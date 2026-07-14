// Proxy chat widget requests to the actual backend API (FastAPI on Fly.io).
// NOTE: aios.getforgeflow.com is a frontend host and will 405 on POST.
const UPSTREAM_BASE = "https://get-forge-flow-api.fly.dev";
const CHAT_MESSAGE_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/message`;
const CHAT_HISTORY_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/history`;
const CHAT_STREAM_UPSTREAM = `${UPSTREAM_BASE}/api/v1/website-chat/stream`;
const WEBSITE_SESSION_UPSTREAM = `${UPSTREAM_BASE}/api/v1/public/website/session`;
const WEBSITE_EVENT_UPSTREAM = `${UPSTREAM_BASE}/api/v1/public/website/event`;
const WEBSITE_LEAD_UPSTREAM = `${UPSTREAM_BASE}/api/v1/public/website/lead`;
const WEBSITE_REVIEWS_UPSTREAM = `${UPSTREAM_BASE}/api/v1/public/website/reviews`;

function corsHeaders(methods) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

async function handleChatProxy(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders("POST, OPTIONS"),
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
      headers: corsHeaders("GET, OPTIONS"),
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
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders("GET, OPTIONS"),
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
  upstreamUrl.search = url.search; // session_id, website

  const upstream = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
    },
  });

  // Stream through without buffering so SSE heartbeats reach the browser.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function handleWebsiteGrowthProxy(request, upstreamUrl, allowedMethod) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(`${allowedMethod}, OPTIONS`),
    });
  }

  if (request.method !== allowedMethod) {
    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(upstreamUrl, {
    method: allowedMethod,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: allowedMethod === "POST" ? await request.text() : undefined,
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

async function handleWebsiteReviewsProxy(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders("GET, OPTIONS"),
    });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const upstreamUrl = new URL(WEBSITE_REVIEWS_UPSTREAM);
  upstreamUrl.search = url.search;

  const upstream = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
      // Reviews change infrequently; cache at the edge for a short window.
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
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
    if (url.pathname === "/api/v1/website-chat/history") {
      return handleChatHistoryProxy(request);
    }
    if (url.pathname === "/api/v1/website-chat/stream") {
      return handleChatStreamProxy(request);
    }
    if (url.pathname === "/api/v1/public/website/session") {
      return handleWebsiteGrowthProxy(request, WEBSITE_SESSION_UPSTREAM, "POST");
    }
    if (url.pathname === "/api/v1/public/website/event") {
      return handleWebsiteGrowthProxy(request, WEBSITE_EVENT_UPSTREAM, "POST");
    }
    if (url.pathname === "/api/v1/public/website/lead") {
      return handleWebsiteGrowthProxy(request, WEBSITE_LEAD_UPSTREAM, "POST");
    }
    if (url.pathname === "/api/v1/public/website/reviews") {
      return handleWebsiteReviewsProxy(request);
    }
    return env.ASSETS.fetch(request);
  },
};
