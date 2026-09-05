import { useEffect } from "react";

type Meta = { title: string; description: string; path: string };

const PRIMARY_SITE = "https://rathodram.is-a.dev";
const SECONDARY_SITE = "https://rathodram.vercel.app";

function getSiteUrl() {
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return SECONDARY_SITE;
  }
  return PRIMARY_SITE;
}

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
function setCanonical(primaryHref: string, altHref: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
  el.setAttribute("href", primaryHref);

  let altEl = document.querySelector<HTMLLinkElement>('link[rel="alternate"]');
  if (!altEl) { altEl = document.createElement("link"); altEl.setAttribute("rel", "alternate"); document.head.appendChild(altEl); }
  altEl.setAttribute("href", altHref);
}

export function usePageMeta({ title, description, path }: Meta) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonical = `${siteUrl}${path}`;
    const primaryCanonical = `${PRIMARY_SITE}${path}`;
    const secondaryAlternate = `${SECONDARY_SITE}${path}`;

    document.title = title;
    setMetaByName("description", description);
    setCanonical(primaryCanonical, secondaryAlternate);
    setMetaByProperty("og:title", title);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", canonical);
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
  }, [title, description, path]);
}
