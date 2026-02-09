import { useForm, FormProvider } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import RHFTextField from "../components/RHFTextfield";
import RHFAutocomplete from "../components/RHFAutoComplete";

type CreateTestForm = {
  name: string;
  subject: string;
  type: string;
  difficulty: string;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
};

export default function CreateTest() {
  const navigate = useNavigate();

  const methods = useForm<CreateTestForm>({
    defaultValues: {
      difficulty: "easy",
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 60,
      total_marks: 100,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: CreateTestForm) => {
    console.log("Create Test:", data);

    // dispatch(createTestAsync(data))

    navigate("/tests/add-questions");
  };

  const subjectOptions = [
    { label: "Mathematics", value: "math" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
  ];

  const typeOptions = [
    { label: "Practice Test", value: "practice" },
    { label: "Mock Test", value: "mock" },
    { label: "Chapter Test", value: "chapter" },
  ];

  const difficultyOptions = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FiArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Test
          </h1>

          <p className="text-sm text-gray-500">
            Configure your test settings and marking scheme
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RHFTextField
                  name="name"
                  label="Test Name"
                  placeholder="Enter test name"
                  rules={{
                    required: "Test Name is required",
                  }}
                />

                <RHFAutocomplete
                  name="subject"
                  label="Subject"
                  options={subjectOptions}
                  placeholder="Select subject"
                  rules={{
                    required: "Subject is required",
                  }}
                />

                <RHFAutocomplete
                  name="type"
                  label="Test Type"
                  options={typeOptions}
                  placeholder="Select test type"
                />

                <RHFAutocomplete
                  name="difficulty"
                  label="Difficulty"
                  options={difficultyOptions}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Marking Scheme
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <RHFTextField
                  name="correct_marks"
                  label="Correct Marks"
                  placeholder="Enter marks"
                  type="number"
                  numeric
                />

                <RHFTextField
                  name="wrong_marks"
                  label="Wrong Marks"
                  placeholder="Enter marks"
                  type="number"
                />

                <RHFTextField
                  name="unattempt_marks"
                  label="Unattempt Marks"
                  placeholder="Enter marks"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Test Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RHFTextField
                  name="total_time"
                  label="Total Time (minutes)"
                  placeholder="Enter duration"
                  type="number"
                  numeric
                />

                <RHFTextField
                  name="total_marks"
                  label="Total Marks"
                  placeholder="Enter total marks"
                  type="number"
                  numeric
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm"
              >
                Next: Add Questions
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
