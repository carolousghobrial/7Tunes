import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settings";
import saintsReducer from "./saints";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["saints", "settings"], // specify which reducers to persist
};
const rootReducer = combineReducers({
  settings: settingsReducer,
  saints: saintsReducer,
  // add other reducers here
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    /* add any middleware here */
  ],
});

export const persistor = persistStore(store, null);
// In your app initialization logic or specific update/migration code
// Set the flag to 'true' when you want to trigger the purge
// This can be done during an app update or migration process
// Ensure to set it to 'true' only when needed
