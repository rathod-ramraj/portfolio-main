import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { Code, MessageCircle, Github, Instagram, Linkedin, ExternalLink, ArrowRight, Star, GraduationCap, Briefcase, Youtube } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { GH_USER, LANG_COLORS, fetchReadmePreview, timeAgo, type Repo } from "../lib/github";
import { SKILLS, CATEGORIES, type SkillCategory } from "../lib/skills";
import "./portfolio.css";

const MARQUEE_ITEMS = [
  "Building Full Stack Applications", "React & Next.js Developer", "Open Source Enthusiast", "Hackathon Builder", "Always Learning",
  "AI Powered Applications", "Clean UI • Clean Code", "MongoDB • PostgreSQL", "Node.js Backend", "Frontend Specialist",
  "Problem Solver", "NIT Jalandhar", "Tech Explorer", "JavaScript Developer", "Building the Future",
  "Building Full Stack Applications", "React & Next.js Developer", "Open Source Enthusiast", "Hackathon Builder", "Always Learning",
  "AI Powered Applications", "Clean UI • Clean Code", "MongoDB • PostgreSQL", "Node.js Backend", "Frontend Specialist",
  "Problem Solver", "NIT Jalandhar", "Tech Explorer", "JavaScript Developer", "Building the Future"
];

const MINI_MARQUEE = [
  "React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL", "AI", "DSA", "GitHub", "Open Source", "JavaScript", "Python", "C++", "Hackathons",
  "React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL", "AI", "DSA", "GitHub", "Open Source", "JavaScript", "Python", "C++", "Hackathons"
];

const TONE_CYCLE = ["cyan", "red", "gold", "violet", "steel"] as const;

const TERMINAL_LINES = [
  "> whoami",
  "Rathod Ramraj",
  "",
  "> education",
  "B.Tech Information Technology @ NIT Jalandhar",
  "",
  "> role",
  "Full Stack Developer",
  "",
  "> currently",
  "Building AI-powered web applications",
  "",
  "> stack",
  "React • Next.js • Node.js • MongoDB",
  "",
  "> hobbies",
  "Coding • Open Source • Hackathons",
  "",
  "> mission",
  "Build scalable products that solve real-world problems.",
  "",
  "> status",
  "Available for internships & collaborations."
];

type JourneyEntry = {
  kind: "education" | "work";
  logo: string;
  title: string;
  org: string;
  url: string;
  period: string;
  status: "current" | "completed";
  detail: string;
  tags: string[];
};

const JOURNEY: JourneyEntry[] = [
  {
    kind: "work",
    logo: "/educations/wpriseIntern.jpg",
    title: "Frontend Developer Intern",
    org: "BlogstormAI",
    url: "https://github.com/BlogstormAI",
    period: "2026",
    status: "completed",
    detail: "Developed responsive frontend components using React and Next.js, contributed to WPrise AI platform, collaborated with backend and design teams, improved accessibility and optimized UI performance.",
    tags: ["React", "Next.js", "Tailwind", "TypeScript", "Frontend"],
  },
  {
    kind: "work",
    logo: "/educations/sqc_nitj_logo.jpeg",
    title: "Core Member",
    org: "Super Quant Coders",
    url: "#",
    period: "2025 — Present",
    status: "current",
    detail: "Contributing to technical events, coding activities and collaborative software development initiatives.",
    tags: ["Programming", "Hackathons", "Open Source", "Leadership"],
  },
  {
    kind: "education",
    logo: "/educations/college.png",
    title: "B.Tech, Information Technology",
    org: "Dr B R Ambedkar National Institute of Technology Jalandhar",
    url: "https://www.nitj.ac.in/",
    period: "Aug 2024 — Jun 2028",
    status: "current",
    detail: "Pursuing B.Tech in Information Technology with strong focus on Data Structures & Algorithms, Full Stack Development, and scalable web technologies.",
    tags: ["NIT Jalandhar", "IT", "React", "Next.js", "Node.js"],
  },
  {
    kind: "education",
    logo: "/educations/nssLogo.png",
    title: "Student Coordinator",
    org: "National Service Scheme (NSS)",
    url: "https://nss.gov.in/",
    period: "Aug 2024 — Dec 2024",
    status: "completed",
    detail: "Organized blood donation drives, cleanliness campaigns and community service events.",
    tags: ["Leadership", "Volunteer", "Community"],
  },
  {
    kind: "education",
    logo: "/educations/12th.png",
    title: "Higher Secondary (Class XII)",
    org: "Narayana Junior College, Miyapur",
    url: "https://www.narayanajuniorcolleges.com/",
    period: "2022 — 2024",
    status: "completed",
    detail: "Completed intermediate education focusing on Physics, Chemistry, and Mathematics (PCM) at IIT-JEE-NEET Academy. Secured 97.3% marks in board examinations.",
    tags: ["97.3%", "Intermediate", "IIT-JEE Prep"],
  },
  {
    kind: "education",
    logo: "/educations/school(5th-10th).png",
    title: "Secondary Education (5th — 10th)",
    org: "TGSWREIS, Jinnaram (Sangareddy)",
    url: "https://tgtwreis.telangana.gov.in/",
    period: "2016 — 2022",
    status: "completed",
    detail: "Completed secondary school education with academic honors under Telangana State Social Welfare Residential Educational Institutions Society. Secured 9.2 CGPA.",
    tags: ["9.2 CGPA", "Telangana", "Secondary School"],
  },
  {
    kind: "education",
    logo: "/educations/school(nursarary-4th).jpeg",
    title: "Primary Education (Nursery — 4th)",
    org: "High Mount High School, Hyderabad",
    url: "https://www.uniapply.com/school/high-mount-high-school-hyderabad/",
    period: "2010 — 2016",
    status: "completed",
    detail: "Primary education at Mangalhat, Hyderabad. Focused on early academic foundations, social development, and extracurricular participation.",
    tags: ["Primary School", "Hyderabad"],
  },
];

const OSS_PRS: any[] = [];

function useCounter(target: number, suffix: string, isVisible: boolean): string {
  const [val, setVal] = useState("0" + suffix);
  const started = useRef(false);
  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const duration = 1800;
    let startTs: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target) + suffix);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, target, suffix]);
  return val;
}

function MetricCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const numMatch = value.match(/^(\d+)(.*)$/);
  const num = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = numMatch ? numMatch[2] : "";
  const isStatic = !numMatch;
  const counted = useCounter(num, suffix, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { setVisible(true); setRevealed(true); }, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="pf-metric-card"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <span className="pf-metric-value">{isStatic ? value : counted}</span>
      <span className="pf-metric-label">{label}</span>
    </div>
  );
}

function ProjectShowcase() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const state = useRef({ y: 0, curY: 0, raf: 0 });

  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Repo | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gh/users/${GH_USER}/repos?per_page=100&sort=updated`)
      .then(async (r) => { if (!r.ok) throw new Error(`GitHub ${r.status}`); return r.json(); })
      .then((data: Repo[]) => {
        if (cancelled) return;
        const filtered = data
          .filter((r) => !r.fork && !r.archived && !r.private)
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
          .slice(0, 5);
        setRepos(filtered);
      })
      .catch((err) => { if (!cancelled) setError(String(err.message || err)); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function animate() {
      state.current.curY += (state.current.y - state.current.curY) * 0.11;
      if (previewRef.current) previewRef.current.style.transform = `translateY(${state.current.curY}px)`;
      state.current.raf = requestAnimationFrame(animate);
    }
    state.current.raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(state.current.raf);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    const rect = showcaseRef.current!.getBoundingClientRect();
    state.current.y = e.clientY - rect.top - 120;
  }

  async function onRowEnter(repo: Repo) {
    if (previewRef.current) previewRef.current.classList.add("is-visible");
    setHovered(repo);
    setPreviewImg(null);
    setPreviewLoading(true);
    const img = await fetchReadmePreview(repo);
    setPreviewLoading(false);
    setHovered((current) => {
      if (current && current.name === repo.name) setPreviewImg(img);
      return current;
    });
  }

  function onRowLeave() {
    if (previewRef.current) previewRef.current.classList.remove("is-visible");
  }

  return (
    <div className="pf-project-showcase" ref={showcaseRef} onMouseMove={onMouseMove}>
      <div ref={previewRef} className="pf-hover-preview">
        <div className="pf-project-artwork" data-tone={hovered ? TONE_CYCLE[((repos || []).findIndex((r) => r.name === hovered.name) || 0) % TONE_CYCLE.length] : "cyan"}>
          {previewImg ? (
            <img src={previewImg} alt={hovered?.name || ""} className="pf-hover-preview-img" draggable={false} />
          ) : (
            <>
              <div className="pf-art-grid" />
              <div className="pf-art-sigil">
                <span>{previewLoading ? "…" : hovered ? String((repos || []).findIndex((r) => r.name === hovered.name) + 1).padStart(2, "0") : "01"}</span>
              </div>
              <div className="pf-art-lines"><span /><span /><span /></div>
            </>
          )}
          <p className="pf-art-label">{hovered ? hovered.name : ""}</p>
        </div>
      </div>

      <div className="pf-project-list">
        {error && !repos && <p className="pf-repo-loading">⚠ {error}</p>}
        {!error && !repos && <p className="pf-repo-loading">SYNCING WITH GITHUB…</p>}
        {repos && repos.length === 0 && <p className="pf-repo-loading">No repositories found.</p>}
        {repos && repos.map((p, i) => {
          const tone = TONE_CYCLE[i % TONE_CYCLE.length];
          const index = String(i + 1).padStart(2, "0");
          const tags = (p.topics || []).slice(0, 3);
          if (tags.length === 0 && p.language) tags.push(p.language);
          return (
            <article
              key={p.id}
              className="pf-project-row"
              data-tone={tone}
              data-reveal="true"
              style={{ transitionDelay: `${i * 0.08}s` }}
              onMouseEnter={() => onRowEnter(p)}
              onMouseLeave={onRowLeave}
            >
              <span className="pf-project-index">{index}</span>
              <div className="pf-project-main">
                <span className="pf-project-eyebrow">{p.language || "Repository"} · {timeAgo(p.pushed_at)}</span>
                <h3>{p.name}</h3>
                <p>{p.description || "No description provided."}</p>
              </div>
              <div className="pf-project-tags">
                {tags.map((t) => <span key={t}>{t}</span>)}
                <span className="pf-project-stars"><Star size={12} aria-hidden="true" /> {p.stargazers_count}</span>
              </div>
              <a
                href={p.html_url}
                target="_blank"
                rel="noreferrer"
                className="pf-project-icon"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${p.name} on GitHub`}
                data-cursor-link
              >
                <ExternalLink size={18} />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SkillCarousel() {
  const [filter, setFilter] = useState<SkillCategory | "All">("All");
  const filtered = filter === "All" ? SKILLS : SKILLS.filter((s) => s.category === filter);
  const loop = [...filtered, ...filtered];

  return (
    <div className="pf-skill-deck">
      <div className="pf-skill-filters" data-reveal="true">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={`pf-skill-filter${filter === c ? " is-active" : ""}`}
            onClick={() => setFilter(c)}
            data-cursor-link
          >
            {c}
          </button>
        ))}
      </div>
      <div className="pf-skill-carousel" data-reveal="true">
        <div className="pf-skill-carousel-track" key={filter}>
          {loop.map((s, i) => (
            <div key={`${s.name}-${i}`} className="pf-skill-chip" title={s.name}>
              <div className="pf-skill-chip-icon">
                <img
                  src={s.icon}
                  alt={s.name}
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.25";
                  }}
                />
              </div>
              <span className="pf-skill-chip-name">{s.name}</span>
              <span className="pf-skill-chip-cat">{s.category}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pf-skill-carousel pf-skill-carousel-reverse" data-reveal="true" aria-hidden="true">
        <div className="pf-skill-carousel-track pf-skill-carousel-track-reverse" key={`r-${filter}`}>
          {[...loop].reverse().map((s, i) => (
            <div key={`r-${s.name}-${i}`} className="pf-skill-chip pf-skill-chip-mini">
              <div className="pf-skill-chip-icon">
                <img
                  src={s.icon}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.25";
                  }}
                />
              </div>
              <span className="pf-skill-chip-name">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type LangBucket = { name: string; count: number; bytes: number; color: string };

function LanguageStats() {
  const [buckets, setBuckets] = useState<LangBucket[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gh/users/${GH_USER}/repos?per_page=100&sort=updated`)
      .then((r) => r.json())
      .then((data: Repo[]) => {
        if (cancelled || !Array.isArray(data)) return;
        const tally = new Map<string, number>();
        data
          .filter((r) => !r.fork && !r.archived && !r.private && r.language)
          .forEach((r) => tally.set(r.language!, (tally.get(r.language!) || 0) + 1));
        const sorted = Array.from(tally.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({
            name,
            count,
            bytes: count,
            color: LANG_COLORS[name] || "#f4efe8",
          }));
        setBuckets(sorted);
      })
      .catch(() => { if (!cancelled) setBuckets([]); });
    return () => { cancelled = true; };
  }, []);

  const total = (buckets || []).reduce((s, b) => s + b.count, 0) || 1;

  return (
    <div className="pf-lang-stats" data-reveal="true">
      <div className="pf-lang-stats-head">
        <span className="pf-lang-stats-meta">{buckets ? `${buckets.length} languages · ${total} repos` : "SYNCING…"}</span>
      </div>
      <div className="pf-lang-stats-bar">
        {(buckets || []).map((b) => (
          <span
            key={b.name}
            className="pf-lang-stats-bar-seg"
            style={{ width: `${(b.count / total) * 100}%`, background: b.color }}
            title={`${b.name} — ${b.count} repos`}
          />
        ))}
      </div>
      <div className="pf-lang-stats-list">
        {(buckets || []).map((b) => (
          <div key={b.name} className="pf-lang-stats-row">
            <span className="pf-lang-stats-dot" style={{ background: b.color }} />
            <span className="pf-lang-stats-name">{b.name}</span>
            <span className="pf-lang-stats-count">{b.count}</span>
            <span className="pf-lang-stats-pct">{Math.round((b.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JourneyTimeline() {
  return (
    <div className="pf-journey">
      <div className="pf-journey-spine" aria-hidden="true" />
      {JOURNEY.map((j, i) => (
        <article
          key={`${j.org}-${j.period}`}
          className={`pf-journey-entry pf-journey-${j.kind}${j.status === "current" ? " is-current" : ""}`}
          data-reveal="true"
          style={{ transitionDelay: `${i * 0.08}s` }}
        >
          <div className="pf-journey-node" aria-hidden="true">
            {j.kind === "education" ? <GraduationCap size={14} /> : <Briefcase size={14} />}
          </div>
          <div className="pf-journey-period">
            <span>{j.period}</span>
            {j.status === "current" && <span className="pf-journey-current-dot" />}
          </div>
          <a
            href={j.url}
            target="_blank"
            rel="noreferrer"
            className="pf-journey-card"
            data-cursor-link
          >
            <div className="pf-journey-card-head">
              <div className="pf-journey-logo">
                <img src={j.logo} alt={j.org} draggable={false} />
              </div>
              <div className="pf-journey-meta">
                <span className="pf-journey-kind">{j.kind === "education" ? "Education" : "Work"}</span>
                <h3 className="pf-journey-title">{j.title}</h3>
                <span className="pf-journey-org">{j.org}</span>
              </div>
              <ExternalLink size={14} className="pf-journey-link-icon" />
            </div>
            <p className="pf-journey-detail">{j.detail}</p>
            <div className="pf-journey-tags">
              {j.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<boolean[]>(Array(TERMINAL_LINES.length).fill(false));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          TERMINAL_LINES.forEach((_, i) => {
            setTimeout(() => {
              setRevealed((prev) => { const n = [...prev]; n[i] = true; return n; });
            }, 120 + i * 160);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="pf-terminal-panel" data-reveal="true">
      <div className="pf-terminal-topline">
        <Code size={16} aria-hidden="true" />
        <span>RISHAB_CONSOLE</span>
      </div>
      <div className="pf-terminal-lines">
        {TERMINAL_LINES.map((line, i) => (
          <span key={i} className={`pf-terminal-line${revealed[i] ? " is-visible" : ""}`}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    let raf: number;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      setPct(Math.round(eased * 100));
      if (progress < 1) { raf = requestAnimationFrame(step); }
      else { setTimeout(() => { setDone(true); setTimeout(onDone, 700); }, 200); }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`pf-preloader${done ? " is-done" : ""}`}>
      <div className="pf-preloader-panel pf-preloader-panel-left" />
      <div className="pf-preloader-panel pf-preloader-panel-right" />
      <div className="pf-preloader-grid" />
      <div className="pf-preloader-grain" />
      <div className="pf-preloader-scan" />
      <div className="pf-preloader-accent pf-preloader-accent-red" />
      <div className="pf-preloader-accent pf-preloader-accent-cyan" />
      <div className="pf-preloader-content">
        <div className="pf-preloader-meta">
          <span>FULL STACK DEVELOPER</span>
          <span>NIT JALANDHAR</span>
        </div>
        <div className="pf-preloader-brand-wrap">
          <div className="pf-preloader-brand">RAM</div>
        </div>
        <div className="pf-preloader-meta" style={{ flexDirection: "column" as const, alignItems: "flex-end" }}>
          <span>HYDERABAD, INDIA</span>
          <span>ONLINE</span>
        </div>
        <div className="pf-preloader-status-row">
          <span>INITIALIZING CORE</span>
          <span className="pf-preloader-percentage">{String(pct).padStart(3, "0")}%</span>
        </div>
        <div className="pf-preloader-mini-marquee">
          <div className="pf-preloader-mini-marquee-inner">
            {MINI_MARQUEE.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>
        <div className="pf-preloader-progress-bottom">
          <div className="pf-preloader-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gx = { cur: -100, target: -100 };
    const gy = { cur: -100, target: -100 };
    let raf: number;

    function move(e: MouseEvent) {
      gx.target = e.clientX; gy.target = e.clientY;
      const s = `translateX(${e.clientX}px) translateY(${e.clientY}px)`;
      if (scopeRef.current) scopeRef.current.style.transform = s;
      if (dotRef.current) dotRef.current.style.transform = s;
    }

    function animate() {
      gx.cur += (gx.target - gx.cur) * 0.14;
      gy.cur += (gy.target - gy.cur) * 0.14;
      if (glowRef.current) glowRef.current.style.transform = `translateX(${gx.cur}px) translateY(${gy.cur}px)`;
      raf = requestAnimationFrame(animate);
    }

    function onOver(e: MouseEvent) {
      if ((e.target as Element).closest("a,button,[data-cursor-link]") && glowRef.current)
        glowRef.current.classList.add("is-link");
    }
    function onOut(e: MouseEvent) {
      if ((e.target as Element).closest("a,button,[data-cursor-link]") && glowRef.current)
        glowRef.current.classList.remove("is-link");
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="pf-cursor-glow" style={{ transform: "translateX(-100px) translateY(-100px)" }} />
      <div ref={scopeRef} className="pf-cursor-scope" style={{ transform: "translateX(-100px) translateY(-100px)" }}>
        <span className="pf-cursor-scope-ring" />
        <span className="pf-cursor-scope-core" />
        <span className="pf-cursor-scope-line pf-cursor-scope-line-x" />
        <span className="pf-cursor-scope-line pf-cursor-scope-line-y" />
        <span className="pf-cursor-blade pf-cursor-blade-a" />
        <span className="pf-cursor-blade pf-cursor-blade-b" />
      </div>
      <div ref={dotRef} className="pf-cursor-dot" style={{ transform: "translateX(-100px) translateY(-100px)" }} />
    </>
  );
}

const LEETCODE_USERNAME = "Rathod_Ramraj";
const STATUS_COLORS: Record<string, string> = {
  online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e",
};
const STATUS_LABELS: Record<string, string> = {
  online: "ONLINE", idle: "IDLE", dnd: "DO NOT DISTURB", offline: "OFFLINE",
};


type DiscordActivity = {
  id?: string; name: string; type: number; state?: string; details?: string; application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
};
type LanyardData = {
  discord_user: { id: string; username: string; global_name: string | null; avatar: string | null; discriminator: string };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: DiscordActivity[];
  listening_to_spotify: boolean;
  spotify: { track_id: string; timestamps: { start: number; end: number }; album: string; album_art_url: string; artist: string; song: string } | null;
};

const DISCORD_USER_ID = "1343627759997554708";

function resolveDiscordAsset(asset: string, applicationId?: string) {
  if (!asset) return "";
  if (asset.startsWith("mp:")) return asset.replace("mp:", "https://media.discordapp.net/");
  if (asset.startsWith("spotify:")) return `https://i.scdn.co/image/${asset.split(":")[1]}`;
  return `https://cdn.discordapp.com/app-assets/${applicationId || ""}/${asset}.png`;
}

function activityLabel(type: number) {
  switch (type) {
    case 0: return "Playing"; case 1: return "Streaming"; case 2: return "Listening to";
    case 3: return "Watching"; case 4: return "Custom Status"; case 5: return "Competing in";
    default: return "Playing";
  }
}

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function DiscordCard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!DISCORD_USER_ID) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (!cancelled) {
          if (json?.success && json.data) { setData(json.data); setError(false); }
          else setError(true);
        }
      } catch { if (!cancelled) setError(true); }
    }
    load();
    const poll = setInterval(load, 15000);
    const heartbeat = setInterval(() => setTick((t) => t + 1), 1000);
    return () => { cancelled = true; clearInterval(poll); clearInterval(heartbeat); };
  }, []);

  void tick;

  const status = data ? (data.discord_status || "offline") : "offline";
  const user = data ? data.discord_user : {
    id: DISCORD_USER_ID || "1343627759997554708",
    username: "rathod_ramraj",
    global_name: "Ramraj",
    avatar: null,
    discriminator: "0"
  };
  const avatar = data && user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
    : `https://github.com/rathod-ramraj.png`;

  const activities = data ? (data.activities || []).filter((a) => a.type !== 4) : [];
  const customStatus = data ? (data.activities || []).find((a) => a.type === 4) : null;

  return (
    <div className="pf-live-card pf-discord-card" data-cursor-link>
      <div className="pf-live-header">
        <span className="pf-live-eyebrow">Discord Presence</span>
        <span className="pf-live-status">
          <span className="pf-live-dot" style={{ background: STATUS_COLORS[status] }} />
          <span>{STATUS_LABELS[status]}</span>
        </span>
      </div>
      <div className="pf-discord-identity">
        <div className="pf-discord-avatar-wrap">
          <img src={avatar} alt={user.username} className="pf-discord-avatar" draggable={false} />
          <span className="pf-discord-status-pill" style={{ background: STATUS_COLORS[status] }} />
        </div>
        <div className="pf-discord-meta">
          <span className="pf-discord-name">{user.global_name || user.username}</span>
          <span className="pf-discord-handle">@{user.username}</span>
          {customStatus?.state && <span className="pf-discord-bio">{customStatus.state}</span>}
        </div>
      </div>
      <div className="pf-discord-divider" />
      <div className="pf-discord-activities">
        {activities.length === 0 ? (
          <p className="pf-live-empty">NO ACTIVE SESSIONS</p>
        ) : activities.slice(0, 2).map((a, idx) => {
          const isSpotify = a.type === 2 && a.name === "Spotify";
          const large = a.assets?.large_image
            ? (isSpotify && a.assets.large_image.startsWith("spotify:")
                ? `https://i.scdn.co/image/${a.assets.large_image.split(":")[1]}`
                : resolveDiscordAsset(a.assets.large_image, a.application_id))
            : null;
          const small = a.assets?.small_image ? resolveDiscordAsset(a.assets.small_image, a.application_id) : null;
          const elapsed = a.timestamps?.start ? Date.now() - a.timestamps.start : null;
          const total = a.timestamps?.start && a.timestamps?.end ? a.timestamps.end - a.timestamps.start : null;
          const pct = elapsed != null && total ? Math.min(100, (elapsed / total) * 100) : null;
          return (
            <div key={a.id || idx} className="pf-activity-row">
              {large && (
                <div className="pf-activity-art">
                  <img src={large} alt={a.name} draggable={false} />
                  {small && <img src={small} alt="" className="pf-activity-art-small" draggable={false} />}
                </div>
              )}
              <div className="pf-activity-body">
                <span className="pf-activity-label">{a.type === 2 ? `Listening to ${a.name}` : activityLabel(a.type)}</span>
                <span className="pf-activity-title">{a.type === 2 ? (a.details || a.name) : a.name}</span>
                {a.type === 2 && a.state && <span className="pf-activity-sub">by {a.state}</span>}
                {a.type !== 2 && a.details && <span className="pf-activity-sub">{a.details}</span>}
                {a.type !== 2 && a.state && <span className="pf-activity-sub">{a.state}</span>}
                {pct != null ? (
                  <div className="pf-activity-progress">
                    <div className="pf-activity-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                ) : elapsed != null ? (
                  <span className="pf-activity-elapsed">{formatElapsed(elapsed)} elapsed</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type LeetCodeData = {
  totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number;
  totalQuestions: number; totalEasy: number; totalMedium: number; totalHard: number;
  ranking: number;
};

function LeetCodeCard() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/leetcode?username=${encodeURIComponent(LEETCODE_USERNAME)}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) { if (j && typeof j.totalSolved === "number") setData(j); else setError(true); } })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="pf-live-card pf-leetcode-card pf-live-card-empty">
        <div className="pf-live-header">
          <span className="pf-live-eyebrow">LeetCode</span>
          <span className="pf-live-dot" style={{ background: STATUS_COLORS.offline }} />
        </div>
        <p className="pf-live-empty">STATS UNREACHABLE</p>
      </div>
    );
  }

  const loading = !data;
  const totalPct = data ? Math.min(100, (data.totalSolved / Math.max(data.totalQuestions, 1)) * 100) : 0;
  const buckets = [
    { key: "Easy", solved: data?.easySolved ?? 0, total: data?.totalEasy ?? 0, color: "var(--cyan)" },
    { key: "Medium", solved: data?.mediumSolved ?? 0, total: data?.totalMedium ?? 0, color: "var(--gold)" },
    { key: "Hard", solved: data?.hardSolved ?? 0, total: data?.totalHard ?? 0, color: "var(--red)" },
  ];

  return (
    <a
      href={`https://leetcode.com/u/${LEETCODE_USERNAME}`}
      target="_blank"
      rel="noreferrer"
      className="pf-live-card pf-leetcode-card"
      data-cursor-link
    >
      <div className="pf-live-header">
        <span className="pf-live-eyebrow">LeetCode</span>
        <span className="pf-live-status">
          <span className="pf-live-dot" style={{ background: "var(--gold)" }} />
          <span>@{LEETCODE_USERNAME}</span>
        </span>
      </div>
      <div className="pf-leetcode-headline">
        <span className="pf-leetcode-total">{loading ? "—" : data!.totalSolved}</span>
        <span className="pf-leetcode-total-label">Problems Solved</span>
        <span className="pf-leetcode-rank">
          Global Rank <strong>#{loading ? "—" : data!.ranking.toLocaleString()}</strong>
        </span>
      </div>
      <div className="pf-leetcode-progress-wrap">
        <div className="pf-leetcode-progress-track">
          <div className="pf-leetcode-progress-fill" style={{ width: `${totalPct}%` }} />
        </div>
        <span className="pf-leetcode-progress-meta">
          {loading ? "—" : `${data!.totalSolved} / ${data!.totalQuestions}`}
        </span>
      </div>
      <div className="pf-leetcode-buckets">
        {buckets.map((b) => {
          const pct = b.total ? Math.min(100, (b.solved / b.total) * 100) : 0;
          return (
            <div key={b.key} className="pf-leetcode-bucket">
              <div className="pf-leetcode-bucket-head">
                <span className="pf-leetcode-bucket-label">{b.key}</span>
                <span className="pf-leetcode-bucket-count">{loading ? "—" : `${b.solved}/${b.total}`}</span>
              </div>
              <div className="pf-leetcode-bucket-track">
                <div className="pf-leetcode-bucket-fill" style={{ width: `${pct}%`, background: b.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </a>
  );
}

export function Portfolio() {
  usePageMeta({
    title: "Rathod Ramraj — Full Stack Developer • React • Next.js • Node.js",
    description: "Rathod Ramraj is a Full Stack Developer and B.Tech IT student at NIT Jalandhar. Passionate about building scalable web applications using React, Next.js, Node.js, MongoDB, PostgreSQL, and AI-powered solutions.",
    path: "/",
  });
  const [ready, setReady] = useState(false);
  const [activeChapter, setActiveChapter] = useState("hero");
  const navLinksRef = useRef<HTMLDivElement>(null);
  const navProgressRef = useRef<HTMLSpanElement>(null);
  const heroWordRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const onPreloaderDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const word = heroWordRef.current;
    const sub = heroSubRef.current;
    if (word) {
      requestAnimationFrame(() => {
        word.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        word.style.opacity = "1";
        word.style.transform = "none";
      });
    }
    if (sub) {
      setTimeout(() => {
        sub.style.transition = "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.18s";
        sub.style.opacity = "1";
        sub.style.transform = "none";
      }, 60);
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    let rafScheduled = false;
    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      if (navProgressRef.current) navProgressRef.current.style.width = pct + "%";
    }
    function onScroll() {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        updateProgress();
        rafScheduled = false;
      });
    }
    function onAnchorClick(e: MouseEvent) {
      const a = (e.target as Element).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: "smooth" });
    }

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const sections = document.querySelectorAll("[data-chapter]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveChapter((e.target as HTMLElement).dataset.chapter || "");
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [ready]);

  useEffect(() => {
    const container = navLinksRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLAnchorElement>("a.is-active");
    if (!active) return;
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const offset = aRect.left - cRect.left - (cRect.width / 2 - aRect.width / 2);
    container.scrollTo({ left: container.scrollLeft + offset, behavior: "smooth" });
  }, [activeChapter]);

  useEffect(() => {
    if (!ready) return;
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const siblings = Array.from(parent.querySelectorAll(":scope > [data-reveal]"));
      const idx = siblings.indexOf(el as Element);
      const existing = parseFloat((el as HTMLElement).style.transitionDelay || "0") * 1000;
      if (idx > 0 && existing === 0) {
        (el as HTMLElement).style.transitionDelay = `${idx * 0.12}s`;
      }
    });
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }); },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ready]);

  const chapters = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "numbers", label: "Numbers" },
    { id: "live", label: "Live" },
    { id: "projects", label: "Projects" },
    { id: "oss", label: "OSS" },
    { id: "journey", label: "Journey" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="pf-root">
      <Preloader onDone={onPreloaderDone} />
      <Cursor />

      <nav className={`pf-chapter-nav${ready ? " is-ready" : ""}`} aria-label="Chapter navigation">
        <a href="#hero" className="pf-chapter-nav-brand" data-cursor-link>
          <img src="/nobg.png" alt="Rathod Ramraj" />
          <span>RAMRAJ</span>
        </a>
        <div className="pf-chapter-nav-links" ref={navLinksRef}>
          {chapters.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={activeChapter === c.id ? "is-active" : ""}
              data-cursor-link
            >
              <span>{String(i).padStart(2, "0")}</span>
              <span>{c.label}</span>
            </a>
          ))}
        </div>
        <a
          href="https://github.com/rathod-ramraj"
          target="_blank"
          rel="noreferrer"
          className="pf-chapter-nav-cta"
          data-cursor-link
        >
          <Github size={12} aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <span
          ref={navProgressRef}
          className="pf-chapter-nav-progress"
          aria-hidden="true"
        />
      </nav>

      <div className={`pf-shell${ready ? " is-ready" : ""}`}>
        <div className="pf-noise-overlay" />
        <div className="pf-command-grid" />

        <section id="hero" data-chapter="hero" className="pf-hero">
          <div className="pf-hero-kicker" data-reveal="true">
            <span>Rathod Ramraj</span>
            <span>Hyderabad, India</span>
          </div>
          <div className="pf-hero-layout">
            <div className="pf-hero-copy">
              <h1
                ref={heroWordRef}
                className="pf-hero-word"
                style={{ opacity: 0, transform: "translateY(80px) rotateX(16deg)" }}
              >
                RAMRAJ
              </h1>
              <p
                ref={heroSubRef}
                className="pf-hero-subtitle"
                style={{ opacity: 0, transform: "translateY(30px)" }}
              >
                Full Stack Developer <span aria-hidden="true">•</span> React <span aria-hidden="true">•</span> Next.js <span aria-hidden="true">•</span> Node.js
              </p>
            </div>
            <div className="pf-hero-visual">
              <div className="pf-portrait-readout" style={{ position: "static", textAlign: "right" }}>
                <span>CORE ONLINE</span>
                <span>NIT JALANDHAR</span>
              </div>
            </div>
          </div>
          <div className="pf-marquee" aria-hidden="true">
            <div className="pf-marquee-track">
              {MARQUEE_ITEMS.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </section>

        <section id="about" data-chapter="about" className="pf-chapter pf-about-section">
          <div className="pf-section-shell">
            <p className="pf-chapter-label" data-reveal="true">01 / About</p>
            <div className="pf-about-grid">
              <h2 data-reveal="true">BUILDING DIGITAL PRODUCTS FROM SCRATCH.</h2>
              <div className="pf-about-copy" data-reveal="true">
                <p>I'm Rathod Ramraj — a Full Stack Developer and B.Tech Information Technology student at NIT Jalandhar, passionate about building scalable web applications, AI-powered platforms, and modern user experiences.</p>
                <p>I enjoy transforming ideas into high-quality code. I specialize in React, Next.js, Node.js, MongoDB, and PostgreSQL, with a strong interest in AI integration, clean coding patterns, and intuitive UI/UX design.</p>
              </div>
            </div>
            <Terminal />
          </div>
        </section>

        <section id="numbers" data-chapter="numbers" className="pf-chapter pf-numbers-section">
          <div className="pf-section-shell">
            <p className="pf-chapter-label" data-reveal="true">02 / Numbers</p>
            <div className="pf-metrics-grid">
              <MetricCard value="11"   label="Projects Built"          delay={0} />
              <MetricCard value="2028" label="NITJ B.Tech IT Batch"     delay={100} />
              <MetricCard value="15+"  label="Public GitHub Repos"      delay={200} />
              <MetricCard value="1"    label="Developer Internship"     delay={300} />
            </div>
          </div>
        </section>

        <section id="live" data-chapter="live" className="pf-chapter pf-live-section">
          <div className="pf-section-shell">
            <p className="pf-chapter-label" data-reveal="true">03 / Live Signal</p>
            <h2 className="pf-live-heading" data-reveal="true">REALTIME — PRESENCE &amp; PRACTICE.</h2>
            <div className="pf-live-grid">
              <div data-reveal="true"><DiscordCard /></div>
              <div data-reveal="true"><LeetCodeCard /></div>
            </div>
          </div>
        </section>

        <section id="projects" data-chapter="projects" className="pf-chapter">
          <div className="pf-section-shell">
            <div className="pf-section-heading">
              <p className="pf-chapter-label" data-reveal="true">04 / Projects</p>
              <h2 data-reveal="true">Systems that feel sharp before they speak.</h2>
            </div>
            <ProjectShowcase />
            <div className="pf-projects-cta" data-reveal="true">
              <Link href="/projects" className="pf-projects-cta-btn" data-cursor-link>
                <span>See All Projects</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="oss" data-chapter="oss" className="pf-chapter pf-about-section">
          <div className="pf-section-shell">
            <p className="pf-chapter-label" data-reveal="true">05 / Open Source</p>
            <h2 data-reveal="true">CONTRIBUTING TO THE COMMONS.</h2>
            <div className="pf-oss-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="pf-oss-card" data-reveal="true" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                <p className="pf-oss-desc" style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                  Currently contributing to frontend development and preparing open-source contributions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" data-chapter="journey" className="pf-chapter pf-journey-section">
          <div className="pf-section-shell">
            <div className="pf-section-heading">
              <p className="pf-chapter-label" data-reveal="true">06 / Journey</p>
              <h2 data-reveal="true">EDUCATION &amp; WORK — TRAJECTORY ON RECORD.</h2>
            </div>
            <JourneyTimeline />
          </div>
        </section>

        <section id="skills" data-chapter="skills" className="pf-chapter pf-skills-section">
          <div className="pf-section-shell">
            <p className="pf-chapter-label" data-reveal="true">07 / Skills</p>
            <div className="pf-skill-layout">
              <h2 data-reveal="true">Tools sharpened for backend, scraping, and reverse engineering.</h2>
              <LanguageStats />
            </div>
            <SkillCarousel />
          </div>
        </section>

        <section id="contact" data-chapter="contact" className="pf-contact-section">
          <div className="pf-contact-panel" data-reveal="true">
            <p className="pf-chapter-label">08 / Contact</p>
            <h2>LET'S BUILD SOMETHING TOGETHER</h2>
            <div className="pf-contact-actions">
              <a href="https://github.com/rathod-ramraj" target="_blank" rel="noreferrer" data-cursor-link>
                <Github size={18} aria-hidden="true" style={{ color: "#a371f7" }} />
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/rathod-ramraj-a50794323" target="_blank" rel="noreferrer" data-cursor-link>
                <Linkedin size={18} aria-hidden="true" style={{ color: "#0A66C2" }} />
                <span>LinkedIn</span>
              </a>
              <a href="https://leetcode.com/u/Rathod_Ramraj/" target="_blank" rel="noreferrer" data-cursor-link>
                <svg role="img" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ color: "#FFA116" }}><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
                <span>LeetCode</span>
              </a>
              <a href="https://codeforces.com/profile/rathodram" target="_blank" rel="noreferrer" data-cursor-link>
                <svg role="img" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="#4A90E2" d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3z"/>
                  <path fill="#FF4A4A" d="M13.5 4.5A1.5 1.5 0 0 1 15 6v13.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5V6a1.5 1.5 0 0 1 1.5-1.5h3z"/>
                  <path fill="#FFCC00" d="M22.5 10.5A1.5 1.5 0 0 1 24 12v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"/>
                </svg>
                <span>Codeforces</span>
              </a>
              <a href="mailto:rathodramraj.dev@gmail.com" target="_blank" rel="noreferrer" data-cursor-link>
                <MessageCircle size={18} aria-hidden="true" style={{ color: "#EA4335" }} />
                <span>Email</span>
              </a>
              <a href="https://discord.com/users/1343627759997554708" target="_blank" rel="noreferrer" data-cursor-link>
                <svg role="img" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ color: "#5865F2" }}><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>
                <span>Discord</span>
              </a>
              <a href="https://www.instagram.com/rammm_18_/" target="_blank" rel="noreferrer" data-cursor-link>
                <Instagram size={18} aria-hidden="true" style={{ color: "#E1306C" }} />
                <span>Instagram</span>
              </a>
              <a href="https://x.com/rammm2200" target="_blank" rel="noreferrer" data-cursor-link>
                <svg role="img" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ color: "#1DA1F2" }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>X</span>
              </a>
            </div>
            <p className="pf-contact-username">rathodramraj.dev@gmail.com • Discord: rathod_ramraj</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Portfolio;
