import fs from 'fs';
import path from 'path';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'llms.txt');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Failed to read llms.txt:', err);
    return new Response('Not found', { status: 404 });
  }
}
