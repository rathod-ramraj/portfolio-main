export const config = {
  matcher: [
    "/((?!api|_vercel|.*\\..*).*)",
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.hostname === "rathodram.vercel.app") {
    url.hostname = "rathodram.is-a.dev";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 308);
  }
}
