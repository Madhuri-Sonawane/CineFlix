import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";
import useActiveProfile from "../hooks/useActiveProfile";
import gsap from "gsap";

export default function WatchLater() {
  const navigate = useNavigate();
  const profile  = useActiveProfile();
  const [list, setList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!profile) return;
    const stored = JSON.parse(localStorage.getItem(`watchLater_${profile.id}`)) || [];
    setList(stored);
  }, [profile]);

  useEffect(() => {
    if (!gridRef.current || !list.length) return;
    gsap.fromTo(Array.from(gridRef.current.children),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }
    );
  }, [list.length]);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const removeItem = (movieId) => {
    const updated = list.filter(m => m.id !== movieId);
    localStorage.setItem(`watchLater_${profile.id}`, JSON.stringify(updated));
    setList(updated);
  };

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "var(--brand-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7c3aed", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--brand-bg)", padding: "5rem 0 3rem" }}>

      {/* BG glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1rem, 4%, 2.5rem)" }}>

        {/* Header */}
        <div ref={headerRef} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "2rem" }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "var(--brand-text-dim)", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", marginBottom: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🔖</div>
              <div>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#f1eeff", letterSpacing: "-0.02em" }}>Watch Later</h1>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "var(--brand-text-dim)", marginTop: 2 }}>
                  {list.length} {list.length === 1 ? "movie" : "movies"} saved
                </p>
              </div>
            </div>
          </div>

          {list.length > 0 && (
            <button onClick={() => { localStorage.removeItem(`watchLater_${profile.id}`); setList([]); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "8px 16px", cursor: "pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              Clear All
            </button>
          )}
        </div>

        {/* Empty */}
        {list.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 2rem", gap: "1.25rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🔖</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#f1eeff" }}>Nothing saved yet</h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "var(--brand-text-dim)", textAlign: "center", maxWidth: 300 }}>
              Bookmark movies from the grid to build your personal watchlist
            </p>
            <button onClick={() => navigate("/")} style={{ marginTop: 8, padding: "10px 24px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
              Browse Movies
            </button>
          </div>
        )}

        {/* Grid */}
        {list.length > 0 && (
          <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1.25rem" }}>
            {list.map(movie => {
              const isHovered = hoveredId === movie.id;
              return (
                <div key={movie.id}
                  onMouseEnter={() => setHoveredId(movie.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "var(--brand-surface)", border: isHovered ? "1px solid rgba(124,58,237,0.5)" : "1px solid var(--brand-border)", boxShadow: isHovered ? "0 0 24px rgba(124,58,237,0.3), 0 8px 32px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.4)", transition: "all 0.25s ease", transform: isHovered ? "translateY(-4px)" : "translateY(0)" }}
                >
                  <img src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "/no-poster.png"} alt={movie.title}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block", cursor: "pointer", transition: "transform 0.4s ease, filter 0.4s ease", transform: isHovered ? "scale(1.05)" : "scale(1)", filter: isHovered ? "brightness(1.1)" : "brightness(1)" }}
                  />
                  {/* Remove button */}
                  <button onClick={() => removeItem(movie.id)} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(9,8,15,0.8)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, cursor: "pointer", color: "#f87171", fontSize: "0.75rem", backdropFilter: "blur(8px)", transition: "all 0.2s", opacity: isHovered ? 1 : 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(9,8,15,0.8)"; }}
                  >✕</button>
                  {/* Gold bookmark badge */}
                  <div style={{ position: "absolute", top: 8, left: 8, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div style={{ padding: "0.65rem 0.75rem 0.75rem" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#f1eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>{movie.title}</h3>
                    {movie.vote_average > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(movie.vote_average / 10) * 100}%`, background: "#f59e0b", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#f59e0b" }}>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {/* Bottom accent */}
                  <div style={{ height: 2, background: "linear-gradient(90deg, #f59e0b, #fcd34d)", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}