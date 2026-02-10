import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { AxiosError } from "axios";

export type Question = {
  id: string;
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
  test_id: string;
};

export type BulkCreateQuestionsPayload = {
  questions: Omit<Question, "id">[];
};

type ApiErrorResponse = {
  message?: string;
};

type QuestionState = {
  questions: Question[];
  loading: boolean;
  error: string | null;
};

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

export const bulkCreateQuestionsAsync = createAsyncThunk<
  Question[],
  BulkCreateQuestionsPayload,
  { rejectValue: string }
>("questions/bulkCreate", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{
      data: Question[];
    }>("/questions/bulk", payload);

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to create questions",
    );
  }
});

const questionSlice = createSlice({
  name: "questions",

  initialState,

  reducers: {
    clearQuestions(state) {
      state.questions = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(bulkCreateQuestionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(bulkCreateQuestionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })

      .addCase(bulkCreateQuestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create questions";
      });
  },
});

export const { clearQuestions } = questionSlice.actions;

export default questionSlice.reducer;
