import { createSlice } from "@reduxjs/toolkit";
import getData from "../../helpers/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Languages from "../../constants/languages";
import { CurrentSeason } from "../../models/currentSeason";
import moment from "moment";

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
    standardPsalmodyPermission : false,
    kiahkPsalmodyPermission : false,
    paschaBookPermission : false,
    timeTransition: new Date().setHours(18, 0, 0),
    pagination: false,
    currentSeason: {
      key: "STANDARD",
      week: moment().week(),
      dayOfWeek: moment().day(),
      isWatos: true,
      type: "regular",
      start: moment(),
      end: moment(),
      major: true,
      plantsSeason: "air",
      copticMonth: "",
      xc: "",
      copticYear: "",
    },

  },
  reducers: {
    setTimeTransition: (state, action) => {
      const time = action.payload.timeTransition;
      return {
        ...state,
        timeTransition: time,
      };
    },
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
    changePagination: (state, action) => {
      return {
        ...state,
        pagination: !state.pagination,
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
    setSeason: (state, action) => {
      return {
        ...state,
        currentSeason: action.payload.currentSeason,
      };
    },
    setItemPurchased: (state, action) => {
      const permissionId = action.payload.permissionId;

      switch (permissionId) {
        case "standardPsalmodyPermission":
          return {
            ...state,
            standardPsalmodyPermission: true,
          };
        case "kiahkPsalmodyPermission":
          return {
            ...state,
            kiahkPsalmodyPermission: true,
          };
        case "paschaBookPermission":
          return {
            ...state,
            paschaBookPermission: true,
          };
      }

    },
  },
});
export const changeLanguage = settingsSlice.actions.changeLanguage;
export const setTimeTransition = settingsSlice.actions.setTimeTransition;
export const changeDarkMode = settingsSlice.actions.changeDarkMode;
export const changeFontSize = settingsSlice.actions.changeFontSize;
export const changeTodayPrayer = settingsSlice.actions.changeTodayPrayer;
export const changeTextLanguage = settingsSlice.actions.changeTextLanguage;
export const setSeason = settingsSlice.actions.setSeason;
export const setItemPurchased = settingsSlice.actions.setItemPurchased;
export const changePagination = settingsSlice.actions.changePagination;



export default settingsSlice.reducer;
