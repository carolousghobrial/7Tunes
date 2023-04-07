import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { getSeason } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";

import {
  getCurrentSeason,
  isInFast,
  getCopticFastsFeasts,
} from "../helpers/copticMonthsHelper.js";

const TennavRule = (motherSource, path) => {
  const fastsFeasts = getCopticFastsFeasts();
  const today = moment();
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  var Kiahk = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");
  var Resurrection = fastsFeasts.find(
    (element) => element.key === "RESURRECTION"
  );
  var PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
  if (todayPrayer) {
    if (today.isBetween(Resurrection.start, PENTECOST.start)) {
      return true;
    } else if (today.isBetween(PENTECOST.start, Kiahk.start)) {
      if (today.day() === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
};
const SundayThetokiaWeekdaysPraisesRule = (motherSource, path) => {
  const today = moment();

  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  if (todayPrayer) {
    if (today.day() != 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const TheotokiaVisible = (motherSource, path) => {
  const today = moment();
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  if (todayPrayer) {
    if (today.day() == 0 && path.includes("sunday")) {
      return true;
    } else if (today.day() == 1 && path.includes("monday")) {
      return true;
    } else if (today.day() == 2 && path.includes("tuesday")) {
      return true;
    } else if (today.day() == 3 && path.includes("wednesday")) {
      return true;
    } else if (today.day() == 4 && path.includes("thursday")) {
      return true;
    } else if (today.day() == 5 && path.includes("friday")) {
      return true;
    } else if (today.day() == 6 && path.includes("saturday")) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

const isStandard = (motherSource, path) => {
  return motherSource === "standardPsalmody" ? true : false;
};
const isKiahk = (motherSource, path) => {
  return motherSource === "kiahkPsalmody" ? true : false;
};
const isLenten = (motherSource, path) => {
  return motherSource === "lentenPsalmody" ? true : false;
};
const isStandardVespersPraises = (motherSource, path) => {
  return motherSource === "standardVespersPraises" ? true : false;
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
    return true;
  }
  return false;
};
const isSeason = (motherSource, path) => {
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if(motherSource === "brightSaturdayMatins" ){
    if(path === "DoxologiesMajorFeastsRessurection2" || path === "TheotokiasSaturdayWatosConclusion"){
      return true;
    }
    else{
      return false;
    }
  }
  if(motherSource == "covenantThursdayMatins"){
    return false;
  }
  if (todayPrayer) {
    switch (currentSeason.key) {
      case "COPTIC_NEW_YEAR":
        if (path.toLowerCase().includes("nayrooz")) {
          return true;
        }
        return false;
      case "FEAST_OF_CROSS":
      case "FEAST_OF_CROSS_3":
        if (path.toLowerCase().includes("cross")) {
          return true;
        }
        return false;
      case "NATIVITY":
        if (path.toLowerCase().includes("nativity")) {
          return true;
        }
        return false;
      case "EPIPHANY":
        if (path.toLowerCase().includes("theophany")) {
          return true;
        }
        return false;
      case "ANNUNCIATION":
        if (path.toLowerCase().includes("annunciation")) {
          console.log("HERE");
          return true;
        }
        return false;
      case "FEAST_OF_CIRCUMCISION":
        if (path.toLowerCase().includes("circumcision")) {
          return true;
        }
        return false;
      case "ENTRY_EGYPT":
        if (path.toLowerCase().includes("entryegypt")) {
          return true;
        }
        return false;
      case "WEDDING_CANA":
        if (path.toLowerCase().includes("weddingcana")) {
          return true;
        }
        return false;
      case "PRESENTATION_TEMPLE":
        if (path.toLowerCase().includes("presentationtemple")) {
          return true;
        }
        return false;
      case "TRANSFIGURATION":
        if (path.toLowerCase().includes("transfiguration")) {
          return true;
        }
        return false;
      case "NATIVITY_FAST":
        if (
          path.toLowerCase().includes("kiahk") &&
          currentSeason.copticMonth === "Koiahk"
        ) {
          return true;
        }
        return false;
      case "JONAH_FEAST":
        if (
          path.toLowerCase().includes("jonah") &&
          path.toLowerCase().includes("feast")
        ) {
          return true;
        }
        return false;
      case "JONAH_FAST":
        if (path.toLowerCase().includes("jonah")) {
          if (path.toLowerCase().includes("first")) {
            if (currentSeason.dayOfWeek === 1) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase().includes("second")) {
            if (currentSeason.dayOfWeek === 2) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase().includes("third")) {
            if (currentSeason.dayOfWeek === 3) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase().includes("feast")) {
            return false;
          }
          return true;
        }
        return false;
      case "GREAT_LENT":
        if (path.toLowerCase().includes("lent")) {
          if (path.toLowerCase().includes("weekend")) {
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
        if (path.Case().includes("lazarus")) {
          return true;
        }
        return false;
      case "PALM_SUNDAY":
        if (path.toLowerCase().includes("palmsunday")) {
          if (path.toLowerCase().includes("matins")) {
            if (isMatins(motherSource, path)) {
              return true;
            }
            return false;
          }
          if (path.toLowerCase().includes("vespers")) {
            if (isVespers(motherSource, path)) {
              return true;
            }
            return false;
          }
          return true;
        }
        return false;
      
      case "RESURRECTION":
      case "THOMAS_SUNDAY":
      case "HOLY_50":
        if (path.toLowerCase().includes("ressurection")) {
          return true;
        }
        return false;
      case "ASCENSION":
        if (path.toLowerCase().includes("ressurection") && path.toLowerCase().includes("doxologies")) {
          return true;
        }
        return false;
        if (path.toLowerCase().includes("ascensionfeast")) {
          return true;
        }
        return false;
      case "ASCENSIONTOPENTECOST":
        if (path.toLowerCase().includes("ressurection") && path.toLowerCase().includes("doxologies")) {
          return true;
        }
        if (path.toLowerCase().includes("ascensionperiod")) {
          return true;
        }
        return false;
      case "PENTECOST":
        if (path.toLowerCase().includes("ressurection") && path.toLowerCase().includes("doxologies")) {
          return true;
        }
        if (path.toLowerCase().includes("pentecost")) {
          return true;
        }
        return false;
      case "FAST_OF_APOSTLES":
      case "FEAST_OF_APOSTLES":
        if (path.toLowerCase().includes("apostle")) {
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
const isKiahkVespersPraisesExpositionWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  if (isKiahkVespersPraises()) {
    if (todayPrayer) {
      switch (currentSeason.week) {
        case 1:
          if (path.toLowerCase().includes("first")) {
            return true;
          }
          break;
        case 2:
          if (path.toLowerCase().includes("second")) {
            return true;
          }
          break;
        case 3:
          if (path.toLowerCase().includes("third")) {
            return true;
          }
          break;
        case 4:
          if (path.toLowerCase().includes("fourth")) {
            return true;
          }
          break;
      }
      return false;
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
      switch (currentSeason.week) {
        case 1:
          if (path.toLowerCase().includes("first")) {
            return true;
          }
          break;
        case 2:
          if (path.toLowerCase().includes("second")) {
            return true;
          }
          break;
        case 3:
          if (path.toLowerCase().includes("third")) {
            return true;
          }
          break;
        case 4:
          if (path.toLowerCase().includes("fourth")) {
            return true;
          }
          break;
        case 5:
          if (path.toLowerCase().includes("fifth")) {
            return true;
          }
          break;
        case 6:
          if (path.toLowerCase().includes("sixth")) {
            return true;
          }
          break;
      }
      return false;
    } else {
      return true;
    }
  }
  return false;
};
const isMatins = (motherSource, path) => {
  return motherSource.toLowerCase().includes("matins") ? true : false;
};
const isVespers = (motherSource, path) => {
  return motherSource === "vespers" ? true : false;
};
const isCovenantThursday = (motherSource, path) => {
  return motherSource === "ThursdayDayFirstHourMain" ? true : false;
};
const isPraises = (motherSource, path) => {
  return motherSource === "praises" ? true : false;
};
const showLitanyOfDeparted = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.dayOfWeek === 6 && currentSeason.type !== "regular") {
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
  if(motherSource === "ThursdayDayFirstHourMain"){
    return true;
  }
  if (
    currentSeason.isWatos &&
    isNOTLentWeekdayOrJonah(motherSource, path) &&
    !isBigFeast(motherSource, path)
  ) {
    return true;
  }

  return false;
};
const isAdam = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (
    currentSeason.isWatos === false &&
    isNOTLentWeekdayOrJonah(motherSource, path) &&
    !isBigFeast(motherSource, path)
  ) {
    return true;
  }

  return false;
};
const isNOTLentWeekdayOrJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if(motherSource === "ThursdayDayFirstHourMain"){
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
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "PALM_SUNDAY") {
    return true;
  }
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
  if(motherSource === "ThursdayDayFirstHourMain"){
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
const showEthrenHosVOC = (motherSource, path) => {
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
const CreedHolyWeek = (motherSource, path) => {
  return motherSource === "ThursdayDayFirstHourMain" ? true : false;
};
const isTwelfthHourGoodFriday = (motherSource, path) => {
  return motherSource === "FridayDayTwelfthHourMain" ? true : false;
};
const isNOTTwelfthHourGoodFriday = (motherSource, path) => {
  return motherSource === "FridayDayTwelfthHourMain" ? false : true;
};
const BrightSaturday = (motherSource, path) => {
  return motherSource.toLowerCase().includes("brightsaturday") ? true : false;
};
const hide = (motherSource, path) => {
  return true;
};
const VOCSaint = (motherSource, path) => {
  const saintSelected = useSelector((state) => state.saints[path]);

  if(motherSource === "ThursdayDayFirstHourMain"){
   return saintSelected.vos;
  }
  if (isLentWeekdayOrJonah(motherSource, path)) {
    return false;
  }

  return saintSelected.vos;
};
const DOXSaint = (motherSource, path) => {
  const saintSelected = useSelector((state) => state.saints[path]);

  return saintSelected.doxologies;
};
const isApostlesFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  return currentSeason.key === "FEAST_OF_APOSTLES" ? true : false;
};
const VisibleRules = {
  hide: hide,
  TennavRule: TennavRule,
  SundayThetokiaWeekdaysPraisesRule: SundayThetokiaWeekdaysPraisesRule,
  TheotokiaVisible: TheotokiaVisible,
  isStandard: isStandard,
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
  isMatins: isMatins,
  isVespers: isVespers,
  isPraises: isPraises,
  showLitanyOfDeparted: showLitanyOfDeparted,
  showLitanyOfTravelers: showLitanyOfTravelers,
  showLitanyOfOblations: showLitanyOfOblations,
  isLentWeekdayOrJonah: isLentWeekdayOrJonah,
  isNOTLentWeekdayOrJonah: isNOTLentWeekdayOrJonah,
  isWatos: isWatos,
  isAdam: isAdam,
  showVersesOfCymbalsFestiveConclusion: showVersesOfCymbalsFestiveConclusion,
  showGospelResponseFestiveConclusion: showGospelResponseFestiveConclusion,
  isBigFeast: isBigFeast,
  isPalmSunday: isPalmSunday,
  isCross: isCross,
  isHosanna: isHosanna,
  showHitenVOC: showHitenVOC,
  showEthrenHosVOC: showEthrenHosVOC,
  notPalmSunday: notPalmSunday,
  isCovenantThursday: isCovenantThursday,
  CreedHolyWeek: CreedHolyWeek,
  isTwelfthHourGoodFriday: isTwelfthHourGoodFriday,
  isNOTTwelfthHourGoodFriday: isNOTTwelfthHourGoodFriday,
  BrightSaturday: BrightSaturday,
  VOCSaint: VOCSaint,
  DOXSaint: DOXSaint,
  isApostlesFeast: isApostlesFeast,
};
export default VisibleRules;
