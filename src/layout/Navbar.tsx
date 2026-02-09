import { FaCaretDown } from "react-icons/fa";
import { FiBell } from "react-icons/fi";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header
      className="
        h-16
        bg-white
        flex
        items-center
        justify-end
        px-6
        relative
        z-40
      "
      style={{
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition">
            <FiBell size={18} className="text-gray-600" />
          </div>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-9 h-9 rounded-full     object-cover"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-800">
              {user.name || "User"}
            </div>
            <div className="text-xs text-gray-500">{user.role || "Admin"}</div>
          </div>
          <FaCaretDown
            size={16}
            className="text-gray-500 transform -translate-y-2"
          />
        </div>
      </div>
    </header>
  );
}
