import { useEffect, useState } from "react";
import { normalizeProfiles } from "../utils/normalizeProfiles";

export default function useActiveProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("profiles")) || [];
    const profiles = normalizeProfiles(raw);

    localStorage.setItem("profiles", JSON.stringify(profiles));

    const activeId = localStorage.getItem("activeProfileId");
    const active =
      profiles.find(p => p.id === activeId) ||
      profiles.find(p => p.role === "owner") ||
      profiles[0];

    if (active) {
      localStorage.setItem("activeProfileId", active.id);
      setProfile(active);
    }
  }, []);

  return profile;
}
