import Colors from "../constants/colors";
import Languages from "../constants/languages";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export function getLanguageValue(key) {
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  return Languages[appLanguage][key];
}

export function getSeason() {
  return useSelector((state) => state.settings.currentSeason);
}

export function getFontSize() {
  return useSelector((state) => state.settings.textFontSize);
}

export function getColor(key) {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const activeColors = darkMode ? Colors["dark"] : Colors["light"];
  return activeColors[key];
}

const saintsSelector = (state) => state.saints;

export function getSaint(saint) {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  const saints = useSelector(saintsSelector);
  console.log(saint);
  const saintMapping = {
    ARCHANGEL_MICHAEL: saints.ARCHANGEL_MICHAEL,
    ARCHANGEL_GABRIEL: saints.ARCHANGEL_GABRIEL,
    ARCHANGEL_RAPHAEL: saints.ARCHANGEL_RAPHAEL,
    FOUR_INCORPOREAL_CREATURES: saints.FOUR_INCORPOREAL_CREATURES,
    TWENTY_FOUR_PRIESTS: saints.TWENTY_FOUR_PRIESTS,
    JOHN_THE_BAPTIST: saints.JOHN_THE_BAPTIST,
    ST_JOHN_BELOVED: saints.ST_JOHN_BELOVED,
    ST_MARK: saints.ST_MARK,
    ST_STEPHEN: saints.ST_STEPHEN,
    ST_GEORGE: saints.ST_GEORGE,
    ST_THEODORE_SHOTEP: saints.ST_THEODORE_SHOTEP,
    ST_PHILOPATER: saints.ST_PHILOPATER,
    ST_MINA: saints.ST_MINA,
    APAKIR_AND_JOHN: saints.APAKIR_AND_JOHN,
    COSMAN_AND_DEMIAN: saints.COSMAN_AND_DEMIAN,
    ST_ABANOUB: saints.ST_ABANOUB,
    ST_DEMIANA: saints.ST_DEMIANA,
    ST_MARINA: saints.ST_MARINA,
    ST_BARBARA: saints.ST_BARBARA,
    ST_JULIANA: saints.ST_JULIANA,
    ST_ANTHONY: saints.ST_ANTHONY,
    ST_PAULHERMIT: saints.ST_PAULHERMIT,
    ST_MOSES: saints.ST_MOSES,
    MACARIUS_GREAT: saints.MACARIUS_GREAT,
    ST_PISHOI: saints.ST_PISHOI,
    ATHANASIUS_APOSTOLIC: saints.ATHANASIUS_APOSTOLIC,
    MAXIMUS_DOMETIUS: saints.MAXIMUS_DOMETIUS,
    ST_PACHOMIOUS: saints.ST_PACHOMIOUS,
    ST_SHENOUDA_ARCHMANDRITE: saints.ST_SHENOUDA_ARCHMANDRITE,
    SAMUEL_CONFESSOR: saints.SAMUEL_CONFESSOR,
    ST_REWIS: saints.ST_REWIS,
    ST_JOHN_THE_SHORT: saints.ST_JOHN_THE_SHORT,
    ST_KARAS: saints.ST_KARAS,
    ST_KIROLLOS_SIXTH: saints.ST_KIROLLOS_SIXTH,
  };
  if (saint === "ST_THEODORE_SHOTEP") {
    console.log("HERasdadssadEEE");
    console.log(saintMapping[saint]);
  }
  return currentSeason.saintsOfThisDay.includes(saint)
    ? {
        versesofCymbals: true,
        doxologies: true,
        intercessions: true,
        actsResponse: true,
        gospelResponse: true,
      }
    : saintMapping[saint];
}
