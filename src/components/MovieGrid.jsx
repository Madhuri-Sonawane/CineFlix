import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";
import gsap from "gsap";

export default function MovieGrid({ movies = [], loading = false }) {
  const navigate = useNavigate();
  const gridRef = useRef(null);

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
    if (!gridRef.current) return;

    gsap.fromTo(
      gridRef.current.children,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
      }
    );
  }, [movies]);

  const toggleWatchLater = (movie) => {
    const profileId = localStorage.getItem("activeProfileId");
    if (!profileId) return;

    const key = `watchLater_${profileId}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];

    const exists = stored.find((m) => m.id === movie.id);
    const updated = exists
      ? stored.filter((m) => m.id !== movie.id)
      : [...stored, movie];

    localStorage.setItem(key, JSON.stringify(updated));
    setSavedIds(updated.map((m) => m.id));
  };

  if (loading) return <div className="text-gray-400">Loading…</div>;
  if (!movies.length) return <div className="text-gray-400">No movies</div>;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {movies.map((movie) => {
        const saved = savedIds.includes(movie.id);
        const poster = movie.poster_path
          ? `${IMG_BASE}${movie.poster_path}`
          : "/no-poster.png";

        return (
          <div
            key={movie.id}
            className="movie-card relative bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
            onClick={() => navigate(`/movie/${movie.id}`)}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;

              gsap.to(card, {
                rotateY: x / 18,
                rotateX: -y / 18,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.4,
                ease: "power3.out",
              });
            }}
          >
            <img
              src={poster}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />

            {/* WATCH LATER */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchLater(movie);
              }}
              className={`absolute bottom-3 right-3 p-2 rounded-full
                ${
                  saved
                    ? "bg-white text-black"
                    : "bg-black/70 text-white hover:bg-red-600"
                }`}
            >
              🔖
            </button>

            <div className="p-4">
              <h3 className="text-lg font-bold">{movie.title}</h3>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-yellow-400">
                  ⭐ {movie.vote_average}
                </span>
                <span className="text-gray-400">
                  {movie.release_date?.slice(0, 4)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
