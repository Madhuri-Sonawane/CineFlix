import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  const activeProfileId = localStorage.getItem("activeProfileId");

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || {};

  useEffect(() => {
    if (!activeProfileId) return;

    const key = `activity_${activeProfileId}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setActivities(stored);
  }, [activeProfileId]);

  const clearActivity = () => {
    if (!activeProfileId) return;

    localStorage.removeItem(`activity_${activeProfileId}`);
    setActivities([]);
  };

  if (!activities.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Activity</h1>
        <p className="text-gray-400">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Continue Watching</h1>

      {/* ✅ CLEAR BUTTON — ONLY FOR NON-KIDS */}
      {!activeProfile.isKids && (
        <button
          onClick={clearActivity}
          className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Clear Activity
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {activities.map((movie) => (
          <div
            key={`${movie.id}-${movie.watchedAt}`}
            className="bg-gray-800 rounded overflow-hidden cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={
                movie.poster_path
                  ? `${IMG_BASE}${movie.poster_path}`
                  : "/no-poster.png"
              }
              alt={movie.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-3">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                Watched on{" "}
                {movie.watchedAt
                  ? new Date(movie.watchedAt).toLocaleString()
                  : "Recently watched"}
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-700">
              <div
                className="h-1 bg-red-600"
                style={{ width: `${movie.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
