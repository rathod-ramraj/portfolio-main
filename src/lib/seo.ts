import { useEffect } from "react";

type Meta = { title: string; description: string; path: string };

const SITE = "https://rathodram.vercel.app";

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
  el.setAttribute("href", href);

  let altEl = document.querySelector<HTMLLinkElement>('link[rel="alternate"]');
  if (altEl) { altEl.remove(); }
}

export function usePageMeta({ title, description, path }: Meta) {
  useEffect(() => {
    const canonical = `${SITE}${path}`;

    document.title = title;
    setMetaByName("description", description);
    setCanonical(canonical);
    setMetaByProperty("og:title", title);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", canonical);
    setMetaByProperty("og:image", `${SITE}/thumb.png`);
    setMetaByProperty("og:site_name", "Rathod Ramraj");
    setMetaByName("application-name", "Rathod Ramraj");
    setMetaByName("apple-mobile-web-app-title", "Rathod Ramraj");
    setMetaByName("twitter:card", "summary");
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", `${SITE}/thumb.png`);
  }, [title, description, path]);
}
