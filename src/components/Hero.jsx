import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG_BASE } from "../api/tmdb";

export default function Hero({ movie, onPlay, onInfo }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!movie || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [movie]);

  if (!movie) return null;

  return (
    <section className="relative w-full mb-12">
      {/* BACKDROP */}
      <img
        src={`${IMG_BASE}${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div
        className={`absolute inset-0 ${
          movie.isKids
            ? "bg-gradient-to-r from-blue-900/90 via-blue-800/60 to-transparent"
            : "bg-gradient-to-r from-black/95 via-black/70 to-transparent"
        }`}
      />

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-12 py-24">
        <div
          ref={contentRef}
          className="max-w-3xl bg-black/40 p-6 rounded-lg backdrop-blur-sm"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {movie.title}
          </h1>

          <p className="text-gray-200 text-sm md:text-base mb-6 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onPlay}
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200"
            >
              ▶ Play
            </button>

            <button
              onClick={onInfo}
              className="bg-gray-700/80 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
