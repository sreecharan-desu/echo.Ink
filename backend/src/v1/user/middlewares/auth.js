import { verify } from "hono/jwt";
import { JWT_SECRET } from "../routes/routes";
export const AuthMiddleware = async (c, next) => {
    const Authorization = c.req.header('authorization');
    console.log("Authorization", Authorization);
    const token = Authorization?.split(' ')[1];
    if (token == undefined || token == null) {
        c.status(401);
        return c.json({ error: "Unauthorized", success: false });
    }
    else {
        try {
            const payload = await verify(token, JWT_SECRET);
            console.log("Payload", payload);
            c.set('jwtPayload', payload);
            await next();
        }
        catch (error) {
            c.status(401);
            return c.json({ error: "Unauthorized", success: false });
        }
    }
};
