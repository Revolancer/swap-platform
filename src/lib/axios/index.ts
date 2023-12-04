import store from '@/redux/store';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { logout, refreshToken } from '../user/auth';
import { setupCache } from 'axios-cache-interceptor';

export const axiosPublic = setupCache(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
  }),
);
export const axiosPrivate = setupCache(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
  }),
);

axiosPrivate.interceptors.request.use(
  async (config) => {
    const user = store?.getState()?.userData?.user;

    let currentDate = new Date();
    if (user?.accessToken) {
      const decodedRefreshToken: { exp: number } = jwtDecode(
        user?.refreshToken,
      );
      if (decodedRefreshToken.exp * 1000 < currentDate.getTime()) {
        store?.dispatch(logout());
        return config;
      }
      const decodedToken: { exp: number } = jwtDecode(user?.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await store?.dispatch(refreshToken());
      }
      if (config?.headers) {
        config.headers['Authorization'] = `Bearer ${store?.getState()?.userData
          ?.user?.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
