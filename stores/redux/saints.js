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
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ARCHANGEL_GABRIEL: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    JOHN_THE_BAPTIST: {
      versesofCymbals: true,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_MARK: {
      versesofCymbals: true,
      doxologies: true,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_STEPHEN: {
      versesofCymbals: true,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_GEORGE: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_PHILOPATER: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_MINA: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_ABANOUB: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_DEMIANA: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_MARINA: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_ANTHONY: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_PAULHERMIT: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_MOSES: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_PISHOI: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_REWIS: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_JOHN_THE_SHORT: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_KARAS: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_KIROLLOS_SIXTH: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
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
