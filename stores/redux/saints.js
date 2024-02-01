import { createSlice } from "@reduxjs/toolkit";
import getData from "../../helpers/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Languages from "../../constants/languages";
import { CurrentSeason } from "../../models/currentSeason";
import moment from "moment";

const saintsSlice = createSlice({
  name: "saints",
  initialState: {
    ST_MARY: {
      versesofCymbals: true,
      doxologies: true,
      intercessions: true,
      actsResponse: true,
      gospelResponse: true,
    },
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
    ARCHANGEL_RAPHAEL: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    FOUR_INCORPOREAL_CREATURES: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    TWENTY_FOUR_PRIESTS: {
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
    ST_JOHN_BELOVED: {
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
    ST_THEODORE_SHOTEP: {
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
    APAKIR_AND_JOHN: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    COSMAN_AND_DEMIAN: {
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
    ST_BARBARA: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_JULIANA: {
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
    MACARIUS_GREAT: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ATHANASIUS_APOSTOLIC: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    MAXIMUS_DOMETIUS: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_PACHOMIOUS: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    ST_SHENOUDA_ARCHMANDRITE: {
      versesofCymbals: false,
      doxologies: false,
      intercessions: false,
      actsResponse: false,
      gospelResponse: false,
    },
    SAMUEL_CONFESSOR: {
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
      const { saint, object } = action.payload;
      // Use a dynamic key to update the state
      return {
        ...state,
        [saint]: object,
      };
    },
  },
});
export const changeSaint = saintsSlice.actions.changeSaint;

export default saintsSlice.reducer;
