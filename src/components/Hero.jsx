import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG_BASE } from "../api/tmdb";

export default function Hero({ movie, onPlay, onInfo }) {
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  /* =========================
     CONTENT-ONLY ANIMATION
  ========================== */
  useEffect(() => {
    if (!movie || !contentRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .from(titleRef.current, { y: 20, opacity: 0 }, "-=0.3")
      .from(descRef.current, { y: 15, opacity: 0 }, "-=0.25")
      .from(buttonsRef.current, { y: 10, opacity: 0 }, "-=0.2");

    return () => tl.kill();
  }, [movie]);

  if (!movie) return null;

  return (
    <section className="relative h-[70vh] w-full mb-10">
      {/* BACKGROUND */}
      <img
        src={`${IMG_BASE}${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* OVERLAY */}
      <div
        className={`absolute inset-0 z-10 ${
          movie.isKids
            ? "bg-gradient-to-r from-blue-900/90 via-blue-800/60 to-transparent"
            : "bg-gradient-to-r from-black/95 via-black/70 to-transparent"
        }`}
      />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center px-6 md:px-12">
        <div
          ref={contentRef}
          className="max-w-3xl bg-black/30 p-6 rounded-lg backdrop-blur-sm"
        >
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            {movie.title}
          </h1>

          <p
            ref={descRef}
            className="text-gray-200 text-sm md:text-base mb-6 leading-relaxed"
          >
            {movie.overview}
          </p>

          <div ref={buttonsRef} className="flex gap-4">
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
