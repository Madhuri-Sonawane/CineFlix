import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const NAV_ITEMS = [
  { icon: "👤", label: "Manage Profiles",  action: "manage"  },
  { icon: "🔀", label: "Switch Profile",   action: "switch"  },
  { icon: "🔖", label: "Watch Later",      action: "watchlater" },
  { icon: "🕐", label: "Activity",         action: "activity" },
];

export default function ProfileSidebar({ open, onClose, profile }) {
  const navigate    = useNavigate();
  const sidebarRef  = useRef(null);
  const overlayRef  = useRef(null);
  const itemsRef    = useRef([]);

  /* ── open / close animation ── */
  useEffect(() => {
    if (!sidebarRef.current) return;
    if (open) {
      gsap.fromTo(sidebarRef.current,
        { x: 320, opacity: 0.6 },
        { x: 0, opacity: 1, duration: 0.38, ease: "power3.out" }
      );
      gsap.fromTo(itemsRef.current.filter(Boolean),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, ease: "power2.out", delay: 0.18 }
      );
      gsap.fromTo(overlayRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.25 }
      );
    } else {
      gsap.to(sidebarRef.current,
        { x: 320, opacity: 0, duration: 0.28, ease: "power2.in" }
      );
      gsap.to(overlayRef.current,
        { opacity: 0, duration: 0.2 }
      );
    }
  }, [open]);

  /* ── ESC close ── */
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleAction = (action) => {
    onClose();
    if (action === "manage")      navigate("/profile",   { replace: true });
    if (action === "switch")      { localStorage.removeItem("activeProfileId"); navigate("/profiles", { replace: true }); }
    if (action === "watchlater")  navigate("/watch-later");
    if (action === "activity")    navigate("/activity");
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div ref={overlayRef} onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "rgba(9,8,15,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }} />

      {/* Panel */}
      <aside ref={sidebarRef} style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 300, zIndex: 50,
        background: "rgba(14,12,26,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(124,58,237,0.2)",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 48px rgba(0,0,0,0.6)",
      }}>

        {/* Top shimmer line */}
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #7c3aed, #f59e0b, transparent)" }} />

        {/* Profile header */}
        <div style={{ padding: "1.75rem 1.5rem 1.25rem", borderBottom: "1px solid rgba(124,58,237,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar with gradient ring */}
            <div style={{ position: "relative", padding: 2.5, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #f59e0b)", flexShrink: 0 }}>
              <div style={{ borderRadius: "50%", overflow: "hidden", border: "2px solid #09080f" }}>
                <img src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} alt={profile?.name} style={{ width: 52, height: 52, display: "block" }} />
              </div>
              {/* Online dot */}
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#34d399", border: "2px solid #09080f" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f1eeff", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile?.name || "User"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                {profile?.isKids ? (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4, padding: "1px 7px" }}>KIDS</span>
                ) : (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 4, padding: "1px 7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {profile?.role || "Member"}
                  </span>
                )}
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: "#34d399" }}>● Online</span>
              </div>
            </div>

            {/* Close button */}
            <button onClick={onClose} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8, cursor: "pointer", color: "#a78bfa", flexShrink: 0, fontSize: "0.85rem" }}>✕</button>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "1rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand-text-muted)", padding: "0 0.5rem", marginBottom: 4 }}>Navigation</p>

          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.action}
              ref={el => itemsRef.current[i] = el}
              onClick={() => handleAction(item.action)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, cursor: "pointer", transition: "all 0.18s ease", textAlign: "left", width: "100%" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.14)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <span style={{ fontSize: "1.1rem", width: 24, textAlign: "center" }}>{item.icon}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#d4cff0" }}>{item.label}</span>
              <svg style={{ marginLeft: "auto", opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1eeff" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(124,58,237,0.12)", margin: "0.5rem 0" }} />

          {/* Sign out */}
          <button
            ref={el => itemsRef.current[NAV_ITEMS.length] = el}
            onClick={() => { localStorage.removeItem("activeProfileId"); onClose(); navigate("/profiles", { replace: true }); }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, cursor: "pointer", transition: "all 0.18s ease", textAlign: "left", width: "100%" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; }}
          >
            <span style={{ fontSize: "1.1rem", width: 24, textAlign: "center" }}>🚪</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#f87171" }}>Exit Profile</span>
          </button>
        </nav>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 8L8 15L1 8Z" fill="white" opacity="0.9"/>
                <path d="M8 4L12 8L8 12L4 8Z" fill="#f59e0b"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", background: "linear-gradient(135deg, #f59e0b, #fcd34d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CINEFLEX</span>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: "var(--brand-text-muted)" }}>v1.0</span>
        </div>
      </aside>
    </>
  );
}