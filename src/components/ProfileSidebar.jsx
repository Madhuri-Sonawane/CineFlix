import { Link } from "react-router-dom";

export default function ProfileSidebar({ open, onClose, profile }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-black text-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 text-center">
          <img
            src={
              profile.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
            }
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="mt-3 font-semibold">{profile.name}</h2>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-4 p-5 text-sm">
          <Link to="/profile" onClick={onClose}>Profile</Link>
          <Link to="/watch-later" onClick={onClose}>Watch Later</Link>
          <Link to="/activity" onClick={onClose}>Activity</Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="text-red-500 text-left"
          >
            Exit
          </button>
        </div>
      </aside>
    </>
  );
}
