import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
];

export default function Profile() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const activeProfileId = localStorage.getItem("activeProfileId");

  /* =========================
     LOAD + ENSURE OWNER
  ========================== */
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("profiles")) || [];

    if (!raw.length) {
      setProfiles([]);
      return;
    }

    // ensure ONE owner exists
    if (!raw.some((p) => p.role === "owner")) {
      raw[0].role = "owner";
      localStorage.setItem("profiles", JSON.stringify(raw));
    }

    const normalized = raw.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar || avatars[0],
      role: p.role || "adult",
      pin: p.pin || null,
    }));

    setProfiles(normalized);
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const isOwner = activeProfile?.role === "owner";

  /* =========================
     SWITCH PROFILE
  ========================== */
  const switchProfile = (id) => {
    localStorage.setItem("activeProfileId", id);
    navigate("/", { replace: true });
  };

  /* =========================
     DELETE PROFILE (OWNER ONLY)
  ========================== */
  const deleteProfile = (profile) => {
    if (profile.role === "owner") return;

    if (!window.confirm(`Delete profile "${profile.name}"?`)) return;

    const updated = profiles.filter((p) => p.id !== profile.id);
    localStorage.setItem("profiles", JSON.stringify(updated));

    localStorage.removeItem(`watchLater_${profile.id}`);
    localStorage.removeItem(`activity_${profile.id}`);

    if (profile.id === activeProfileId && updated.length) {
      localStorage.setItem("activeProfileId", updated[0].id);
    }

    setProfiles(updated);
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate("/", { replace: true })}
        className="mb-4 text-gray-300 hover:text-white"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Manage Profiles</h1>

      {/* PROFILES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {profiles.map((p) => {
          const canEdit =
            (isOwner && p.role !== "kids") ||
            (p.id === activeProfileId && p.role !== "kids");

          return (
            <div
              key={p.id}
              className={`relative bg-gray-800 p-4 rounded text-center
                transition-transform duration-300
                hover:-translate-y-2 hover:shadow-xl
                ${
                  p.id === activeProfileId
                    ? "border-2 border-red-600"
                    : ""
                }`}
            >
              {/* EDIT */}
              {canEdit && (
                <button
                  onClick={() =>
                    navigate(`/profile/edit/${p.id}`, { replace: true })
                  }
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  title="Edit profile"
                >
                  ✏️
                </button>
              )}

              {/* DELETE (OWNER ONLY) */}
              {isOwner && p.role !== "owner" && (
                <button
                  onClick={() => deleteProfile(p)}
                  className="absolute top-2 left-2 text-gray-400 hover:text-red-500"
                  title="Delete profile"
                >
                  🗑
                </button>
              )}

              <img
                src={p.avatar}
                alt={p.name}
                className="w-20 h-20 rounded mx-auto mb-2"
              />

              <p className="font-semibold">{p.name}</p>

              <span className="text-xs text-gray-400 capitalize">
                {p.role}
              </span>

              {p.id !== activeProfileId && (
                <button
                  onClick={() => switchProfile(p.id)}
                  className="mt-3 px-4 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                >
                  Switch
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD PROFILE (OWNER ONLY) */}
      {isOwner && profiles.length < 3 && (
        <button
          onClick={() => navigate("/profiles", { replace: true })}
          className="px-6 py-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          + Add Profile
        </button>
      )}

      {!isOwner && (
        <p className="mt-6 text-sm text-gray-500">
          Only the owner profile can add or delete profiles.
        </p>
      )}
    </div>
  );
}
