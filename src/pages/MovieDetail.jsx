import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails, IMG_BASE } from "../api/tmdb";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        Loading movie...
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

 const addToActivity = () => {
  const profileId = localStorage.getItem("activeProfileId");
  if (!profileId) return;

  const key = `activity_${profileId}`;
  const stored = JSON.parse(localStorage.getItem(key)) || [];

  const filtered = stored.filter((m) => m.id !== movie.id);

  const item = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    watchedAt: Date.now(),
    progress: Math.floor(Math.random() * 80) + 10,
  };

  localStorage.setItem(key, JSON.stringify([item, ...filtered]));
};



  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-300">
        ← Back
      </button>

      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`${IMG_BASE}${movie.poster_path}`}
          className="w-48 rounded"
        />

        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            {movie.overview}
          </p>

          <p className="mt-3">⭐ {movie.vote_average}</p>

          <div className="flex gap-4 mt-6">
            {trailer && (
              <button
                onClick={() => {
                      addToActivity();
                      setPlay(true);
                    }}

                className="bg-white text-black px-6 py-2 rounded font-semibold"
              >
                ▶ Play
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Trailer */}
      {play && trailer && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setPlay(false)}
            className="absolute top-5 right-5 text-white text-xl"
          >
            ✕
          </button>

          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}

    </div>
  );
}
