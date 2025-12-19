import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";
import useActiveProfile from "../hooks/useActiveProfile";

export default function WatchLater() {
  const navigate = useNavigate();
  const profile = useActiveProfile();
  const [list, setList] = useState([]);

  /* =========================
     LOAD WATCH LATER (PROFILE-SCOPED)
  ========================== */
  useEffect(() => {
    if (!profile) return;

    const key = `watchLater_${profile.id}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setList(stored);
  }, [profile]);

  /* =========================
     REMOVE ITEM
  ========================== */
  const removeItem = (movieId) => {
    const key = `watchLater_${profile.id}`;
    const updated = list.filter((m) => m.id !== movieId);
    localStorage.setItem(key, JSON.stringify(updated));
    setList(updated);
  };

  /* =========================
     LOADING / SAFETY
  ========================== */
  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile…
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Watch Later</h1>
       
      </div>
      <div className=" mb-6">
         <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
       </div>

      {/* EMPTY STATE */}
      {list.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <p className="text-lg mb-2">Your Watch Later list is empty</p>
          <p className="text-sm">
            Save movies to watch them later.
          </p>
        </div>
      )}

      {/* GRID */}
      {list.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {list.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-gray-800 rounded-xl overflow-hidden
                         hover:scale-105 transition-transform duration-200"
            >
              <img
                src={
                  movie.poster_path
                    ? `${IMG_BASE}${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title}
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
              />

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeItem(movie.id)}
                className="absolute top-2 right-2 bg-black/70
                           text-white p-2 rounded-full
                           hover:bg-red-600 transition"
                title="Remove from Watch Later"
              >
                ✕
              </button>

              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {movie.title}
                </h3>

                {movie.vote_average && (
                  <p className="text-xs text-gray-400 mt-1">
                    ⭐ {movie.vote_average}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
