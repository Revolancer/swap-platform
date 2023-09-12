import navToggle from '@/components/navigation/main/nav-toggle';
import adminToggle from '@/components/navigation/main/admin-toggle';
import loadingToggle from '@/lib/loading';
import { userSlice } from '@/lib/user/auth';
import { combineReducers } from '@reduxjs/toolkit';

const navigation = combineReducers({ toggle: navToggle });
const admin = combineReducers({ toggle: adminToggle });
const loading = combineReducers({ toggle: loadingToggle });

export const rootReducer = combineReducers({
  navigation: navigation,
  admin: admin,
  loading: loading,
  userData: userSlice.reducer,
});
