import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const presetAvatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=F",
];

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile,   setProfile]   = useState(null);
  const [name,      setName]      = useState("");
  const [avatar,    setAvatar]    = useState("");
  const [pin,       setPin]       = useState("");
  const [makeOwner, setMakeOwner] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [saved,     setSaved]     = useState(false);

  const cardRef = useRef(null);

  /* ── load ── */
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const activeId = localStorage.getItem("activeProfileId");
    const target   = profiles.find(p => p.id === id);
    const active   = profiles.find(p => p.id === activeId);

    if (!target || !active) { navigate("/", { replace: true }); return; }
    if (active.role === "kids" && active.id !== target.id) {
      navigate("/", { replace: true }); return;
    }

    setProfile(target);
    setName(target.name);
    setAvatar(target.avatar);
    setPin(target.pin || "");
    setMakeOwner(target.role === "owner");
  }, [id, navigate]);

  /* ── entrance animation ── */
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  }, [profile]);

  if (!profile) return null;

  const isKids = profile.role === "kids";

  /* ── save ── */
  const saveChanges = () => {
    if (!name.trim()) {
      setNameError(true);
      gsap.fromTo(cardRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
      setTimeout(() => setNameError(false), 2000);
      return;
    }
    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const updated  = profiles.map(p => {
      if (makeOwner && p.role === "owner" && p.id !== profile.id) return { ...p, role: "adult" };
      if (p.id === profile.id) return {
        ...p, name, avatar,
        role: makeOwner ? "owner" : p.role,
        pin:  makeOwner ? pin || null : p.pin,
      };
      return p;
    });
    localStorage.setItem("profiles", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => navigate("/profile", { replace: true }), 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--brand-bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem", position: "relative", overflow: "hidden",
    }}>
      {/* bg glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "70vw", height: "50vh", background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div ref={cardRef} style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>

        {/* Back */}
        <button onClick={() => navigate("/profile")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "var(--brand-text-dim)", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", marginBottom: "1.5rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Profiles
        </button>

        {/* Card */}
        <div style={{ background: "rgba(17,15,30,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 20, padding: "2rem", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ padding: 3, borderRadius: 14, background: "linear-gradient(135deg, #7c3aed, #f59e0b)" }}>
                <div style={{ borderRadius: 11, overflow: "hidden", background: "var(--brand-surface)" }}>
                  <img src={avatar} alt="avatar" style={{ width: 64, height: 64, display: "block" }} />
                </div>
              </div>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#f1eeff", letterSpacing: "-0.02em" }}>Edit Profile</h1>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "var(--brand-text-dim)", marginTop: 2 }}>
                Editing <span style={{ color: "#a78bfa", fontWeight: 600 }}>{profile.name}</span>
              </p>
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: nameError ? "#f87171" : "var(--brand-text-muted)", display: "block", marginBottom: 8 }}>
              {nameError ? "Name cannot be empty" : "Profile name"}
            </label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setNameError(false); }}
              onKeyDown={e => e.key === "Enter" && saveChanges()}
              placeholder="Profile name"
              style={{ width: "100%", padding: "10px 14px", background: nameError ? "rgba(248,113,113,0.08)" : "rgba(26,23,48,0.9)", border: `1.5px solid ${nameError ? "rgba(248,113,113,0.6)" : "rgba(124,58,237,0.25)"}`, borderRadius: 10, color: "#f1eeff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => { if (!nameError) e.target.style.borderColor = "rgba(124,58,237,0.6)"; }}
              onBlur={e => { if (!nameError) e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
            />
          </div>

          {/* Avatar picker */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-text-muted)", display: "block", marginBottom: 10 }}>Choose avatar</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {presetAvatars.map(a => {
                const selected = avatar === a;
                return (
                  <div key={a} onClick={() => setAvatar(a)} style={{ position: "relative", cursor: "pointer", padding: 2, borderRadius: 12, background: selected ? "linear-gradient(135deg, #7c3aed, #f59e0b)" : "transparent", border: selected ? "none" : "2px solid rgba(255,255,255,0.08)", transition: "all 0.2s ease", transform: selected ? "scale(1.1)" : "scale(1)", boxShadow: selected ? "0 0 16px rgba(124,58,237,0.5)" : "none" }}>
                    <div style={{ borderRadius: 9, overflow: "hidden", background: "var(--brand-surface)" }}>
                      <img src={a} alt="avatar" style={{ width: 44, height: 44, display: "block" }} />
                    </div>
                    {selected && (
                      <div style={{ position: "absolute", bottom: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#f59e0b", border: "2px solid var(--brand-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#09080f" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Owner toggle */}
          {!isKids && (
            <div style={{ marginBottom: "1.25rem" }}>
              <button onClick={() => setMakeOwner(!makeOwner)} style={{ display: "flex", alignItems: "center", gap: 12, background: makeOwner ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${makeOwner ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", width: "100%", transition: "all 0.2s ease" }}>
                <div style={{ width: 36, height: 20, borderRadius: 99, background: makeOwner ? "#f59e0b" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.3s", flexShrink: 0, boxShadow: makeOwner ? "0 0 10px rgba(245,158,11,0.4)" : "none" }}>
                  <div style={{ position: "absolute", top: 3, left: makeOwner ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.25s ease" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: makeOwner ? "#f59e0b" : "#f1eeff", transition: "color 0.2s" }}>Owner Profile</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "var(--brand-text-muted)", marginTop: 1 }}>Can manage all profiles</p>
                </div>
              </button>
            </div>
          )}

          {/* PIN (owner only) */}
          {makeOwner && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-text-muted)", display: "block", marginBottom: 8 }}>Owner PIN (optional)</label>
              <input
                type="password" maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4-digit PIN"
                style={{ width: "100%", padding: "10px 14px", background: "rgba(26,23,48,0.9)", border: "1.5px solid rgba(124,58,237,0.25)", borderRadius: 10, color: "#f1eeff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", letterSpacing: "0.3em" }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
              />
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(124,58,237,0.15)", margin: "1.5rem 0" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/profile")} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "var(--brand-text-dim)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f1eeff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--brand-text-dim)"; }}
            >Cancel</button>

            <button onClick={saveChanges} style={{ flex: 2, padding: "11px", background: saved ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", border: saved ? "1.5px solid rgba(52,211,153,0.5)" : "none", borderRadius: 12, color: saved ? "#34d399" : "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: saved ? "none" : "0 0 20px rgba(124,58,237,0.4)", transition: "all 0.3s" }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}