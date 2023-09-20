import navToggle from '@/components/navigation/main/nav-toggle';
import adminToggle from '@/components/navigation/main/admin-toggle';
import { userSlice } from '@/lib/user/auth';
import { indicatorsSlice } from '@/lib/notifications';
import { combineReducers } from '@reduxjs/toolkit';

const navigation = combineReducers({ toggle: navToggle });
const admin = combineReducers({ toggle: adminToggle });

export const rootReducer = combineReducers({
  navigation: navigation,
  admin: admin,
  userData: userSlice.reducer,
  indicator: indicatorsSlice.reducer,
});
