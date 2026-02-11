export type TestDifficulty = "easy" | "medium" | "hard";

export type TestType =
  | "chapterwise"
  | "pyq"
  | "mocktest"
  | "dailychallenge"
  | "uncategorised";

export type CreateTestPayload = {
  name: string;
  type: TestType;
  subject: string;

  topics: string[];
  sub_topics: string[];

  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;

  difficulty: TestDifficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;

  status: string | null;
};

export type CreateTestResponse = {
  id: string;
  name: string;
  subject: string;
  type: TestType;
  difficulty: TestDifficulty;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  topics: string[];
  sub_topics: string[];
  status: string | null;
  total_questions: number;
};

export type TestItem = {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  status: "draft" | "live";
  created_at: string;
};
