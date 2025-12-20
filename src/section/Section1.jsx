import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import MovieGrid from "../components/MovieGrid";
import ProfileSidebar from "../components/ProfileSidebar";

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
    <div className="bg-gray-900 text-white min-h-screen">
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

      <div className="flex pt-20 min-h-screen overflow-visible">
        {!profile.isKids && (
          <Sidebar
            open={sidebarOpen}
            genres={genres}
            filters={filters}
            setFilters={setFilters}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-6">
          {featured && !isFiltering && (
            <Hero
              movie={{ ...featured, isKids: profile.isKids }}
              onPlay={() => navigate(`/movie/${featured.id}`)}
              onInfo={() => navigate(`/movie/${featured.id}`)}
            />
          )}

          {continueWatching.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">
                Continue Watching
              </h2>

              <div className="flex gap-4 overflow-x-auto">
                {continueWatching.map(movie => (
                  <div
                    key={`${movie.id}-${movie.watchedAt}`}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="min-w-[160px] cursor-pointer"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      className="rounded h-40 object-cover"
                      alt={movie.title}
                    />

                    <div className="h-1 bg-gray-700 mt-1 rounded">
                      <div
                        className="h-1 bg-red-600 rounded"
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
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
