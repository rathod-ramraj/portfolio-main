export async function onRequest(context: {
  request: Request;
  env: { GITHUB_TOKEN?: string };
  params: { path?: string | string[] };
}): Promise<Response> {
  const url = new URL(context.request.url);
  const subpath = Array.isArray(context.params.path)
    ? context.params.path.join("/")
    : context.params.path || url.searchParams.get("path") || "";

  if (!subpath) {
    return new Response(JSON.stringify({ error: "missing_path" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const passthrough = new URLSearchParams();
  url.searchParams.forEach((v, k) => {
    if (k !== "path") passthrough.append(k, v);
  });
  const qs = passthrough.toString();
  const upstream = `https://api.github.com/${subpath}${qs ? "?" + qs : ""}`;

  const headers: Record<string, string> = {
    Accept: context.request.headers.get("accept") || "application/vnd.github+json",
    "User-Agent": "Ramraj-portfolio-proxy",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (context.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${context.env.GITHUB_TOKEN}`;
  }

  try {
    const upstreamRes = await fetch(upstream, { headers });
    const ct = upstreamRes.headers.get("content-type") || "application/json";
    const body = await upstreamRes.arrayBuffer();
    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        "content-type": ct,
        "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
        "access-control-allow-origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "proxy_failed", detail: String(err?.message || err) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}
