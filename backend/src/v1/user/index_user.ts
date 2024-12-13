import { Hono } from "hono";
import routes_user from "./routes/routes";
const userRouter = new Hono();

userRouter.route('/user',routes_user);

export default userRouter;  