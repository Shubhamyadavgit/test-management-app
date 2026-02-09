import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import api from "../../services/api";
import type { AuthState, LoginPayload, LoginResponse } from "../../types/Types";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", payload);

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return rejectWithValue(error.response?.data?.message ?? "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      loginAsync.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;

        const token = action.payload.data.token;

        const user = action.payload.data.user;

        state.token = token;
        state.user = user;
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(user));
      },
    );

    builder.addCase(loginAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Login failed";
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
