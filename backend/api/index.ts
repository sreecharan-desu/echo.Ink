import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { isUserExist, signupValidation, signinValidation } from "./middlewares/validation";
import { AuthMiddleware } from "./middlewares/auth";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";  
import bcryptjs from 'bcryptjs';
import { sign } from "hono/jwt";

const app = new Hono();

// Simple CORS for MVP
app.use('*', cors());

// Initialize Prisma with connection pooling
const prisma = new PrismaClient({
  datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMjRmYmJjNGUtZjdjMS00OTI1LWI2MGMtZWQ4MWM4MDU4NTBlIiwidGVuYW50X2lkIjoiMTFlYWNkZWYyYzk5YzAxNDA0NjA5MDlkNTY2YzgxMGQ4YjgzYmEwYzMyNDZkNDM0Y2JjYzZiNzEwY2UwOWU4ZiIsImludGVybmFsX3NlY3JldCI6IjYxNWJjNjJiLWRiZWYtNDI2YS05YmViLWVhYThiMzFkMTY1NyJ9.utqbfZGOhFR1Yy_hJ3Sr9LKa9lakDJi4dsvIcT3Q-4E",
}).$extends(withAccelerate());

// Health check endpoint
app.get('/', (c) => c.text('OK'));

// Auth Routes
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
      message: "User created successfully"
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({
      success: false,
      error: "Failed to create user"
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
      return c.json({
        success: false,
        error: "User not found"
      }, 404);
    }

    const validPassword = await bcryptjs.compare(body.password, user.password);
    if (!validPassword) {
      return c.json({
        success: false,
        error: "Invalid password"
      }, 401);
    }

    const token = await sign({ id: user.id }, "8f9d3a1c6b4e7m2k5n8p0q9r4s7t2u5v");
    return c.json({ token, success: true });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({
      success: false,
      error: "Authentication failed"
    }, 500);
  }
});

// Protected Routes
app.post('/blogs', AuthMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const userId = c.get('jwtPayload').id;
    const post = await prisma.post.create({
      data: {
        title: body.title,
        data: body.content,
        authorId: userId,
        posted_on: new Date(),
        author: {
          connect: {
            id: userId
          }
        }
      }
    });

    return c.json({
      success: true,
      message: "Blog created successfully",
      data: post
    });
  } catch (error) {
    console.error('Blog creation error:', error);
    return c.json({
      success: false,
      error: "Failed to create blog"
    }, 500);
  }
});

app.get('/blogs', async (c) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    return c.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return c.json({
      success: false,
      error: "Failed to fetch blogs"
    }, 500);
  }
});

app.get('/blogs/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    if (!post) {
      return c.json({
        success: false,
        error: "Blog not found"
      }, 404);
    }

    return c.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return c.json({
      success: false,
      error: "Failed to fetch blog"
    }, 500);
  }
});

app.put('/blogs/:id', AuthMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const userId = c.get('jwtPayload').id;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return c.json({
        success: false,
        error: "Blog not found"
      }, 404);
    }

    if (post.authorId !== userId) {
      return c.json({
        success: false,
        error: "Not authorized to update this blog"
      }, 403);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        data: body.content
      }
    });

    return c.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedPost
    });
  } catch (error) {
    console.error('Blog update error:', error);
    return c.json({
      success: false,
      error: "Failed to update blog"
    }, 500);
  }
});

// Export for Vercel
export default {
    fetch: app.fetch,
    port: 8787
  };