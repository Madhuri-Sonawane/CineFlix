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
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [isKids, setIsKids] = useState(false);

  const activeProfileId = localStorage.getItem("activeProfileId");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(stored);
  }, []);

  // Switch profile
  const switchProfile = (id) => {
    localStorage.setItem("activeProfileId", id);
   navigate("/", { replace: true });
 // reload cleanly
  };

  // Add new profile
  const addProfile = () => {
    if (!name.trim()) return;

    if (profiles.length >= 3) {
      alert("Maximum 3 profiles allowed");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name,
      avatar,
      isKids,
    };

    const updated = [...profiles, newProfile];
    localStorage.setItem("profiles", JSON.stringify(updated));
    localStorage.setItem("activeProfileId", newProfile.id);

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Profiles</h1>

      {/* Profile list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {profiles.map((p) => (
          <div
            key={p.id}
            className={`bg-gray-800 p-4 rounded text-center ${
              p.id === activeProfileId ? "border-2 border-red-600" : ""
            }`}
          >
            <img
              src={p.avatar}
              className="w-20 h-20 rounded mx-auto mb-2"
            />
            <p className="font-semibold">{p.name}</p>

            {p.isKids && (
              <span className="text-xs text-yellow-400">Kids</span>
            )}

            {p.id !== activeProfileId && (
              <button
                onClick={() => switchProfile(p.id)}
                className="mt-3 px-4 py-1 bg-red-600 rounded text-sm"
              >
                Switch
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add profile */}
      {profiles.length < 3 && (
        <>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-6 py-2 bg-gray-800 rounded"
          >
            + Add Profile
          </button>

          {showAdd && (
            <div className="mt-6 bg-gray-800 p-4 rounded max-w-sm">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Profile name"
                className="w-full mb-3 px-3 py-2 rounded bg-gray-700"
              />

              <div className="flex gap-2 mb-3">
                {avatars.map((a) => (
                  <img
                    key={a}
                    src={a}
                    onClick={() => setAvatar(a)}
                    className={`w-10 h-10 rounded cursor-pointer border ${
                      avatar === a
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>

              <label className="flex items-center gap-2 mb-3 text-sm">
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={() => setIsKids(!isKids)}
                />
                Kids Profile
              </label>

              <button
                onClick={addProfile}
                className="w-full bg-red-600 py-2 rounded"
              >
                Save & Switch
              </button>
            </div>
          )}
        </>
      )}

      {/* edit profile */}
    {profiles.map((p) => (
  <div
    key={p.id}
    className={`relative bg-gray-800 p-4 rounded text-center transition hover:scale-105 ${
      p.id === activeProfileId ? "border-2 border-red-600" : ""
    }`}
  >
    {/* ✏️ EDIT ICON ON SAME CARD */}
    <button
      onClick={() => navigate(`/profile/edit/${p.id}`)}
      className="absolute top-2 right-2 text-gray-400 hover:text-white"
      title="Edit profile"
    >
      ✏️
    </button>

    <img
      src={p.avatar}
      className="w-20 h-20 rounded mx-auto mb-2"
      alt={p.name}
    />

    <p className="font-semibold">{p.name}</p>

    {p.isKids && (
      <span className="text-xs text-yellow-400">Kids</span>
    )}

    {p.id !== activeProfileId && (
      <button
        onClick={() => switchProfile(p.id)}
        className="mt-3 px-4 py-1 bg-red-600 rounded text-sm"
      >
        Switch
      </button>
    )}
  </div>
))}


    </div>
  );
}
