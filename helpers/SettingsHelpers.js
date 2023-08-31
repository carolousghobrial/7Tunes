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
  const saints = useSelector(saintsSelector);
  const saintMapping = {
    ARCHANGEL_MICHAEL: saints.ARCHANGEL_MICHAEL,
    ARCHANGEL_GABRIEL: saints.ARCHANGEL_GABRIEL,
    JOHN_THE_BAPTIST: saints.JOHN_THE_BAPTIST,
    ST_MARK: saints.ST_MARK,
    ST_STEPHEN: saints.ST_STEPHEN,
    ST_GEORGE: saints.ST_GEORGE,
    ST_PHILOPATER: saints.ST_PHILOPATER,
    ST_MINA: saints.ST_MINA,
    ST_ABANOUB: saints.ST_ABANOUB,
    ST_DEMIANA: saints.ST_DEMIANA,
    ST_MARINA: saints.ST_MARINA,
    ST_ANTHONY: saints.ST_ANTHONY,
    ST_PAULHERMIT: saints.ST_PAULHERMIT,
    ST_MOSES: saints.ST_MOSES,
    ST_PISHOI: saints.ST_PISHOI,
    ST_REWIS: saints.ST_REWIS,
    ST_JOHN_THE_SHORT: saints.ST_JOHN_THE_SHORT,
    ST_KARAS: saints.ST_KARAS,
    ST_KIROLLOS_SIXTH: saints.ST_KIROLLOS_SIXTH,
  };

  return saintMapping[saint];
}
