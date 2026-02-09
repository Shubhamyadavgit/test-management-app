import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Test = {
  id: number;
  name: string;
  subject: string;
  status: "Draft" | "Live";
  createdAt: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const tests: Test[] = [
    {
      id: 1,
      name: "Math Test",
      subject: "Mathematics",
      status: "Draft",
      createdAt: "2026-02-09",
    },
    {
      id: 2,
      name: "Physics Mock",
      subject: "Physics",
      status: "Live",
      createdAt: "2026-02-08",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm"
        >
          <FiPlus size={18} />
          Create New Test
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-sm">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Test Name</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => (
              <tr
                key={test.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {test.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{test.subject}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full
                      ${
                        test.status === "Live"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {test.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500 text-sm">
                  {test.createdAt}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                      <FiEye size={18} />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition">
                      <FiEdit size={18} />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
