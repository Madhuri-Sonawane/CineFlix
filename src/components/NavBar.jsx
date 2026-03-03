import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import logo from "../assets/cineflix-logo.png"; // 👈 CineFlix logo

export default function NavBar({
  toggleSidebar,
  sidebarOpen,
  query,
  setQuery,
  profile,
  onProfileClick,
}) {
  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* =========================
     SCROLL SHADOW
  ========================== */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     ENTRANCE ANIMATION
  ========================== */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
    );
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", delay: 0.35 }
    );
  }, []);

  /* =========================
     HAMBURGER ANIMATION
  ========================== */
  useEffect(() => {
    if (sidebarOpen) {
      gsap.to(line1.current, { rotation: 45, y: 7, duration: 0.2 });
      gsap.to(line2.current, { opacity: 0, duration: 0.2 });
      gsap.to(line3.current, { rotation: -45, y: -7, duration: 0.2 });
    } else {
      gsap.to(line1.current, { rotation: 0, y: 0, duration: 0.2 });
      gsap.to(line2.current, { opacity: 1, duration: 0.2 });
      gsap.to(line3.current, { rotation: 0, y: 0, duration: 0.2 });
    }
  }, [sidebarOpen]);

  return (
    <>
    <style>{`
      .cf-hamburger { display: none !important; }
      @media (max-width: 1023px) { .cf-hamburger { display: flex !important; } }
    `}</style>
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 1.25rem",
        height: "64px",
        background: scrolled
          ? "rgba(9, 8, 15, 0.97)"
          : "rgba(9, 8, 15, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.1)"}`,
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        gap: "1rem",
      }}
    >
      {/* ========================
          HAMBURGER (MOBILE)
      ========================= */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="cf-hamburger"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "8px",
          background: "rgba(124, 58, 237, 0.12)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <div ref={line1} style={{ width: 22, height: 2.5, background: "#a78bfa", borderRadius: 2, marginBottom: 5 }} />
        <div ref={line2} style={{ width: 22, height: 2.5, background: "#a78bfa", borderRadius: 2, marginBottom: 5 }} />
        <div ref={line3} style={{ width: 22, height: 2.5, background: "#a78bfa", borderRadius: 2 }} />
      </button>

      {/* ========================
          LOGO + WORDMARK
      ========================= */}
      <div
        ref={logoRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          userSelect: "none",
          flexShrink: 0,
          textDecoration: "none",
        }}
      >
        {/* Diamond icon mark */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 16px rgba(124,58,237,0.6)",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L15 8L8 15L1 8Z" fill="white" opacity="0.9"/>
            <path d="M8 4L12 8L8 12L4 8Z" fill="#f59e0b"/>
          </svg>
        </div>

        {/* Wordmark */}
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #f59e0b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 10px rgba(245,158,11,0.5))",
        }}>
          CINEFLEX
        </span>
      </div>

      {/* ========================
          SEARCH BAR
      ========================= */}
      {!profile?.isKids && (
        <div
          className="hidden md:flex"
          style={{
            flex: 1,
            maxWidth: "520px",
            marginLeft: "1.5rem",
          }}
        >
          <div style={{
            position: "relative",
            width: "100%",
          }}>
            {/* Search icon */}
            <svg
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: searchFocused ? 0.9 : 0.4,
                transition: "opacity 0.2s ease",
                pointerEvents: "none",
              }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? "#a78bfa" : "#9d93c4"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search movies, genres..."
              style={{
                width: "100%",
                padding: "9px 16px 9px 42px",
                background: searchFocused
                  ? "rgba(124, 58, 237, 0.08)"
                  : "rgba(26, 23, 48, 0.8)",
                border: `1.5px solid ${searchFocused ? "rgba(124,58,237,0.6)" : "rgba(139,92,246,0.18)"}`,
                borderRadius: "99px",
                color: "#f1eeff",
                fontSize: "0.875rem",
                fontFamily: "'Space Grotesk', sans-serif",
                outline: "none",
                transition: "all 0.25s ease",
                boxShadow: searchFocused ? "0 0 20px rgba(124,58,237,0.25)" : "none",
              }}
            />

            {/* Clear button */}
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(124,58,237,0.3)",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#a78bfa",
                  fontSize: "12px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================
          RIGHT — PROFILE
      ========================= */}
      <div style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexShrink: 0,
      }}>
        {/* Greeting */}
        <div
          className="hidden sm:flex"
          style={{ flexDirection: "column", alignItems: "flex-end" }}
        >
          <span style={{
            fontSize: "0.7rem",
            color: "#5e567d",
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Welcome back
          </span>
          <span style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#f1eeff",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {profile?.name || "User"}
          </span>
        </div>

        {/* Avatar with gold ring */}
        <div
          onClick={onProfileClick}
          style={{
            position: "relative",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {/* Animated gold ring */}
          <div style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #7c3aed, #f59e0b)",
            padding: 2,
            zIndex: 0,
          }} />
          <img
            src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
            alt="Profile"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              position: "relative",
              zIndex: 1,
              border: "2px solid #09080f",
              display: "block",
            }}
          />
          {/* Online dot */}
          <div style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 9,
            height: 9,
            background: "#34d399",
            borderRadius: "50%",
            border: "2px solid #09080f",
            zIndex: 2,
          }} />
        </div>
      </div>
    </nav>
  );
  </>
  );
}