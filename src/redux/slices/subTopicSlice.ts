import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export type SubTopic = {
  id: string;
  name: string;
  topic_id: string;
};

type FetchSubTopicsResponse = {
  success: boolean;
  data: SubTopic[];
};

type SubTopicState = {
  subTopics: SubTopic[];
  loading: boolean;
  error: string | null;
};

const initialState: SubTopicState = {
  subTopics: [],
  loading: false,
  error: null,
};

export const fetchSubTopicsAsync = createAsyncThunk<
  SubTopic[],
  string[],
  { rejectValue: string }
>(
  "subTopics/fetchMultiTopics",

  async (topicIds, { rejectWithValue }) => {
    try {
      const response = await api.post<FetchSubTopicsResponse>(
        "/sub-topics/multi-topics",
        { topicIds },
      );

      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch subtopics";

      return rejectWithValue(message);
    }
  },
);

const subTopicSlice = createSlice({
  name: "subTopics",

  initialState,

  reducers: {
    clearSubTopics(state) {
      state.subTopics = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSubTopicsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchSubTopicsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.subTopics = action.payload;
    });

    builder.addCase(fetchSubTopicsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Failed to fetch subtopics";
    });
  },
});

export const { clearSubTopics } = subTopicSlice.actions;
export default subTopicSlice.reducer;
