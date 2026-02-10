import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { AxiosError } from "axios";
import type { CreateTestPayload, CreateTestResponse } from "../../types/test";

type ApiErrorResponse = {
  message?: string;
};

export type TestItem = {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  status: "draft" | "live";
  created_at: string;
};

type TestState = {
  loading: boolean;
  getloading: boolean;
  error: string | null;

  currentTest: CreateTestResponse | null;

  tests: TestItem[];
};

const initialState: TestState = {
  loading: false,
  getloading: false,
  error: null,
  currentTest: null,
  tests: [],
};

export const createTestAsync = createAsyncThunk<
  CreateTestResponse,
  CreateTestPayload,
  { rejectValue: string }
>("test/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{
      data: CreateTestResponse;
    }>("/tests", payload);

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to create test",
    );
  }
});

export const fetchTestByIdAsync = createAsyncThunk<
  CreateTestResponse,
  string,
  { rejectValue: string }
>("test/fetchById", async (testId, { rejectWithValue }) => {
  try {
    const response = await api.get<{
      data: CreateTestResponse;
    }>(`/tests/${testId}`);

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to fetch test",
    );
  }
});

export const fetchTestsAsync = createAsyncThunk<
  TestItem[],
  void,
  { rejectValue: string }
>("test/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{
      data: TestItem[];
    }>("/tests");

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to fetch tests",
    );
  }
});

export const publishTestAsync = createAsyncThunk<
  CreateTestResponse,
  string,
  { rejectValue: string }
>("test/publish", async (testId, { rejectWithValue }) => {
  try {
    const response = await api.put<{
      data: CreateTestResponse;
    }>(`/tests/${testId}`, {
      status: "live",
    });

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to publish test",
    );
  }
});

const testSlice = createSlice({
  name: "test",

  initialState,

  reducers: {
    clearCurrentTest(state) {
      state.currentTest = null;
      state.error = null;
      state.loading = false;
    },

    clearTests(state) {
      state.tests = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createTestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createTestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })

      .addCase(createTestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create test";
      })

      .addCase(fetchTestByIdAsync.pending, (state) => {
        state.getloading = true;
        state.error = null;
      })

      .addCase(fetchTestByIdAsync.fulfilled, (state, action) => {
        state.getloading = false;
        state.currentTest = action.payload;
      })

      .addCase(fetchTestByIdAsync.rejected, (state, action) => {
        state.getloading = false;
        state.error = action.payload ?? "Failed to fetch test";
      })

      .addCase(fetchTestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })

      .addCase(fetchTestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch tests";
      })

      .addCase(publishTestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(publishTestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;

        const index = state.tests.findIndex(
          (test) => test.id === action.payload.id,
        );

        if (index !== -1) {
          state.tests[index].status = "live";
        }
      })

      .addCase(publishTestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to publish test";
      });
  },
});

export const { clearCurrentTest, clearTests } = testSlice.actions;

export default testSlice.reducer;
