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
  <Route path="/profiles" element={<ProfileSelect />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/profile/edit/:id" element={<EditProfile />} />

  {/* Home */}
  <Route path="/" element={<Section1 />} />

  {/* Fallback */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
  
  );
}

export default App;
