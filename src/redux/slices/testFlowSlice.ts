import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateTestPayload } from "../../types/test";

export type QuestionDraft = {
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: string;
  media_url?: string;
};

type TestFlowState = {
  testDetails: CreateTestPayload | null;
  questions: QuestionDraft[];
};

const initialState: TestFlowState = {
  testDetails: null,
  questions: [],
};

const testFlowSlice = createSlice({
  name: "testFlow",
  initialState,
  reducers: {
    setTestDetails(state, action: PayloadAction<CreateTestPayload>) {
      state.testDetails = action.payload;
    },

    addQuestion(state, action: PayloadAction<QuestionDraft>) {
      state.questions.push(action.payload);
    },

    clearTestFlow(state) {
      state.testDetails = null;
      state.questions = [];
    },
  },
});

export const { setTestDetails, addQuestion, clearTestFlow } =
  testFlowSlice.actions;

export default testFlowSlice.reducer;
