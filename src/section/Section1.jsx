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

import useActiveProfile from "../hooks/useActiveProfile";

export default function Section1() {
  const navigate = useNavigate();
  const profile = useActiveProfile(); // may be null initially

  /* ======================
     UI STATE
  ====================== */
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

  /* ======================
     GENRES
  ====================== */
  useEffect(() => {
    fetchGenres().then(res => setGenres(res.genres || []));
  }, []);

  /* ======================
     HERO
  ====================== */
  useEffect(() => {
    if (!profile) return;

    const fetchHero = profile.isKids
      ? fetchKidsFeaturedMovie
      : fetchFeaturedMovie;

    fetchHero().then(res => {
      setFeatured(res?.results?.[0] || null);
    });
  }, [profile]);

  /* ======================
     MOVIES
  ====================== */
  useEffect(() => {
    if (!profile) return;

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
  }, [filters, query, profile]);

  /* ======================
     CONTINUE WATCHING
  ====================== */
  const activity = profile
    ? JSON.parse(localStorage.getItem(`activity_${profile.id}`)) || []
    : [];

  const continueWatching = activity
    .sort((a, b) => b.watchedAt - a.watchedAt)
    .slice(0, 8);

  /* ======================
     RENDER
  ====================== */

  const isFiltering =
  query.trim().length > 0 ||
  filters.genreIds.length > 0 ||
  filters.rating > 0 ||
  filters.year !== "";

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {!profile && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          Loading profile…
        </div>
      )}

      {profile && (
        <>
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

          <div className="flex pt-20">
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
              {/* 🎬 HERO — only when NOT searching or filtering */}
                {featured && !isFiltering && (
                <Hero
                    movie={{ ...featured, isKids: profile.isKids }}
                    onInfo={() => navigate(`/movie/${featured.id}`)}
                    onPlay={() => navigate(`/movie/${featured.id}`)}
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
                        onClick={() =>
                          navigate(`/movie/${movie.id}`, {
                            state: {
                              resume: true,
                              position: movie.lastPosition,
                            },
                          })
                        }
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
                            className="h-1 bg-red-600 rounded transition-all duration-300"
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
        </>
      )}
    </div>
  );
}
