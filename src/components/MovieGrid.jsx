// src/components/MovieGrid.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";

export default function MovieGrid({ movies = [] , loading = false }) {

  if (loading) {
    return (
      <div className="text-gray-400 text-lg">
        Loading movies...
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="text-gray-400 text-lg">
        No movies found
      </div>
    );
  }

  
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const s = localStorage.getItem("watchLater");
      if (!s) return [];
      const arr = JSON.parse(s);
      return arr.map((m) => m.id);
    } catch {
      return [];
    }
  });

const toggleWatchLater = (movie) => {
  const profileId = localStorage.getItem("activeProfileId");
  if (!profileId) return;

  const key = `watchLater_${profileId}`;
  const stored = JSON.parse(localStorage.getItem(key)) || [];

  const exists = stored.find((m) => m.id === movie.id);

  let updated;
  if (exists) {
    updated = stored.filter((m) => m.id !== movie.id);
  } else {
    updated = [
      ...stored,
      {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      },
    ];
  }

  localStorage.setItem(key, JSON.stringify(updated));
  setSavedIds(updated.map((m) => m.id));
};



  useEffect(() => {

    
    // simple entrance animation when grid mounts (if you have GSAP)
    // kept safe: only run if gsap is available globally/imported
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const cards = gridRef.current?.querySelectorAll(".movie-card");
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }
          );
        }
      } catch {
        // gsap not available or dynamic import failed — ignore
      }
    })();
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <div className="text-gray-400 text-lg">No movies found.</div>;
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const saved = savedIds.includes(movie.id);
        const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : (movie.poster || "/fallback.jpg");

        return (
          <div
            key={movie.id}
            className="movie-card relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img src={posterUrl} alt={movie.title} className="w-full h-64 object-cover" />

            {/* Save / Bookmark button */}
           <button
  onClick={(e) => {
    e.stopPropagation();
    toggleWatchLater(movie);
  }}
  className={`absolute bottom-3 right-3 p-2 rounded-full transition
    ${
      saved
        ? "bg-white text-black"
        : "bg-black/70 text-white hover:bg-red-600"
    }
  `}
>
  🔖
</button>



            <div className="p-4">
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{movie.overview ?? movie.tagline}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-semibold">{movie.vote_average ?? movie.rating}</span>
                </div>
                <div className="text-sm text-gray-300">{(movie.release_date || movie.year || "").toString().slice(0,4)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
