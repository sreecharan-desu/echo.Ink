// Import required dependencies
import { Hono } from "hono";
import { isUserExist, signupValidation,signinValidation } from "../middlewares/validation";
import { AuthMiddleware } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";  
import bcryptjs from 'bcryptjs';
import { sign } from "hono/jwt";
export const JWT_SECRET="8f9d3a1c6b4e7m2k5n8p0q9r4s7t2u5v"
// Define router with environment variable bindings
const app = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_SECRET : string;
    }
}>();


// Handle user signup
app.post('/signup',signupValidation,isUserExist,async(c)=>{
    // Initialize Prisma client with acceleration
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())       

    // Get request body
    const body:any = await c.req.json();
    
    // Hash the password before storing
    const hashedPassword = await bcryptjs.hash(body.password,10);
    
    // Create new user in database
    const user = await prisma.user.create({
        data : {
            username : body.username,
            password : hashedPassword
        }
    })

    // Return success message with user id
    return c.json({message:`User with id : ${user.id} created successfully`})
})

// Handle user signin
app.post('/signin',signinValidation,async(c)=>{
    // Get request body
    const body:any = await c.req.json();
    
    // Initialize Prisma client with acceleration
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    // Find user by username
    const user = await prisma.user.findUnique({
        where : {username : body.username}
    })
    
    // Generate JWT token
    console.log(JWT_SECRET)
    const token = await sign({id:user?.id},JWT_SECRET)

    // Return token and success status
    return c.json({token,success:true})
})

// Get user details (protected route)
app.get('/me',AuthMiddleware,async(c)=>{
    // Initialize Prisma client with acceleration
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
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


app.post('/post',AuthMiddleware,async(c)=>{
    const body:any = await c.req.json();
    const userId = c.get('jwtPayload').id;

    const prisma = new PrismaClient({       
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const post = await prisma.post.create({
        data : {
            title : body.title,
            data : body.data,
            authorId : userId,
            posted_on : new Date(),
            tags : body.tags
        }
    })

    return c.json({message: `Post with id : ${post.id} created successfully`,success:true})
})


app.put('/post/:id',AuthMiddleware,async(c)=>{
    const body:any = await c.req.json();
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


app.delete('/post/:id',AuthMiddleware,async(c)=>{
    const postId = c.req.param('id');

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const post = await prisma.post.delete({
        where : {id : postId}
    })

    return c.json({message: `Post with id : ${post.id} deleted successfully`,success:true})
})  

app.get('/posts',async(c)=>{
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

app.get('/posts',async(c)=>{
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

app.post('/posts', async(c) => {
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

// Export the router
export default app;      