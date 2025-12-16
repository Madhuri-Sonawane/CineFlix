import { useEffect, useState } from "react";
import { IMG_BASE } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

export default function WatchLater() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const profileId = localStorage.getItem("activeProfileId");
  if (!profileId) {
    setLoading(false);
    return;
  }

  const key = `watchLater_${profileId}`;
  const stored = JSON.parse(localStorage.getItem(key)) || [];
  setMovies(stored);
  setLoading(false);
}, []);


  const removeMovie = (id) => {
  const profileId = localStorage.getItem("activeProfileId");
  if (!profileId) return;

  const key = `watchLater_${profileId}`;
  const updated = movies.filter((m) => m.id !== id);

  setMovies(updated);
  localStorage.setItem(key, JSON.stringify(updated));
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        Loading Watch Later...
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        No movies saved to Watch Later
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Watch Later</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 rounded overflow-hidden relative"
          >
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title}
              className="h-56 w-full object-cover cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            />

            <button
              onClick={() => removeMovie(movie.id)}
              className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-sm"
            >
              Remove
            </button>

            <div className="p-3">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-400">
                ⭐ {movie.vote_average}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
