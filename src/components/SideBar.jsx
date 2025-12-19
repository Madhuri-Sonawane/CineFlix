import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Sidebar({
  open,
  genres,
  filters,
  setFilters,
  onClose,
}) {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

  /* =========================
     MOBILE ANIMATION ONLY
  ========================== */
  useEffect(() => {
    if (window.innerWidth >= 1024) return; // ⛔ desktop ignored

    if (open) {
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.2,
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: -320,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.2,
      });
    }
  }, [open]);

  const toggleGenre = (id) => {
    setFilters((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((g) => g !== id)
        : [...prev.genreIds, id],
    }));
  };

  return (
    <>
      {/* =========================
          MOBILE OVERLAY
      ========================== */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40 lg:hidden opacity-0 pointer-events-none"
      />

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        ref={sidebarRef}
        className="
          fixed lg:sticky
          top-20 left-0
          z-50
          w-64
          h-[calc(100vh-5rem)]
          bg-black
          border-r border-gray-700
          p-5
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-gray-700

          transform -translate-x-full
          lg:translate-x-0
        "
      >
        {/* MOBILE HEADER */}
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-lg">✕</button>
        </div>

        {/* DESKTOP TITLE */}
        <h2 className="text-xl font-bold mb-4 hidden lg:block">
          Filters
        </h2>

        {/* GENRES */}
        <h3 className="text-lg mb-2">Genres</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map((g) => {
            const active = filters.genreIds.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1 text-sm rounded-md border transition
                  ${
                    active
                      ? "bg-red-600 border-red-600"
                      : "border-gray-400 hover:bg-red-600"
                  }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* RATING */}
        <h3 className="text-lg mb-2">Rating</h3>
        <input
          type="range"
          min="0"
          max="10"
          value={filters.rating}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              rating: Number(e.target.value),
            }))
          }
          className="w-full mb-2"
        />
        <p className="text-red-400 mb-4">{filters.rating}</p>

        {/* YEAR */}
        <h3 className="text-lg mb-2">Year</h3>
        <select
          value={filters.year}
          onChange={(e) =>
            setFilters((p) => ({ ...p, year: e.target.value }))
          }
          className="w-full bg-gray-800 p-2 rounded-md"
        >
          <option value="">All</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        {/* APPLY (MOBILE ONLY) */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 py-2 rounded lg:hidden"
        >
          Apply Filters
        </button>
      </aside>
    </>
  );
}
