import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import { useState } from "react";
import type { QuestionForm } from "../types/question";

export default function MainLayout() {
  const location = useLocation();

  const isQuestionsPage =
    location.pathname.includes("/add-questions") ||
    location.pathname.includes("/publish");

  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={isQuestionsPage ? "questions" : "default"}
        questions={questions}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        totalQuestions={totalQuestions}
      />
      <div
        className={`
          flex flex-col flex-1 min-h-screen w-full transition-all duration-300
          ${isQuestionsPage ? "lg:ml-[340px]" : "lg:ml-64"}
        `}
      >
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <Outlet
            context={{
              questions,
              setQuestions,
              currentIndex,
              setCurrentIndex,
              totalQuestions,
              setTotalQuestions,
            }}
          />
        </main>
      </div>
    </div>
  );
}
