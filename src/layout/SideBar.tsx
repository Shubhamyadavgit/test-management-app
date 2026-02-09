import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiUsers,
  FiSettings,
  FiBell,
  FiUser,
} from "react-icons/fi";

import {
  MdOutlineQuiz,
  MdOutlinePayments,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiSupport, BiBadgeCheck } from "react-icons/bi";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={18} />, path: "/dashboard" },
    {
      name: "Test Creation",
      icon: <MdOutlineQuiz size={18} />,
      path: "/tests/create",
    },
    {
      name: "Test Tracking",
      icon: <FiFileText size={18} />,
      path: "/test-tracking",
    },
    {
      name: "Approvals",
      icon: <AiOutlineInfoCircle size={18} />,
      path: "/approvals",
    },
    { name: "Resources", icon: <FiFileText size={18} />, path: "/resources" },
    { name: "User Management", icon: <FiUsers size={18} />, path: "/users" },
    {
      name: "Admin Management",
      icon: <MdOutlineAdminPanelSettings size={18} />,
      path: "/admin-management",
    },
    {
      name: "Role Management",
      icon: <FiUser size={18} />,
      path: "/role-management",
    },
    {
      name: "Subscriptions",
      icon: <FiFileText size={18} />,
      path: "/subscriptions",
    },
    {
      name: "Payments",
      icon: <MdOutlinePayments size={18} />,
      path: "/payments",
    },
    { name: "Badges", icon: <BiBadgeCheck size={18} />, path: "/badges" },
    {
      name: "Customer support",
      icon: <BiSupport size={18} />,
      path: "/support",
    },
    {
      name: "Notifications",
      icon: <FiBell size={18} />,
      path: "/notifications",
    },
    { name: "Settings", icon: <FiSettings size={18} />, path: "/settings" },
  ];

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 z-50 flex flex-col bg-white"
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      <div className="h-16 flex items-center px-6">
        <img src="/images/logo.png" alt="PrepRoute" className="h-8" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all${isActive ? "bg-blue-50 text-primary" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <span>{item.icon}</span>

            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
