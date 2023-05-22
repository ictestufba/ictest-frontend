export async function POST(request: Request) {
  return new Response(JSON.stringify({ token: Math.random() }));
}
