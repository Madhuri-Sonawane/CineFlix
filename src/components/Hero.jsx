import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG_BASE } from "../api/tmdb";

/* Genre ID → label map (TMDB standard) */
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

/* Star rating helper */
function StarRating({ score }) {
  const pct = Math.round((score / 10) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        position: "relative",
        width: 80,
        height: 12,
        background: "rgba(255,255,255,0.12)",
        borderRadius: 6,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: "linear-gradient(90deg, #f59e0b, #fcd34d)",
          borderRadius: 6,
        }} />
      </div>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#fcd34d",
      }}>
        {score?.toFixed(1)}
      </span>
    </div>
  );
}

export default function Hero({ movie, onPlay, onInfo }) {
  const contentRef  = useRef(null);
  const backdropRef = useRef(null);
  const badgeRef    = useRef(null);

  /* =========================
     ENTRANCE ANIMATION
  ========================== */
  useEffect(() => {
    if (!movie || !contentRef.current) return;

    // Backdrop zoom-in
    gsap.fromTo(
      backdropRef.current,
      { scale: 1.08, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
    );

    // Content stagger
    const children = contentRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", delay: 0.3 }
    );

    // Badge pulse
    gsap.fromTo(
      badgeRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.6 }
    );
  }, [movie]);

  if (!movie) return null;

  const genres = (movie.genre_ids || []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean);
  const year   = movie.release_date?.slice(0, 4);
  const imgSrc = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <section style={{
      position: "relative",
      width: "100%",
      marginBottom: "3rem",
      overflow: "hidden",
      borderRadius: "0 0 24px 24px",
    }}>

      {/* =====================
          LETTERBOX BARS
      ===================== */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px", zIndex: 20,
        background: "linear-gradient(90deg, #7c3aed, #f59e0b, #7c3aed)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "3px", zIndex: 20,
        background: "linear-gradient(90deg, #f59e0b, #7c3aed, #f59e0b)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite reverse",
      }} />

      {/* =====================
          BACKDROP IMAGE
      ===================== */}
      <div ref={backdropRef} style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={movie.title}
          style={{
            width: "100%",
            height: "clamp(420px, 60vh, 680px)",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
      </div>

      {/* =====================
          GRADIENT OVERLAYS
      ===================== */}
      {/* Left-to-right dark fade */}
      <div style={{
        position: "absolute", inset: 0,
        background: movie.isKids
          ? "linear-gradient(to right, rgba(30,27,75,0.96) 0%, rgba(30,27,75,0.75) 40%, rgba(30,27,75,0.2) 75%, transparent 100%)"
          : "linear-gradient(to right, rgba(9,8,15,0.97) 0%, rgba(9,8,15,0.82) 38%, rgba(9,8,15,0.35) 68%, transparent 100%)",
      }} />
      {/* Bottom fade to page bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(9,8,15,1) 0%, rgba(9,8,15,0.4) 25%, transparent 55%)",
      }} />
      {/* Subtle purple tint overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 80% at 15% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)",
      }} />

      {/* =====================
          FEATURED BADGE
      ===================== */}
      <div
        ref={badgeRef}
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "clamp(1.5rem, 5%, 3rem)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(124,58,237,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(167,139,250,0.4)",
          borderRadius: "99px",
          padding: "5px 14px 5px 8px",
        }}
      >
        <span style={{ fontSize: "1rem" }}>✦</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#f1eeff",
        }}>
          Featured
        </span>
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(1.5rem, 5%, 3.5rem)",
        zIndex: 10,
      }}>
        <div ref={contentRef} style={{ maxWidth: 560 }}>

          {/* Genre tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
            {genres.map(g => (
              <span key={g} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a78bfa",
                background: "rgba(124,58,237,0.18)",
                border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: "6px",
                padding: "3px 10px",
              }}>
                {g}
              </span>
            ))}
            {year && (
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#9d93c4",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "3px 10px",
              }}>
                {year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            color: "#f1eeff",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>
            {movie.title}
          </h1>

          {/* Rating bar */}
          {movie.vote_average > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <StarRating score={movie.vote_average} />
            </div>
          )}

          {/* Overview */}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            color: "rgba(241,238,255,0.75)",
            marginBottom: "1.75rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {movie.overview}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>

            {/* Play button — pulsing gold */}
            <button
              onClick={onPlay}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 28px",
                background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)",
                color: "#09080f",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(245,158,11,0.5), 0 4px 16px rgba(0,0,0,0.4)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 0 36px rgba(245,158,11,0.7), 0 4px 20px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(245,158,11,0.5), 0 4px 16px rgba(0,0,0,0.4)";
              }}
            >
              {/* Play triangle icon */}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#09080f">
                <path d="M3 2l11 6.5L3 15z"/>
              </svg>
              Play Now
            </button>

            {/* More Info — glass */}
            <button
              onClick={onInfo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                background: "rgba(124,58,237,0.18)",
                color: "#f1eeff",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                border: "1.5px solid rgba(124,58,237,0.45)",
                borderRadius: "10px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(124,58,237,0.35)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.7)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(124,58,237,0.18)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}