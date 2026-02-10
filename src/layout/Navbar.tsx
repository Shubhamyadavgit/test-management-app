import { FaCaretDown } from "react-icons/fa";
import { FiBell, FiMenu } from "react-icons/fi";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 relative z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
        >
          <FiMenu size={20} className="text-gray-700" />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition">
            <FiBell size={18} className="text-gray-600" />
          </div>

          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />

          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">
              {user?.name || "User"}
            </div>

            <div className="text-xs text-gray-500">{user?.role || "Admin"}</div>
          </div>

          <FaCaretDown size={14} className="text-gray-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
