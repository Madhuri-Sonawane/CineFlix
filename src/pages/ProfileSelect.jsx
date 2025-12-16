import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
];

export default function ProfileSelect() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [isKids, setIsKids] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(stored);
  }, []);

  const selectProfile = (id) => {
    localStorage.setItem("activeProfileId", id);
    navigate("/");
  };

  const addProfile = () => {
    if (!name.trim()) return;

    const newProfile = {
      id: Date.now().toString(),
      name,
      avatar,
      isKids,
    };

    const updated = [...profiles, newProfile];
    localStorage.setItem("profiles", JSON.stringify(updated));
    localStorage.setItem("activeProfileId", newProfile.id);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Who’s watching?</h1>

      {/* Existing profiles */}
      <div className="flex gap-6 mb-10">
        {profiles.map((p) => (
          <div
            key={p.id}
            onClick={() => selectProfile(p.id)}
            className="cursor-pointer text-center hover:scale-110 transition"
          >
            <img
              src={p.avatar}
              className="w-24 h-24 rounded mb-2"
            />
            <p>{p.name}</p>
            {p.isKids && (
              <span className="text-xs text-yellow-400">Kids</span>
            )}
          </div>
        ))}
      </div>

      {/* Add profile */}
      <div className="bg-gray-900 p-6 rounded w-80">
        <h2 className="text-lg font-semibold mb-4">Add Profile</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile name"
          className="w-full mb-3 px-3 py-2 rounded bg-gray-800"
        />

        <div className="flex gap-2 mb-3">
          {avatars.map((a) => (
            <img
              key={a}
              src={a}
              onClick={() => setAvatar(a)}
              className={`w-10 h-10 rounded cursor-pointer border ${
                avatar === a ? "border-red-500" : "border-transparent"
              }`}
            />
          ))}
        </div>

        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={isKids}
            onChange={() => setIsKids(!isKids)}
          />
          Kids Profile
        </label>

        <button
          onClick={addProfile}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
