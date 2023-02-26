import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    appLanguage: "eng",
    darkMode: false,
    textFontSize: 24,
    todayPrayer: true,
  },
  reducers: {
    changeLanguage: (state, action) => {
      const key = action.payload.appLanguage;

      return {
        ...state,
        appLanguage: key,
      };
    },
    changeDarkMode: (state, action) => {
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    },
    changeFontSize: (state, action) => {
      const minFont = 10;
      const maxFont = 40;
      const direction = action.payload.direction;
      let currentFontSize = state.textFontSize;
      switch (direction) {
        case "plus":
          if (currentFontSize < maxFont) {
            return {
              ...state,
              textFontSize: state.textFontSize + 2,
            };
          } else {
            return state;
          }

        case "minus":
          if (currentFontSize > minFont) {
            return {
              ...state,
              textFontSize: state.textFontSize - 2,
            };
          } else {
            return state;
          }

        default:
          return state;
      }
    },
    changeTodayPrayer: (state, action) => {
      return {
        ...state,
        todayPrayer: !state.todayPrayer,
      };
    },
  },
});
export const changeLanguage = settingsSlice.actions.changeLanguage;
export const changeDarkMode = settingsSlice.actions.changeDarkMode;
export const changeFontSize = settingsSlice.actions.changeFontSize;
export const changeTodayPrayer = settingsSlice.actions.changeTodayPrayer;
export default settingsSlice.reducer;
