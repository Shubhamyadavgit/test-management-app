import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export type Subject = {
  id: string;
  name: string;
};

type SubjectState = {
  subjects: Subject[];
  loading: boolean;
};

const initialState: SubjectState = {
  subjects: [],
  loading: false,
};

export const fetchSubjectsAsync = createAsyncThunk(
  "subjects/fetch",
  async () => {
    const response = await api.get("/subjects");
    return response.data.data as Subject[];
  },
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubjectsAsync.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSubjectsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.subjects = action.payload;
    });

    builder.addCase(fetchSubjectsAsync.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default subjectSlice.reducer;
