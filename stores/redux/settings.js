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
    timeTransition: new Date().setHours(18, 0, 0),
    pagination: false,
    isTablet: false,
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
    saints: {
      ARCHANGEL_MICHAEL: {
        vos: true,
        doxologies: true,
      },
      ARCHANGEL_GABRIEL: {
        vos: false,
        doxologies: false,
      },
      JOHN_THE_BAPTIST: {
        vos: false,
        doxologies: false,
      },
      ST_MARK: {
        vos: false,
        doxologies: false,
      },
      ST_STEPHEN: {
        vos: false,
        doxologies: false,
      },
      ST_GEORGE: {
        vos: false,
        doxologies: false,
      },
      ST_PHILOPATER: {
        vos: false,
        doxologies: false,
      },
      ST_MINA: {
        vos: false,
        doxologies: false,
      },
      ST_ABANOUB: {
        vos: false,
        doxologies: false,
      },
      ST_DEMIANA: {
        vos: false,
        doxologies: false,
      },
      ST_MARINA: {
        vos: false,
        doxologies: false,
      },
      ST_ANTHONY: {
        vos: false,
        doxologies: false,
      },
      ST_PAULHERMIT: {
        vos: false,
        doxologies: false,
      },
      ST_MOSES: {
        vos: false,
        doxologies: false,
      },
      ST_PISHOI: {
        vos: false,
        doxologies: false,
      },
      ST_REWIS: {
        vos: false,
        doxologies: false,
      },
      ST_JOHN_THE_SHORT: {
        vos: false,
        doxologies: false,
      },
      ST_KARAS: {
        vos: false,
        doxologies: false,
      },
      ST_KIROLLOS_SIXTH: {
        vos: false,
        doxologies: false,
      },
      DEFAULT: {
        vos: false,
        doxologies: false,
      },
    },
  },
  reducers: {
    changeSaint: (state, action) => {
      const saint = action.payload.saint;
      const object = action.payload.object;
      switch (saint) {
        case "ARCHANGEL_MICHAEL":
          return {
            ...state,
            saints: {
              ...state.saints,
              ARCHANGEL_MICHAEL: object,
            },
          };

        case "ARCHANGEL_GABRIEL":
          return {
            ...state,
            saints: {
              ...state.saints,
              ARCHANGEL_GABRIEL: object,
            },
          };
        case "JOHN_THE_BAPTIST":
          return {
            ...state,
            saints: {
              ...state.saints,
              JOHN_THE_BAPTIST: object,
            },
          };
        case "ST_MARK":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_MARK: object,
            },
          };
        case "ST_STEPHEN":
          console.log(object);
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_STEPHEN: object,
            },
          };
        case "ST_GEORGE":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_GEORGE: object,
            },
          };
        case "ST_PHILOPATER":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_PHILOPATER: object,
            },
          };
        case "ST_MINA":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_MINA: object,
            },
          };
        case "ST_ABANOUB":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_ABANOUB: object,
            },
          };
        case "ST_DEMIANA":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_DEMIANA: object,
            },
          };
        case "ST_MARINA":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_MARINA: object,
            },
          };
        case "ST_ANTHONY":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_ANTHONY: object,
            },
          };
        case "ST_PAULHERMIT":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_PAULHERMIT: object,
            },
          };
        case "ST_MOSES":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_MOSES: object,
            },
          };
        case "ST_PISHOI":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_PISHOI: object,
            },
          };
        case "ST_REWIS":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_REWIS: object,
            },
          };
        case "ST_JOHN_THE_SHORT":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_JOHN_THE_SHORT: object,
            },
          };
        case "ST_KARAS":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_KARAS: object,
            },
          };
        case "ST_KIROLLOS_SIXTH":
          return {
            ...state,
            saints: {
              ...state.saints,
              ST_KIROLLOS_SIXTH: object,
            },
          };
      }
    },
    setTimeTransition: (state, action) => {
      const time = action.payload.timeTransition;
      return {
        ...state,
        timeTransition: time,
      };
    },
    setIsTablet: (state, action) => {
      const isTablet = action.payload.isTablet;
      console.log(isTablet);
      return {
        ...state,
        isTablet: isTablet,
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
export const setIsTablet = settingsSlice.actions.setIsTablet;
export const changeSaint = settingsSlice.actions.changeSaint;

export default settingsSlice.reducer;
