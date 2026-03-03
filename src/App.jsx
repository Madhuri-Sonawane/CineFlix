import { Routes, Route } from "react-router-dom";

import Section1 from "./section/Section1";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import ProfileSelect from "./pages/ProfileSelect";
import EditProfile from "./pages/EditProfile";
import Activity from "./pages/Activity";
import WatchLater from "./pages/WatchLater";

export default function App() {
  return (
    <Routes>
      {/* PROFILE SELECT */}
      <Route path="/profiles" element={<ProfileSelect />} />

      {/* HOME */}
      <Route path="/" element={<Section1 />} />

      {/* MOVIE DETAIL */}
      <Route path="/movie/:id" element={<MovieDetail />} />

      {/* PROFILE PAGES */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit/:id" element={<EditProfile />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/watch-later" element={<WatchLater />} />

      {/* FALLBACK */}
      <Route path="*" element={<Section1 />} />
    </Routes>
  );
}