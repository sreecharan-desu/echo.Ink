import { Hono } from "hono";
import routes_user from "./routes/routes";
const userRouter = new Hono();
// Use '/user' path for routes_user
//@ts-ignore
userRouter.use('/user', routes_user);
export default userRouter;
