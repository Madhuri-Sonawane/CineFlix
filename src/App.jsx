import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EditProfile from "./pages/EditProfile";

import Section1 from "./section/Section1";

// pages
import WatchLater from "./pages/WatchLater";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import MovieDetail from "./pages/MovieDetail";
import ProfileSelect from "./pages/ProfileSelect";

/* 🔒 Route Guard */
function RequireProfile({ children }) {
  const activeProfile = localStorage.getItem("activeProfileId");

  if (!activeProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Profile selector (ALWAYS available) */}
        <Route path="/profiles" element={<ProfileSelect />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireProfile>
              <Section1 />
            </RequireProfile>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          }
        />

        <Route
          path="/watch-later"
          element={
            <RequireProfile>
              <WatchLater />
            </RequireProfile>
          }
        />

        <Route
          path="/activity"
          element={
            <RequireProfile>
              <Activity />
            </RequireProfile>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <RequireProfile>
              <MovieDetail />
            </RequireProfile>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* edit profile */}
        <Route path="/profile/edit/:id" element={<EditProfile />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
