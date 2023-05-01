import { RootState } from "@/redux/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "../axios";
import { AppState } from "../types";

const modulePrefix = "user";

const initialState: AppState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(window?.localStorage?.getItem("user") as string) || null
      : null,
  email: "",
  password: "",
  success: false,
  error: false,
};

export const login = createAsyncThunk(
  `${modulePrefix}/login`,
  async (_, { getState }) => {
    const state = getState() as RootState;

    const res = await axiosPublic.post("auth/login", {
      email: state.userData.email,
      password: state.userData.password,
    });

    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  `${modulePrefix}/deleteUser`,
  async (id: number, { getState }) => {
    const state = getState() as RootState;

    const res = await axiosPrivate.delete(`users/${id}`, {
      headers: { Authorization: `Bearer ${state.userData.user?.accessToken}` },
    });

    return res.data;
  }
);

export const refreshToken = createAsyncThunk(
  `${modulePrefix}/refreshToken`,
  async (_, { getState }) => {
    const state = getState() as RootState;

    const res = await axiosPublic.get(`auth/refresh`, {
      headers: {
        Authorization: `Bearer ${state.userData.user?.refreshToken}`,
      },
    });
    const newUser = res.data;

    return newUser;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    afterRegister(state, action: PayloadAction<AppState["user"]>) {
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("user", JSON.stringify(action.payload));
      }
      state.user = action.payload;
    },
    updateEmail(state, action: PayloadAction<AppState["email"]>) {
      state.email = action.payload;
    },
    updatePassword(state, action: PayloadAction<AppState["password"]>) {
      state.password = action.payload;
    },
    logout(state) {
      if (typeof window !== "undefined") {
        window?.localStorage.removeItem("user");
      }
      state.user = null;
      state.email = "";
      state.password = "";
      state.success = false;
      state.error = false;
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AppState["user"]>) => {
          if (typeof window !== "undefined") {
            window?.localStorage.setItem(
              "user",
              JSON.stringify(action.payload)
            );
          }
          state.user = action.payload;
        }
      )
      .addCase(deleteUser.pending, (state) => {
        state.success = false;
        state.error = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.error = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (typeof window !== "undefined") {
          window?.localStorage.setItem("user", JSON.stringify(action.payload));
        }
        state.user = action.payload as AppState["user"];
      });
  },
});

export const { updateEmail, updatePassword, logout, afterRegister } =
  userSlice.actions;
