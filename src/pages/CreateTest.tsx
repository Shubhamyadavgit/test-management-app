import { useEffect } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../redux/store";

import { fetchSubjectsAsync } from "../redux/slices/subjectSlice";
import { fetchTopicsAsync } from "../redux/slices/topicSlice";
import { fetchSubTopicsAsync } from "../redux/slices/subTopicSlice";
import { createTestAsync } from "../redux/slices/testSlice";

import RHFAutocomplete from "../components/RHFAutoComplete";
import RHFTextField from "../components/RHFTextfield";

import toast from "react-hot-toast";
import CircularLoader from "../components/CircularLoader";

type CreateTestForm = {
  name: string;
  subject: string;
  topics: string[];
  sub_topics: string[];

  difficulty: "easy" | "medium" | "hard";

  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;

  total_time: number;
  total_questions: number;
  total_marks: number;

  type: "chapterwise" | "pyq" | "mocktest" | "dailychallenge" | "uncategorised";
};

export default function CreateTest() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { subjects } = useSelector((s: RootState) => s.subjects);
  const { topics } = useSelector((s: RootState) => s.topics);
  const { subTopics } = useSelector((s: RootState) => s.subTopics);
  const { loading } = useSelector((s: RootState) => s.test);

  const methods = useForm<CreateTestForm>({
    defaultValues: {
      name: "",
      subject: "",
      topics: [],
      sub_topics: [],
      difficulty: "easy",
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 0,
      total_questions: 0,
      total_marks: 0,
      type: "chapterwise",
    },
  });

  const { handleSubmit, watch, control } = methods;

  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");
  const correctMarks = watch("correct_marks");
  const totalQuestions = watch("total_questions");

  useEffect(() => {
    dispatch(fetchSubjectsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSubject) dispatch(fetchTopicsAsync(selectedSubject));
  }, [selectedSubject, dispatch]);

  useEffect(() => {
    if (selectedTopics.length) dispatch(fetchSubTopicsAsync(selectedTopics));
  }, [selectedTopics, dispatch]);

  useEffect(() => {
    const total = (Number(correctMarks) || 0) * (Number(totalQuestions) || 0);

    methods.setValue("total_marks", total);
  }, [correctMarks, totalQuestions, methods]);

  const subjectOptions = subjects.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const topicOptions = topics.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  const subTopicOptions = subTopics.map((st) => ({
    label: st.name,
    value: st.id,
  }));

  const tabs = [
    { label: "Chapter Wise", value: "chapterwise" },
    { label: "PYQ", value: "pyq" },
    { label: "Mock Test", value: "mocktest" },
    { label: "Daily Challenge", value: "dailychallenge" },
    { label: "Uncategorised", value: "uncategorised" },
  ];

  const onSubmit = async (data: CreateTestForm) => {
    const payload = { ...data, status: "draft" };

    const result = await dispatch(createTestAsync(payload));

    if (createTestAsync.fulfilled.match(result)) {
      toast.success("Test created");
      navigate(`/tests/${result.payload.id}/add-questions`);
    } else {
      toast.error("Failed to create test");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-10"
      >
        <div className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
          Test Creation / Create Test / Chapter Wise
        </div>

        <div className="overflow-x-auto mb-6">
          <div className="bg-gray-50 rounded-xl p-1 flex gap-2 border border-gray-200 w-max min-w-full sm:min-w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() =>
                  methods.setValue("type", tab.value as CreateTestForm["type"])
                }
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition ${
                  watch("type") === tab.value
                    ? "bg-indigo-50 shadow text-indigo-600 font-medium"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <RHFAutocomplete
            name="subject"
            label="Subject"
            options={subjectOptions}
            placeholder="Choose subject"
            rules={{ required: "Subject is required" }}
          />

          <RHFTextField
            name="name"
            label="Name of Test"
            placeholder="Enter test name"
            rules={{ required: "Test name is required" }}
          />

          <RHFAutocomplete
            name="topics"
            label="Topics"
            options={topicOptions}
            multiple
            placeholder="Choose topics"
            rules={{ required: "Topics required" }}
          />

          <RHFAutocomplete
            name="sub_topics"
            label="Sub Topics"
            options={subTopicOptions}
            multiple
            placeholder="Choose subtopics"
            rules={{ required: "Subtopics required" }}
          />

          <RHFTextField
            name="total_time"
            label="Duration (Minutes)"
            type="number"
            rules={{ required: "Duration required" }}
          />
          <div>
            <label className="text-sm text-gray-600 mb-3 block">
              Difficulty Level
            </label>

            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {["easy", "medium", "hard"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={level}
                        checked={field.value === level}
                        onChange={field.onChange}
                        className="accent-indigo-600"
                      />

                      <span className="text-sm capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="text-sm text-gray-600 font-medium mb-4">
            Marking Scheme
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <RHFTextField
              name="wrong_marks"
              label="Wrong Answer"
              type="number"
            />

            <RHFTextField
              name="unattempt_marks"
              label="Unattempted"
              type="number"
            />

            <RHFTextField
              name="correct_marks"
              label="Correct Answer"
              type="number"
            />

            <RHFTextField
              name="total_questions"
              label="Total Questions"
              type="number"
            />

            <RHFTextField
              name="total_marks"
              label="Total Marks"
              type="number"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-2.5 rounded-lg text-white flex items-center justify-center gap-2 min-w-[120px] transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? <CircularLoader size={20} /> : "Next"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
