import { Next } from "hono/types";
import { Context } from "hono";
import { verify } from "hono/jwt";

const JWT_SECRET = "8f9d3a1c6b4e7m2k5n8p0q9r4s7t2u5v";

export const AuthMiddleware = async (c: Context, next: Next) => {
  const Authorization = c.req.header('authorization');
  const token = Authorization?.split(' ')[1];
  
  if (!token) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }
  
  try {
    const payload = await verify(token, JWT_SECRET);
    c.set('jwtPayload', payload);
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }
};
