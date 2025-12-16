import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import MovieGrid from "../components/MovieGrid";
import ProfileSidebar from "../components/ProfileSidebar";

import { fetchGenres, discoverMovies, IMG_BASE } from "../api/tmdb";

function Section1() {
  const navigate = useNavigate();

  // 🔑 SINGLE SOURCE OF TRUTH
  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  const activeProfileId = localStorage.getItem("activeProfileId");

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || {
      name: "User",
      avatar: "",
      isKids: false,
    };

  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);

  const [filters, setFilters] = useState({
    genreIds: [],
    rating: 0,
    year: "",
  });

  // Fetch genres
  useEffect(() => {
    fetchGenres().then((res) => setGenres(res.genres || []));
  }, []);

  // Fetch movies
  useEffect(() => {
    setLoading(true);

    const delay = setTimeout(() => {
      const params = activeProfile.isKids
        ? {
            genreIds: [16, 10751], // Animation + Family
            kidsMode: true,
          }
        : { ...filters, query };

      discoverMovies(params)
        .then((res) => setMovies(res.results || []))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delay);
  }, [filters, query, activeProfile.isKids]);

  // 🔐 profile-specific activity
  const activityKey = `activity_${activeProfileId}`;
  const activity = JSON.parse(localStorage.getItem(activityKey)) || [];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavBar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        query={query}
        setQuery={setQuery}
        profile={activeProfile}  
        onProfileClick={() => setProfileOpen((p) => !p)}
      />

      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={activeProfile}  
      />

      <div className="flex pt-20">
        {!activeProfile.isKids && (
          <Sidebar
            open={sidebarOpen}
            genres={genres}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        <div className="flex-1 p-6">
          {/* Continue Watching */}
          {activity.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">Continue Watching</h2>

              <div className="flex gap-4 overflow-x-auto">
                {activity.slice(0, 6).map((movie) => (
                  <div
                    key={`${movie.id}-${movie.watchedAt}`}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="min-w-[160px] cursor-pointer"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `${IMG_BASE}${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      className="rounded h-40 object-cover"
                      alt={movie.title}
                    />
                    <div className="h-1 bg-gray-700 mt-1">
                      <div
                        className="h-1 bg-red-600"
                        style={{ width: `${movie.progress || 0}%` }}
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

export default Section1;
