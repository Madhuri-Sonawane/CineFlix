import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails, IMG_BASE } from "../api/tmdb";
import gsap from "gsap";

/* ── helpers ── */
function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function StatPill({ label, value }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "12px 20px",
      background: "rgba(124,58,237,0.1)",
      border: "1px solid rgba(124,58,237,0.22)",
      borderRadius: 12,
      minWidth: 80,
    }}>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "1rem", fontWeight: 700,
        color: "#f59e0b",
      }}>{value}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.68rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "#5e567d",
      }}>{label}</span>
    </div>
  );
}

export default function MovieDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [movie, setMovie]     = useState(null);
  const [play,  setPlay]      = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const pageRef    = useRef(null);
  const contentRef = useRef(null);
  const posterRef  = useRef(null);
  const modalRef   = useRef(null);

  /* ── fetch ── */
  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
  }, [id]);

  /* ── page entrance ── */
  useEffect(() => {
    if (!movie || !contentRef.current) return;
    gsap.fromTo(posterRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
    );
    gsap.fromTo(Array.from(contentRef.current.children),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.25 }
    );
  }, [movie]);

  /* ── modal open/close ── */
  const openModal = () => {
    setPlay(true);
    setModalVisible(false);
    requestAnimationFrame(() => {
      setModalVisible(true);
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }
    });
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => setPlay(false),
      });
    } else {
      setPlay(false);
    }
  };

  /* ── activity ── */
  const addToActivity = () => {
    const profileId = localStorage.getItem("activeProfileId");
    if (!profileId) return;
    const key     = `activity_${profileId}`;
    const stored  = JSON.parse(localStorage.getItem(key)) || [];
    const filtered = stored.filter((m) => m.id !== movie.id);
    const item = {
      id: movie.id, title: movie.title,
      poster_path: movie.poster_path,
      watchedAt: Date.now(),
      progress: Math.floor(Math.random() * 80) + 10,
    };
    localStorage.setItem(key, JSON.stringify([item, ...filtered]));
  };

  const saveToActivity = (movie, profileId) => {
    const key      = `activity_${profileId}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const progress = Math.min(90, Math.floor(Math.random() * 70) + 20);
    const updated  = [{
      id: movie.id, title: movie.title,
      poster_path: movie.poster_path,
      progress, lastPosition: progress * 60, watchedAt: Date.now(),
    }, ...existing.filter((m) => m.id !== movie.id)];
    localStorage.setItem(key, JSON.stringify(updated));
  };

  /* ── loading state ── */
  if (!movie) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--brand-bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(124,58,237,0.2)",
          borderTopColor: "#7c3aed",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: "var(--brand-text-dim)", fontSize: "0.9rem",
        }}>Loading movie…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const trailer   = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const runtime   = formatRuntime(movie.runtime);
  const year      = movie.release_date?.slice(0, 4);
  const score     = movie.vote_average?.toFixed(1);
  const genres    = movie.genres?.slice(0, 4) || [];
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", background: "var(--brand-bg)", position: "relative", overflowX: "hidden" }}>

      {/* ══════════════════════════
          BLURRED BACKDROP
      ══════════════════════════ */}
      {backdropUrl && (
        <>
          <img src={backdropUrl} aria-hidden="true" style={{
            position: "fixed", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 20%",
            filter: "blur(28px) brightness(0.25) saturate(0.8)",
            transform: "scale(1.08)",
            zIndex: 0, pointerEvents: "none",
          }} />
          {/* extra dark vignette */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(9,8,15,0.7) 100%)",
          }} />
        </>
      )}

      {/* ══════════════════════════
          PAGE CONTENT
      ══════════════════════════ */}
      <div style={{ position: "relative", zIndex: 1, padding: "6rem 0 4rem" }}>

        {/* Back button */}
        <div style={{ padding: "0 clamp(1.5rem, 5%, 3.5rem)", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem", fontWeight: 600,
              color: "var(--brand-text-dim)",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 10, padding: "8px 18px", cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#f1eeff";
              e.currentTarget.style.background = "rgba(124,58,237,0.25)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--brand-text-dim)";
              e.currentTarget.style.background = "rgba(124,58,237,0.12)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: "2.5rem",
          padding: "0 clamp(1.5rem, 5%, 3.5rem)",
          alignItems: "flex-start",
        }}>

          {/* POSTER */}
          <div ref={posterRef} style={{ flexShrink: 0 }}>
            <div style={{
              position: "relative",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2)",
            }}>
              <img
                src={`${IMG_BASE}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "clamp(160px, 20vw, 220px)", display: "block" }}
              />
              {/* Gold shimmer top line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #7c3aed, #f59e0b, #7c3aed)",
              }} />
            </div>
          </div>

          {/* INFO */}
          <div ref={contentRef} style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: "1.1rem" }}>

            {/* Genre pills */}
            {genres.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {genres.map(g => (
                  <span key={g.id} style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.68rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#a78bfa",
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    borderRadius: 6, padding: "3px 10px",
                  }}>{g.name}</span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800, letterSpacing: "-0.03em",
              lineHeight: 1.05, color: "#f1eeff", margin: 0,
            }}>
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.9rem", fontStyle: "italic",
                color: "var(--brand-text-dim)", margin: 0,
              }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {score && <StatPill label="Rating" value={score} />}
              {year   && <StatPill label="Year"   value={year} />}
              {runtime && <StatPill label="Runtime" value={runtime} />}
              {movie.vote_count > 0 && (
                <StatPill label="Votes" value={`${(movie.vote_count / 1000).toFixed(1)}k`} />
              )}
            </div>

            {/* Overview */}
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.92rem", lineHeight: 1.75,
              color: "rgba(241,238,255,0.72)",
              maxWidth: 600, margin: 0,
            }}>
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.25rem" }}>

              {/* Play trailer */}
              {trailer ? (
                <button
                  onClick={() => { addToActivity(); openModal(); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "12px 30px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)",
                    color: "#09080f",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.03em",
                    border: "none", borderRadius: 12, cursor: "pointer",
                    boxShadow: "0 0 28px rgba(245,158,11,0.45), 0 4px 16px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(245,158,11,0.65), 0 4px 20px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 28px rgba(245,158,11,0.45), 0 4px 16px rgba(0,0,0,0.4)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="#09080f">
                    <path d="M3 2l11 6.5L3 15z"/>
                  </svg>
                  Play Trailer
                </button>
              ) : (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "var(--brand-text-dim)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.85rem",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  No trailer available
                </div>
              )}

              {/* Back button alt */}
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px",
                  background: "rgba(124,58,237,0.15)",
                  border: "1.5px solid rgba(124,58,237,0.4)",
                  borderRadius: 12, color: "#a78bfa",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: "0.9rem",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.28)";
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.65)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                }}
              >
                Browse More
              </button>
            </div>

            {/* Production companies */}
            {movie.production_companies?.length > 0 && (
              <div style={{ paddingTop: "0.5rem", borderTop: "1px solid rgba(124,58,237,0.12)" }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.7rem", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--brand-text-muted)", marginBottom: 8,
                }}>
                  Production
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {movie.production_companies.slice(0, 3).map(c => (
                    <span key={c.id} style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.78rem", color: "var(--brand-text-dim)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 6, padding: "4px 10px",
                    }}>{c.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          TRAILER MODAL
      ══════════════════════════ */}
      {play && trailer && (
        <div
          ref={modalRef}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(9,8,15,0.96)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(124,58,237,0.4)",
              borderRadius: "50%", cursor: "pointer",
              color: "#a78bfa", fontSize: "1.1rem",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(124,58,237,0.45)";
              e.currentTarget.style.color = "#f1eeff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(124,58,237,0.2)";
              e.currentTarget.style.color = "#a78bfa";
            }}
          >
            ✕
          </button>

          {/* Movie title in modal */}
          <div style={{
            position: "absolute", top: 22, left: 24,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.85rem", fontWeight: 600,
            color: "var(--brand-text-dim)",
          }}>
            {movie.title} — Trailer
          </div>

          {/* Purple shimmer bar top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, #7c3aed, #f59e0b, #7c3aed)",
          }} />

          {/* iframe */}
          <div style={{
            width: "min(90vw, 1100px)",
            aspectRatio: "16 / 9",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 0 80px rgba(124,58,237,0.35), 0 32px 80px rgba(0,0,0,0.8)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}>
            <iframe
              style={{ width: "100%", height: "100%", display: "block" }}
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}