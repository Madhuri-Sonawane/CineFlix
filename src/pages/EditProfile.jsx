import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const presetAvatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
];

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pin, setPin] = useState("");
  const [makeOwner, setMakeOwner] = useState(false);

  /* =========================
     LOAD + ACCESS CONTROL
  ========================== */
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const activeId = localStorage.getItem("activeProfileId");

    const target = profiles.find(p => p.id === id);
    const active = profiles.find(p => p.id === activeId);

    if (!target || !active) {
      navigate("/", { replace: true });
      return;
    }

    // Kids cannot edit others
    if (active.role === "kids" && active.id !== target.id) {
      alert("Kids profiles cannot edit other profiles.");
      navigate("/", { replace: true });
      return;
    }

    setProfile(target);
    setName(target.name);
    setAvatar(target.avatar);
    setPin(target.pin || "");
    setMakeOwner(target.role === "owner");
  }, [id, navigate]);

  if (!profile) return null;

  const isOwner = profile.role === "owner";
  const isKids = profile.role === "kids";

  /* =========================
     SAVE CHANGES
  ========================== */
  const saveChanges = () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];

    const updated = profiles.map(p => {
      // Demote previous owner if promoting new one
      if (makeOwner && p.role === "owner" && p.id !== profile.id) {
        return { ...p, role: "adult" };
      }

      if (p.id === profile.id) {
        return {
          ...p,
          name,
          avatar,
          role: makeOwner ? "owner" : p.role,
          pin: makeOwner ? pin || null : p.pin,
        };
      }

      return p;
    });

    localStorage.setItem("profiles", JSON.stringify(updated));
    navigate("/profile", { replace: true });
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile name"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700"
        />

        {/* AVATAR */}
        <p className="text-sm mb-2 text-gray-400">Choose an avatar</p>
        <div className="flex gap-3 mb-4">
          {presetAvatars.map((a) => (
            <img
              key={a}
              src={a}
              onClick={() => setAvatar(a)}
              className={`w-12 h-12 rounded cursor-pointer border ${
                avatar === a ? "border-red-500" : "border-transparent"
              }`}
              alt="avatar"
            />
          ))}
        </div>

        {/* OWNER CONTROLS */}
        {!isKids && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={makeOwner}
                onChange={(e) => setMakeOwner(e.target.checked)}
              />
              Make this the Owner profile
            </label>
          </div>
        )}

        {/* PIN — ONLY FOR OWNER */}
        {makeOwner && (
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="Set 4-digit Owner PIN"
            className="w-full mb-4 px-3 py-2 rounded bg-gray-700"
          />
        )}

        {/* ACTIONS */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/profile", { replace: true })}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
