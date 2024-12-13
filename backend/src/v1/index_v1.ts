import { Hono } from "hono";
import userRouter from "./user/index_user";

const v1Router = new Hono();

v1Router.route('/api/v1',userRouter);

export default v1Router;
