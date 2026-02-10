"use client";

import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../redux/store";

import toast from "react-hot-toast";
import { FiBarChart2, FiBookOpen, FiClock } from "react-icons/fi";
import { MdOutlineTopic } from "react-icons/md";
import RHFAutocomplete from "../components/RHFAutoComplete";
import { bulkCreateQuestionsAsync } from "../redux/slices/questionSlice";
import { fetchTestByIdAsync } from "../redux/slices/testSlice";
import CircularLoader from "../components/CircularLoader";

type QuestionForm = {
  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_option: string;

  explanation: string;

  difficulty: string;
  topic: string;
  sub_topic: string;
};

type OutletContextType = {
  questions: QuestionForm[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionForm[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  totalQuestions: number;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;
};

export default function AddQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { currentTest, getloading } = useSelector((s: RootState) => s.test);
  const { topics } = useSelector((s: RootState) => s.topics);
  const { subTopics } = useSelector((s: RootState) => s.subTopics);
  const { loading } = useSelector((s: RootState) => s.questions);
  const [uploaded, setUploaded] = useState(false);

  const apiTotalQuestions = currentTest?.total_questions || 0;

  const topicOptions = topics.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  const subTopicOptions = subTopics.map((st) => ({
    label: st.name,
    value: st.id,
  }));

  const dispatch = useDispatch<AppDispatch>();
  const {
    questions,
    setQuestions,
    currentIndex,
    setCurrentIndex,
    totalQuestions,
    setTotalQuestions,
  } = useOutletContext<OutletContextType>();

  const methods = useForm<QuestionForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      difficulty: "easy",
      correct_option: "",
    },
  });

  const { handleSubmit, reset, control } = methods;

  const onAddQuestion = async (data: QuestionForm) => {
    if (currentIndex >= apiTotalQuestions) {
      toast.error("Maximum questions reached");
      return;
    }

    const updated = [...questions];
    updated[currentIndex] = data;

    setQuestions(updated);

    toast.success("Question Saved");

    const nextIndex = currentIndex + 1;
    if (nextIndex === apiTotalQuestions) {
      const payload = {
        questions: updated.map((q) => ({
          type: "mcq",
          subject: currentTest?.subject,
          test_id: testId!,

          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,

          correct_option: q.correct_option,

          explanation: q.explanation,
          difficulty: q.difficulty,
        })),
      };

      const result = await dispatch(bulkCreateQuestionsAsync(payload));

      if (bulkCreateQuestionsAsync.fulfilled.match(result)) {
        toast.success("All questions uploaded");
        setUploaded(true);
      } else {
        toast.error("Upload failed");
      }

      return;
    }

    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    if (questions[currentIndex]) {
      reset(questions[currentIndex]);
    } else {
      reset({
        difficulty: "easy",
        correct_option: "",
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        explanation: "",
        topic: "",
        sub_topic: "",
      });
    }
  }, [currentIndex, reset, questions]);

  useEffect(() => {
    if (currentTest) {
      methods.setValue("topic", currentTest.topics?.[0] || "");
      methods.setValue("sub_topic", currentTest.sub_topics?.[0] || "");
      methods.setValue("difficulty", currentTest.difficulty);

      setTotalQuestions(currentTest.total_questions || 0);
    }
  }, [currentTest, methods, setTotalQuestions]);

  useEffect(() => {
    if (testId) dispatch(fetchTestByIdAsync(testId!));
  }, [dispatch, testId]);

  if (getloading) {
    return <CircularLoader />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="text-gray-400">Test Creation</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-400">Create Test</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-400 font-medium">Chapter Wise</span>
        </div>

        <button
          onClick={() => navigate(`/tests/${testId}/publish`)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-6 py-2 rounded-md shadow-sm transition w-full sm:w-auto"
        >
          Publish
        </button>
      </div>

      <div className="rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 transition hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-4 capitalize">
              {currentTest?.type}
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {currentTest?.name}
              </h2>

              <span
                className={`
                  text-xs font-medium px-3 py-1 rounded-full capitalize
                  ${
                    currentTest?.difficulty === "easy"
                      ? "bg-green-50 text-green-600"
                      : currentTest?.difficulty === "medium"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-red-50 text-red-600"
                  }
                `}
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

          <div className="flex flex-col items-start sm:items-end gap-5">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiClock size={14} />
                {currentTest?.total_time} Min
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiBookOpen size={14} />
                {currentTest?.total_questions} Questions
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                <FiBarChart2 size={14} />
                {currentTest?.total_marks} Marks
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 font-medium text-gray-700 text-center sm:text-left">
        Question {Math.min(currentIndex + 1, apiTotalQuestions)} /{" "}
        {apiTotalQuestions}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onAddQuestion)} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Question</label>
            <textarea
              {...methods.register("question", {
                required: "Question is required",
                minLength: {
                  value: 10,
                  message: "Question must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Question cannot exceed 1000 characters",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Question cannot be empty",
              })}
              placeholder="Type here"
              className={`
                mt-2 w-full h-[140px] sm:h-[160px]
                border rounded-md p-3 text-sm
                focus:outline-none focus:border-indigo-400
                ${
                  methods.formState.errors.question
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200"
                }
              `}
            />
            {methods.formState.errors.question && (
              <p className="text-red-500 text-xs mt-1">
                {methods.formState.errors.question.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600">Type the options below</div>

            {(["option1", "option2", "option3", "option4"] as const).map(
              (opt, index) => (
                <div key={opt} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Controller
                      control={control}
                      name="correct_option"
                      rules={{
                        required: "Please select the correct answer",
                      }}
                      render={({ field }) => (
                        <input
                          type="radio"
                          value={opt}
                          checked={field.value === opt}
                          onChange={field.onChange}
                          className="accent-indigo-500 flex-shrink-0"
                        />
                      )}
                    />
                    <input
                      {...methods.register(opt, {
                        required: `Option ${index + 1} is required`,
                        minLength: {
                          value: 1,
                          message: `Option ${index + 1} cannot be empty`,
                        },
                        maxLength: {
                          value: 300,
                          message: `Option ${index + 1} is too long`,
                        },
                        validate: (value) =>
                          value.trim().length > 0 ||
                          `Option ${index + 1} cannot be empty`,
                      })}
                      placeholder={`Type Option ${index + 1}`}
                      className={`
                        flex-1 border rounded-md px-3 py-2 text-sm
                        ${
                          methods.formState.errors[opt]
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200"
                        }
                      `}
                    />
                  </div>

                  {methods.formState.errors[opt] && (
                    <p className="text-red-500 text-xs ml-8 sm:ml-6">
                      {methods.formState.errors[opt]?.message as string}
                    </p>
                  )}
                </div>
              ),
            )}

            {methods.formState.errors.correct_option && (
              <p className="text-red-500 text-xs mt-1">
                {methods.formState.errors.correct_option.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Add Solution</label>
            <textarea
              {...methods.register("explanation")}
              placeholder="Type here"
              className="
                mt-2 w-full h-[120px] sm:h-[140px]
                border border-gray-200
                rounded-md
                p-3 text-sm
              "
            />
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-600">
              Question settings
            </div>

            <select
              {...methods.register("difficulty")}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RHFAutocomplete
                name="topic"
                label="Topic"
                options={topicOptions}
                placeholder="Select Topic"
              />

              <RHFAutocomplete
                name="sub_topic"
                label="Sub Topic"
                options={subTopicOptions}
                placeholder="Select Sub Topic"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between pt-6 gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-md transition w-full sm:w-auto"
            >
              Exit Test Creation
            </button>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                type="button"
                className="text-indigo-500 hover:text-indigo-700 text-sm"
              >
                Save as Drafts
              </button>

              {!uploaded && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    flex items-center justify-center gap-2
                    bg-indigo-500 text-white px-6 py-2 rounded-md
                    transition w-full sm:w-auto
                    ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-indigo-600"
                    }
                  `}
                >
                  {loading ? (
                    <CircularLoader />
                  ) : currentIndex === totalQuestions - 1 ? (
                    "Upload"
                  ) : (
                    "Next"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
