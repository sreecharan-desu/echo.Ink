import { Hono } from 'hono';

const app = new Hono();

// Simple health check route
app.get('/', (c) => c.text('OK', 200));

// Export as Vercel serverless function
export default async function handler(req: Request) {
  try {
    const res = await app.fetch(req);
    return res;
  } catch (error) {
    console.error('Request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
