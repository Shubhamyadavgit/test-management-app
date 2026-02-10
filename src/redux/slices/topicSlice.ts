import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export type Topic = {
  id: string;
  name: string;
  subject_id: string;
};

type TopicState = {
  topics: Topic[];
  loading: boolean;
};

const initialState: TopicState = {
  topics: [],
  loading: false,
};

export const fetchTopicsAsync = createAsyncThunk(
  "topics/fetch",
  async (subjectId: string) => {
    const response = await api.get(`/topics/subject/${subjectId}`);
    return response.data.data as Topic[];
  },
);

const topicSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTopicsAsync.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchTopicsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.topics = action.payload;
    });

    builder.addCase(fetchTopicsAsync.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default topicSlice.reducer;
