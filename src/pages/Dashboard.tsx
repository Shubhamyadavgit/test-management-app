"use client";

import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../redux/store";
import { fetchTestsAsync } from "../redux/slices/testSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { tests, loading } = useSelector((state: RootState) => state.test);

  useEffect(() => {
    dispatch(fetchTestsAsync());
  }, [dispatch]);

  return (
    <div className="space-y-6 w-full max-w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Test Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Create, manage and publish tests
          </p>
        </div>

        <button
          onClick={() => navigate("/tests/create")}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg
            shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md
            active:bg-indigo-800 w-full sm:w-auto text-sm sm:text-base font-medium"
        >
          <FiPlus size={18} />
          Create New Test
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
              outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full min-w-[800px] table-auto">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                <th className="px-4 py-4 min-w-[70px]">S.No</th>

                <th className="px-4 py-4 min-w-[200px]">Test Name</th>

                <th className="px-4 py-4 min-w-[140px]">Subject</th>

                <th className="px-4 py-4 min-w-[100px]">Status</th>

                <th className="px-4 py-4 min-w-[120px]">Created</th>

                <th className="px-4 py-4 min-w-[120px] text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tests.map((test, index) => (
                <tr
                  key={test.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-900 text-sm max-w-[200px] truncate">
                    {test.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600 text-sm">
                    {test.subject}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap
                        ${
                          test.status === "live"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {test.status === "live" ? "Live" : "Draft"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-600 text-sm">
                    {new Date(test.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end items-center gap-2 sm:gap-3">
                      <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <FiEye size={18} />
                      </button>

                      <button
                        onClick={() => navigate(`/tests/${test.id}/edit`)}
                        className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />

                      <span>Loading tests...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && tests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
