import { Hono } from 'hono';
import v1Router from './v1/index_v1';
import { cors } from 'hono/cors';
const app = new Hono();
// CORS configuration for all routes
app.use('/*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
}));
// Route all API calls starting with /api/v1 to v1Router
//@ts-ignore
app.use('/api/v1', v1Router); // Corrected this line to use 'use' instead of 'route'
// Root route handler (optional)
app.get('/', async (c) => {
    return c.text("Hello from backend!");
});
export default app;
