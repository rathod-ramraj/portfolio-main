import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || "/", "http://x");
  const path = url.searchParams.get("path") || "";
  if (!path) {
    res.status(400).json({ error: "missing_path" });
    return;
  }

  const passthrough = new URLSearchParams();
  url.searchParams.forEach((v, k) => { if (k !== "path") passthrough.append(k, v); });
  const qs = passthrough.toString();
  const upstream = `https://api.github.com/${path}${qs ? "?" + qs : ""}`;

  const headers: Record<string, string> = {
    Accept: (req.headers["accept"] as string) || "application/vnd.github+json",
    "User-Agent": "Ramraj-portfolio-proxy",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const upstreamRes = await fetch(upstream, { headers });
    const ct = upstreamRes.headers.get("content-type") || "application/json";
    const body = await upstreamRes.arrayBuffer();
    res.status(upstreamRes.status);
    res.setHeader("content-type", ct);
    res.setHeader("cache-control", "public, s-maxage=300, stale-while-revalidate=600");
    res.send(Buffer.from(body));
  } catch (err) {
    res.status(502).json({ error: "proxy_failed", detail: String(err) });
  }
}
