import { Hono } from 'hono'
import v1Router from './v1/index_v1'
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}));
app.route('/',v1Router);

export default app