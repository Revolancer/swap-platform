import navToggle from "@/components/navigation/main/nav-toggle";
import auth from "@/lib/user/auth";
import { combineReducers } from "@reduxjs/toolkit";

const navigation = combineReducers({ toggle: navToggle });

export const rootReducer = combineReducers({
  navigation: navigation,
  auth: auth,
});
