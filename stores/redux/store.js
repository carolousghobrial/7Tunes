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
const rootReducer = combineReducers(persistConfig, {
  settings: settingsReducer,
  saints: saintsReducer,
  // add other reducers here
});

const persistedReducer = persistReducer(rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    /* add any middleware here */
  ],
});

export const persistor = persistStore(store);
