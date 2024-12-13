import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client/edge";
import { Context, Next } from "hono";
import zod from "zod";
import bcryptjs from 'bcryptjs';

const DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMjRmYmJjNGUtZjdjMS00OTI1LWI2MGMtZWQ4MWM4MDU4NTBlIiwidGVuYW50X2lkIjoiMTFlYWNkZWYyYzk5YzAxNDA0NjA5MDlkNTY2YzgxMGQ4YjgzYmEwYzMyNDZkNDM0Y2JjYzZiNzEwY2UwOWU4ZiIsImludGVybmFsX3NlY3JldCI6IjYxNWJjNjJiLWRiZWYtNDI2YS05YmViLWVhYThiMzFkMTY1NyJ9.utqbfZGOhFR1Yy_hJ3Sr9LKa9lakDJi4dsvIcT3Q-4E";

export const signupValidation = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const schema = zod.object({
    username: zod.string().min(3).max(20),
    password: zod.string().min(8).max(20),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message, success: false }, 400);
  }
  await next();
};

export const isUserExist = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: { username: body.username }
  });

  if (user) {
    return c.json({ error: "User already exists", success: false }, 400);
  }
  await next();
};

export const signinValidation = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: { username: body.username }
  });

  if (!user) {
    return c.json({ error: "User does not exist", success: false }, 400);
  }

  const validPassword = await bcryptjs.compare(body.password, user.password);
  if (!validPassword) {
    return c.json({ error: "Invalid password", success: false }, 400);
  }

  await next();
};
