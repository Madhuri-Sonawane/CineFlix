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

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const profile = profiles.find((p) => p.id === id);

    if (!profile) {
      navigate("/profile");
      return;
    }

    setName(profile.name);
    setAvatar(profile.avatar);
  }, [id, navigate]);

  // Handle image upload (local preview)
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const saveChanges = () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];

    const updated = profiles.map((p) =>
      p.id === id
        ? { ...p, name, avatar }
        : p
    );

    localStorage.setItem("profiles", JSON.stringify(updated));
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile name"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700"
        />

        {/* Preset avatars */}
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
            />
          ))}
        </div>

        {/* Avatar URL */}
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Paste image URL"
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700"
        />
        <button
          onClick={() => avatarUrl && setAvatar(avatarUrl)}
          className="mb-4 px-3 py-1 bg-gray-600 rounded text-sm"
        >
          Use URL
        </button>

        {/* Upload */}
        <label className="block mb-4 text-sm cursor-pointer">
          Upload image
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/profile")}
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
