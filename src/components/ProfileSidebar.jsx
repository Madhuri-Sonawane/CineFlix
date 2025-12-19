import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function ProfileSidebar({ open, onClose, profile }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  /* =========================
     SLIDE-IN ANIMATION
  ========================== */
  useEffect(() => {
    if (!open || !sidebarRef.current) return;

    gsap.fromTo(
      sidebarRef.current,
      { x: 320 },
      { x: 0, duration: 0.35, ease: "power3.out" }
    );
  }, [open]);

  /* =========================
     ESC KEY CLOSE
  ========================== */
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-80 bg-gray-900 z-50 p-6 flex flex-col"
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={profile?.avatar}
            alt={profile?.name}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <p className="font-semibold">{profile?.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {profile?.role || "profile"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <nav className="flex flex-col gap-4 text-sm">
          <button
            onClick={() => {
              onClose();
              navigate("/profile", { replace: true });
            }}
            className="text-left hover:text-red-400 transition"
          >
            Manage Profiles
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("activeProfileId");
              onClose();
              navigate("/profiles", { replace: true });
            }}
            className="text-left hover:text-red-400 transition"
          >
            Switch Profile
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/watch-later");
            }}
            className="text-left hover:text-red-400 transition"
          >
            Watch Later
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("activeProfileId");
              onClose();
              navigate("/profiles", { replace: true });
            }}
            className="text-left text-gray-400 hover:text-red-500 mt-6 transition"
          >
            Exit Profile
          </button>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto text-xs text-gray-500">
          CineFlix • Private Profile
        </div>
      </aside>
    </>
  );
}
