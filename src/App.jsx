import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Section1 from "./section/Section1";
import Profile from "./pages/Profile";
import ProfileSelect from "./pages/ProfileSelect";
import WatchLater from "./pages/WatchLater";
import Activity from "./pages/Activity";
import MovieDetail from "./pages/MovieDetail";
import EditProfile from "./pages/EditProfile";

function App() {
  const activeProfile = localStorage.getItem("activeProfileId");

  return (
   
      <Routes>
        {/* 🔒 PROFILE SELECTION (Netflix-style) */}
        <Route
          path="/profiles"
          element={<ProfileSelect />}
        />

        {/* If no active profile, force profiles screen */}
        {!activeProfile && (
          <Route
            path="*"
            element={<Navigate to="/profiles" replace />}
          />
        )}

        {/* 🏠 HOME */}
        <Route path="/" element={<Section1 />} />

        {/* 👤 PROFILE MANAGEMENT */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit/:id" element={<EditProfile />} />

        {/* 📌 USER FEATURES */}
        <Route path="/watch-later" element={<WatchLater />} />
        <Route path="/activity" element={<Activity />} />

        {/* 🎬 MOVIE */}
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
  
  );
}

export default App;
