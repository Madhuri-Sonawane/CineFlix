import React, { useRef, useEffect } from "react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      
      {/* HAMBURGER (MOBILE) */}
      <button
        onClick={toggleSidebar}
        className="mr-4 lg:hidden p-2 rounded-md bg-gray-800/60 hover:bg-gray-700"
        aria-label="Toggle sidebar"
      >
        <div ref={line1} className="w-6 h-[3px] bg-white mb-1 rounded" />
        <div ref={line2} className="w-6 h-[3px] bg-white mb-1 rounded" />
        <div ref={line3} className="w-6 h-[3px] bg-white rounded" />
      </button>

      {/* LOGO + BRAND */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        
        <h1
  className="text-2xl font-extrabold tracking-widest
             text-transparent bg-clip-text
             bg-gradient-to-r from-red-500 to-red-800
             drop-shadow-[0_0_8px_rgba(229,9,20,0.9)]"
>
  CINEFLIX
</h1>

      </div>

      {/* SEARCH (HIDDEN FOR KIDS) */}
      {!profile?.isKids && (
        <div className="hidden md:flex items-center ml-6 flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full max-w-2xl px-4 py-2 bg-gray-800 rounded-md text-sm placeholder-gray-400 focus:outline-none"
          />
        </div>
      )}

      {/* PROFILE */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-300 hidden sm:block">
          Hi, {profile?.name || "User"}
        </span>

        <img
          onClick={onProfileClick}
          src={
            profile?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer
                     ring-2 ring-transparent hover:ring-red-600
                     transition"
        />
      </div>
    </nav>
  );
}
