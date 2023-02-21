import navToggle from "@/components/navigation/main/nav-toggle";
import { userSlice } from "@/lib/user/auth";
import { combineReducers } from "@reduxjs/toolkit";

const navigation = combineReducers({ toggle: navToggle });

export const rootReducer = combineReducers({
  navigation: navigation,
  userData: userSlice.reducer,
});
