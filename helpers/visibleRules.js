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
const isSeason = (motherSource, path) => {
  return false;
};
const isStandard = (motherSource, path) => {
  return motherSource == "standardPsalmody" ? true : false;
};
const isKiahk = (motherSource, path) => {
  return motherSource == "kiahkPsalmody" ? true : false;
};
const isLenten = (motherSource, path) => {
  return motherSource == "lentenPsalmody" ? true : false;
};
const isStandardVespersPraises = (motherSource, path) => {
  return motherSource == "standardVespersPraises" ? true : false;
};
const isKiahkVespersPraises = (motherSource, path) => {
  return motherSource == "kiahkVespersPraises" ? true : false;
};
const isLentenVespersPraises = (motherSource, path) => {
  return motherSource == "lentenVespersPraises" ? true : false;
};
const isKiahkVespersPraisesExpositionWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  if (isKiahkVespersPraises) {
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

  if (isLentenVespersPraises) {
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
const VisibleRules = {
  TennavRule: TennavRule,
  SundayThetokiaWeekdaysPraisesRule: SundayThetokiaWeekdaysPraisesRule,
  0: true,
  TheotokiaVisible: TheotokiaVisible,
  isStandard: isStandard,
  isKiahk: isKiahk,
  isLenten: isLenten,
  isSeason: isSeason,
  isStandardVespersPraises: isStandardVespersPraises,
  isKiahkVespersPraises: isKiahkVespersPraises,
  isLentenVespersPraises: isLentenVespersPraises,
  isKiahkVespersPraisesExpositionWeek: isKiahkVespersPraisesExpositionWeek,
  isLentVespersPraisesExpositionWeek: isLentVespersPraisesExpositionWeek,
};
export default VisibleRules;
