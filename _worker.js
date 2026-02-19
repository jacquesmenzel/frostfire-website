// Proxy chat widget requests to the actual backend API (FastAPI on Fly.io).
// NOTE: aios.getforgeflow.com is a frontend host and will 405 on POST.
const CHAT_UPSTREAM = "https://get-forge-flow-api.fly.dev/api/v1/website-chat/message";

async function handleChatProxy(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(CHAT_UPSTREAM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/v1/website-chat/message") {
      return handleChatProxy(request);
    }
    return env.ASSETS.fetch(request);
  },
};
