import moment from "moment";
import store from "../stores/redux/store.js";
import { useDispatch, useSelector } from "react-redux";
import { getSeason, getSaint } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";
import FeastEnum from "../models/FeastEnum.js";
import {
  getCurrentSeason,
  isInFast,
  getCopticFastsFeasts,
} from "../helpers/copticMonthsHelper.js";

const TennavRule = (motherSource, path) => {
  const fastsFeasts = getCopticFastsFeasts(moment().year());
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const { gregorianYear, gregorianMonth, gregorianDayOfMonth } = currentSeason;

  const Kiahk = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");
  const Resurrection = fastsFeasts.find(
    (element) => element.key === "RESURRECTION"
  );
  const PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");

  const startDate = new Date(
    gregorianYear,
    gregorianMonth,
    gregorianDayOfMonth,
    0,
    0,
    0,
    0
  );
  const today = moment(startDate);

  if (!todayPrayer) {
    return true;
  }

  if (today.isBetween(Resurrection.start, PENTECOST.start)) {
    return true;
  }

  if (
    today.isBetween(PENTECOST.start, Kiahk.start) &&
    currentSeason.dayOfWeek === 0
  ) {
    return true;
  }

  return false;
};

const SundayThetokiaWeekdaysPraisesRule = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  return todayPrayer && currentSeason.dayOfWeek !== 0;
};

const TheotokiaVisible = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const today = currentSeason.dayOfWeek;
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  const dayOfWeekToPath = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  if (todayPrayer) {
    return path?.includes(dayOfWeekToPath[today]);
  } else {
    return false;
  }
};

const isStandard = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  return currentSeason.type !== "feast" && motherSource === "praises";
};
const isStandardSeason = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "STANDARD":
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
      return true;
    default:
      return false;
  }
  return currentSeason.type !== "feast";
};

const isKiahk = (motherSource, path) => {
  return motherSource === "kiahkPsalmody" ? true : false;
};
const isLenten = (motherSource, path) => {
  return motherSource === "lentenPsalmody" ? true : false;
};
const IsLiturgy = (motherSource, path) => {
  return motherSource === "offertory" ? true : false;
};
const isStandardVespersPraises = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.type === "feast") {
    return false;
  }
  if (motherSource === "standardvesperspraises") {
    return true;
  }
  return false;
};
const isKiahkVespersPraises = (motherSource, path) => {
  return motherSource === "kiahkVespersPraises" ? true : false;
};
const isLentenVespersPraises = (motherSource, path) => {
  return motherSource === "lentenVespersPraises" ? true : false;
};
const isNOTVespersPraises = (motherSource, path) => {
  if (
    isLentenVespersPraises() ||
    isKiahkVespersPraises() ||
    isStandardVespersPraises()
  ) {
    return false;
  }
  return true;
};
const isSeason = (motherSource, path) => {
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (motherSource === "brightSaturdayMatins") {
    if (
      path === "DoxologiesMajorFeastsResurrection2" ||
      path === "TheotokiasSaturdayWatosConclusion"
    ) {
      return true;
    } else {
      return false;
    }
  }
  if (
    motherSource === "covenantThursdayMatins" ||
    motherSource === "ThursdayDayFirstHourMain"
  ) {
    return false;
  }
  if (todayPrayer) {
    switch (currentSeason.key) {
      case "COPTIC_NEW_YEAR":
        if (path.toLowerCase()?.includes("nayrooz")) {
          return true;
        }
        return false;
      case "FEAST_OF_CROSS":
      case "FEAST_OF_CROSS_3":
        if (path.toLowerCase()?.includes("cross")) {
          return true;
        }
        return false;
      case "NATIVITY":
        if (path.toLowerCase()?.includes("nativity")) {
          return true;
        }
        return false;
      case "EPIPHANY":
        if (path.toLowerCase()?.includes("theophany")) {
          return true;
        }
        return false;
      case "ANNUNCIATION":
        if (path.toLowerCase()?.includes("annunciation")) {
          return true;
        }
        return false;
      case "FEAST_OF_CIRCUMCISION":
        if (path.toLowerCase()?.includes("circumcision")) {
          return true;
        }
        return false;
      case "ENTRY_EGYPT":
        if (path.toLowerCase()?.includes("entryegypt")) {
          return true;
        }
        return false;
      case "WEDDING_CANA":
        if (path.toLowerCase()?.includes("weddingcana")) {
          return true;
        }
        return false;
      case "PRESENTATION_TEMPLE":
        if (path.toLowerCase()?.includes("presentationtemple")) {
          return true;
        }
        return false;
      case "TRANSFIGURATION":
        if (path.toLowerCase()?.includes("transfiguration")) {
          return true;
        }
        return false;
      case "NATIVITY_FAST":
        if (
          path.toLowerCase()?.includes("kiahk") &&
          currentSeason.copticMonth === "Koiahk"
        ) {
          return true;
        }
        return false;
      case "JONAH_FEAST":
        if (
          path.toLowerCase()?.includes("jonah") &&
          path.toLowerCase()?.includes("feast")
        ) {
          return true;
        }
        return false;
      case "JONAH_FAST":
        if (path.toLowerCase()?.includes("jonah")) {
          if (path.toLowerCase()?.includes("first")) {
            if (currentSeason.dayOfWeek === 1) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase()?.includes("second")) {
            if (currentSeason.dayOfWeek === 2) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase()?.includes("third")) {
            if (currentSeason.dayOfWeek === 3) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase()?.includes("feast")) {
            return false;
          }
          return true;
        }
        return false;
      case "GREAT_LENT":
        if (path.toLowerCase()?.includes("lent")) {
          if (path.toLowerCase()?.includes("weekend")) {
            if (
              currentSeason.dayOfWeek === 6 ||
              currentSeason.dayOfWeek === 7
            ) {
              return true;
            }
            return false;
          }
          return true;
        }
        return false;
      case "LAZARUS_SATURDAY":
        if (path.toLowerCase()?.includes("lazarus")) {
          return true;
        }
        return false;
      case "PALM_SUNDAY":
        if (path.toLowerCase()?.includes("palmsunday")) {
          if (path.toLowerCase()?.includes("matins")) {
            if (isMatins(motherSource, path)) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase()?.includes("vespers")) {
            if (isVespers(motherSource, path)) {
              return true;
            }
            return false;
          }
          return true;
        }
        return false;

      case "RESURRECTION":
        if (path.toLowerCase()?.includes("resurrection")) {
          return true;
        }
        return false;
      case "THOMAS_SUNDAY":
        if (
          path.toLowerCase()?.includes("resurrection") &&
          (path.toLowerCase()?.includes("doxologies") ||
            path.toLowerCase()?.includes("psali"))
        ) {
          return true;
        }
        if (path.toLowerCase()?.includes("thomas")) {
          return true;
        }
        return false;
      case "HOLY_50":
        if (path.toLowerCase()?.includes("resurrection")) {
          return true;
        }
        return false;
      case "ASCENSION":
        if (
          path.toLowerCase()?.includes("resurrection") &&
          path.toLowerCase()?.includes("doxologies")
        ) {
          return true;
        }
        if (
          path
            .toLowerCase()
            ?.includes("versesofcymbalsresurrectionarchangelmichael")
        ) {
          return true;
        }
        if (path.toLowerCase()?.includes("ascensionfeast")) {
          return true;
        }
        if (path.toLowerCase()?.includes("ascension")) {
          return true;
        }
        return false;
      case "ASCENSIONTOPENTECOST":
        if (
          path.toLowerCase()?.includes("resurrection") &&
          path.toLowerCase()?.includes("doxologies")
        ) {
          return true;
        }
        if (
          path
            .toLowerCase()
            ?.includes("versesofcymbalsresurrectionarchangelmichael")
        ) {
          return true;
        }
        if (path.toLowerCase()?.includes("ascensionperiod")) {
          return true;
        }
        if (path.toLowerCase()?.includes("ascension")) {
          return true;
        }
        return false;
      case "PENTECOST":
        if (
          path.toLowerCase()?.includes("resurrection") &&
          path.toLowerCase()?.includes("doxologies")
        ) {
          return true;
        }
        if (
          path
            .toLowerCase()
            ?.includes("versesofcymbalsresurrectionarchangelmichael")
        ) {
          return true;
        }
        if (path.toLowerCase()?.includes("pentecost")) {
          return true;
        }
        return false;
      case "FAST_OF_APOSTLES":
      case "FEAST_OF_APOSTLES":
        if (path.toLowerCase()?.includes("apostle")) {
          return true;
        }
        return false;
      case "FAST_STMARY":
      case "ASSUMPTION_STMARY":
        if (path.toLowerCase()?.includes("maryfast")) {
          return true;
        }
        return false;

      case FeastEnum.TWENTYNINTHTH_COPTIC_MONTH:
        if (path.toLowerCase().includes("cymbals")) {
          switch (path) {
            case "RaisingOfIncenseVersesOfCymbalsVersesofCymbalsTwentyNinth":
            case "RaisingOfIncenseVersesOfCymbalsVersesofCymbalsResurrectionArchangelMichael":
            case "RaisingOfIncenseVersesOfCymbalsArchangelGabriel":
              return true;
            default:
              return false;
          }
        } else if (
          path.toLowerCase().includes("psalmresponses") ||
          path.toLowerCase().includes("gospelresponses")
        ) {
          if (path?.toLowerCase().includes("twentyninth")) {
            console.log(path);
            return true;
          }
        } else if (
          path.toLowerCase()?.includes("nativity") ||
          path.toLowerCase()?.includes("annunciation") ||
          path.toLowerCase()?.includes("resurrection")
        ) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }
  return true;
};
const isInHolyFifties = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "RESURRECTION":
    case "THOMAS_SUNDAY":
    case "HOLY_50":
    case "ASCENSION":
    case "PENTECOST":
      return true;
    default:
      return false;
  }
};
const isNOTInHolyFifties = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "RESURRECTION":
    case "THOMAS_SUNDAY":
    case "HOLY_50":
    case "ASCENSION":
    case "PENTECOST":
      return false;
    default:
      return true;
  }
};
const isKiahkVespersPraisesExpositionWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  if (isKiahkVespersPraises()) {
    if (todayPrayer) {
      const { week } = currentSeason;
      const weekKeywords = ["first", "second", "third", "fourth"];

      // Check if path includes any of the weekKeywords based on the current week
      return weekKeywords.some(
        (keyword) =>
          path.toLowerCase()?.includes(keyword) &&
          path.toLowerCase()?.includes(week.toString())
      );
    } else {
      return true;
    }
  }

  return false;
};
const isLentVespersPraisesExpositionWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  if (isLentenVespersPraises()) {
    if (todayPrayer) {
      const { week } = currentSeason;
      const weekKeywords = [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
      ];

      // Check if path includes any of the weekKeywords based on the current week
      return weekKeywords.some(
        (keyword) =>
          path.toLowerCase()?.includes(keyword) &&
          path.toLowerCase()?.includes(week.toString())
      );
    } else {
      return true;
    }
  }

  return false;
};

const isMatins = (motherSource, path) => {
  return motherSource.toLowerCase()?.includes("matins") ? true : false;
};
const isVespers = (motherSource, path) => {
  return motherSource === "vespers" ? true : false;
};
const inRaisingOfIncense = (motherSource, path) => {
  return motherSource === "vespers" ||
    motherSource.toLowerCase()?.includes("matins")
    ? true
    : false;
};
const isCovenantThursday = (motherSource, path) => {
  return motherSource === "ThursdayDayFirstHourMain" ? true : false;
};
const isPraises = (motherSource, path) => {
  return motherSource === "praises" ? true : false;
};
const showLitanyOfDeparted = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.dayOfWeek === 6 && currentSeason.type === "regular") {
    return true;
  }
  return false;
};
const showLitanyOfTravelers = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.dayOfWeek !== 6 &&
    currentSeason.dayOfWeek !== 7 &&
    currentSeason.type !== "feast"
  ) {
    return true;
  }
  return false;
};
const isNotSaturday = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.dayOfWeek !== 6 || currentSeason.type === "feast") {
    return true;
  }
  return false;
};
const showLitanyOfOblations = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.dayOfWeek === 0 || currentSeason.type === "feast") {
    return true;
  }
  return false;
};
const isLentWeekdayOrJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "JONAH_FAST") {
    return true;
  }
  if (currentSeason.key === "GREAT_LENT") {
    if (currentSeason.dayOfWeek !== 6 && currentSeason.dayOfWeek !== 7) {
      return true;
    }
  }
  return false;
};
const isWatos = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (motherSource === "ThursdayDayFirstHourMain") {
    return true;
  }

  if (currentSeason.type === "feast") {
    return false;
  }

  if (motherSource === "vespers" && new Date().getDay() === 6) {
    return true;
  }

  // If any of the conditions is met, return true, otherwise, return false
  return (
    currentSeason.isWatos &&
    isNOTLentWeekdayOrJonah(motherSource, path) &&
    !isBigFeast(motherSource, path)
  );
};

const isAdam = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.type === "feast") {
    return false;
  }

  // If any of the conditions is not met, return false
  if (
    currentSeason.isWatos === true ||
    !isNOTLentWeekdayOrJonah(motherSource, path) ||
    isBigFeast(motherSource, path)
  ) {
    return false;
  }

  // Check specific conditions to determine if it is "Adam"
  if (
    (motherSource === "vespers" && currentSeason.dayOfWeek === 0) ||
    motherSource === "ThursdayDayFirstHourMain"
  ) {
    return false;
  }

  return true;
};
const isNOTLentWeekdayOrJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (motherSource === "ThursdayDayFirstHourMain") {
    return true;
  }
  if (currentSeason.key === "JONAH_FAST") {
    return false;
  }
  if (currentSeason.key === "GREAT_LENT") {
    if (currentSeason.dayOfWeek !== 6 && currentSeason.dayOfWeek !== 7) {
      return false;
    }
  }
  return true;
};
const showArchangelMichaelAndGabriel = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const { key, dayOfWeek } = currentSeason;

  if (motherSource === "ThursdayDayFirstHourMain") {
    return true;
  }

  const nonArchangelSeasons = [
    "JONAH_FAST",
    "HOLY_50",
    "ASCENSION",
    "PENTECOST",
    "RESURRECTION",
  ];
  if (nonArchangelSeasons?.includes(key)) {
    return false;
  }

  if (key === "GREAT_LENT" && dayOfWeek !== 6 && dayOfWeek !== 7) {
    return false;
  }

  return true;
};

const showVersesOfCymbalsFestiveConclusion = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.type === "feast") {
    return true;
  }
  return false;
};
const showGospelResponseFestiveConclusion = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.type === "feast" &&
    currentSeason.key !== "FEAST_OF_CROSS" &&
    currentSeason.key !== "FEAST_OF_CROSS_3" &&
    currentSeason.key !== "PALM_SUNDAY"
  ) {
    return true;
  }
  return false;
};
const isBigFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.key === "NATIVITY" ||
    currentSeason.key === "EPIPHANY" ||
    currentSeason.key === "RESURRECTION"
  ) {
    return true;
  }
  return false;
};
const isPalmSunday = (motherSource, path) => {
  return false;
};
const isCross = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.key === "FEAST_OF_CROSS" ||
    currentSeason.key === "FEAST_OF_CROSS_3"
  ) {
    return true;
  }
  return false;
};
const isHosanna = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.key === "FEAST_OF_CROSS" ||
    currentSeason.key === "FEAST_OF_CROSS_3" ||
    currentSeason.key === "PALM_SUNDAY"
  ) {
    return true;
  }
  return false;
};
const showHitenVOC = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (motherSource === "ThursdayDayFirstHourMain") {
    return true;
  }
  if (
    currentSeason.type === "feast" ||
    isLentWeekdayOrJonah(motherSource, path)
  ) {
    return false;
  }
  return true;
};
const showStandardVOCConclusion = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.type === "feast") {
    return false;
  }
  return true;
};
const notPalmSunday = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key !== "PALM_SUNDAY") {
    return true;
  }
  return false;
};
const isResurrectionFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "RESURRECTION") {
    return true;
  }
  return false;
};
const CreedHolyWeek = (motherSource, path) => {
  if (
    motherSource === "ThursdayDayFirstHourMain" ||
    motherSource.toLowerCase()?.includes("brightsaturday")
  ) {
    return false;
  }
  return true;
};
const CreedCrucified = (motherSource, path) => {
  return motherSource !== "ThursdayDayFirstHourMain" ? true : false;
};
const isTwelfthHourGoodFriday = (motherSource, path) => {
  return motherSource === "FridayDayTwelfthHourMain" ? true : false;
};
const isNOTTwelfthHourGoodFriday = (motherSource, path) => {
  return motherSource === "FridayDayTwelfthHourMain" ? false : true;
};
const BrightSaturday = (motherSource, path) => {
  return motherSource.toLowerCase()?.includes("brightsaturday") ? true : false;
};
const hide = (motherSource, path) => {
  return false;
};
const VOCSaint = (motherSource, path) => {
  const saintSelected = getSaint(path);

  if (isLentWeekdayOrJonah(motherSource, path)) {
    return false;
  }

  return saintSelected.versesofCymbals;
};
const DOXSaint = (motherSource, path) => {
  const saintSelected = getSaint(path);

  return saintSelected.doxologies;
};
const HitenSaint = (motherSource, path) => {
  const saintSelected = getSaint(path);

  return saintSelected.intercessions;
};
const ActsResponseSaint = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  console.log(path);
  const saintSelected = getSaint(path);
  switch (currentSeason.key) {
    case "STANDARD":
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
    case "FAST_STMARY":
      return saintSelected.actsResponse;
    default:
      return false;
  }
};
const GospelResponseSaint = (motherSource, path) => {
  const saintSelected = getSaint(path);
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "STANDARD":
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
      return saintSelected.gospelResponse;
    default:
      return false;
  }
};
const isApostlesFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  return currentSeason.key === "FEAST_OF_APOSTLES" ? true : false;
};
const stMaryActsResponse = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.type === "feast") {
    return false;
  }
  if (
    currentSeason.key === "GREAT_LENT" ||
    currentSeason.key === "JONAH_FAST"
  ) {
    return false;
  }
  return true;
};
const ArchangelGabrielShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const saintSelected = getSaint("ARCHANGEL_GABRIEL");

  if (currentSeason.copticMonth === "Koiahk") {
    return true;
  }
  if (
    currentSeason.key === FeastEnum.ANNUNCIATION ||
    currentSeason.key === FeastEnum.TWENTYNINTHTH_COPTIC_MONTH
  ) {
    return true;
  }
  if (path?.toLowerCase().includes("ActsResponse")) {
    return saintSelected.actsResponse;
  } else if (path?.toLowerCase().includes("Hitens")) {
    return saintSelected.intercessions;
  } else if (path?.toLowerCase().includes("VersesOfCymbals")) {
    return saintSelected.versesofCymbals;
  }
};
const JohnTheBaptistShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const saintSelected = getSaint("JOHN_THE_BAPTIST");
  if (currentSeason.copticMonth === "Koiahk") {
    if (path?.toLowerCase().includes("Doxologies")) {
      return true;
    } else if (path?.toLowerCase().includes("VersesOfCymbals")) {
      return true;
    }
    return false;
  }
  switch (currentSeason.key) {
    case FeastEnum.EPIPHANY:
    case FeastEnum.EPIPHANY_PARAMOUN:
    case FeastEnum.EPIPHANY_SECONDDAY:
      return true;
    default:
      if (path?.toLowerCase().includes("ActsResponse")) {
        return saintSelected.actsResponse;
      } else if (path?.toLowerCase().includes("Hitens")) {
        return saintSelected.intercessions;
      } else if (path?.toLowerCase().includes("VersesOfCymbals")) {
        return saintSelected.versesofCymbals;
      } else if (path?.toLowerCase().includes("Doxologies")) {
        return saintSelected.doxologies;
      }
      return false;
  }
};
const getPlantsSeason = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (path?.toLowerCase().includes(currentSeason.plantsSeason)) {
    return true;
  }
  return false;
};
const ISDioceseMetropolitain = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  if (dioceseBishop === undefined) {
    return false;
  }
  if (
    dioceseBishop?.Rank === "Metropolitan" &&
    (BishopIsPresent === true || motherSource.toLowerCase()?.includes("index"))
  ) {
    return true;
  }
  return false;
};
const ISDioceseMetropolitainAlways = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  if (dioceseBishop === undefined) {
    return false;
  }
  if (dioceseBishop?.Rank === "Metropolitan") {
    return true;
  }
  return false;
};
const ISDioceseBishop = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  if (dioceseBishop === undefined) {
    return false;
  }
  if (
    dioceseBishop?.Rank === "Bishop" &&
    (BishopIsPresent === true || motherSource.toLowerCase()?.includes("index"))
  ) {
    return true;
  }
  return false;
};
const ISDioceseBishopAlways = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  if (dioceseBishop === undefined) {
    return false;
  }
  if (dioceseBishop?.Rank === "Bishop") {
    return true;
  }
  return false;
};
const BishopIsPresent = (motherSource, path) => {
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  if (BishopIsPresent !== undefined && BishopIsPresent !== false) {
    return true;
  }
  return false;
};
const BishopIsNOTPresent = (motherSource, path) => {
  return !BishopIsPresent();
};
const Is3PlusBishops = (BishopsPresent, motherSource, path) => {
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return true;
  }

  return false;
};

const Is3PlusMetroBishops = (motherSource, path) => {
  const Is3PlusBishops = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const filteredMetro = BishopsPresent.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  );
  const filteredBishop = BishopsPresent.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  );
  if (
    filteredBishops?.length > 1 &&
    filteredMetro?.length > 1 &&
    Is3PlusBishops === true
  ) {
    return true;
  }
  return false;
};
const ISOneMetropolitain = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  if (
    BishopsPresent?.length > 0 &&
    BishopsPresent?.filter(
      (bishop) =>
        bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
    ).length > 0 &&
    BishopIsPresent()
  ) {
    return true;
  }
  return false;
};
const ISTwoMetropolitain = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const filteredBishops = BishopsPresent?.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  );
  if (filteredBishops?.length > 1 && BishopIsPresent()) {
    if (
      filteredBishops[0]?.Rank === "Metropolitan" &&
      filteredBishops[1]?.Rank === "Metropolitan"
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
const ISThreeMetropolitain = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const filteredBishops = BishopsPresent?.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  );
  if (
    filteredBishops?.length > 2 &&
    BishopIsPresent() &&
    filteredBishops?.some((bishop) => bishop.key !== dioceseBishop?.key)
  ) {
    if (
      filteredBishops[0]?.Rank === "Metropolitan" &&
      filteredBishops[1]?.Rank === "Metropolitan"
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
const ISOneBishop = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  if (
    BishopsPresent?.length > 0 &&
    BishopsPresent?.filter(
      (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
    ).length > 0 &&
    BishopIsPresent()
  ) {
    return true;
  }
  return false;
};
const ISTwoBishop = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const filteredBishops = BishopsPresent?.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  );
  if (filteredBishops?.length > 1 && BishopIsPresent === true) {
    if (
      filteredBishops[0].Rank === "Bishop" &&
      filteredBishops[1].Rank === "Bishop"
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
const ISThreeBishop = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);

  const filteredBishops = BishopsPresent?.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  );
  const are3PlusBishopsPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  if (are3PlusBishopsPresent) {
    return false;
  }
  if (
    filteredBishops?.length >= 3 &&
    BishopIsPresent &&
    !filteredBishops?.some((bishop) => bishop.key === dioceseBishop?.key)
  ) {
    // Check if there are at least 3 bishops present and if the diocese bishop is not one of them
    return true;
  }

  return false;
};

const IsDiocesePope = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  if (dioceseBishop === undefined) {
    return true;
  }
  if (dioceseBishop?.Rank === "Pope") {
    return true;
  }
  return false;
};
const IsDioceseNotPope = (motherSource, path) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  if (dioceseBishop === undefined) {
    return false;
  }
  if (
    dioceseBishop?.Rank != "Metropolitan" ||
    dioceseBishop?.Rank != "Bishop" ||
    BishopIsPresent === true
  ) {
    return true;
  }
  return false;
};
const IsNonFastingDays = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    (currentSeason.key === FeastEnum.FEAST_OF_CROSS ||
      currentSeason.key === FeastEnum.FEAST_OF_CROSS_3) &&
    path.toLowerCase().includes("taishori")
  ) {
    return false;
  }
  if (!isInFast() || currentSeason.type === "feast") {
    return true;
  } else {
    return false;
  }
};
const IsFastingDays = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    (currentSeason.key === FeastEnum.FEAST_OF_CROSS ||
      currentSeason.key === FeastEnum.FEAST_OF_CROSS_3) &&
    path.toLowerCase().includes("tishori")
  ) {
    return true;
  }
  if (
    currentSeason.key === "GREAT_LENT" &&
    (currentSeason.dayOfWeek === 0 || currentSeason.dayOfWeek === 6)
  ) {
    return true;
  } else {
    return false;
  }
  if (isInFast() && currentSeason.type !== "feast") {
    return true;
  } else {
    return false;
  }
};
const StandardAgiosShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY":
    case "NATIVITY_SECONDDAY":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
    case "EPIPHANY_PARAMOUN":
    case "EPIPHANY":
    case "EPIPHANY_SECONDDAY":
    case FeastEnum.RESURRECTION:
    case FeastEnum.HOLY_50:
    case FeastEnum.THOMAS_SUNDAY:
    case FeastEnum.ASCENSION:
    case FeastEnum.ASCENSIONTOPENTECOST:
    case FeastEnum.PENTECOST:
      return false;
    default:
      return true;
  }
};
const ShowSotees = (motherSource, path) => {
  if (
    BishopIsNOTPresent(motherSource, path) &&
    !isLentWeekdayOrJonah(motherSource, path)
  ) {
    return true;
  }
  return false;
};
const VisibleRules = {
  hide: hide,
  TennavRule: TennavRule,
  SundayThetokiaWeekdaysPraisesRule: SundayThetokiaWeekdaysPraisesRule,
  TheotokiaVisible: TheotokiaVisible,
  isStandard: isStandard,
  isStandardSeason: isStandardSeason,
  isKiahk: isKiahk,
  isLenten: isLenten,
  isSeason: isSeason,
  isStandardVespersPraises: isStandardVespersPraises,
  isKiahkVespersPraises: isKiahkVespersPraises,
  isLentenVespersPraises: isLentenVespersPraises,
  isNOTVespersPraises: isNOTVespersPraises,
  isKiahkVespersPraisesExpositionWeek: isKiahkVespersPraisesExpositionWeek,
  isLentVespersPraisesExpositionWeek: isLentVespersPraisesExpositionWeek,
  isInHolyFifties: isInHolyFifties,
  isNOTInHolyFifties: isNOTInHolyFifties,
  isMatins: isMatins,
  isVespers: isVespers,
  isPraises: isPraises,
  IsDiocesePope: IsDiocesePope,
  showLitanyOfDeparted: showLitanyOfDeparted,
  showLitanyOfTravelers: showLitanyOfTravelers,
  showLitanyOfOblations: showLitanyOfOblations,
  isLentWeekdayOrJonah: isLentWeekdayOrJonah,
  isNOTLentWeekdayOrJonah: isNOTLentWeekdayOrJonah,
  showArchangelMichaelAndGabriel: showArchangelMichaelAndGabriel,
  isWatos: isWatos,
  isAdam: isAdam,
  showVersesOfCymbalsFestiveConclusion: showVersesOfCymbalsFestiveConclusion,
  showGospelResponseFestiveConclusion: showGospelResponseFestiveConclusion,
  isBigFeast: isBigFeast,
  isPalmSunday: isPalmSunday,
  isCross: isCross,
  getPlantsSeason: getPlantsSeason,
  isHosanna: isHosanna,
  showHitenVOC: showHitenVOC,
  showStandardVOCConclusion: showStandardVOCConclusion,
  notPalmSunday: notPalmSunday,
  isCovenantThursday: isCovenantThursday,
  CreedHolyWeek: CreedHolyWeek,
  CreedCrucified: CreedCrucified,
  isTwelfthHourGoodFriday: isTwelfthHourGoodFriday,
  isNOTTwelfthHourGoodFriday: isNOTTwelfthHourGoodFriday,
  BrightSaturday: BrightSaturday,
  VOCSaint: VOCSaint,
  DOXSaint: DOXSaint,
  ActsResponseSaint: ActsResponseSaint,
  HitenSaint: HitenSaint,
  GospelResponseSaint: GospelResponseSaint,
  isApostlesFeast: isApostlesFeast,
  isNotSaturday: isNotSaturday,
  IsLiturgy: IsLiturgy,
  inRaisingOfIncense: inRaisingOfIncense,
  isResurrectionFeast: isResurrectionFeast,
  ISDioceseMetropolitain: ISDioceseMetropolitain,
  ISDioceseBishop: ISDioceseBishop,
  ISOneMetropolitain: ISOneMetropolitain,
  ISTwoMetropolitain: ISTwoMetropolitain,
  ISThreeMetropolitain: ISThreeMetropolitain,
  ISOneBishop: ISOneBishop,
  ISTwoBishop: ISTwoBishop,
  ISThreeBishop: ISThreeBishop,
  Is3PlusBishops: Is3PlusBishops,
  IsDioceseNotPope: IsDioceseNotPope,
  BishopIsPresent: BishopIsPresent,
  BishopIsNOTPresent: BishopIsNOTPresent,
  IsNonFastingDays: IsNonFastingDays,
  IsFastingDays: IsFastingDays,
  stMaryActsResponse: stMaryActsResponse,
  ArchangelGabrielShow: ArchangelGabrielShow,
  JohnTheBaptistShow: JohnTheBaptistShow,
  StandardAgiosShow: StandardAgiosShow,
  ISDioceseMetropolitainAlways: ISDioceseMetropolitainAlways,
  ISDioceseBishopAlways: ISDioceseBishopAlways,
  ShowSotees: ShowSotees,
};
export default VisibleRules;
