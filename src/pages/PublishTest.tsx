"use client";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import type { QuestionForm } from "../types/question";

import { FiBarChart2, FiBookOpen, FiClock } from "react-icons/fi";
import { MdOutlineTopic } from "react-icons/md";

import { useState } from "react";
import toast from "react-hot-toast";
import { publishTestAsync } from "../redux/slices/testSlice";

type OutletContextType = {
  questions: QuestionForm[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  totalQuestions: number;
};

export default function PublishTest() {
  const navigate = useNavigate();
  const { testId } = useParams();

  const { totalQuestions } = useOutletContext<OutletContextType>();

  const { currentTest } = useSelector((s: RootState) => s.test);

  const [activeTab, setActiveTab] = useState<"publish" | "schedule" | "bank">(
    "publish",
  );

  const [durationType, setDurationType] = useState<
    "always" | "1week" | "3weeks" | "1month" | "custom"
  >("always");

  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handlePublish = async () => {
    if (!testId) return;

    setLoading(true);

    try {
      const result = await dispatch(publishTestAsync(testId));

      if (publishTestAsync.fulfilled.match(result)) {
        toast.success("Test published successfully");
        navigate("/dashboard");
      } else {
        toast.error(result.payload ?? "Failed to publish test");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    setLoading(true);

    const payload = {
      test_id: testId,
      publish_type: "schedule",
      publish_date: scheduleDate,
      publish_time: scheduleTime,
    };

    console.log(payload);
    // await dispatch(schedulePublishAsync(payload));

    setLoading(false);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Test creation</div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-lg font-semibold text-gray-800">
            Test created
          </div>

          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
            All {totalQuestions} Questions done
          </span>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          <div className="flex-1">
            <span className="inline-flex bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-4 capitalize">
              {currentTest?.type}
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {currentTest?.name}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                ${
                  currentTest?.difficulty === "easy"
                    ? "bg-green-50 text-green-600"
                    : currentTest?.difficulty === "medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {currentTest?.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm mb-3">
              <span className="text-gray-400 w-24">Subject</span>
              <span className="font-medium text-gray-700">
                {currentTest?.subject}
              </span>
            </div>

            <div className="flex items-start gap-4 text-sm mb-3">
              <span className="text-gray-400 w-24">Topic</span>
              <div className="flex gap-2 flex-wrap">
                {currentTest?.topics?.map((topic) => (
                  <span
                    key={topic}
                    className="flex items-center gap-1 border border-yellow-300 bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full"
                  >
                    <MdOutlineTopic size={14} />
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 text-sm">
              <span className="text-gray-400 w-24">Sub Topic</span>
              <div className="flex gap-2 flex-wrap">
                {currentTest?.sub_topics?.map((sub) => (
                  <span
                    key={sub}
                    className="flex items-center gap-1 border border-yellow-300 bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full"
                  >
                    <FiBookOpen size={14} />
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiClock size={14} />
                {currentTest?.total_time} Min
              </div>
              <div className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiBookOpen size={14} />
                {currentTest?.total_questions}
              </div>
              <div className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiBarChart2 size={14} />
                {currentTest?.total_marks}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200 w-fit">
          {["publish", "schedule", "bank"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition whitespace-nowrap cursor-pointer
                ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:bg-white hover:shadow-sm"
                }`}
            >
              {tab === "bank"
                ? "Save to Question Bank"
                : tab === "schedule"
                  ? "Schedule Publish"
                  : "Publish Now"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "publish" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="mb-6">
            <div className="text-base font-semibold text-gray-800">
              Live Until
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Choose how long this test remains available
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { key: "always", title: "Always Available" },
              { key: "1week", title: "1 Week" },
              { key: "3weeks", title: "3 Weeks" },
              { key: "1month", title: "1 Month" },
              { key: "custom", title: "Custom Duration" },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition text-sm
                  ${
                    durationType === item.key
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
              >
                <input
                  type="radio"
                  checked={durationType === item.key}
                  onChange={() =>
                    setDurationType(item.key as typeof durationType)
                  }
                  className="accent-indigo-600 flex-shrink-0"
                />
                <span className="font-medium text-gray-800">{item.title}</span>
              </label>
            ))}
          </div>

          {durationType === "custom" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition order-2 sm:order-1"
            >
              Cancel
            </button>

            <button
              onClick={handlePublish}
              disabled={loading}
              className={`px-6 py-2.5 bg-indigo-600 text-white rounded-lg transition shadow-sm order-1 sm:order-2
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loading ? "Publishing..." : "Confirm Publish"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="mb-6 font-semibold text-gray-800">
            Schedule Publish
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition order-2 sm:order-1 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSchedule}
              disabled={loading}
              className={`px-6 py-2.5 bg-indigo-600 text-white rounded-lg transition shadow-sm order-1 sm:order-2
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loading ? "Scheduling..." : "Schedule Publish"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "bank" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center text-gray-600">
          Save to Question Bank feature coming soon...
        </div>
      )}
    </div>
  );
}
