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
    standardPsalmodyPermission: false,
    kiahkPsalmodyPermission: false,
    paschaBookPermission: false,
    holyLiturgyPermission: false,
    timeTransition: new Date().setHours(18, 0, 0),
    pagination: false,
    isTablet: false,
    firstPurge: false,
    BishopIsPresent: false,
    ismorethan3BishopPresent: false,
    BishopsPresent: [],
    currentSeason: {
      key: "STANDARD",
      week: moment().week(),
      dayOfWeek: moment().day(),
      gregorianDayOfMonth: moment().date(),
      gregorianMonth: moment().month(),
      gregorianYear: moment().year(),
      isWatos: true,
      type: "regular",
      start: moment(),
      end: moment(),
      major: true,
      plantsSeason: "air",
      copticMonth: "",
      copticYear: "",
    },
    dioceseBishop: {
      key: "POPE",
      Arabic: "تاواضروس",
      Coptic: "Qe`odwrou",
      English: "Tawadros",
      Arabiccoptic: "تاواضروس",
      Englishcoptic: "Tawadros",
      dioceseArabic: "بابا وبطريرك ورئيس أساقفة المدينة العظمى الاسكندرية",
      dioceseEnglish:
        "Pope and Patriarch and Archbishop of the Great City of Alexandria",
      Rank: "Pope",
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
    setIsTablet: (state, action) => {
      const isTablet = action.payload.isTablet;
      return {
        ...state,
        isTablet: isTablet,
      };
    },
    changeBishopPresent: (state, action) => {
      return {
        ...state,
        BishopIsPresent: !state.BishopIsPresent,
      };
    },

    changeismorethan3BishopPresent: (state, action) => {
      return {
        ...state,
        ismorethan3BishopPresent: !state.ismorethan3BishopPresent,
      };
    },
    updateBishopsPresent: (state, action) => {
      const myBishopsPresent = action.payload.BishopsPresent;
      console.log(myBishopsPresent);
      return {
        ...state,
        BishopsPresent: myBishopsPresent,
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
    changePurge: (state, action) => {
      return {
        ...state,
        firstPurge: !state.firstPurge,
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
      const maxFont = 50;
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
    setdioceseBishop: (state, action) => {
      return {
        ...state,
        dioceseBishop: action.payload.dioceseBishop,
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
        case "holyLiturgyPermission":
          return {
            ...state,
            holyLiturgyPermission: true,
          };
      }
    },
  },
});
export const changeLanguage = settingsSlice.actions.changeLanguage;
export const changePurge = settingsSlice.actions.changePurge;
export const setTimeTransition = settingsSlice.actions.setTimeTransition;
export const changeDarkMode = settingsSlice.actions.changeDarkMode;
export const changeFontSize = settingsSlice.actions.changeFontSize;
export const changeTodayPrayer = settingsSlice.actions.changeTodayPrayer;
export const changeTextLanguage = settingsSlice.actions.changeTextLanguage;
export const setSeason = settingsSlice.actions.setSeason;
export const setItemPurchased = settingsSlice.actions.setItemPurchased;
export const changePagination = settingsSlice.actions.changePagination;
export const setIsTablet = settingsSlice.actions.setIsTablet;
export const setdioceseBishop = settingsSlice.actions.setdioceseBishop;
export const updateBishopsPresent = settingsSlice.actions.updateBishopsPresent;
export const changeBishopPresent = settingsSlice.actions.changeBishopPresent;
export const changeismorethan3BishopPresent =
  settingsSlice.actions.changeismorethan3BishopPresent;

export default settingsSlice.reducer;
