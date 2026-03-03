import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";
import gsap from "gsap";

function timeAgo(ts) {
  if (!ts) return "Recently";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Activity() {
  const navigate       = useNavigate();
  const [activities, setActivities] = useState([]);
  const [hoveredId,  setHoveredId]  = useState(null);
  const gridRef   = useRef(null);
  const headerRef = useRef(null);

  const profiles        = JSON.parse(localStorage.getItem("profiles")) || [];
  const activeProfileId = localStorage.getItem("activeProfileId");
  const activeProfile   = profiles.find(p => p.id === activeProfileId) || {};

  useEffect(() => {
    if (!activeProfileId) return;
    const stored = JSON.parse(localStorage.getItem(`activity_${activeProfileId}`)) || [];
    setActivities(stored.sort((a, b) => b.watchedAt - a.watchedAt));
  }, [activeProfileId]);

  useEffect(() => {
    if (headerRef.current) gsap.fromTo(headerRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!gridRef.current || !activities.length) return;
    gsap.fromTo(Array.from(gridRef.current.children),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
    );
  }, [activities.length]);

  const clearActivity = () => {
    localStorage.removeItem(`activity_${activeProfileId}`);
    setActivities([]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--brand-bg)", padding: "5rem 0 3rem" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1rem, 4%, 2.5rem)" }}>

        {/* Header */}
        <div ref={headerRef} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "2rem" }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "var(--brand-text-dim)", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", marginBottom: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🕐</div>
              <div>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#f1eeff", letterSpacing: "-0.02em" }}>Watch Activity</h1>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "var(--brand-text-dim)", marginTop: 2 }}>
                  {activities.length} {activities.length === 1 ? "title" : "titles"} watched
                </p>
              </div>
            </div>
          </div>
          {!activeProfile.isKids && activities.length > 0 && (
            <button onClick={clearActivity} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "8px 16px", cursor: "pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              Clear History
            </button>
          )}
        </div>

        {/* Empty */}
        {activities.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6rem 2rem", gap: "1.25rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🕐</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#f1eeff" }}>No activity yet</h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "var(--brand-text-dim)", textAlign: "center", maxWidth: 280 }}>Start watching movies to see your history here</p>
            <button onClick={() => navigate("/")} style={{ marginTop: 8, padding: "10px 24px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>Browse Movies</button>
          </div>
        )}

        {/* Grid */}
        {activities.length > 0 && (
          <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
            {activities.map(movie => {
              const isHovered = hoveredId === movie.id;
              const prog = movie.progress || 0;
              return (
                <div key={`${movie.id}-${movie.watchedAt}`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  onMouseEnter={() => setHoveredId(movie.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "var(--brand-surface)", border: isHovered ? "1px solid rgba(124,58,237,0.5)" : "1px solid var(--brand-border)", boxShadow: isHovered ? "0 0 24px rgba(124,58,237,0.3), 0 8px 32px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.4)", transition: "all 0.25s ease", transform: isHovered ? "translateY(-4px)" : "translateY(0)", cursor: "pointer" }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "/no-poster.png"} alt={movie.title}
                      style={{ width: "100%", height: 230, objectFit: "cover", display: "block", transition: "transform 0.4s ease, filter 0.4s ease", transform: isHovered ? "scale(1.06)" : "scale(1)", filter: isHovered ? "brightness(1.08)" : "brightness(1)" }}
                    />
                    {/* Time ago badge */}
                    <div style={{ position: "absolute", top: 8, left: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#f1eeff", background: "rgba(9,8,15,0.82)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 8px" }}>
                      {timeAgo(movie.watchedAt)}
                    </div>
                    {/* Progress % badge */}
                    <div style={{ position: "absolute", top: 8, right: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#f59e0b", background: "rgba(9,8,15,0.82)", backdropFilter: "blur(6px)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "3px 8px" }}>
                      {prog}%
                    </div>
                  </div>

                  <div style={{ padding: "0.65rem 0.75rem 0" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#f1eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</h3>
                  </div>

                  {/* Progress bar */}
                  <div style={{ padding: "0.5rem 0.75rem 0.75rem" }}>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${prog}%`, background: prog > 80 ? "#34d399" : "linear-gradient(90deg, #7c3aed, #f59e0b)", borderRadius: 99, transition: "width 0.6s ease" }} />
                    </div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: "var(--brand-text-muted)", marginTop: 4 }}>
                      {prog > 80 ? "✓ Finished" : prog > 0 ? `${prog}% watched` : "Not started"}
                    </p>
                  </div>

                  <div style={{ height: 2, background: prog > 80 ? "#34d399" : "linear-gradient(90deg, #7c3aed, #a78bfa)", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}