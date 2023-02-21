import store from "@/redux/store";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { refreshToken } from "../user/auth";

export const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});
export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const user = store?.getState()?.userData?.user;

    let currentDate = new Date();
    if (user?.accessToken) {
      const decodedToken: { exp: number } = jwt_decode(user?.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await store.dispatch(refreshToken());
      }
      if (config?.headers) {
        config.headers["Authorization"] = `Bearer ${
          store?.getState()?.userData?.user?.accessToken
        }`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
