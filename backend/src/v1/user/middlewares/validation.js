import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client/edge";
import zod from "zod";
import bcryptjs from 'bcryptjs';
export const signupValidation = async (c, next) => {
    const { username, password } = await c.req.json();
    const zodSchema = await zod.object({
        username: zod.string().min(3).max(20),
        password: zod.string().min(8).max(20),
    });
    const result = zodSchema.safeParse({ username, password });
    if (!result.success) {
        c.status(400);
        return c.json({ error: result.error.issues[0].message, success: false });
    }
    await next();
};
export const isUserExist = async (c, next) => {
    const { username } = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const user = await prisma.user.findUnique({
        where: { username }
    });
    if (user) {
        c.status(400);
        return c.json({ error: "User already exists", success: false });
    }
    await next();
};
export const signinValidation = async (c, next) => {
    const { username, password } = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const user = await prisma.user.findUnique({
        where: { username }
    });
    if (!user) {
        c.status(400);
        return c.json({ error: "User does not exist", success: false });
    }
    else {
        const validatePassword = await bcryptjs.compare(password, user.password);
        if (!validatePassword) {
            c.status(400);
            return c.json({ error: "Invalid password", success: false });
        }
    }
    await next();
};
