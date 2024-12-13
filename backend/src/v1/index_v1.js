import { Hono } from "hono";
import userRouter from "./user/index_user";
const v1Router = new Hono();
// All routes under /api/v1/users will be handled by userRouter
//@ts-ignore
v1Router.use('/users', userRouter); // Use 'use' instead of 'route'
export default v1Router;
