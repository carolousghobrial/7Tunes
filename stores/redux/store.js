import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settings";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});
