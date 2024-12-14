import { Context, Hono } from 'hono';
import { isUserExist, signupValidation, signinValidation } from "./middlewares/validation";
import { AuthMiddleware } from "./middlewares/auth";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";  
import bcryptjs from 'bcryptjs';
import { sign } from "hono/jwt";

// For Cloudflare Workers, use env from context
const app = new Hono<{
  Bindings: {
    JWT_SECRET: string;
    DATABASE_URL: string;
  }
}>();

// Initialize single Prisma instance
const prisma = new PrismaClient({
  datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMjRmYmJjNGUtZjdjMS00OTI1LWI2MGMtZWQ4MWM4MDU4NTBlIiwidGVuYW50X2lkIjoiMTFlYWNkZWYyYzk5YzAxNDA0NjA5MDlkNTY2YzgxMGQ4YjgzYmEwYzMyNDZkNDM0Y2JjYzZiNzEwY2UwOWU4ZiIsImludGVybmFsX3NlY3JldCI6IjYxNWJjNjJiLWRiZWYtNDI2YS05YmViLWVhYThiMzFkMTY1NyJ9.utqbfZGOhFR1Yy_hJ3Sr9LKa9lakDJi4dsvIcT3Q-4E",
}).$extends(withAccelerate());

// Global error handler
app.use('*', async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Global error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error',
      details: error instanceof Error ? error.stack : undefined
    }, 500);
  }
});

// CORS
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  await next();
});

// Health check
app.get('/', async (c) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    return c.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Database connection failed' 
    }, 500);
  }
});

// Auth routes with better error handling
app.post('/signup', signupValidation, isUserExist, async (c) => {
  try {
    const body = await c.req.json();
    const hashedPassword = await bcryptjs.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword
      }
    });

    return c.json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : undefined
    }, 500);
  }
});

app.post('/signin', signinValidation, async (c) => {
  try {
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: { username: body.username }
    });

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const validPassword = await bcryptjs.compare(body.password, user.password);
    if (!validPassword) {
      return c.json({ success: false, error: 'Invalid password' }, 401);
    }

    const token = await sign({ id: user.id }, "8f9d3a1c6b4e7m2k5n8p0q9r4s7t2u5v");
    return c.json({ token, success: true });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ 
      success: false, 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : undefined
    }, 500);
  }
});

// Get user details (protected route)
app.get('/me',AuthMiddleware,async(c:Context)=>{
  // Initialize Prisma client with acceleration
  const prisma = new PrismaClient({
      datasourceUrl: c.env.c.env.DATABASE_URL
  }).$extends(withAccelerate())
  
  const userId = c.get('jwtPayload').id;
  // Get user id from JWT payload
  const currentUser = await prisma.user.findUnique({
      where : {id : userId},
      select : {
          id : true,
          username : true,
          created_on : true,
          Posts : {
              select : {
                  id : true,
                  title : true,
                  data : true,
                  posted_on : true
              }
          },
      }
  })  
  console.log("Current User",currentUser);

  if(currentUser?.id !== userId){
      c.status(401);
      return c.json({error:"Unauthorized",success:false})
  }   
  else{
      // Return user details
      return c.json({user : currentUser,success:true})
  }
})


app.post('/post',AuthMiddleware,async(c:Context)=>{
  const body:any = await c.req.json();
  const userId = c.get('jwtPayload').id;
  const prisma = new PrismaClient({       
      datasourceUrl: c.env.c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const post = await prisma.post.create({
      data: {
          title : body.title,
          data : body.data,
          authorId : userId,
          posted_on : new Date(),
          tags : body.tags
      }
  })

  return c.json({message: `Post with id : ${post.id} created successfully`,success:true})
})


app.put('/post/:id', AuthMiddleware, async (c: Context) => {
  const body = await c.req.json();
  const postId = c.req.param('id');
  
  const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const post = await prisma.post.update({
      where : {id : postId},
      data : {
          title : body.title,
          data : body.data,
          tags : body.tags,
          posted_on : new Date()
      }
  })

  return c.json({message: `Post with id : ${post.id} updated successfully`,success:true})
})  


app.delete('/post/:id',AuthMiddleware,async(c:Context)=>{
  const postId = c.req.param('id');

  const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const post = await prisma.post.delete({
      where : {id : postId}
  })

  return c.json({message: `Post with id : ${post.id} deleted successfully`,success:true})
})  

app.get('/posts',async(c:Context)=>{
  const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())
  const posts = await prisma.post.findMany(
      {
          select : {
              id : true,
              title : true,
              data : true,
              posted_on : true,
              author : {
                  select : {
                      id : true,
                      username : true,
                      created_on : true
                  }
              },
              tags : true
          }
      }
  );
  return c.json({posts,success:true})
})  

app.get('/post/:id', async(c) => {
  const postId = c.req.param('id');

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
      const post = await prisma.post.findUnique({
          where: { id: postId },
          include: {
              author: {
                  select: {
                      id: true,
                      username: true,
                      created_on : true
                  }
              }
          }
      });

      if (!post) {
          c.status(404);
          return c.json({ 
              success: false, 
              error: 'Post not found' 
          });
      }

      // Format the post with ISO string for consistent date handling
      const formattedPost = {
          ...post,
          posted_on: post.posted_on.toISOString()
      };

      return c.json({ 
          success: true, 
          post: formattedPost 
      });
  } catch (error) {
      console.error('Error fetching post:', error);
      c.status(500);
      return c.json({ 
          success: false, 
          error: 'Failed to load post' 
      });
  }
});

app.get('/posts',async(c:Context)=>{
  const body:any = await c.req.json();
  const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())
  const posts = await prisma.post.findMany({
      where : {
          authorId : body.authorId
      },
      include : {
          author : {
              select : {
                  id : true,
                  username : true,
                  created_on : true
              }
          }
      }
  });
  return c.json({posts,success:true})
})  


app.post('/profile/:username', async(c) => {
  const body = await c.req.json();
  const username = body.username;   
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try {
      const user = await prisma.user.findUnique({
          where: { username },
          select: {
              id: true,
              username: true,
              created_on : true,
              Posts: {
                  select: {
                      id: true,
                      title: true,
                      data: true,
                      posted_on: true,
                      tags : true,
                      author: {
                          select: {
                              id: true,
                              username: true,
                              created_on : true
                          }
                      }
                  },
                  orderBy: {
                      posted_on: 'desc'
                  }
              }
          }
      });

      if (!user) {
          return c.json({ 
              success: false, 
              error: 'User not found' 
          });
      }

      return c.json({
          success: true,
          user: {
              ...user,
              Posts: user.Posts.map(post => ({
                  ...post,
                  posted_on: post.posted_on.toISOString()
              }))
          }
      });
  } catch (error) {
      console.error('Error fetching user profile:', error);
      return c.json({ 
          success: false, 
          error: 'Failed to fetch user profile' 
      });
  }
});

app.post('/posts', async(c:Context) => {
  const body = await c.req.json();
  const { username } = body;
  
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
      const user = await prisma.user.findUnique({
          where: { username }
      });

      if (!user) {
          return c.json({ 
              success: false, 
              error: 'User not found' 
          });
      }

      const posts = await prisma.post.findMany({
          where: { authorId: user.id },
          include: {
              author: {
                  select: {
                      id: true,
                      username: true,
                      created_on : true,  
                      Posts : {
                          select : {
                              id : true,
                              title : true,
                              data : true,
                              posted_on : true
                          }
                      }
                  }
              }
          },
          orderBy: { posted_on: 'desc' }
      });

      return c.json({ 
          success: true, 
          posts: posts.map(post => ({
              ...post,
              posted_on: post.posted_on.toISOString()
          }))
      });
  } catch (error) {
      console.error('Error fetching posts:', error);
      return c.json({ 
          success: false, 
          error: 'Failed to fetch posts',
          posts: []
      });
  }
});

// Export for Vercel and Cloudflare Workers
export default {
  fetch: app.fetch,
  port: 8787
};
