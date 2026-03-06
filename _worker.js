// Proxy chat widget requests to the actual backend API (FastAPI on Fly.io).
// NOTE: aios.getforgeflow.com is a frontend host and will 405 on POST.
const UPSTREAM_BASE = "https://get-forge-flow-api.fly.dev";
const CHAT_MESSAGE_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/message`;
const CHAT_HISTORY_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/history`;
const CHAT_STREAM_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/stream`;

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

  const upstream = await fetch(CHAT_MESSAGE_UPSTREAM, {
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

async function handleChatHistoryProxy(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const upstreamUrl = new URL(CHAT_HISTORY_UPSTREAM);
  upstreamUrl.search = url.search; // forward session_id, website, limit

  const upstream = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
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

async function handleChatStreamProxy(request) {
  // SSE (Server-Sent Events) proxy for real-time chat updates
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Cache-Control",
      },
    });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const upstreamUrl = new URL(CHAT_STREAM_UPSTREAM);
  upstreamUrl.search = url.search; // forward session_id, website

  // Proxy the SSE stream directly from backend
  const upstream = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      "Accept": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });

  // Return the streaming response with proper SSE headers
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/v1/website-chat/message") {
      return handleChatProxy(request);
    }
    if (url.pathname === "/api/v1/website-chat/history") {
      return handleChatHistoryProxy(request);
    }
    if (url.pathname === "/api/v1/website-chat/stream") {
      return handleChatStreamProxy(request);
    }
    return env.ASSETS.fetch(request);
  },
};
