import { createSlice } from "@reduxjs/toolkit";
import getData from "../../helpers/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Languages from "../../constants/languages";
import { CurrentSeason } from "../../models/currentSeason";
// const curTheme = ;

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    appLanguage: "eng",
    darkMode: false,
    textFontSize: 24,
    todayPrayer: true,
    english: true,
    coptic: true,
    arabic: true,
    copticenglish: false,
    copticarabic: false,
    currentSeason: {
      key: null,
      week: null,
      dayOfWeek: null,
      isWatos: null,
      isFast: null,
    },
  },
  reducers: {
    changeLanguage: (state, action) => {
      const key = action.payload.appLanguage;

      return {
        ...state,
        appLanguage: key,
        activeLang: Languages[key],
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
    changeTextLanguage: (state, action) => {
      const lang = action.payload.lang;
      const value = action.payload.value;

      switch (lang) {
        case "english":
          return {
            ...state,
            english: !state.english,
          };
        case "coptic":
          return {
            ...state,
            coptic: !state.coptic,
          };
        case "arabic":
          return {
            ...state,
            arabic: !state.arabic,
          };
        case "copticenglish":
          return {
            ...state,
            copticenglish: !state.copticenglish,
          };
        case "copticarabic":
          return {
            ...state,
            copticarabic: !state.copticarabic,
          };
        default:
          return state;
      }
    },
  },
});
export const changeLanguage = settingsSlice.actions.changeLanguage;
export const changeDarkMode = settingsSlice.actions.changeDarkMode;
export const changeFontSize = settingsSlice.actions.changeFontSize;
export const changeTodayPrayer = settingsSlice.actions.changeTodayPrayer;
export const changeTextLanguage = settingsSlice.actions.changeTextLanguage;

export default settingsSlice.reducer;
