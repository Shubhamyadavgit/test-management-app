import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiUsers,
  FiSettings,
  FiBell,
} from "react-icons/fi";

import { MdOutlineQuiz } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";

import type { QuestionForm } from "../types/question";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "questions";
  questions?: QuestionForm[];
  currentIndex?: number;
  setCurrentIndex?: (index: number) => void;
  totalQuestions?: number;
};

export default function Sidebar({
  isOpen,
  onClose,
  variant = "default",
  questions = [],
  currentIndex = 0,
  setCurrentIndex,
  totalQuestions = 0,
}: SidebarProps) {
  const isQuestionsVariant = variant === "questions";

  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    {
      name: "Test Creation",
      icon: <MdOutlineQuiz size={20} />,
      path: "/tests/create",
    },
    {
      name: "Test Tracking",
      icon: <FiFileText size={20} />,
      path: "/test-tracking",
    },
    {
      name: "Approvals",
      icon: <AiOutlineInfoCircle size={20} />,
      path: "/approvals",
    },
    { name: "Users", icon: <FiUsers size={20} />, path: "/users" },
    {
      name: "Notifications",
      icon: <FiBell size={20} />,
      path: "/notifications",
    },
    { name: "Settings", icon: <FiSettings size={20} />, path: "/settings" },
  ];

  const sidebarWidth = isQuestionsVariant ? "w-[340px]" : "w-64";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out${sidebarWidth}${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center border-b border-gray-200 px-6">
          <img
            src="/images/logo.png"
            className="h-8 object-contain"
            alt="PrepRoute"
          />
        </div>

        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <div
            className={`border-r border-gray-200 flex flex-col py-4 gap-2 transition-all duration-300${isQuestionsVariant ? "w-20 items-center" : "w-64 px-3"}`}
          >
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) => `
                  flex items-center
                  ${isQuestionsVariant ? "justify-center p-3" : "gap-3 px-3 py-2.5"}
                  rounded-lg transition
                  ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                `}
              >
                {item.icon}

                {!isQuestionsVariant && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            ))}
          </div>
          {isQuestionsVariant && (
            <div className="w-[260px] border-r border-gray-200">
              <QuestionSidebar
                questions={questions}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                totalQuestions={totalQuestions}
                onClose={onClose}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

type QuestionSidebarProps = {
  questions: QuestionForm[];
  currentIndex: number;
  setCurrentIndex?: (index: number) => void;
  totalQuestions: number;
  onClose: () => void;
};

function QuestionSidebar({
  questions,
  currentIndex,
  setCurrentIndex,
  totalQuestions,
  onClose,
}: QuestionSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="font-semibold text-gray-800">Question creation</div>

        <div className="text-sm text-gray-500">
          Total Questions : {totalQuestions}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const completed = index < questions.length;
          const active = index === currentIndex;

          return (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex?.(index);
                onClose();
              }}
              className={`flex justify-between items-center px-3 py-2 rounded-lg border cursor-pointer transition ${active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : completed ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-400"}`}
            >
              Question {index + 1}
              <span className="text-sm">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
