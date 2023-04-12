import { createSlice } from "@reduxjs/toolkit";
import getData from "../../helpers/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Languages from "../../constants/languages";
import { CurrentSeason } from "../../models/currentSeason";
import moment from "moment";

const saintsSlice = createSlice({
  name: "saints",
  initialState: {
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
  },
  reducers: {
    changeSaint: (state, action) => {
      const saint = action.payload.saint;
      const object = action.payload.object;
      switch (saint) {
        case "ARCHANGEL_MICHAEL":
          return {
            ...state,
            ARCHANGEL_MICHAEL: object,
          };
          break;
        case "ARCHANGEL_GABRIEL":
          return {
            ...state,
            ARCHANGEL_GABRIEL: object,
          };
          break;
        case "JOHN_THE_BAPTIST":
          return {
            ...state,
            JOHN_THE_BAPTIST: object,
          };
          break;
        case "ST_MARK":
          return {
            ...state,
            ST_MARK: object,
          };
          break;
        case "ST_STEPHEN":
          return {
            ...state,
            ST_STEPHEN: object,
          };
          break;
        case "ST_GEORGE":
          return {
            ...state,
            ST_GEORGE: object,
          };
          break;
        case "ST_PHILOPATER":
          return {
            ...state,
            ST_PHILOPATER: object,
          };
          break;
        case "ST_MINA":
          return {
            ...state,
            ST_MINA: object,
          };
          break;
        case "ST_ABANOUB":
          return {
            ...state,
            ST_ABANOUB: object,
          };
          break;
        case "ST_DEMIANA":
          return {
            ...state,
            ST_DEMIANA: object,
          };
          break;
        case "ST_MARINA":
          return {
            ...state,
            ST_MARINA: object,
          };
          break;
        case "ST_ANTHONY":
          return {
            ...state,
            ST_ANTHONY: object,
          };
          break;
        case "ST_PAULHERMIT":
          return {
            ...state,
            ST_PAULHERMIT: object,
          };
          break;
        case "ST_MOSES":
          return {
            ...state,
            ST_MOSES: object,
          };
          break;
        case "ST_PISHOI":
          return {
            ...state,
            ST_PISHOI: object,
          };
          break;
        case "ST_REWIS":
          return {
            ...state,
            ST_REWIS: object,
          };
          break;
        case "ST_JOHN_THE_SHORT":
          return {
            ...state,
            ST_JOHN_THE_SHORT: object,
          };
          break;
        case "ST_KARAS":
          return {
            ...state,
            ST_KARAS: object,
          };
          break;
        case "ST_KIROLLOS_SIXTH":
          return {
            ...state,
            ST_KIROLLOS_SIXTH: object,
          };
          break;
      }
    },
  },
});
export const changeSaint = saintsSlice.actions.changeSaint;

export default saintsSlice.reducer;
