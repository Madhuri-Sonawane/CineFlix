import { BrowserRouter, Routes, Route } from "react-router-dom";

import Section1 from "./section/Section1";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import ProfileSelect from "./pages/ProfileSelect";
import Activity from "./pages/Activity";
import WatchLater from "./pages/WatchLater";

export default function App() {
  return (
  
      <Routes>
        {/* PROFILE SELECT (fresh device like Netflix) */}
        <Route path="/profiles" element={<ProfileSelect />} />

        {/* HOME */}
        <Route path="/" element={<Section1 />} />

        {/* MOVIE DETAIL — THIS WAS THE PROBLEM */}
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* PROFILE PAGES */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/watch-later" element={<WatchLater />} />

        {/* FALLBACK */}
        <Route path="*" element={<Section1 />} />
      </Routes>
   
  );
}
