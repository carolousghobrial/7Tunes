import Colors from "../constants/colors";
import Languages from "../constants/languages";
import { useDispatch, useSelector } from "react-redux";

export function getLanguageValue(key) {
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  return Languages[appLanguage][key];
}
export function getSeason() {
  const season = useSelector((state) => state.settings.currentSeason);
  return season;
}
export function getFontSize() {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  return fontSize;
}
export function getColor(key) {
  const darkMode = useSelector((state) => state.settings.darkMode);
  var activeColors = darkMode === false ? Colors["light"] : Colors["dark"];

  return activeColors[key];
}
export function getSaint(saint) {
  const saints = useSelector((state) => state.settings);
  switch (saint) {
    case "ARCHANGEL_MICHAEL":
      return saints.ARCHANGEL_MICHAEL;

    case "ARCHANGEL_GABRIEL":
      return saints.ARCHANGEL_GABRIEL;

    case "JOHN_THE_BAPTIST":
      return saints.JOHN_THE_BAPTIST;

    case "ST_MARK":
      return saints.ST_MARK;

    case "ST_STEPHEN":
      return saints.ST_STEPHEN;

    case "ST_GEORGE":
      return saints.ST_GEORGE;

    case "ST_PHILOPATER":
      return saints.ST_PHILOPATER;

    case "ST_MINA":
      return saints.ST_MINA;

    case "ST_ABANOUB":
      return saints.ST_ABANOUB;

    case "ST_DEMIANA":
      return saints.ST_DEMIANA;

    case "ST_MARINA":
      return saints.ST_MARINA;

    case "ST_ANTHONY":
      return saints.ST_ANTHONY;

    case "ST_PAULHERMIT":
      return saints.ST_PAULHERMIT;

    case "ST_MOSES":
      return saints.ST_MOSES;

    case "ST_PISHOI":
      return saints.ST_PISHOI;

    case "ST_REWIS":
      return saints.ST_REWIS;

    case "ST_JOHN_THE_SHORT":
      return saints.ST_JOHN_THE_SHORT;

    case "ST_KARAS":
      return saints.ST_KARAS;

    case "ST_KIROLLOS_SIXTH":
      return saints.ST_KIROLLOS_SIXTH;
    default:
      return saints.DEFAULT;
  }
}
