import { useEffect, useRef } from "react";
import gsap from "gsap";

/* Genre icon map */
const GENRE_ICONS = {
  28: "💥", 12: "🗺️", 16: "🎨", 35: "😂", 80: "🔫",
  99: "🎥", 18: "🎭", 10751: "👨‍👩‍👧", 14: "🧙", 36: "📜",
  27: "👻", 10402: "🎵", 9648: "🔍", 10749: "💕", 878: "🚀",
  53: "🔪", 10752: "⚔️", 37: "🤠",
};

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

/* Section label */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: "0.68rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--brand-text-muted)",
      marginBottom: "0.6rem",
    }}>
      {children}
    </p>
  );
}

export default function Sidebar({ open, genres, filters, setFilters, onClose }) {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  /* active filter count */
  const activeCount =
    filters.genreIds.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.year ? 1 : 0);

  const clearAll = () =>
    setFilters({ genreIds: [], rating: 0, year: "" });

  /* =========================
     MOBILE ANIMATION ONLY
  ========================== */
  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    if (open) {
      gsap.to(sidebarRef.current, { x: 0, duration: 0.35, ease: "power3.out" });
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.2 });
    } else {
      gsap.to(sidebarRef.current, { x: -320, duration: 0.3, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.2 });
    }
  }, [open]);

  const toggleGenre = (id) =>
    setFilters((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((g) => g !== id)
        : [...prev.genreIds, id],
    }));

  /* rating colour */
  const ratingColor =
    filters.rating >= 7.5 ? "#f59e0b" :
    filters.rating >= 5   ? "#a78bfa" :
                             "var(--brand-text-muted)";

  return (
    <>
      <style>{`
        /* Desktop: always visible as sticky sidebar */
        @media (min-width: 1024px) {
          .cf-sidebar {
            position: sticky !important;
            top: 64px !important;
            transform: translateX(0) !important;
            height: calc(100vh - 64px);
            flex-shrink: 0;
          }
        }
        .cf-sidebar::-webkit-scrollbar { width: 4px; }
        .cf-sidebar::-webkit-scrollbar-track { background: transparent; }
        .cf-sidebar::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.35); border-radius: 99px; }

        .cf-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px;
          border-radius: 99px; outline: none; cursor: pointer; }
        .cf-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          box-shadow: 0 0 10px rgba(124,58,237,0.6);
          cursor: pointer; border: 2px solid #09080f;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cf-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 18px rgba(124,58,237,0.8);
        }
      `}</style>

      {/* ── MOBILE OVERLAY ── */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="lg:hidden"
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(9,8,15,0.7)",
          backdropFilter: "blur(4px)",
          opacity: 0, pointerEvents: "none",
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside
        ref={sidebarRef}
        className="cf-sidebar"
        style={{
          position: "fixed",
          top: "64px", left: 0,
          zIndex: 50,
          width: 256,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          padding: "1.25rem 1rem",
          /* mobile: start off-screen; desktop handled by CSS class below */
          transform: "translateX(-320px)",

          /* glassmorphism */
          background: "rgba(17, 15, 30, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(124,58,237,0.18)",

          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(124,58,237,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.95rem", fontWeight: 700, color: "#f1eeff",
            }}>
              Filters
            </span>
            {/* Active count badge */}
            {activeCount > 0 && (
              <div style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                color: "#fff",
                fontSize: "0.65rem", fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                borderRadius: 99, padding: "2px 7px",
                boxShadow: "0 0 10px rgba(124,58,237,0.5)",
              }}>
                {activeCount}
              </div>
            )}
          </div>

          {/* Clear all + mobile close */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.72rem", fontWeight: 600,
                  color: "#a78bfa",
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  borderRadius: 6, padding: "4px 10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.25)";
                  e.currentTarget.style.color = "#f1eeff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                  e.currentTarget.style.color = "#a78bfa";
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden"
              style={{
                width: 28, height: 28, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 8, cursor: "pointer",
                color: "#a78bfa", fontSize: "0.85rem",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* thin divider */}
        <div style={{ height: 1, background: "rgba(124,58,237,0.15)", margin: "0 -1rem" }} />

        {/* ── GENRES ── */}
        <div>
          <SectionLabel>Genres</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {genres.map((g) => {
              const active = filters.genreIds.includes(g.id);
              const icon   = GENRE_ICONS[g.id] || "🎬";
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  title={g.name}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 10px",
                    background: active
                      ? "rgba(124,58,237,0.22)"
                      : "rgba(255,255,255,0.03)",
                    border: active
                      ? "1px solid rgba(124,58,237,0.55)"
                      : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, cursor: "pointer",
                    transition: "all 0.18s ease",
                    textAlign: "left", width: "100%",
                    boxShadow: active ? "0 0 10px rgba(124,58,237,0.2)" : "none",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                      e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    }
                  }}
                >
                  <span style={{ fontSize: "0.85rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "#f1eeff" : "var(--brand-text-dim)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {g.name}
                  </span>
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      style={{ marginLeft: "auto", flexShrink: 0 }}
                      stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* thin divider */}
        <div style={{ height: 1, background: "rgba(124,58,237,0.15)", margin: "0 -1rem" }} />

        {/* ── MIN RATING ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <SectionLabel>Min Rating</SectionLabel>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.9rem", fontWeight: 700,
              color: ratingColor,
              transition: "color 0.3s ease",
            }}>
              {filters.rating > 0 ? `${filters.rating}+` : "Any"}
            </span>
          </div>

          {/* Track background gradient */}
          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <input
              type="range"
              min="0" max="10" step="0.5"
              value={filters.rating}
              onChange={(e) => setFilters((p) => ({ ...p, rating: Number(e.target.value) }))}
              className="cf-range"
              style={{
                background: `linear-gradient(to right, #7c3aed ${filters.rating * 10}%, rgba(255,255,255,0.1) ${filters.rating * 10}%)`,
              }}
            />
          </div>

          {/* Rating tick marks */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "0 2px",
          }}>
            {[0, 2, 4, 6, 8, 10].map(v => (
              <span key={v} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.6rem", color: "var(--brand-text-muted)",
              }}>{v}</span>
            ))}
          </div>
        </div>

        {/* thin divider */}
        <div style={{ height: 1, background: "rgba(124,58,237,0.15)", margin: "0 -1rem" }} />

        {/* ── YEAR ── */}
        <div>
          <SectionLabel>Release Year</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {/* All option */}
            <button
              onClick={() => setFilters(p => ({ ...p, year: "" }))}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.75rem", fontWeight: 600,
                padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                background: !filters.year ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
                border: !filters.year ? "1px solid rgba(124,58,237,0.55)" : "1px solid rgba(255,255,255,0.08)",
                color: !filters.year ? "#f1eeff" : "var(--brand-text-dim)",
                transition: "all 0.18s ease",
              }}
            >
              All
            </button>
            {years.map((y) => {
              const active = String(filters.year) === String(y);
              return (
                <button
                  key={y}
                  onClick={() => setFilters(p => ({ ...p, year: active ? "" : y }))}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.75rem", fontWeight: 600,
                    padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                    background: active ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color: active ? "#f59e0b" : "var(--brand-text-dim)",
                    transition: "all 0.18s ease",
                    boxShadow: active ? "0 0 10px rgba(245,158,11,0.2)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                      e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                      e.currentTarget.style.color = "#f1eeff";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "var(--brand-text-dim)";
                    }
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── APPLY (mobile only) ── */}
        <button
          onClick={onClose}
          className="lg:hidden"
          style={{
            marginTop: "auto",
            width: "100%", padding: "12px",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            border: "none", borderRadius: 12, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: "0.9rem",
            color: "#fff",
            boxShadow: "0 0 20px rgba(124,58,237,0.4)",
          }}
        >
          Apply Filters {activeCount > 0 && `(${activeCount})`}
        </button>
      </aside>
    </>
  );
}