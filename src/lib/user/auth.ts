import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "cookies-next";
import jwt_decode from "jwt-decode";

interface UserAuthState {
  authed: boolean;
  authtoken: string;
  refreshtoken: string;
  id?: string;
  expiry?: Date;
  refreshexpiry?: Date;
}

const authtoken = String(getCookie("rv-auth") ?? "");
const refreshtoken = String(getCookie("rv-auth-refresh") ?? "");
const authed = authtoken != "";

if (authed) {
  const unpacked = jwt_decode(authtoken);
  const expiry = new Date((unpacked as any).exp * 1000);
  const id = (unpacked as any).sub;
  const refreshunpacked = jwt_decode(refreshtoken);
  const refreshexpiry = new Date((refreshunpacked as any).exp * 1000);
}

const initialState = {
  authed,
  authtoken,
  refreshtoken,
} as UserAuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const tokenContent1 = jwt_decode(action.payload.access_token);
      state.id = (tokenContent1 as any).sub;
      state.expiry = (tokenContent1 as any).exp;
      state.authed = true;
      const tokenContent2 = jwt_decode(action.payload.refresh_token);
      state.refreshexpiry = (tokenContent2 as any).exp;
      setCookie("rv-auth-refresh", action.payload.refresh_token, {
        maxAge: 28 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      setCookie("rv-auth", action.payload.access_token, {
        maxAge: 60 * 60 * 1000,
        path: "/",
      });
      console.log(state);
    },
    logout() {
      setCookie("rv-auth-refresh", "", {
        maxAge: 28 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      setCookie("rv-auth", "", {
        maxAge: 60 * 60 * 1000,
        path: "/",
      });
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
