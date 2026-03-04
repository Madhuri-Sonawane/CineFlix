import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import MovieGrid from "../components/MovieGrid";
import ProfileSidebar from "../components/ProfileSidebar";
import MoodBar from "../components/MoodBar";

import {
  fetchGenres,
  discoverMovies,
  fetchFeaturedMovie,
  fetchKidsFeaturedMovie,
} from "../api/tmdb";

export default function Section1() {
  const navigate = useNavigate();

  /* =========================
     RESOLVE PROFILE (ONCE)
  ========================== */

  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  const activeId = localStorage.getItem("activeProfileId");

  const profile =
    profiles.find(p => p.id === activeId) ||
    profiles.find(p => p.isDefault) ||
    profiles[0] ||
    null;

  // No profile → redirect immediately
  useEffect(() => {
    if (!profile) {
      navigate("/profiles", { replace: true });
    } else {
      localStorage.setItem("activeProfileId", profile.id);
    }
  }, [profile, navigate]);

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        Loading profile…
      </div>
    );
  }

  /* =========================
     UI STATE
  ========================== */

  const [featured, setFeatured] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    genreIds: [],
    rating: 0,
    year: "",
  });

  const [activeMood, setActiveMood] = useState(null);

  const applyMood = (genreIds) => {
    setActiveMood(genreIds);
    setFilters(prev => ({ ...prev, genreIds: genreIds ?? [] }));
  };

  /* =========================
     GENRES
  ========================== */

  useEffect(() => {
    fetchGenres().then(res => setGenres(res.genres || []));
  }, []);

  /* =========================
     HERO
  ========================== */

  useEffect(() => {
    const fetchHero = profile.isKids
      ? fetchKidsFeaturedMovie
      : fetchFeaturedMovie;

    fetchHero().then(res => {
      setFeatured(res?.results?.[0] || null);
    });
  }, [profile.isKids]);

  /* =========================
     MOVIES
  ========================== */

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const params = profile.isKids
        ? { genreIds: [16, 10751], kidsMode: true }
        : { ...filters, query };

      discoverMovies(params)
        .then(res => setMovies(res.results || []))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timeout);
  }, [filters, query, profile.isKids]);

  /* =========================
     ACTIVITY
  ========================== */

  const activity =
    JSON.parse(localStorage.getItem(`activity_${profile.id}`)) || [];

  const continueWatching = activity
    .sort((a, b) => b.watchedAt - a.watchedAt)
    .slice(0, 8);

  const isFiltering =
    query.trim() ||
    filters.genreIds.length ||
    filters.rating ||
    filters.year;

  /* =========================
     RENDER
  ========================== */

  return (
    <div style={{ background: "var(--brand-bg)", color: "#f1eeff", minHeight: "100vh" }}>
      <NavBar
        toggleSidebar={() => setSidebarOpen(s => !s)}
        sidebarOpen={sidebarOpen}
        query={query}
        setQuery={setQuery}
        profile={profile}
        onProfileClick={() => setProfileOpen(true)}
      />

      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
      />

      <div style={{ display: "flex", paddingTop: "80px", minHeight: "100vh" }}>
        {!profile.isKids && (
          <Sidebar
            open={sidebarOpen}
            genres={genres}
            filters={filters}
            setFilters={setFilters}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div style={{ flex: 1, padding: "1.5rem", minWidth: 0 }}>
          {featured && !isFiltering && (
            <Hero
              movie={{ ...featured, isKids: profile.isKids }}
              onPlay={() => navigate(`/movie/${featured.id}`)}
              onInfo={() => navigate(`/movie/${featured.id}`)}
            />
          )}

          {!profile.isKids && !query.trim() && (
            <MoodBar activeMood={activeMood} onSelect={applyMood} />
          )}

          {continueWatching.length > 0 && !isFiltering && (
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.1rem" }}>▶</span>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f1eeff", letterSpacing: "-0.01em", position: "relative", paddingBottom: 4 }}>
                  Continue Watching
                  <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #7c3aed, #f59e0b)", borderRadius: 99 }} />
                </h2>
              </div>
              <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                {continueWatching.map(movie => (
                  <div key={`${movie.id}-${movie.watchedAt}`}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ minWidth: 140, cursor: "pointer", flexShrink: 0 }}
                  >
                    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--brand-border)" }}>
                      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "/no-poster.png"}
                        style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} alt={movie.title} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)" }}>
                        <div style={{ height: "100%", width: `${movie.progress}%`, background: "linear-gradient(90deg, #7c3aed, #f59e0b)" }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "var(--brand-text-dim)", marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MovieGrid movies={movies} loading={loading} />
        </div>
      </div>
    </div>
  );
}