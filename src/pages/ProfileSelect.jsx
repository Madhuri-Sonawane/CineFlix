import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const avatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=F",
];

export default function ProfileSelect() {
  const navigate = useNavigate();
  const [profiles,  setProfiles]  = useState([]);
  const [name,      setName]      = useState("");
  const [avatar,    setAvatar]    = useState(avatars[0]);
  const [isKids,    setIsKids]    = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [nameError, setNameError] = useState(false);

  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const profilesRef = useRef(null);
  const formRef     = useRef(null);
  const logoRef     = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(stored);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(logoRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(subtitleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(
        profilesRef.current?.children || [],
        { opacity: 0, y: 32, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.55 }, "-=0.2"
      )
      .fromTo(formRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
  }, []);

  const selectProfile = (id) => {
    localStorage.setItem("activeProfileId", id);
    gsap.to([titleRef.current, profilesRef.current, formRef.current], {
      opacity: 0, y: -16, duration: 0.3, stagger: 0.05, ease: "power2.in",
      onComplete: () => navigate("/"),
    });
  };

  const addProfile = () => {
    if (!name.trim()) {
      setNameError(true);
      gsap.fromTo(formRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
      setTimeout(() => setNameError(false), 2000);
      return;
    }
    const newProfile = { id: Date.now().toString(), name: name.trim(), avatar, isKids };
    const updated = [...profiles, newProfile];
    localStorage.setItem("profiles", JSON.stringify(updated));
    localStorage.setItem("activeProfileId", newProfile.id);
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--brand-bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem", position: "relative", overflow: "hidden",
    }}>

      {/* BG ORBS */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "10%", width: "40vw", height: "40vh", background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "20%", right: "5%", width: "30vw", height: "30vh", background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 640 }}>

        {/* LOGO */}
        <div ref={logoRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "2.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(124,58,237,0.6)" }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 8L8 15L1 8Z" fill="white" opacity="0.9"/>
              <path d="M8 4L12 8L8 12L4 8Z" fill="#f59e0b"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.12em", background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 12px rgba(245,158,11,0.4))" }}>
            CINEFLEX
          </span>
        </div>

        {/* HEADING */}
        <h1 ref={titleRef} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", color: "#f1eeff", marginBottom: "0.5rem" }}>
          Who's watching?
        </h1>
        <p ref={subtitleRef} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: "var(--brand-text-dim)", textAlign: "center", marginBottom: "2.5rem" }}>
          Select your profile to continue
        </p>

        {/* EXISTING PROFILES */}
        {profiles.length > 0 && (
          <div ref={profilesRef} style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {profiles.map((p) => {
              const isHovered = hoveredId === p.id;
              return (
                <div key={p.id} onClick={() => selectProfile(p.id)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", transition: "transform 0.25s ease", transform: isHovered ? "translateY(-8px) scale(1.05)" : "translateY(0) scale(1)" }}
                >
                  <div style={{ position: "relative", padding: 3, borderRadius: 16, background: isHovered ? "linear-gradient(135deg, #7c3aed, #f59e0b)" : "rgba(124,58,237,0.15)", transition: "background 0.3s ease, box-shadow 0.3s ease", boxShadow: isHovered ? "0 0 32px rgba(124,58,237,0.5), 0 12px 32px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.4)" }}>
                    <div style={{ borderRadius: 13, overflow: "hidden", background: "var(--brand-surface)" }}>
                      <img src={p.avatar} alt={p.name} style={{ width: 96, height: 96, display: "block" }} />
                    </div>
                    {p.isKids && (
                      <div style={{ position: "absolute", bottom: -6, right: -6, background: "linear-gradient(135deg, #f59e0b, #fcd34d)", color: "#09080f", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 6, border: "2px solid var(--brand-bg)" }}>Kids</div>
                    )}
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: isHovered ? 700 : 500, color: isHovered ? "#f1eeff" : "var(--brand-text-dim)", transition: "color 0.2s ease", letterSpacing: "-0.01em" }}>
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* DIVIDER */}
        {profiles.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "2rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.18)" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-text-muted)" }}>Add New Profile</span>
            <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.18)" }} />
          </div>
        )}

        {/* ADD PROFILE FORM */}
        <div ref={formRef} style={{ background: "rgba(17,15,30,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 20, padding: "1.75rem", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f1eeff", marginBottom: "1.25rem" }}>
            {profiles.length === 0 ? "Create your first profile" : "New profile"}
          </h2>

          {/* Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: nameError ? "#f87171" : "var(--brand-text-muted)", display: "block", marginBottom: 8, transition: "color 0.2s ease" }}>
              {nameError ? "Name is required" : "Profile name"}
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(false); }}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="e.g. Alex"
              style={{ width: "100%", padding: "10px 14px", background: nameError ? "rgba(248,113,113,0.08)" : "rgba(26,23,48,0.9)", border: `1.5px solid ${nameError ? "rgba(248,113,113,0.6)" : "rgba(124,58,237,0.25)"}`, borderRadius: 10, color: "#f1eeff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 500, outline: "none", transition: "border-color 0.2s ease", boxSizing: "border-box" }}
              onFocus={e => { if (!nameError) e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 16px rgba(124,58,237,0.2)"; }}
              onBlur={e => { if (!nameError) e.target.style.borderColor = "rgba(124,58,237,0.25)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Avatars */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-text-muted)", display: "block", marginBottom: 10 }}>Choose avatar</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {avatars.map((a) => {
                const selected = avatar === a;
                return (
                  <div key={a} onClick={() => setAvatar(a)} style={{ position: "relative", cursor: "pointer", padding: 2, borderRadius: 12, background: selected ? "linear-gradient(135deg, #7c3aed, #f59e0b)" : "transparent", border: selected ? "none" : "2px solid rgba(255,255,255,0.08)", transition: "all 0.2s ease", transform: selected ? "scale(1.1)" : "scale(1)", boxShadow: selected ? "0 0 18px rgba(124,58,237,0.5)" : "none" }}>
                    <div style={{ borderRadius: 9, overflow: "hidden", background: "var(--brand-surface)" }}>
                      <img src={a} alt="avatar" style={{ width: 44, height: 44, display: "block" }} />
                    </div>
                    {selected && (
                      <div style={{ position: "absolute", bottom: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#f59e0b", border: "2px solid var(--brand-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#09080f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kids toggle */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button onClick={() => setIsKids(!isKids)} style={{ display: "flex", alignItems: "center", gap: 12, background: isKids ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${isKids ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", width: "100%", transition: "all 0.2s ease" }}>
              <div style={{ width: 36, height: 20, borderRadius: 99, background: isKids ? "#f59e0b" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.3s ease", flexShrink: 0, boxShadow: isKids ? "0 0 12px rgba(245,158,11,0.4)" : "none" }}>
                <div style={{ position: "absolute", top: 3, left: isKids ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: isKids ? "#f59e0b" : "#f1eeff", transition: "color 0.2s ease" }}>Kids Profile</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "var(--brand-text-muted)", marginTop: 1 }}>Family-friendly content only</p>
              </div>
            </button>
          </div>

          {/* Submit */}
          <button onClick={addProfile}
            style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", border: "none", borderRadius: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", cursor: "pointer", boxShadow: "0 0 24px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.4)", transition: "transform 0.2s ease, box-shadow 0.2s ease", letterSpacing: "0.02em" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 36px rgba(124,58,237,0.65), 0 4px 20px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.4)"; }}
          >
            {profiles.length === 0 ? "Get Started →" : "Save & Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}