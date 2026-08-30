import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Github, Star, GitFork, ExternalLink, ArrowLeft, Search } from "lucide-react";
import "../components/portfolio.css";
import { Cursor } from "../components/Portfolio";
import { usePageMeta } from "../lib/seo";
import { GH_USER, LANG_COLORS, fetchReadmePreview, timeAgo, type Repo } from "../lib/github";

function RepoCard({ repo, onHover }: { repo: Repo; onHover: (img: string | null, repo: Repo) => void }) {
  const [img, setImg] = useState<string | null | undefined>(undefined);
  const fetchedRef = useRef(false);

  async function load() {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const url = await fetchReadmePreview(repo);
    setImg(url);
    onHover(url, repo);
  }

  const langColor = repo.language ? LANG_COLORS[repo.language] || "#f4efe8" : "#f4efe8";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="pf-repo-card"
      data-reveal="true"
      data-cursor-link
      onMouseEnter={() => { load(); onHover(img ?? null, repo); }}
      onFocus={() => { load(); onHover(img ?? null, repo); }}
    >
      <div className="pf-repo-card-head">
        <span className="pf-repo-card-name">{repo.name}</span>
        <ExternalLink size={14} />
      </div>
      <p className="pf-repo-card-desc">{repo.description || "No description provided."}</p>
      <div className="pf-repo-card-topics">
        {(repo.topics || []).slice(0, 4).map((t) => (
          <span key={t} className="pf-repo-topic">{t}</span>
        ))}
      </div>
      <div className="pf-repo-card-foot">
        <span className="pf-repo-stat">
          <span className="pf-repo-lang-dot" style={{ background: langColor }} />
          <span>{repo.language || "-"}</span>
        </span>
        <span className="pf-repo-stat"><Star size={12} /> {repo.stargazers_count}</span>
        <span className="pf-repo-stat"><GitFork size={12} /> {repo.forks_count}</span>
        <span className="pf-repo-stat pf-repo-stat-meta">{timeAgo(repo.pushed_at)}</span>
      </div>
      <span className="pf-repo-preview-status">
        {img === undefined ? "" : img ? "PREVIEW READY" : "NO PREVIEW"}
      </span>
    </a>
  );
}

function HoverPreview({ image, repo }: { image: string | null; repo: Repo | null }) {
  return (
    <div className={`pf-repo-preview${image ? " is-loaded" : ""}`} aria-hidden="true">
      <div className="pf-repo-preview-frame">
        {image && repo ? (
          <img src={image} alt={repo.name} draggable={false} />
        ) : (
          <div className="pf-repo-preview-empty">
            <span>{repo ? "// no readme image" : "// hover a repo"}</span>
            <span>{repo ? repo.name : "preview surface"}</span>
          </div>
        )}
        <div className="pf-repo-preview-scan" />
        <div className="pf-repo-preview-corner pf-repo-preview-corner-tl" />
        <div className="pf-repo-preview-corner pf-repo-preview-corner-tr" />
        <div className="pf-repo-preview-corner pf-repo-preview-corner-bl" />
        <div className="pf-repo-preview-corner pf-repo-preview-corner-br" />
      </div>
      <div className="pf-repo-preview-meta">
        <span>{repo ? repo.name.toUpperCase() : "AWAITING SIGNAL"}</span>
        <span>{repo ? (repo.description ? repo.description.slice(0, 80) : "-") : "MOVE CURSOR OVER A REPOSITORY"}</span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  usePageMeta({
    title: "All Projects - Rathod Ramraj",
    description: "Complete archive of Rathod Ramraj's GitHub repositories - full-stack, backend, database systems, and AI-powered web applications. Live README previews on hover.",
    path: "/projects",
  });
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"stars" | "recent" | "name">("recent");
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [hoverRepo, setHoverRepo] = useState<Repo | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gh/users/${GH_USER}/repos?per_page=100&sort=updated`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
        return r.json();
      })
      .then((data: Repo[]) => {
        if (cancelled) return;
        const filtered = data.filter((r) => !r.fork && !r.archived && !r.private);
        setRepos(filtered);
      })
      .catch((err) => { if (!cancelled) setError(String(err.message || err)); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [repos]);

  const filtered = useMemo(() => {
    if (!repos) return [];
    const q = query.trim().toLowerCase();
    const list = q
      ? repos.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.topics || []).some((t) => t.toLowerCase().includes(q)) ||
        (r.language || "").toLowerCase().includes(q)
      )
      : repos.slice();
    if (sort === "stars") list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    else if (sort === "recent") list.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [repos, query, sort]);

  const totalStars = useMemo(() => (repos || []).reduce((s, r) => s + r.stargazers_count, 0), [repos]);
  const totalForks = useMemo(() => (repos || []).reduce((s, r) => s + r.forks_count, 0), [repos]);

  function onHover(img: string | null, repo: Repo) {
    setHoverImage(img);
    setHoverRepo(repo);
  }

  return (
    <div className="pf-root pf-projects-root">
      <Cursor />
      <div className="pf-shell is-ready">
        <div className="pf-noise-overlay" />
        <div className="pf-command-grid" />

        <header className="pf-projects-header">
          <Link href="/" className="pf-projects-back" data-cursor-link>
            <ArrowLeft size={14} />
            <span>Back to portfolio</span>
          </Link>
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noreferrer"
            className="pf-projects-github"
            data-cursor-link
          >
            <Github size={14} />
            <span>github.com/{GH_USER}</span>
          </a>
        </header>

        <section className="pf-projects-hero">
          <p className="pf-chapter-label" data-reveal="true">Archive / All Repositories</p>
          <h1 className="pf-projects-title" data-reveal="true">
            EVERY <span className="pf-projects-title-accent">REPO</span> I'VE BUILT.
          </h1>
          <p className="pf-projects-sub" data-reveal="true">
            Live feed from GitHub - sources, side experiments, and infrastructure. Hover any card to lift the README preview.
          </p>
          <div className="pf-projects-stats" data-reveal="true">
            <div><span>{repos ? repos.length : "-"}</span><label>Public Repos</label></div>
            <div><span>{repos ? totalStars : "-"}</span><label>Total Stars</label></div>
            <div><span>{repos ? totalForks : "-"}</span><label>Total Forks</label></div>
          </div>
        </section>

        <section className="pf-projects-controls">
          <div className="pf-projects-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search repositories, topics, languages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-cursor-link
            />
          </div>
          <div className="pf-projects-sort" role="tablist">
            {(["stars", "recent", "name"] as const).map((s) => (
              <button
                key={s}
                role="tab"
                className={`pf-projects-sort-btn${sort === s ? " is-active" : ""}`}
                onClick={() => setSort(s)}
                data-cursor-link
              >
                {s === "stars" ? "Most Stars" : s === "recent" ? "Recently Pushed" : "A → Z"}
              </button>
            ))}
          </div>
        </section>

        <section className="pf-projects-body">
          <div className="pf-repo-grid">
            {error && <p className="pf-repo-error">⚠ {error}</p>}
            {!error && !repos && (
              <p className="pf-repo-loading">SYNCING WITH GITHUB…</p>
            )}
            {repos && filtered.length === 0 && (
              <p className="pf-repo-loading">No repos match "{query}".</p>
            )}
            {filtered.map((r) => (
              <RepoCard key={r.id} repo={r} onHover={onHover} />
            ))}
          </div>
          <aside className="pf-repo-preview-rail">
            <HoverPreview image={hoverImage} repo={hoverRepo} />
          </aside>
        </section>

        <footer className="pf-projects-footer">
          <Link href="/" className="pf-projects-footer-link" data-cursor-link>
            ← Return to main feed
          </Link>
          <span>@{GH_USER}</span>
        </footer>
      </div>
    </div>
  );
}
