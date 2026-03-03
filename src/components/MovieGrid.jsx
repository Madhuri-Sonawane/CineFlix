import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";
import gsap from "gsap";

/* Genre ID → label (TMDB standard) */
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
  10752: "War", 37: "Western",
};

/* Rating → gold bar width % */
function RatingBar({ score }) {
  const pct = Math.min(100, Math.round((score / 10) * 100));
  const color =
    score >= 7.5 ? "#f59e0b" :
    score >= 5   ? "#a78bfa" :
                   "#6b7280";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{
        flex: 1,
        height: 3,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 99,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }} />
      </div>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.75rem",
        fontWeight: 700,
        color,
        minWidth: 28,
        textAlign: "right",
      }}>
        {score?.toFixed(1)}
      </span>
    </div>
  );
}

/* Bookmark SVG icon */
function BookmarkIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "currentColor"}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

/* Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div style={{
      background: "var(--brand-surface)",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid var(--brand-border)",
    }}>
      <div style={{
        width: "100%", height: 256,
        background: "linear-gradient(90deg, #1a1730 25%, #221f3d 50%, #1a1730 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.4s infinite",
      }} />
      <div style={{ padding: "1rem" }}>
        <div style={{
          height: 16, width: "70%", borderRadius: 6,
          background: "linear-gradient(90deg, #1a1730 25%, #221f3d 50%, #1a1730 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.4s infinite",
          marginBottom: 10,
        }} />
        <div style={{
          height: 10, width: "40%", borderRadius: 6,
          background: "linear-gradient(90deg, #1a1730 25%, #221f3d 50%, #1a1730 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.4s infinite",
        }} />
      </div>
    </div>
  );
}

export default function MovieGrid({ movies = [], loading = false }) {
  const navigate  = useNavigate();
  const gridRef   = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const profileId = localStorage.getItem("activeProfileId");
      const s = localStorage.getItem(`watchLater_${profileId}`);
      return s ? JSON.parse(s).map((m) => m.id) : [];
    } catch {
      return [];
    }
  });

  /* ======================
     ENTRANCE ANIMATION
  ====================== */
  useEffect(() => {
    if (!gridRef.current || loading) return;
    gsap.fromTo(
      gridRef.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: "power2.out" }
    );
  }, [movies, loading]);

  const toggleWatchLater = (movie) => {
    const profileId = localStorage.getItem("activeProfileId");
    if (!profileId) return;
    const key     = `watchLater_${profileId}`;
    const stored  = JSON.parse(localStorage.getItem(key)) || [];
    const exists  = stored.find((m) => m.id === movie.id);
    const updated = exists
      ? stored.filter((m) => m.id !== movie.id)
      : [...stored, movie];
    localStorage.setItem(key, JSON.stringify(updated));
    setSavedIds(updated.map((m) => m.id));
  };

  /* ======================
     SKELETON LOADING
  ====================== */
  if (loading) {
    return (
      <>
        <style>{`
          @keyframes skeleton-shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </>
    );
  }

  if (!movies.length) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        gap: "1rem",
        color: "var(--brand-text-dim)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="var(--brand-purple-light)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p style={{ fontSize: "1rem", fontWeight: 500 }}>No movies found</p>
        <p style={{ fontSize: "0.82rem", opacity: 0.6 }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cf-card-img { transition: transform 0.45s ease, filter 0.45s ease; }
        .cf-card:hover .cf-card-img {
          transform: scale(1.07);
          filter: brightness(1.1) saturate(1.15);
        }
        .cf-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cf-card:hover .cf-overlay { opacity: 1; }
      `}</style>

      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {movies.map((movie) => {
          const saved  = savedIds.includes(movie.id);
          const poster = movie.poster_path
            ? `${IMG_BASE}${movie.poster_path}`
            : "/no-poster.png";
          const genre  = GENRE_MAP[movie.genre_ids?.[0]];
          const year   = movie.release_date?.slice(0, 4);

          return (
            <div
              key={movie.id}
              className="movie-card cf-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={(e) => {
                setHoveredId(null);
                gsap.to(e.currentTarget, {
                  rotateX: 0, rotateY: 0, scale: 1,
                  duration: 0.4, ease: "power3.out",
                });
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(card, {
                  rotateY: x / 18, rotateX: -y / 18, scale: 1.04,
                  duration: 0.3, ease: "power2.out",
                });
              }}
              style={{
                position: "relative",
                background: "var(--brand-surface)",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                border: hoveredId === movie.id
                  ? "1px solid rgba(124,58,237,0.55)"
                  : "1px solid var(--brand-border)",
                boxShadow: hoveredId === movie.id
                  ? "0 0 28px rgba(124,58,237,0.3), 0 8px 32px rgba(0,0,0,0.6)"
                  : "0 4px 16px rgba(0,0,0,0.4)",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* ── POSTER ── */}
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img
                  src={poster}
                  alt={movie.title}
                  className="cf-card-img"
                  style={{ width: "100%", height: 256, objectFit: "cover", display: "block" }}
                />

                {/* Hover overlay — quick info */}
                <div
                  className="cf-overlay"
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(9,8,15,0.92) 0%, rgba(9,8,15,0.4) 50%, transparent 100%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "1rem",
                  }}
                >
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(241,238,255,0.7)",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {movie.overview}
                  </span>
                </div>

                {/* Genre badge — top left */}
                {genre && (
                  <div style={{
                    position: "absolute", top: 10, left: 10,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#a78bfa",
                    background: "rgba(9,8,15,0.78)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(124,58,237,0.35)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                  }}>
                    {genre}
                  </div>
                )}

                {/* Year badge — top right */}
                {year && (
                  <div style={{
                    position: "absolute", top: 10, right: 44,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "#9d93c4",
                    background: "rgba(9,8,15,0.78)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                  }}>
                    {year}
                  </div>
                )}
              </div>

              {/* ── BOOKMARK BUTTON ── */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleWatchLater(movie); }}
                title={saved ? "Remove from Watch Later" : "Save to Watch Later"}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: saved
                    ? "1px solid rgba(245,158,11,0.5)"
                    : "1px solid rgba(124,58,237,0.3)",
                  background: saved
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(9,8,15,0.75)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  color: saved ? "#f59e0b" : "#a78bfa",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  if (!saved) {
                    e.currentTarget.style.background = "rgba(124,58,237,0.35)";
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)";
                  }
                }}
                onMouseLeave={e => {
                  if (!saved) {
                    e.currentTarget.style.background = "rgba(9,8,15,0.75)";
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                  }
                }}
              >
                <BookmarkIcon filled={saved} />
              </button>

              {/* ── INFO SECTION ── */}
              <div style={{ padding: "0.85rem 1rem 1rem" }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "var(--brand-text)",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {movie.title}
                </h3>

                {/* Rating bar */}
                {movie.vote_average > 0 && (
                  <RatingBar score={movie.vote_average} />
                )}
              </div>

              {/* Bottom accent line */}
              <div style={{
                height: 2,
                background: saved
                  ? "linear-gradient(90deg, #f59e0b, #fcd34d)"
                  : "linear-gradient(90deg, #7c3aed, #a78bfa)",
                opacity: hoveredId === movie.id ? 1 : 0,
                transition: "opacity 0.3s ease",
              }} />
            </div>
          );
        })}
      </div>
    </>
  );
}