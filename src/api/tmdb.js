const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// ---------- Helper ----------
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB API Error");
  return res.json();
}

// ---------- Genres ----------
export function fetchGenres() {
  return fetchJSON(
    `${BASE}/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
}

// ---------- Discover / Search Movies ----------
export function discoverMovies({
  genreIds = [],
  rating = 0,
  year = "",
  query = "",
  kidsMode = false,
}) {
  // Search (disabled for kids anyway)
  if (query && query.trim() && !kidsMode) {
    return fetchJSON(
      `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&include_adult=false`
    );
  }

  const withGenres = genreIds.length
    ? `&with_genres=${genreIds.join(",")}`
    : "";

  const voteFilter = rating ? `&vote_average.gte=${rating}` : "";
  const yearFilter = year ? `&primary_release_year=${year}` : "";

  // 👶 Kids-safe filters
  const kidsFilters = kidsMode
    ? `
      &include_adult=false
      &with_original_language=en
      &without_genres=28
      &without_original_language=ja
    `
    : "";

  const url = `
    ${BASE}/discover/movie
    ?api_key=${API_KEY}
    ${withGenres}
    ${voteFilter}
    ${yearFilter}
    ${kidsFilters}
    &sort_by=popularity.desc
  `;

  return fetchJSON(url.replace(/\s+/g, ""));
}

// ---------- Movie Details + Videos ----------
export function fetchMovieDetails(id) {
  return fetchJSON(
    `${BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
  );
}

export function fetchFeaturedMovie() {
  return fetchJSON(
    `${BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
}


export function fetchKidsFeaturedMovie() {
  return fetchJSON(
    `${BASE}/discover/movie?api_key=${API_KEY}&language=en-US
    &with_genres=16,10751
    &certification_country=US
    &certification.lte=G
    &sort_by=popularity.desc`
  );
}
