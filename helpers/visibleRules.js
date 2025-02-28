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
import {
  getCopticDateString,
  getCopticDate,
  getParamounDate,
} from "../helpers/copticMonthsHelper";
import {
  TakeFromHathorTwo,
  GetTodaysReadingPath,
} from "../viewModel/getFullViewModel.js";
const bishopsList = require("../assets/json/bishopsList.json");
import bookPaths from "../helpers/bookPathsHelpers";

const TennavRule = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const fastsFeasts = getCopticFastsFeasts(currentSeason.gregorianYear);

  const KIAHK = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");

  const PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
  switch (currentSeason.key) {
    case "HOLY_50":
    case "RESURRECTION":
    case "ASCENSION":
    case "ASCENSIONTOPENTECOST":
    case "PENTECOST":
      return true;
    case "NATIVITY_FAST":
      if (
        currentSeason.copticMonth === "Koiahk" ||
        TakeFromHathor(currentSeason)
      ) {
        return false;
      }

      if (currentSeason.dayOfWeek === 0) {
        return true;
      }

      // Default case
      return false;

    default:
      const date = moment(currentSeason.fullgregorianDate);
      const isBetweenPentecostAndKiahk = date.isBetween(
        PENTECOST.start,
        KIAHK.start
      );
      const isSunday = date.day() === 0;

      if (isBetweenPentecostAndKiahk && isSunday) {
        return true;
      } else {
        return false;
      }
  }
};
const NativityFeastAndFast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  switch (currentSeason.key) {
    case "NATIVITY_FAST":
    case "NATIVITY":
    case "NATIVITY_SECONDDAY":
    case "NATIVITY_PERIOD":
      return true;

    default:
      return false;
  }
};

const SundayThetokiaWeekdaysPraisesRule = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  return todayPrayer && currentSeason.dayOfWeek !== 0;
};

const TheotokiaVisible = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const timeOfDay = moment().hour();

  const today = currentSeason.dayOfWeek;
  const yesterday = today === 0 ? 6 : today - 1;

  const dayOfWeekToPath = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const isVespersPraises = motherSource
    ?.toLowerCase()
    .includes("vesperspraises");

  if (isVespersPraises) {
    const selectedDay =
      timeOfDay < new Date(timeTransition).getHours() ? today : yesterday;
    return path?.includes(dayOfWeekToPath[selectedDay]);
  }

  return path?.includes(dayOfWeekToPath[today]);
};

const isStandard = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  return currentSeason.type !== "feast" && motherSource === "praises";
};
const isStandardSeasonWithStMary = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "STANDARD":
      return true;

    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
      if (motherSource === "distribution") {
        return false;
      } else {
        return true;
      }

    case FeastEnum.FAST_STMARY:
    case FeastEnum.ASSUMPTION_STMARY:
      return true;
    case "NATIVITY_FAST":
      if (
        currentSeason.copticMonth !== "Koiahk" &&
        !TakeFromHathor(currentSeason)
      ) {
        return true;
      }
      return false;
    default:
      return false;
  }
  return currentSeason.type !== "feast";
};
const FeastsAndFastsOfStMary = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  switch (currentSeason.key) {
    case FeastEnum.FAST_STMARY:
    case FeastEnum.ASSUMPTION_STMARY:
      if (path?.toLowerCase()?.includes(motherSource)) {
        return true;
      }
      return false;
    case "STANDARD":
      if (currentSeason.saintsOfThisDay.includes("ST_MARY")) {
        if (path?.toLowerCase()?.includes(motherSource)) {
          return true;
        }
        return false;
      }
    default:
      return false;
  }
};
const isLordsFeasts = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  switch (currentSeason.key) {
    case "FEAST_OF_CIRCUMCISION":
    case "WEDDING_CANA":
    case "PRESENTATION_TEMPLE":
    case "ANNUNCIATION":
    case "ENTRY_EGYPT":
    case "TRANSFIGURATION":
    case "TWENTYNINTHTH_COPTIC_MONTH":
      return true;

    default:
      return false;
  }
};
const isFirstMondayOrLastFridayOfLent = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "GREAT_LENT") {
    if (currentSeason.dayOfWeek === 1 && currentSeason.week === 1) {
      return true;
    } else if (currentSeason.dayOfWeek === 5 && currentSeason.week === 7) {
      return true;
    }
  }
  return false;
};
const FeastsAndFastsOfStMaryAndHeavenlies = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (FeastsAndFastsOfStMary(motherSource, path)) {
    return true;
  }
  switch (currentSeason.saintsOfThisDay) {
    case "ARCHANGEL_MICHAEL":
    case "ARCHANGEL_GABRIEL":
    case "ARCHANGEL_RAPHAEL":
    case "FOUR_INCORPOREAL_CREATURES":
    case "TWENTY_FOUR_PRIESTS":
      return true;
    default:
      return false;
  }
};
const AlleluiaStandard = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.type) {
    case "feast":
      return false;
    default:
      return true;
  }
  return currentSeason.type !== "feast";
};
const StandardROIConclusion = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "PALM_SUNDAY":
    case "NATIVITY":
    case "NATIVITY_SECONDDAY":
    case "NATIVITY_PERIOD":
      return false;
    default:
      return true;
  }
  return currentSeason.type !== "feast";
};
const isStandardSeason = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "STANDARD":
      if (currentSeason.saintsOfThisDay.includes("ST_MARY")) {
        return false;
      }
      return true;
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
      return true;
    case "NATIVITY_FAST":
      if (
        currentSeason.copticMonth !== "Koiahk" &&
        !TakeFromHathor(currentSeason)
      ) {
        return true;
      }
      return false;
    default:
      return false;
  }
  return currentSeason.type !== "feast";
};
const isStandardFraction = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (FeastsAndFastsOfStMaryAndHeavenlies(motherSource, path)) {
    return false;
  }
  switch (currentSeason.key) {
    case "STANDARD":
    case "COPTIC_NEW_YEAR":
      return true;
    default:
      return false;
  }
};

const isKiahk = (motherSource, path) => {
  return motherSource === "kiahkPsalmody" ? true : false;
};
const isLenten = (motherSource, path) => {
  return motherSource === "lentenPsalmody" ? true : false;
};
const IsLiturgy = (motherSource, path) => {
  return motherSource === "offertory" ||
    motherSource === "offertoryCovenantThursday"
    ? true
    : false;
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
const isKiahkSeason = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return false;
  }
  if (
    (currentSeason.key === "NATIVITY_FAST" &&
      currentSeason.copticMonth === "Koiahk") ||
    TakeFromHathor(currentSeason)
  ) {
    return true;
  }

  return false;
};
const isSeason = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const lowerPath = path?.toLowerCase();
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
  switch (currentSeason.key) {
    case "COPTIC_NEW_YEAR":
      if (lowerPath?.includes("nayrooz")) {
        return true;
      }
      return false;
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
      if (lowerPath?.includes("cross")) {
        return true;
      }
      return false;
    case "NATIVITY_PARAMOUN":
      if (lowerPath?.includes("nativity") && lowerPath?.includes("paramoun")) {
        return true;
      }
      if (
        lowerPath?.includes("nativity") &&
        lowerPath?.includes("agiosnativity")
      ) {
        return true;
      }

      return false;
    case "NATIVITY":
    case "NATIVITY_SECONDDAY":
    case "NATIVITY_PERIOD":
      if (lowerPath?.includes("nativity") && !lowerPath?.includes("paramoun")) {
        return true;
      }
      return false;
    case "EPIPHANY_PARAMOUN":
      const conditions = [
        ["theophany", "fraction"],
        ["theophany", "agiostheophany"],
        ["theophany", "paramoun"],
      ];

      return conditions.some((keywords) =>
        keywords.every((keyword) => lowerPath?.includes(keyword))
      );
    case "EPIPHANY":
    case "EPIPHANY_SECONDDAY":
      if (
        lowerPath?.includes("theophany") &&
        !lowerPath?.includes("paramoun")
      ) {
        return true;
      }
      return false;
    case "ANNUNCIATION":
      if (lowerPath?.includes("annunciation")) {
        return true;
      }
      return false;
    case "FEAST_OF_CIRCUMCISION":
      if (lowerPath?.includes("circumcision")) {
        return true;
      }
      return false;
    case "ENTRY_EGYPT":
      if (lowerPath?.includes("entryegypt")) {
        return true;
      }
      return false;
    case "WEDDING_CANA":
      if (lowerPath?.includes("weddingcana")) {
        return true;
      }
      return false;
    case "PRESENTATION_TEMPLE":
      if (lowerPath?.includes("presentationtemple")) {
        return true;
      }
      return false;
    case "TRANSFIGURATION":
      if (lowerPath?.includes("transfiguration")) {
        return true;
      }
      return false;
    case "NATIVITY_FAST":
      if (
        lowerPath?.includes("kiahk") &&
        (currentSeason.copticMonth === "Koiahk" ||
          TakeFromHathor(currentSeason))
      ) {
        return true;
      }

      return false;
    case "JONAH_FEAST":
      if (lowerPath?.includes("jonah") && lowerPath?.includes("feast")) {
        return true;
      }
      return false;
    case "JONAH_FAST":
      if (lowerPath?.includes("jonah")) {
        if (lowerPath?.includes("first")) {
          if (currentSeason.dayOfWeek === 1) {
            return true;
          }
          return false;
        }
        if (lowerPath?.includes("second")) {
          if (currentSeason.dayOfWeek === 2) {
            return true;
          }
          return false;
        }
        if (lowerPath?.includes("third")) {
          if (currentSeason.dayOfWeek === 3) {
            return true;
          }
          return false;
        }
        if (lowerPath?.includes("feast")) {
          return false;
        }
        return true;
      }
      return false;
    case "GREAT_LENT":
      if (lowerPath?.includes("lent")) {
        if (isFirstMondayOrLastFridayOfLent(motherSource, path)) {
          if (lowerPath?.includes("weekend")) return true;
        }
        if (lowerPath?.includes("weekend")) {
          if (currentSeason.dayOfWeek === 6 || currentSeason.dayOfWeek === 0) {
            return true;
          }
          return false;
        } else if (lowerPath?.includes("weekday")) {
          if (currentSeason.dayOfWeek > 0 && currentSeason.dayOfWeek < 6) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    case "LAZARUS_SATURDAY":
      if (lowerPath?.includes("lazarus")) {
        return true;
      }
      return false;
    case "PALM_SUNDAY":
      if (lowerPath?.includes("palmsunday")) {
        if (lowerPath?.includes("matins")) {
          if (isMatins(motherSource, path)) {
            return true;
          }
          return false;
        }
        if (lowerPath?.includes("vespers")) {
          if (isVespers(motherSource, path)) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;

    case "RESURRECTION":
      if (lowerPath?.includes("resurrection")) {
        return true;
      }
      return false;
    case "THOMAS_SUNDAY":
      if (
        lowerPath?.includes("resurrection") &&
        (lowerPath?.includes("doxologies") || lowerPath?.includes("psali"))
      ) {
        return true;
      }
      if (lowerPath?.includes("thomas")) {
        return true;
      }
      return false;
    case "HOLY_50":
      if (lowerPath?.includes("resurrection")) {
        return true;
      }
      return false;
    case "ASCENSION":
      if (
        lowerPath?.includes("resurrection") &&
        lowerPath?.includes("doxologies")
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
      if (
        path
          .toLowerCase()
          ?.includes(
            "LiturgyLiturgyOfTheWordSeasonalHymnsResurrectionKhristosAnesty"
          )
      ) {
        return true;
      }
      if (lowerPath?.includes("ascensionfeast")) {
        return true;
      }
      if (lowerPath?.includes("ascension")) {
        return true;
      }
      return false;
    case "ASCENSIONTOPENTECOST":
      if (
        lowerPath?.includes("resurrection") &&
        lowerPath?.includes("doxologies")
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
      if (lowerPath?.includes("ascensionperiod")) {
        return true;
      }
      if (lowerPath?.includes("ascension")) {
        return true;
      }
      return false;
    case "PENTECOST":
      if (
        lowerPath?.includes("resurrection") &&
        lowerPath?.includes("doxologies")
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
      if (lowerPath?.includes("pentecost")) {
        return true;
      }
      return false;
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
      if (
        lowerPath?.includes("apostle") ||
        lowerPath?.includes("apostlesfast")
      ) {
        return true;
      }

      return false;
    case "FAST_STMARY":
    case "ASSUMPTION_STMARY":
      if (lowerPath?.includes("maryfast")) {
        return true;
      }
      return false;

    case FeastEnum.TWENTYNINTHTH_COPTIC_MONTH:
      if (lowerPath.includes("cymbals")) {
        switch (path) {
          case "RaisingOfIncenseVersesOfCymbalsVersesofCymbalsTwentyNinth":
          case "RaisingOfIncenseVersesOfCymbalsVersesofCymbalsResurrectionArchangelMichael":
          case "RaisingOfIncenseVersesOfCymbalsArchangelGabriel":
            return true;
          default:
            return false;
        }
      } else if (
        lowerPath.includes("psalmresponses") ||
        lowerPath.includes("gospelresponses")
      ) {
        if (path?.toLowerCase().includes("twentyninth")) {
          return true;
        }
      } else if (path === "LiturgyDistributionPsalm15029thCopticMonth") {
        return true;
      } else if (
        ((lowerPath.includes("nativity") && !lowerPath.includes("paramoun")) ||
          lowerPath.includes("annunciation") ||
          lowerPath.includes("resurrection")) &&
        !motherSource.includes("kiahk") &&
        (lowerPath.includes("hitens") ||
          lowerPath.includes("actsresponse") ||
          lowerPath.includes("doxologies") ||
          lowerPath.includes("melodies"))
      ) {
        return true;
      }
      return false;
    default:
      return false;
  }
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
const isKiahkWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const isHathorMonth = currentSeason.copticMonth === "Hathor";
  const isKoiahkMonth = currentSeason.copticMonth === "Koiahk";
  const isWeek1to4 =
    currentSeason.weekOfMonth >= 1 && currentSeason.weekOfMonth <= 4;
  const isWeek5 = currentSeason.weekOfMonth === 5;
  const isTakeFromHathor = TakeFromHathorTwo(currentSeason);
  const lowerPath = path?.toLowerCase();
  switch (currentSeason.key) {
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return false;
  }
  if (isKoiahkMonth) {
    return lowerPath.includes(currentSeason.weekOfMonth);
  }

  return false;
};
const isWeekOfLent = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  return (
    path?.toLowerCase().includes(currentSeason.week) &&
    currentSeason.key === "GREAT_LENT"
  );
};
const isWeekOfPentecost = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  return (
    path?.toLowerCase().includes(currentSeason.week) &&
    isInHolyFifties(motherSource, path)
  );
};
const isLentVespersPraisesExpositionWeek = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  if (
    isLentenVespersPraises(motherSource, path) ||
    (isLenten(motherSource, path) && !todayPrayer)
  ) {
    const { week } = currentSeason;

    return path.toLowerCase().includes(week);
  }

  return false;
};

const isMatins = (motherSource, path) => {
  return motherSource.toLowerCase()?.includes("matins") &&
    isKiahkSeason(motherSource, path) !== true
    ? true
    : false;
};
const isVespers = (motherSource, path) => {
  return motherSource === "vespers" && !isKiahkSeason(motherSource, path)
    ? true
    : false;
};
const inRaisingOfIncense = (motherSource, path) => {
  return motherSource === "vespers" ||
    motherSource.toLowerCase()?.includes("matins")
    ? true
    : false;
};
const isCovenantThursday = (motherSource, path) => {
  switch (motherSource) {
    case "ThursdayDayFirstHourMain":
    case "liturgyofStBasilCovenantThursday":
    case "liturgyofStGregoryCovenantThursday":
      return true;
    default:
      return false;
  }
};
const AdamConclusionDoxologies = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  return motherSource === "praises" && !currentSeason.isWatos;
};
const isPraises = (motherSource, path) => {
  return motherSource === "praises" ? true : false;
};
const showLitanyOfDeparted = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.dayOfWeek === 6 &&
    (currentSeason.type === "regular" || currentSeason.type === "fast")
  ) {
    return true;
  }
  return false;
};
const showLitanyOfTravelers = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.dayOfWeek !== 6 &&
    currentSeason.dayOfWeek !== 0 &&
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
const ProphecyShow = (motherSource, path) => {};
const isLentWeekdayOrJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.key === "JONAH_FAST") {
    return true;
  }

  if (currentSeason.key === "GREAT_LENT") {
    if (
      (currentSeason.dayOfWeek === 1 && currentSeason.week === 1) ||
      (currentSeason.dayOfWeek === 5 && currentSeason.week === 7)
    ) {
      return false;
    }
    if (currentSeason.dayOfWeek > 0 && currentSeason.dayOfWeek < 6) {
      return true;
    }
  }

  return false;
};
const isLentWeekdayOnly = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.key === "GREAT_LENT") {
    if (
      (currentSeason.dayOfWeek === 1 && currentSeason.week === 1) ||
      (currentSeason.dayOfWeek === 5 && currentSeason.week === 7)
    ) {
      return false;
    }
    if (currentSeason.dayOfWeek > 0 && currentSeason.dayOfWeek < 6) {
      return true;
    }
  }

  return false;
};
const isLentWeekdayOrJonahAndLastFirstLent = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "JONAH_FAST") {
    return true;
  }
  if (
    currentSeason.key === "LAZARUS_SATURDAY" &&
    path !== "RaisingOfIncenseLentLitanies"
  ) {
    return true;
  }

  if (currentSeason.key === "GREAT_LENT") {
    if (currentSeason.dayOfWeek > 0 && currentSeason.dayOfWeek < 6) {
      return true;
    }
  }

  return false;
};
const isLentAndJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  return (
    currentSeason.key === "JONAH_FAST" || currentSeason.key === "GREAT_LENT"
  );
};
const isLentWeekends = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "GREAT_LENT") {
    if (
      (currentSeason.dayOfWeek === 1 && currentSeason.week === 1) ||
      (currentSeason.dayOfWeek === 5 && currentSeason.week === 7)
    ) {
      return true;
    }
    if (currentSeason.dayOfWeek === 0 || currentSeason.dayOfWeek === 6) {
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

  if (motherSource === "vespers") {
    switch (new Date().getDay()) {
      case 3:
        return false;
      case 6:
        return true;
    }
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

  if (motherSource === "ThursdayDayFirstHourMain") {
    return false;
  }

  if (currentSeason.type === "feast") {
    return false;
  }

  if (motherSource === "vespers" && new Date().getDay() === 2) {
    return true;
  }
  if (motherSource === "vespers" && new Date().getDay() === 6) {
    return false;
  }

  // If any of the conditions is met, return true, otherwise, return false
  return (
    !currentSeason.isWatos &&
    isNOTLentWeekdayOrJonah(motherSource, path) &&
    !isBigFeast(motherSource, path)
  );
};
const showWatosConclusion = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (!currentSeason.isWatos && isPraises(motherSource, path)) {
    return true;
  } else {
    return false;
  }
};
export const isNOTLentWeekdayOrJonah = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (motherSource === "ThursdayDayFirstHourMain") {
    return false;
  }
  if (isBigFeast(motherSource, path)) {
    return true;
  }
  if (isLentWeekdayOrJonah(motherSource, path)) {
    return false;
  }

  return true;
};
const showArchangelMichaelAndGabriel = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const { key, dayOfWeek } = currentSeason;
  if (isBigFeast(motherSource, path)) {
    return false;
  }
  if (
    motherSource === "ThursdayDayFirstHourMain" ||
    (key === "GREAT_LENT" && (dayOfWeek === 6 || dayOfWeek === 7))
  ) {
    return true;
  }

  const nonArchangelSeasons = [
    "JONAH_FAST",
    "HOLY_50",
    "GREAT_LENT",
    "ASCENSION",
    "PENTECOST",
    "RESURRECTION",
  ];

  if (nonArchangelSeasons.includes(key)) {
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
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "PALM_SUNDAY") {
    return true;
  }
  return false;
};
const isNotPalmSunday = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "PALM_SUNDAY") {
    return false;
  }
  return true;
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
const isPentecostFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "PENTECOST") {
    return true;
  }
  return false;
};
const CreedHolyWeek = (motherSource, path) => {
  switch (motherSource) {
    case "ThursdayDayFirstHourMain":
    case "liturgyofStBasilCovenantThursday":
    case "liturgyofStGregoryCovenantThursday":
      return false;
    default:
      if (motherSource.toLowerCase()?.includes("brightsaturday")) {
        return false;
      }
      return true;
  }
};
const CreedCrucified = (motherSource, path) => {
  switch (motherSource) {
    case "ThursdayDayFirstHourMain":
    case "liturgyofStBasilCovenantThursday":
    case "liturgyofStGregoryCovenantThursday":
      return false;
    default:
      return true;
  }
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
  const saintSelected = getSaint(path.trim());
  if (
    isLentWeekdayOrJonah(motherSource, path) ||
    isBigFeast(motherSource, path)
  ) {
    return false;
  }

  return saintSelected.versesofCymbals;
};
const DOXSaint = (motherSource, path) => {
  const saintSelected = getSaint(path.trim());

  return saintSelected.doxologies;
};
const HitenSaint = (motherSource, path) => {
  const saintSelected = getSaint(path.trim());

  return saintSelected.intercessions;
};
const PioikSaint = (motherSource, path) => {
  const saintSelected = getSaint(path.trim());

  return saintSelected.pioik;
};
const ActsResponseSaint = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const saintSelected = getSaint(path.trim());
  switch (currentSeason.key) {
    case "STANDARD":
    case "FAST_OF_APOSTLES":
    case "FEAST_OF_APOSTLES":
    case "FAST_STMARY":
      return saintSelected.actsResponse;

    case "NATIVITY_FAST":
      if (currentSeason.copticMonth !== "Koiahk") {
        return saintSelected.actsResponse;
      } else {
        return false;
      }
    default:
      return false;
  }
};
const GospelResponseSaint = (motherSource, path) => {
  const saintSelected = getSaint(path.trim());
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
const isApostlesFast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (currentSeason.key === "FAST_OF_APOSTLES") {
    return true;
  }
  return currentSeason.key === "FAST_OF_APOSTLES" ? true : false;
};
const allButTwentyNinth = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  return currentSeason.key === FeastEnum.TWENTYNINTHTH_COPTIC_MONTH
    ? false
    : true;
};
const stMaryActsResponse = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (
    currentSeason.type === "feast" ||
    ["GREAT_LENT", "JONAH_FAST", "NATIVITY_PARAMOUN"].includes(
      currentSeason.key
    )
  ) {
    return false;
  }
  if (isKiahkWeek("", "Week4")) {
    return false;
  }

  return true;
};
const ArchangelGabrielShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const saintSelected = getSaint("ARCHANGEL_GABRIEL");
  const isBigFeastResult = isBigFeast(motherSource, path);

  if (
    (currentSeason.copticMonth === "Koiahk" ||
      TakeFromHathor(currentSeason) ||
      currentSeason.key === FeastEnum.ANNUNCIATION ||
      currentSeason.key === FeastEnum.TWENTYNINTHTH_COPTIC_MONTH) &&
    !isBigFeastResult
  ) {
    return true;
  }
  const lowerPath = path?.toLowerCase();

  if (lowerPath.includes("ActsResponse")) {
    return isBigFeastResult ? false : saintSelected.actsResponse;
  } else if (lowerPath.includes("Hitens")) {
    if (
      currentSeason.key === FeastEnum.NATIVITY ||
      currentSeason.key === FeastEnum.NATIVITY_SECONDDAY ||
      currentSeason.key === FeastEnum.NATIVITY_PERIOD
    ) {
      return true;
    }
    return saintSelected.intercessions;
  } else if (lowerPath.includes("VersesOfCymbals")) {
    return isBigFeastResult ? false : saintSelected.versesofCymbals;
  }
};
const JohnTheBaptistShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const saintSelected = getSaint("JOHN_THE_BAPTIST");

  const isDoxologyPath = (path) =>
    path?.toLowerCase().includes("doxologies") ||
    path?.toLowerCase().includes("versesofcymbals");

  const isKoiahkOrHathor =
    currentSeason.copticMonth === "Koiahk" || TakeFromHathor(currentSeason);

  if (isKoiahkOrHathor && isDoxologyPath(path)) {
    return true;
  }

  switch (currentSeason.key) {
    case FeastEnum.EPIPHANY_PARAMOUN:
      return !path?.toLowerCase().includes("oranen");

    case FeastEnum.EPIPHANY:
    case FeastEnum.EPIPHANY_SECONDDAY:

    case FeastEnum.NATIVITY_FAST:
      return isKoiahkOrHathor
        ? false
        : isDoxologyPath(path)
        ? saintSelected.doxologies
        : false;

    default:
      return currentSeason.saintsOfThisDay.includes("JOHN_THE_BAPTIST");
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

  if (!dioceseBishop) {
    return false;
  }

  const isMetropolitan =
    dioceseBishop.Rank === "Metropolitan" &&
    (BishopIsPresent ||
      (motherSource && motherSource.toLowerCase().includes("index")));

  return isMetropolitan;
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

  const isBishop =
    dioceseBishop.Rank === "Bishop" &&
    (BishopIsPresent ||
      (motherSource && motherSource.toLowerCase().includes("index")));

  return isBishop;
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
const BishopIsPresentOrBigFeast = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  if (
    currentSeason.key === "NATIVITY" ||
    currentSeason.key === "EPIPHANY" ||
    currentSeason.key === "RESURRECTION"
  ) {
    return true;
  }
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
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  if (
    (currentSeason.key === FeastEnum.FEAST_OF_CROSS ||
      currentSeason.key === FeastEnum.FEAST_OF_CROSS_3) &&
    path?.toLowerCase().includes("taishori")
  ) {
    return false;
  }
  switch (currentSeason.key) {
    case FeastEnum.FEAST_OF_CROSS:
    case FeastEnum.FEAST_OF_CROSS:
    case FeastEnum.GREAT_LENT:
    case FeastEnum.JONAH_FAST:
    case FeastEnum.FEAST_OF_CROSS:
      return false;
    default:
      if (currentSeason.type === "feast") {
        return true;
      }
      if (!isInFast(timeTransition)) {
        return true;
      }
      return currentSeason.dayOfWeek === 6 || currentSeason.dayOfWeek === 0
        ? true
        : false;
  }
};
const IsFastingDays = (motherSource, path) => {
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const lowerPath = path?.toLowerCase();

  if (
    (currentSeason.key === FeastEnum.FEAST_OF_CROSS ||
      currentSeason.key === FeastEnum.FEAST_OF_CROSS_3) &&
    lowerPath.includes("tishori")
  ) {
    return true;
  }

  if (
    (currentSeason.key === "GREAT_LENT" &&
      (currentSeason.dayOfWeek === 0 || currentSeason.dayOfWeek === 6)) ||
    (currentSeason.dayOfWeek === 1 && currentSeason.week === 1) ||
    (currentSeason.dayOfWeek === 5 && currentSeason.week === 7)
  ) {
    return true;
  }

  if (
    currentSeason.key === "JONAH_FAST" ||
    (currentSeason.key === "GREAT_LENT" &&
      currentSeason.dayOfWeek > 0 &&
      currentSeason.dayOfWeek < 6)
  ) {
    return false;
  }

  return (
    isInFast(timeTransition) &&
    currentSeason.type !== "feast" &&
    currentSeason.dayOfWeek !== 6 &&
    currentSeason.dayOfWeek !== 0
  );
};
const StandardAgiosShow = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  const nonSpecialSeasons = [
    "FEAST_OF_CROSS",
    "FEAST_OF_CROSS_3",
    "NATIVITY_PARAMOUN",
    "NATIVITY",
    "NATIVITY_SECONDDAY",
    "NATIVITY_PERIOD",
    "FEAST_OF_CIRCUMCISION",
    "EPIPHANY_PARAMOUN",
    "EPIPHANY",
    "EPIPHANY_SECONDDAY",
    FeastEnum.RESURRECTION,
    FeastEnum.HOLY_50,
    FeastEnum.THOMAS_SUNDAY,
    FeastEnum.ASCENSION,
    FeastEnum.ASCENSIONTOPENTECOST,
    FeastEnum.PENTECOST,
  ];

  return !nonSpecialSeasons.includes(currentSeason.key);
};
const ShowSotees = (motherSource, path) => {
  if (
    BishopIsNOTPresent(motherSource, path) &&
    !isLentWeekdayOrJonahAndLastFirstLent(motherSource, path)
  ) {
    return true;
  }
  return false;
};
const firstKiahkGospelResponse = (motherSource, path) => {
  if (isKiahkWeek("", "Week1") || isKiahkWeek("", "Week2")) {
    return true;
  } else {
    return false;
  }
};

const secondKiahkGospelResponse = (motherSource, path) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return false;
  }
  if (isKiahkWeek("", "Week3") || isKiahkWeek("", "Week4")) {
    return true;
  } else {
    return false;
  }
};

export function TakeFromHathor(currentSeason) {
  const copticMonthFound = {
    name: "Koiahk",
    index: 3,
    month: 12,
    day: 10,
    leap: true,
  };

  const copticDate = getCopticDate(
    currentSeason.gregorianYear,
    copticMonthFound.month - 1,
    copticMonthFound.day
  );

  const firstDay = moment([
    currentSeason.gregorianYear,
    copticMonthFound.month - 1,
    copticMonthFound.day +
      (copticDate.month === "Hathor" && copticDate.day === 30 ? 1 : 0),
  ]);

  const lastDay = moment(
    getParamounDate(moment([currentSeason.gregorianYear, 0, 7]))
  );

  let numSundays = 0;

  for (
    let currentDay = firstDay.clone();
    currentDay.isBefore(lastDay);
    currentDay.add(1, "day")
  ) {
    if (currentDay.day() === 0) {
      numSundays++;
    }
  }

  const lastSundayOfHathoor = firstDay.subtract(firstDay.day(), "days");

  return (
    numSundays < 4 &&
    lastSundayOfHathoor.isSame(moment(currentSeason.fullgregorianDate))
  );
}

//ReplacingIndex
const ComeRisenRule = (motherSource, part) => {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const fastsFeasts = getCopticFastsFeasts(currentSeason.gregorianYear);

  const KIAHK = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");

  const PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
  if (motherSource?.includes("CovenantThursday")) {
    return {
      english: "were crucified",
      coptic: "aua]k",
      arabic: "صلبت",
      englishcoptic: "av-ashk",
      arabiccoptic: "اف اشك",
    };
  }
  switch (currentSeason.key) {
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return {
        english: "were born",
        coptic: "aumack",
        arabic: "ولدت",
        englishcoptic: "avmask",
        arabiccoptic: "افماسك",
      };

    case "EPIPHANY":
    case "EPIPHANY_PARAMOUN":
    case "EPIPHANY_SECONDDAY":
      return {
        english: "were baptised",
        coptic: "aksi`wmc",
        arabic: "اعتمدت",
        englishcoptic: "akchi-oms",
        arabiccoptic: "اكتشي أومس",
      };
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
    case "COVENANT_THURSDAY":
      return {
        english: "were crucified",
        coptic: "aua]k",
        arabic: "صلبت",
        englishcoptic: "av-ashk",
        arabiccoptic: "اف اشك",
      };
    case "HOLY_50":
    case "RESURRECTION":
    case "ASCENSION":
    case "ASCENSIONTOPENTECOST":
    case "PENTECOST":
      return {
        english: "have risen",
        coptic: "aktwnk",
        arabic: "قمت",
        englishcoptic: "aktonk",
        arabiccoptic: "اكتونك",
      };
    case "NATIVITY_FAST":
      if (
        currentSeason.copticMonth === "Koiahk" ||
        TakeFromHathor(currentSeason)
      ) {
        return {
          english: "have come",
          coptic: "ak`i",
          arabic: "اتيت",
          englishcoptic: "ak-ee",
          arabiccoptic: "اك إي",
        };
      }

      if (currentSeason.dayOfWeek === 0) {
        return {
          english: "have risen",
          coptic: "aktwnk",
          arabic: "قمت",
          englishcoptic: "aktonk",
          arabiccoptic: "اكتونك",
        };
      }

      // Default case
      return {
        english: "have come",
        coptic: "ak`i",
        arabic: "اتيت",
        englishcoptic: "ak-ee",
        arabiccoptic: "اك إي",
      };

    default:
      const date = moment(currentSeason.fullgregorianDate);
      const isBetweenPentecostAndKiahk = date.isBetween(
        PENTECOST.start,
        KIAHK.start
      );
      const isSunday = date.day() === 0;

      if (isBetweenPentecostAndKiahk && isSunday) {
        return {
          english: "have risen",
          coptic: "aktwnk",
          arabic: "قمت",
          englishcoptic: "aktonk",
          arabiccoptic: "اكتونك",
        };
      } else {
        return {
          english: "have come",
          coptic: "ak`i",
          arabic: "اتيت",
          englishcoptic: "ak-ee",
          arabiccoptic: "اك إي",
        };
      }
  }
};

const ROICONCLUSION = (motherSource, rule) => {
  if (motherSource === "kiahkPsalmody") {
    return {
      english: "The Begotten of the Father before all ages. ",
      coptic: "Pimici `ebol=en `Viwt =ajwou `nni`ewn throu.",
      arabic: "المولود من الآب قبل كل الدهور. ",
      englishcoptic: "Pi-misi evol khen efiot , khago-oo en-ni e-on teero",
      arabiccoptic: "بي ميسي إيفول خين إيفيوت خاجو أو إنني إي أون تيرو",
    };
  } else if (motherSource === "lentenPsalmody") {
    return {
      english:
        "who fasted for us, forty days and forty nights, to save us from our sins.",
      coptic:
        "vh`etaf`ernhcteuin `e`\\rhi `ejwn> `n`\\me `n`e\\o`ou nem `\\me `n`ejwr\\> ]a `ntefcwtten =en nennobi.",
      arabic: "الذي صام عنا، أربعين يوماً وأربعين ليلة، حتي خلصنا من خطايانا.",
      englishcoptic:
        "Vee-etaf ernes-tevin e-ehreei egon: en-ehme en-ehooo nem ehme en-egorh: sha entef-sot-ten khen nen-novi.",
      arabiccoptic:
        "في إيتاف إيرنيستيفين إهري إيجون: إين إيهمي إين إيهووؤ نيم إيهمي إين إيجوره: شا إينتيف سوتتين خين نين نوفي.",
    };
  }
  const fastsFeasts = getCopticFastsFeasts(moment().year());
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  switch (currentSeason.key) {
    case "COPTIC_NEW_YEAR":
      return {
        english:
          "bless the crown of the year, with Your goodness O Lord, the rivers and the fountains, the plants and the fruits.",
        coptic:
          "`cmou `epi`xlom `nte ;rompi> \\iten tekmet`xrhctoc `Psoic> niiarwou nem nimoumi> nem nici; nem nikarpoc.",
        arabic:
          "بارك إكليل [هذه] السنة، بصلاحك يا رب، الأنهار والينابيع، والزروع والأثمار",
        englishcoptic:
          "Esmoo e-pi-eklom ente-ti rompi, he-ten tek-met-ekhrestos Ep-shois, ni-a-ro-oo nem ni-mo-me, nem ni-siti nem ni-karpos.",
        arabiccoptic:
          "إسموا إيه بي إكلوم انتيه تي رومبي، هيتين تيك ميت إخريستوس إبشويس، ني أروؤ نيم ني مومي، نيم ني سيتي نيم ني كاربوس.",
      };
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
    case "HOLY_WEEK":
      return {
        english:
          "who was crucified on the cross, destroy Satan under our feet ",
        coptic:
          "vh`etaua]f `epi`ctauroc> ek`e=om=em `m`pcatanac> capecht `nnensalauj",
        arabic: "الذى صلبت على الصليب وسحقت الشيطان تحت أقدامنا",
        englishcoptic:
          "vi etaf ashf epistavros Ek-ekhomkhem emepsatanas, sapeseet en-nen echalavg.",
        arabiccoptic:
          "فى إيطاف أشف إبى إسطافروس إك إ خومخيم إم إبساطاناس. سابيسيت إن نين إتشالافج.",
      };
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return {
        english:
          "Who was born in Bethlehem, according to the prophetic sayings.",
        coptic: "Vh`etaumacf =en Bhqleem kata ni`cmh `m`provhtikon.",
        arabic: "الذي ولد في بيت لحم كالأخبار النبوية.",
        englishcoptic:
          "Vi-etaf masf khen Vethle-eem , kata ni esmi em epro-phitikon. ",
        arabiccoptic:
          "في ايطاف ماسف خين بيتليئيم : كاطا ني اسمي ام ابروفيتيكون  .",
      };

    case "EPIPHANY":
    case "EPIPHANY_PARAMOUN":
    case "EPIPHANY_SECONDDAY":
      return {
        english: "The Son of God, Who was baptized in the Jordan.",
        coptic: "P]hri `m`Vnou;> Vh`etafsiwmc =en Piiordanhc.",
        arabic: "إبن الله، الذي إعتمد في الأردن",
        englishcoptic:
          "Epsheeri em-Evnooti: Vi-etaf etchy oms khen pi-yordanees ",
        arabiccoptic: "إيبشيري إميفنووتي: في ايطافتشي أومس خين بى يوردانيس .",
      };
    case "ANNUNCIATION":
      return {
        english: "The Son of God, was incarnate from the Virgin.",
        coptic: "P]hri `m`Vnou;> afsicar[ `ebol =en :parqenoc.",
        arabic: "إبن الله، تجسد من العذراء.",
        englishcoptic:
          "Epsheeri em-Evnooti: afechi-sarex evol khen Ti-Parthenos.",
        arabiccoptic: "إيبشيري إميفنووتي: افتشي ساركس إيفول خين تيبارثينوس.",
      };
    case "FEAST_OF_CIRCUMCISION":
      return {
        english: " The Son of God, accepted unto Himself circumcision.",
        coptic: "P]hri `m`Vnou;>  af]wop `erof `mpicebi.",
        arabic: "ابن الله قبل إليه الختان.",
        englishcoptic: "Epsheeri em-Evnooti: afshop erof empi-sevi",
        arabiccoptic: "إيبشيري إميفنووتي: افشوب ايروف امبي سيفي",
      };
    case "ENTRY_EGYPT":
      return {
        english: " The Son of God, came to the land of Egypt.",
        coptic: "P]hri `m`Vnou;>  af`i `e=oun `e`pkai `nXhmi.",
        arabic: "ابن الله دخل إلي أرض مصر..",
        englishcoptic: "Epsheeri em-Evnooti: av-ee ekhon epkahi en-Keemi",
        arabiccoptic: "إيبشيري إميفنووتي: افئي إيخون إبكاهي إن كيمي",
      };
    case "WEDDING_CANA":
      return {
        english: " The Son of God, blessed the water and changed it into wine",
        coptic: "P]hri `m`Vnou;>  af`cmou `enimwou afaitou `nhrp",
        arabic: "ابن الله بارك المياه فصيرها خمراً.",
        englishcoptic: "Epsheeri em-Evnooti: av-esmo eni-mo-oo af-aito en-eerp",
        arabiccoptic: "إيبشيري إميفنووتي: اف إسمو ان نيموؤو اف ايتو إن ايرب",
      };
    case "PRESENTATION_TEMPLE":
      return {
        english: " The Son of God,He entered into the temple",
        coptic: "P]hri `m`Vnou;>  afse `eqoun `epiervei",
        arabic: "ابن الله دخل إلى الهيكل.",
        englishcoptic: "Epsheeri em-Evnooti: af-ee ekhon epi-erfei",
        arabiccoptic: "إيبشيري إميفنووتي: اف ى إيخون اى بى إرفيى",
      };
    case "TRANSFIGURATION":
      return {
        english: " The Son of God, was transfigured upon Mount Tabor",
        coptic: "P]hri `m`Vnou;>  af]wbt `ejen pitwou `nQabwr",
        arabic: "ابن الله تجلى على جبل تابور..",
        englishcoptic: "Epsheeri em-Evnooti: af-shobt ejen pi-to-oo en-Taboor",
        arabiccoptic: "إيبشيري إميفنووتي: اف شوبت إيجين بيتوأو إن تابور",
      };
    case "NATIVITY_FAST":
      return {
        english: "The Begotten of the Father before all ages. ",
        coptic: "Pimici `ebol=en `Viwt =ajwou `nni`ewn throu.",
        arabic: "المولود من الآب قبل كل الدهور. ",
        englishcoptic: "Pi-misi evol khen efiot , khago-oo en-ni e-on teero",
        arabiccoptic: "بي ميسي إيفول خين إيفيوت خاجو أو إنني إي أون تيرو",
      };
    case "GREAT_LENT":
      return {
        english:
          "who fasted for us, forty days and forty nights, to save us from our sins.",
        coptic:
          "vh`etaf`ernhcteuin `e`\\rhi `ejwn> `n`\\me `n`e\\o`ou nem `\\me `n`ejwr\\> ]a `ntefcwtten =en nennobi.",
        arabic:
          "الذي صام عنا، أربعين يوماً وأربعين ليلة، حتي خلصنا من خطايانا.",
        englishcoptic:
          "Vee-etaf ernes-tevin e-ehreei egon: en-ehme en-ehooo nem ehme en-egorh: sha entef-sot-ten khen nen-novi.",
        arabiccoptic:
          "في إيتاف إيرنيستيفين إهري إيجون: إين إيهمي إين إيهووؤ نيم إيهمي إين إيجوره: شا إينتيف سوتتين خين نين نوفي.",
      };
    case "RESURRECTION":
    case "THOMAS_SUNDAY":
      return {
        english:
          "the King of glory, who has risen from the dead on the third day.",
        coptic:
          "`Pouro `nte `p`wou> aftwnf `ebol =en nheqmwout =en pi`e\\oou `mma\\]omt.",
        arabic: "ملك المجد، (الذي) قام من بين الأموات في اليوم الثالث.",
        englishcoptic:
          "Ep-oro ente ep-o-oo, aftonf evol khennieth-mo-oot khenpi-eho-oo emmah-shomt.",
        arabiccoptic:
          "أبؤرو انتيه ابؤؤ افتونف ايفول خين ني ايث موؤت خين بي ايهوؤ امماه شومت",
      };
    case "ASCENSION":
    case "ASCENSIONTOPENTECOST":
      return {
        english:
          "who is risen from the dead, ascended into the heavens, and is seated at the right hand of His Father.",
        coptic:
          "aftwnf `ebol =en nheqmwout> ouo\\ af]enaf `e`p]wi `enivhou`i> af\\emci caou`inam `mPefiwt.",
        arabic: "الذي قام من بين الأموات، وصعد إلى السموات، وجلس عن يمين أبيه.",
        englishcoptic:
          "Aftonf evol khen ni-ethmo-ot, owoh afshenaf epshoi eni-fi-owwe, af-hemsi sa-ow-we-nam empef-iot.",
        arabiccoptic:
          "آفطونف إيﭬول خين ني إثموأووت : أووه آفشيناف إيه إبشوي إيه ني في أووي : آفهيمسي صا أووي نام إمبيف يوت",
      };
    case "HOLY_50":
      return {
        english:
          "the King of glory, who has risen from the dead on the third day.",
        coptic:
          "`Pouro `nte `p`wou> aftwnf `ebol =en nheqmwout =en pi`e\\oou `mma\\]omt.",
        arabic: "ملك المجد، (الذي) قام من بين الأموات في اليوم الثالث.",
        englishcoptic:
          "Ep-oro ente ep-o-oo, aftonf evol khennieth-mo-oot khenpi-eho-oo emmah-shomt.",
        arabiccoptic:
          "أبؤرو انتيه ابؤؤ افتونف ايفول خين ني ايث موؤت خين بي ايهوؤ امماه شومت",
      };

    case "PENTECOST":
      return {
        english:
          "who has risen and ascended, and sent to us the Paraclete, the Spirit of truth.",
        coptic:
          "vh`etaftwnf ouo\\ af]enaf> afouwrp nan `mPiparaklhton> Pi`pneuma `nte ;meqmhi.",
        arabic: "الذي قام ثم صعد، وأرسل لنا البارقليط، روح الحق.",
        englishcoptic:
          "ve-etaftonf owoh af-she-naf, af-oo-orb nan empi-parak-liton, pi-epnevma ente-ti-meth-mee.",
        arabiccoptic:
          "في إيتافطونف اووه آفشيناف : آف أووأورب نان إمبي باراكليتون : بي بنيﭭما إنتي تي ميثمي",
      };
    default:
      //Air
      if (currentSeason.plantsSeason == "air") {
        return {
          english:
            "bless the air of heaven , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou ni`ahr `nte `tve Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ أهويةَ السماءِ ولتكن رحمتُك وسلامُك حِصناً لشعبِك",
          englishcoptic:
            "Esmo eni a-eer ente etve , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إي ني آإير إنتي إتفي ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
      //waters
      else if (currentSeason.plantsSeason == "waters") {
        return {
          english:
            "bless the waters of the river , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou nimwou `m`viaro Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ مياهَ النهرِ ولتكن رحمتُك وسلامُك حِصناً لشعبِك  ",
          englishcoptic:
            "Esmo eni-mo-oo em efiaro , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إي ني موؤ إم إفيارو ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
      //plants
      else {
        return {
          english:
            "bless the seeds and the herbs , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou `enici; nem nicim Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ الزروعَ والعشبَ ولتكن رحمتُك وسلامُك حِصناً لشعبِك  ",
          englishcoptic:
            "Esmo eni-sitee nem ni sim , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إيني سيتي نيم ني سيم ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
  }
};

const REPLACEGOSPELAUTHOR = (author, part) => {
  myauthor = getGospelAuthor(part);
  switch (myauthor) {
    case 1:
      return {
        english: "Matthew",
        coptic: "Matqeon",
        arabic: "متى",
        englishcoptic: "Mat-theon",
        arabiccoptic: "ماتثيؤن",
      };
    case 2:
      return {
        english: "Mark",
        coptic: "Markon",
        arabic: "مرقس",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case 3:
      return {
        english: "Luke",
        coptic: "Loukan",
        arabic: "لوقا",
        englishcoptic: "Lokan",
        arabiccoptic: "لوكان",
      };
    case 4:
      return {
        english: "John",
        coptic: "Iwannhn",
        arabic: "يوحنا",
        englishcoptic: "Yoanin",
        arabiccoptic: "يوأنين",
      };
    default:
      return {
        english: "...",
        coptic: "...",
        arabic: "...",
        englishcoptic: "...",
        arabiccoptic: "...",
      };
  }
};
const REPLACEPASCHAGOSPELAUTHOR = (author, part) => {
  switch (author) {
    case 1:
      return {
        english: "Matthew",
        coptic: "Matqeon",
        arabic: "متى",
        englishcoptic: "Mat-theon",
        arabiccoptic: "ماتثيؤن",
      };
    case 2:
      return {
        english: "Mark",
        coptic: "Markon",
        arabic: "مرقس",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case 3:
      return {
        english: "Luke",
        coptic: "Loukan",
        arabic: "لوقا",
        englishcoptic: "Lokan",
        arabiccoptic: "لوكان",
      };
    case 4:
      return {
        english: "John",
        coptic: "Iwannhn",
        arabic: "يوحنا",
        englishcoptic: "Yoanin",
        arabiccoptic: "يوأنين",
      };
    default:
      return {
        english: "...",
        coptic: "...",
        arabic: "...",
        englishcoptic: "...",
        arabiccoptic: "...",
      };
  }
};
const REPLACECATHOLICAUTHOR = (author, part) => {
  myauthor = getCatholicAuthor(part);

  switch (myauthor) {
    case "1Peter":
      return {
        english: "first epistle of our teacher St.Peter",
        coptic: "Petroc",
        arabic: "بطرس الأولى",
        englishcoptic: "Petros",
        arabiccoptic: "بيتروس",
      };
    case "2Peter":
      return {
        english: "second epistle of our teacher St.Peter",
        coptic: "Petroc",
        arabic: "بطرس الثانية",
        englishcoptic: "Petros",
        arabiccoptic: "بيتروس",
      };
    case "1John":
      return {
        english: "first epistle of our teacher St.John",
        coptic: "Iwannhc",
        arabic: "يوحنا الأولى",
        englishcoptic: "Youannis",
        arabiccoptic: "يوأنيس",
      };
    case "2John":
      return {
        english: "second epistle of our teacher St.John",
        coptic: "Iwannhc",
        arabic: "يوحنا الثانية",
        englishcoptic: "Youannis",
        arabiccoptic: "يوأنيس",
      };
    case "3John":
      return {
        english: "third epistle of our teacher St.John",
        coptic: "Iwannhc",
        arabic: "يوحنا الثالثة",
        englishcoptic: "Youannis",
        arabiccoptic: "يوأنيس",
      };
    case "James":
      return {
        english: "epistle of our teacher St.James",
        coptic: "Iakwboc",
        arabic: "يعقوب",
        englishcoptic: "Yakobos",
        arabiccoptic: "ياكووبوس",
      };
    case "Jude":
      return {
        english: "epistle of our teacher St.Jude",
        coptic: "Iouda",
        arabic: "يهوذا",
        englishcoptic: "Iooza",
        arabiccoptic: "يودا",
      };
    default:
      return {
        english: "...",
        coptic: "...",
        arabic: "...",
        englishcoptic: "...",
        arabiccoptic: "...",
      };
  }
};
const REPLACEPAULINEAUTHOR = (author, part) => {
  myauthor = getPaulineAuthor(part);

  switch (myauthor) {
    case "1Timothy":
      return {
        english: "the first Epistle of our teacher St.Paul to Timothy",
        coptic: "Markon",
        arabic: "الأولى الى تيموثاوس ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "2Timothy":
      return {
        english: "the second Epistle of our teacher St.Paul to Timothy",
        coptic: "Markon",
        arabic: "الثانية الى تيموثاوس ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "1Thessalonians":
      return {
        english: "the first Epistle of our teacher St.Paul to Thessalonians",
        coptic: "Markon",
        arabic: "الأولى الى أهل تسالونيكى ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "2Thessalonians":
      return {
        english: "the second Epistle of our teacher St.Paul to Thessalonians",
        coptic: "Markon",
        arabic: "الثانية الى أهل تسالونيكى ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "1Corinthians":
      return {
        english: "the first Epistle of our teacher St.Paul to Corinthians",
        coptic: "Markon",
        arabic: "الأولى الى أهل كورنثوس ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "2Corinthians":
      return {
        english: "the second Epistle of our teacher St.Paul to Corinthians",
        coptic: "Markon",
        arabic: "الثانية الى أهل كورنثوس ",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Titus":
      return {
        english: "the Epistle of our teacher St.Paul to Titus",
        coptic: "Markon",
        arabic: "الى تيطس",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Philemon":
      return {
        english: "the Epistle of our teacher St.Paul to Philemon",
        coptic: "Markon",
        arabic: "الى فليمون",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Hebrews":
      return {
        english: "the Epistle of our teacher St.Paul to the Hebrews",
        coptic: "Markon",
        arabic: "الى العبرانيين",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Galatians":
      return {
        english: "the Epistle of our teacher St.Paul to the Galatians",
        coptic: "Markon",
        arabic: "الى أهل غلاطية",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Ephesians":
      return {
        english: "the Epistle of our teacher St.Paul to the Ephesians",
        coptic: "Markon",
        arabic: "الى أهل أفسس",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Philippians":
      return {
        english: "the Epistle of our teacher St.Paul to the Philippians",
        coptic: "Markon",
        arabic: "الى أهل فيلبي",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Colossians":
      return {
        english: "the Epistle of our teacher St.Paul to the Colossians",
        coptic: "Markon",
        arabic: "الى أهل كولوسى",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case "Romans":
      return {
        english: "the Epistle of our teacher St.Paul to the Romans",
        coptic: "Markon",
        arabic: "الى أهل رومية",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    default:
      return {
        english: "...",
        coptic: "...",
        arabic: "...",
        englishcoptic: "...",
        arabiccoptic: "...",
      };
  }
};

const REPLACPASCHAHOURDAY = (paschaHourDay, part) => {
  switch (paschaHourDay) {
    //SundayDay
    case "SundayDayNinthHour":
      return {
        english: "Ninth Hour of Hosanna Sunday",
        arabic: " الساعة التاسعة من يوم احد الشعانين",
      };
    case "SundayDayEleventhHour":
      return {
        english: "Eleventh Hour of Hosanna Sunday",
        arabic: " الساعة الحادية عشر من يوم احد الشعانين",
      };
    //MondayEve
    case "MondayEveFirstHour":
      return {
        english: "First Hour of the eve of Monday",
        arabic: " باكر ليلة الأثنين ",
      };
    case "MondayEveThirdHour":
      return {
        english: "Third Hour of the eve of Monday",
        arabic: " الساعة الثالثة من ليلة الأثنين ",
      };
    case "MondayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Monday",
        arabic: " الساعة السادسة من ليلة الأثنين ",
      };

    case "MondayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Monday",
        arabic: " الساعة التاسعة من ليلة الأثنين ",
      };
    case "MondayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Monday",
        arabic: " الساعة الحادية عشر من ليلة الأثنين",
      };
    //MondayDay
    case "MondayDayFirstHour":
      return {
        english: "First Hour of Monday",
        arabic: " باكر يوم الأثنين ",
      };
    case "MondayDayThirdHour":
      return {
        english: "Third Hour of Monday",
        arabic: " الساعة الثالثة من يوم الأثنين ",
      };
    case "MondayDaySixthHour":
      return {
        english: "Sixth Hour of Monday",
        arabic: " الساعة السادسة من يوم الأثنين ",
      };

    case "MondayDayNinthHour":
      return {
        english: "Ninth Hour of Monday",
        arabic: " الساعة التاسعة من يوم الأثنين ",
      };
    case "MondayDayEleventhHour":
      return {
        english: "Eleventh Hour of Monday",
        arabic: " الساعة الحادية عشر من يوم الأثنين",
      };
    //TuesdayEve
    case "TuesdayEveFirstHour":
      return {
        english: "First Hour of the eve of Tuesday",
        arabic: " باكر ليلة الثلاثاء ",
      };
    case "TuesdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Tuesday",
        arabic: " الساعة الثالثة من ليلة الثلاثاء ",
      };
    case "TuesdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Tuesday",
        arabic: " الساعة السادسة من ليلة الثلاثاء ",
      };

    case "TuesdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Tuesday",
        arabic: " الساعة التاسعة من ليلة الثلاثاء ",
      };
    case "TuesdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Tuesday",
        arabic: " الساعة الحادية عشر من ليلة الثلاثاء",
      };
    //TuesdayDay
    case "TuesdayDayFirstHour":
      return {
        english: "First Hour of Tuesday",
        arabic: " باكر يوم الثلاثاء ",
      };
    case "TuesdayDayThirdHour":
      return {
        english: "Third Hour of Tuesday",
        arabic: " الساعة الثالثة من يوم الثلاثاء ",
      };
    case "TuesdayDaySixthHour":
      return {
        english: "Sixth Hour of Tuesday",
        arabic: " الساعة السادسة من يوم الثلاثاء ",
      };

    case "TuesdayDayNinthHour":
      return {
        english: "Ninth Hour of Tuesday",
        arabic: " الساعة التاسعة من يوم الثلاثاء ",
      };
    case "TuesdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Tuesday",
        arabic: " الساعة الحادية عشر من يوم الثلاثاء",
      };
    //WednesdayEve
    case "WednesdayEveFirstHour":
      return {
        english: "First Hour of the eve of Wednesday",
        arabic: " باكر ليلة الأربعاء ",
      };
    case "WednesdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Wednesday",
        arabic: " الساعة الثالثة من ليلة الأربعاء ",
      };
    case "WednesdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Wednesday",
        arabic: " الساعة السادسة من ليلة الأربعاء ",
      };

    case "WednesdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Wednesday",
        arabic: " الساعة التاسعة من ليلة الأربعاء ",
      };
    case "WednesdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Wednesday",
        arabic: " الساعة الحادية عشر من ليلة الأربعاء",
      };
    //WednesdayDay
    case "WednesdayDayFirstHour":
      return {
        english: "First Hour of Wednesday",
        arabic: " باكر يوم الأربعاء ",
      };
    case "WednesdayDayThirdHour":
      return {
        english: "Third Hour of Wednesday",
        arabic: " الساعة الثالثة من يوم الأربعاء ",
      };
    case "WednesdayDaySixthHour":
      return {
        english: "Sixth Hour of Wednesday",
        arabic: " الساعة السادسة من يوم الأربعاء ",
      };

    case "WednesdayDayNinthHour":
      return {
        english: "Ninth Hour of Wednesday",
        arabic: " الساعة التاسعة من يوم الأربعاء ",
      };
    case "WednesdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Wednesday",
        arabic: " الساعة الحادية عشر من يوم الأربعاء",
      };
    //ThursdayEve
    case "ThursdayEveFirstHour":
      return {
        english: "First Hour of the eve of Covenant Thursday",
        arabic: " باكر ليلة خميس العهد ",
      };
    case "ThursdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Covenant Thursday",
        arabic: " الساعة الثالثة من ليلة خميس العهد ",
      };
    case "ThursdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Covenant Thursday",
        arabic: " الساعة السادسة من ليلة خميس العهد ",
      };

    case "ThursdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Covenant Thursday",
        arabic: " الساعة التاسعة من ليلة خميس العهد ",
      };
    case "ThursdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Covenant Thursday",
        arabic: " الساعة الحادية عشر من ليلة خميس العهد",
      };
    //ThursdayDay
    case "ThursdayDayFirstHour":
      return {
        english: "First Hour of Covenant Thursday",
        arabic: " باكر يوم خميس العهد ",
      };
    case "ThursdayDayThirdHour":
      return {
        english: "Third Hour of Covenant Thursday",
        arabic: " الساعة الثالثة من يوم خميس العهد ",
      };
    case "ThursdayDaySixthHour":
      return {
        english: "Sixth Hour of Covenant Thursday",
        arabic: " الساعة السادسة من يوم خميس العهد ",
      };

    case "ThursdayDayNinthHour":
      return {
        english: "Ninth Hour of Covenant Thursday",
        arabic: " الساعة التاسعة من يوم خميس العهد ",
      };
    case "ThursdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Covenant Thursday",
        arabic: " الساعة الحادية عشر من يوم خميس العهد",
      };
    //FridayEve
    case "FridayEveFirstHour":
      return {
        english: "First Hour of the eve of Good Friday",
        arabic: " باكر ليلة الجمعة العظيمة ",
      };
    case "FridayEveThirdHour":
      return {
        english: "Third Hour of the eve of Good Friday",
        arabic: " الساعة الثالثة من ليلة الجمعة العظيمة ",
      };
    case "FridayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Good Friday",
        arabic: " الساعة السادسة من ليلة الجمعة العظيمة ",
      };

    case "FridayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Good Friday",
        arabic: " الساعة التاسعة من ليلة الجمعة العظيمة ",
      };
    case "FridayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Good Friday",
        arabic: " الساعة الحادية عشر من ليلة الجمعة العظيمة",
      };
    //FridayDay
    case "FridayDayFirstHour":
      return {
        english: "First Hour of Good Friday",
        arabic: " باكر يوم الجمعة العظيمة ",
      };
    case "FridayDayThirdHour":
      return {
        english: "Third Hour of Good Friday",
        arabic: " الساعة الثالثة من يوم الجمعة العظيمة ",
      };
    case "FridayDaySixthHour":
      return {
        english: "Sixth Hour of Good Friday",
        arabic: " الساعة السادسة من يوم الجمعة العظيمة ",
      };

    case "FridayDayNinthHour":
      return {
        english: "Ninth Hour of Good Friday",
        arabic: " الساعة التاسعة من يوم الجمعة العظيمة ",
      };
    case "FridayDayEleventhHour":
      return {
        english: "Eleventh Hour of Good Friday",
        arabic: " الساعة الحادية عشر من يوم الجمعة العظيمة",
      };
    case "FridayDayTwelfthHour":
      return {
        english: "Twelfth Hour of Good Friday",
        arabic: " الساعة الثانية عشر من يوم الجمعة العظيمة",
      };
    case "BrightSaturdayFirstHour":
      return {
        english: "Matins of Bright Saturday",
        arabic: " باكر يوم سبت النور",
      };
  }
};

const REPLACEPROPHETS = (prophet, part) => {
  var updatedProphet = prophet;
  console.log(updatedProphet);
  switch (updatedProphet) {
    case "Genesis":
      return {
        english: " The book of Genesis of Moses",
        coptic: " `pjwm `n;Genecic `nte Mw`ucic",
        arabic: "  سفر التكوين لموسى  ",
        englishcoptic: " Epgom enti-jenesis ente Moysis",
        arabiccoptic: " تيجنسيس انتى موسيس  . ",
      };
    case "Exodus":
      return {
        english: " The book of Exodus of Moses",
        coptic: " `pjwm `nte Pido[odoc `nte Mw`ucic",
        arabic: "  سفر الخروج لموسى  ",
        englishcoptic: " Epgom ente pidoxodos ente Moysis",
        arabiccoptic: " إبجوم انتى ذوكصوذوس انتى موسيس  . ",
      };
    case "Leviticus":
      return {
        english: " The book of Leviticus of Moses",
        coptic: " `pjwm nte piLeuitikon `nte Mw`ucic",
        arabic: "  سفر اللاويين لموسى  ",
        englishcoptic: " Epgom ente pi-levitikon ente Moysis",
        arabiccoptic: " إبجوم انتى بيليفيتيكون انتى موسيس  . ",
      };
    case "Numbers":
      return {
        english: " The book of Numbers of Moses",
        coptic: " `pjwm `nte pi`ariqmoc`nte Mw`ucic",
        arabic: "  سفر العدد لموسى  ",
        englishcoptic: " Epgom ente pi-arithmos ente Moysis",
        arabiccoptic: " إبجوم انتى بي اريثموس انتى موسيس  . ",
      };
    case "Deuteronomy":
      return {
        english: " The book of Deuteronomy of Moses",
        coptic: " `pjwm nte Pideuteronomion `nte Mw`ucic",
        arabic: "سفر التثنية لموسى  ",
        englishcoptic: " Epgom ente Pidet-rono-meyon ente Moysis",
        arabiccoptic: "إبجوم انتى بيديترونوميون انتى موسيس  . ",
      };
    case "Isaiah":
      return {
        english: " Isaiah",
        coptic: "Hcai`hac",
        arabic: "  اشعياء ",
        englishcoptic: " Isa-eyas",
        arabiccoptic: " ايسائياس . ",
      };
    case "Jeremiah":
      return {
        english: " Jeremiah",
        coptic: "Iermiac",
        arabic: "  إرميا ",
        englishcoptic: " Yermeyas",
        arabiccoptic: " إريمياس",
      };
    case "Lamentations":
      return {
        english: " The Lamentations of Jeremiah",
        coptic: " qrinoi Iermiac",
        arabic: "مراثي إرميا ",
        englishcoptic: " Ethri-noi Yermeyas ",
        arabiccoptic: " إثرينوي إريمياس  ",
      };
    case "Wisdom":
      return {
        english: " The book of Wisdom of Solomon",
        coptic: " ;covi`a `nte Colomwn",
        arabic: "  سفر الحكمة لسليمان الحكيم ",
        englishcoptic: " Ti-Sofia ente Solomon ",
        arabiccoptic: " تي سوفياانتى سولومون ",
      };
    case "Proverbs":
      return {
        english: " The Proverbs of Solomon",
        coptic: " niparoimia `nte Colomwn",
        arabic: "  سفر الأمثال لسليمان الحكيم",
        englishcoptic: " ni-paroi-mia ente Solomon",
        arabiccoptic: " ني باروميا انتى سولومون ",
      };
    case "Job":
      return {
        english: " Job",
        coptic: " Iwb pi`qmhi",
        arabic: "  أيوب الصديق ",
        englishcoptic: " Yob pi-ethmi",
        arabiccoptic: " يوب بي إثمي",
      };
    case "Zechariah":
      return {
        english: " Zechariah",
        coptic: " Zaxariac",
        arabic: "  زكريا ",
        englishcoptic: " Zakhareyas",
        arabiccoptic: " زخارياس",
      };
    case "Micah":
      return {
        english: " Micah",
        coptic: " Mixeoc",
        arabic: "  ميخا",
        englishcoptic: " Mikhe-os",
        arabiccoptic: " ميخيئوس ",
      };
    case "Amos":
      return {
        english: " Amos",
        coptic: " Amoc",
        arabic: "  عاموس ",
        englishcoptic: " Amos",
        arabiccoptic: " اموس . ",
      };
    case "Joel":
      return {
        english: "Joel",
        coptic: " Iouhl",
        arabic: "  يوئيل ",
        englishcoptic: " Yo-eel",
        arabiccoptic: "يوئيل . ",
      };
    case "Jonah":
      return {
        english: " Jonah ",
        coptic: " Iwna ",
        arabic: "  يونان",
        englishcoptic: " Yona",
        arabiccoptic: "  يونا  ",
      };
    case "Nahum":
      return {
        english: " Nahum",
        coptic: " Naoum",
        arabic: "  ناحوم ",
        englishcoptic: " Na-om",
        arabiccoptic: " ناؤوم ",
      };
    case "Zephaniah":
      return {
        english: "Zephaniah",
        coptic: " Covoniac ",
        arabic: "  صفنيا",
        englishcoptic: " Sofonias",
        arabiccoptic: " صوفونياس ",
      };
    case "Sirach":
      return {
        english: "Joshua the son of Sirach",
        coptic: " Ihcou `p]hri `nCirax",
        arabic: "  يشوع ابن سيراخ  ",
        englishcoptic: " Isou epshiri en-Sirakh ",
        arabiccoptic: " ايسو ابشيري ان سيراخ ",
      };
    case "Tobit":
      return {
        english: "the book of Tobit",
        coptic: " ",
        arabic: "  طوبيا ",
        englishcoptic: "  ",
        arabiccoptic: " ",
      };
    case "Malachi":
      return {
        english: " Malachi",
        coptic: " Malaxiac",
        arabic: "  ملاخي ",
        englishcoptic: " Malakheyas",
        arabiccoptic: " مالاخياس",
      };
    case "Hosea":
      return {
        english: "Hosea",
        coptic: " Wci`e",
        arabic: " هوشع ",
        englishcoptic: " Osey-e ",
        arabiccoptic: " اوسيا ",
      };
    case "Kings1":
      return {
        english: "the Book of First Kings",
        coptic: " qmetouro `n a/",
        arabic: "  سفر الملوك الأول ",
        englishcoptic: " ethmetoro en o-weet",
        arabiccoptic: " إثميت أورو ان أوييت",
      };
    case "Ezekiel":
      return {
        english: "Ezekiel",
        coptic: " Iezekihl",
        arabic: "  حزقيال ",
        englishcoptic: " Ezeki-el",
        arabiccoptic: " إزيكييل ",
      };
    case "Daniel":
      return {
        english: "Daniel",
        coptic: " Danihl",
        arabic: "  دانيال ",
        englishcoptic: " Dani-eel",
        arabiccoptic: " دانييل . ",
      };
  }
};
const REPLACEHOMILYFATHERS = (father, part) => {
  switch (father) {
    case "Shenouda":
      return {
        english: " Shenouda the Archmandrite",
        coptic: " }enou; pi`arxhman`drithc",
        arabic: " شنودة رئيس المتوحدين  ",
        englishcoptic: " Shenouti pi-Arshi manedretees",
        arabiccoptic: " شينوتي بي أرشي مان ادراتيس  ",
      };
    case "John":
      return {
        english: " John Chrysostom",
        coptic: " Iwannhc pi`xrucoctomoc ",
        arabic: " يوحنا فم الذهب  ",
        englishcoptic: " Youannis pi-Ekhri-zostomos",
        arabiccoptic: " يؤانس بى إخري ذوستوموس",
      };
    case "Severus":
      return {
        english: " Severus",
        coptic: " Ceuhrianoc",
        arabic: " ساويروس",
        englishcoptic: " Severianos",
        arabiccoptic: " سيفيريانوس",
      };
    case "Athanasius":
      return {
        english: " Athanasius the Apostolic",
        coptic: " Aqanacioc pi`apotolikoc",
        arabic: " أثانسيوس الرسولى",
        englishcoptic: " أثانسيوس بى أبوسطوليكوس ",
        arabiccoptic: " Athanasius Pi-Apostolikos",
      };
  }
};

const REPLACEPOPE = (rule, part) => {
  return {
    english: bishopsList.POPE.English,
    coptic: bishopsList.POPE.Coptic,
    arabic: bishopsList.POPE.Arabic,
    englishcoptic: bishopsList.POPE.Englishcoptic,
    arabiccoptic: bishopsList.POPE.Arabiccoptic,
  };
};
const REPLACANTIOCHEPOPE = (rule, part) => {
  return {
    english: bishopsList.ANTIOCH_POPE.English,
    coptic: bishopsList.ANTIOCH_POPE.Coptic,
    arabic: bishopsList.ANTIOCH_POPE.Arabic,
    englishcoptic: bishopsList.ANTIOCH_POPE.Englishcoptic,
    arabiccoptic: bishopsList.ANTIOCH_POPE.Arabiccoptic,
  };
};
const REPLACEERITREANPOPE = (rule, part) => {
  return {
    english: bishopsList.ERITREAN_POPE.English,
    coptic: bishopsList.ERITREAN_POPE.Coptic,
    arabic: bishopsList.ERITREAN_POPE.Arabic,
    englishcoptic: bishopsList.ERITREAN_POPE.Englishcoptic,
    arabiccoptic: bishopsList.ERITREAN_POPE.Arabiccoptic,
  };
};

const REPLACEDIOCESEBISHOP = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  return {
    english: dioceseBishop?.English,
    coptic: dioceseBishop?.Coptic,
    arabic: dioceseBishop?.Arabic,
    englishcoptic: dioceseBishop?.Englishcoptic,
    arabiccoptic: dioceseBishop?.Arabiccoptic,
  };
};

const REPLACEMETROPOLITAINAVAILABLE = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);

  const metro1 = BishopsPresent.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  )[0];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};
const REPLACEMETROPOLITAINAVAILABLETWO = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const metro1 = BishopsPresent.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  )[1];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};
const REPLACEMETROPOLITAINAVAILABLETHREE = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const metro1 = BishopsPresent.filter(
    (bishop) =>
      bishop.Rank === "Metropolitan" && bishop.key !== dioceseBishop?.key
  )[2];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};

const REPLACEBISHOPAVAILABLE = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const metro1 = BishopsPresent.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  )[0];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};
const REPLACEBISHOPAVAILABLETWO = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const metro1 = BishopsPresent.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  )[1];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};
const REPLACEBISHOPAVAILABLETHREE = (rule, part) => {
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);

  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const metro1 = BishopsPresent.filter(
    (bishop) => bishop.Rank === "Bishop" && bishop.key !== dioceseBishop?.key
  )[2];
  return {
    english: metro1.English,
    coptic: metro1.Coptic,
    arabic: metro1.Arabic,
    englishcoptic: metro1.Englishcoptic,
    arabiccoptic: metro1.Arabiccoptic,
  };
};

function getAuthor(part, checkList) {
  const completePath = GetTodaysReadingPath(part.mother);

  if (completePath === "Katamaros") return "NONE";

  const book = bookPaths[completePath];

  if (!book) return undefined; // Handle potential missing book paths

  return checkList.find((item) => book.EnglishTitle.includes(item.keyword))
    ?.returnValue;
}

function getGospelAuthor(part) {
  const checkList = [
    { keyword: "Matthew", returnValue: 1 },
    { keyword: "Mark", returnValue: 2 },
    { keyword: "Luke", returnValue: 3 },
    { keyword: "John", returnValue: 4 },
  ];
  return getAuthor(part, checkList);
}

function getCatholicAuthor(part) {
  const checkList = [
    { keyword: "James", returnValue: "James" },
    { keyword: "Jude", returnValue: "Jude" },
    { keyword: "1 Peter", returnValue: "1Peter" },
    { keyword: "2 Peter", returnValue: "2Peter" },
    { keyword: "1 John", returnValue: "1John" },
    { keyword: "2 John", returnValue: "2John" },
    { keyword: "3 John", returnValue: "3John" },
  ];
  return getAuthor(part, checkList);
}

function getPaulineAuthor(part) {
  const checkList = [
    { keyword: "1 Timothy", returnValue: "1Timothy" },
    { keyword: "2 Timothy", returnValue: "2Timothy" },
    { keyword: "1 Thessalonians", returnValue: "1Thessalonians" },
    { keyword: "2 Thessalonians", returnValue: "2Thessalonians" },
    { keyword: "1 Corinthians", returnValue: "1Corinthians" },
    { keyword: "2 Corinthians", returnValue: "2Corinthians" },
    { keyword: "Titus", returnValue: "Titus" },
    { keyword: "Philemon", returnValue: "Philemon" },
    { keyword: "Hebrews", returnValue: "Hebrews" },
    { keyword: "Galatians", returnValue: "Galatians" },
    { keyword: "Ephesians", returnValue: "Ephesians" },
    { keyword: "Philippians", returnValue: "Philippians" },
    { keyword: "Colossians", returnValue: "Colossians" },
    { keyword: "Romans", returnValue: "Romans" },
    // Add other items to the checkList
  ];
  return getAuthor(part, checkList);
}
function getMatinsProphecyAuthor(part) {
  const newPart = {
    mother: part,
  };
  const checkList = [
    { keyword: "Genesis", returnValue: "Genesis" },
    { keyword: "Exodus", returnValue: "Exodus" },
    { keyword: "Leviticus", returnValue: "Leviticus" },
    { keyword: "Numbers", returnValue: "Numbers" },
    {
      keyword: "Deuteronomy",
      returnValue: "Deuteronomy",
    },
    { keyword: "Isaiah", returnValue: "Isaiah" },
    { keyword: "Jeremiah", returnValue: "Jeremiah" },
    { keyword: "Lamentations", returnValue: "Lamentations" },
    { keyword: "Wisdom", returnValue: "Wisdom" },
    { keyword: "Proverbs", returnValue: "Proverbs" },
    { keyword: "Job", returnValue: "Job" },
    { keyword: "Zechariah", returnValue: "Zechariah" },
    { keyword: "Micah", returnValue: "Micah" },
    { keyword: "Amos", returnValue: "Amos" },
    { keyword: "Joel", returnValue: "Joel" },
    { keyword: "Jonah", returnValue: "Jonah" },
    { keyword: "Nahum", returnValue: "Nahum" },
    { keyword: "Zephaniah", returnValue: "Zephaniah" },
    { keyword: "Joshua the son of Sirach", returnValue: "Sirach" },
    { keyword: "Malachi", returnValue: "Malachi" },
    { keyword: "Hosea", returnValue: "Hosea" },
    { keyword: "First Kings", returnValue: "Kings1" },
    { keyword: "Ezekiel", returnValue: "Ezekiel" },
    { keyword: "Daniel", returnValue: "Daniel" },
    { keyword: "Tobit", returnValue: "Tobit" },
  ];
  return getAuthor(newPart, checkList);
}
const VisibleRules = {
  COMERISEN: ComeRisenRule,
  ROICONCLUSION: ROICONCLUSION,
  GOSPEL_AUTHOR: REPLACEPASCHAGOSPELAUTHOR,
  STANDARD_GOSPEL_AUTHOR: REPLACEGOSPELAUTHOR,
  CATHOLIC_AUTHOR: REPLACECATHOLICAUTHOR,
  PAULINE_AUTHOR: REPLACEPAULINEAUTHOR,
  PASCHA_HOUR_DAY: REPLACPASCHAHOURDAY,
  PROPHECIES_AUTHOR: REPLACEPROPHETS,
  HOMILY_FATHER: REPLACEHOMILYFATHERS,
  POPE: REPLACEPOPE,
  ANTIOCH_POPE: REPLACANTIOCHEPOPE,
  ERITREAN_POPE: REPLACEERITREANPOPE,
  DIOCESE_BISHOP: REPLACEDIOCESEBISHOP,
  METROPOLITAIN_PRESENT: REPLACEMETROPOLITAINAVAILABLE,
  METROPOLITAIN_PRESENT2: REPLACEMETROPOLITAINAVAILABLETWO,
  METROPOLITAIN_PRESENT3: REPLACEMETROPOLITAINAVAILABLETHREE,
  BISHOP_PRESENT: REPLACEBISHOPAVAILABLE,
  BISHOP_PRESENT2: REPLACEBISHOPAVAILABLETWO,
  BISHOP_PRESENT3: REPLACEBISHOPAVAILABLETHREE,
  hide: hide,
  TennavRule: TennavRule,
  SundayThetokiaWeekdaysPraisesRule: SundayThetokiaWeekdaysPraisesRule,
  TheotokiaVisible: TheotokiaVisible,
  isStandard: isStandard,
  isStandardFraction: isStandardFraction,
  isStandardSeason: isStandardSeason,
  isStandardSeasonWithStMary: isStandardSeasonWithStMary,
  isKiahk: isKiahk,
  isKiahkSeason: isKiahkSeason,
  isLenten: isLenten,
  secondKiahkGospelResponse: secondKiahkGospelResponse,
  isSeason: isSeason,
  isStandardVespersPraises: isStandardVespersPraises,
  isKiahkVespersPraises: isKiahkVespersPraises,
  isLentenVespersPraises: isLentenVespersPraises,
  isNOTVespersPraises: isNOTVespersPraises,
  isKiahkWeek: isKiahkWeek,
  isWeekOfLent: isWeekOfLent,
  isWeekOfPentecost: isWeekOfPentecost,
  isLentVespersPraisesExpositionWeek: isLentVespersPraisesExpositionWeek,
  isInHolyFifties: isInHolyFifties,
  isNOTInHolyFifties: isNOTInHolyFifties,
  isMatins: isMatins,
  NativityFeastAndFast: NativityFeastAndFast,
  isVespers: isVespers,
  firstKiahkGospelResponse: firstKiahkGospelResponse,
  isPraises: isPraises,
  IsDiocesePope: IsDiocesePope,
  showLitanyOfDeparted: showLitanyOfDeparted,
  showLitanyOfTravelers: showLitanyOfTravelers,
  showLitanyOfOblations: showLitanyOfOblations,
  isLentAndJonah: isLentAndJonah,
  isLentWeekdayOrJonah: isLentWeekdayOrJonah,
  isLentWeekdayOnly: isLentWeekdayOnly,
  isLentWeekdayOrJonahAndLastFirstLent: isLentWeekdayOrJonahAndLastFirstLent,
  isLentWeekends: isLentWeekends,
  isNOTLentWeekdayOrJonah: isNOTLentWeekdayOrJonah,
  showArchangelMichaelAndGabriel: showArchangelMichaelAndGabriel,
  isWatos: isWatos,
  isAdam: isAdam,
  showVersesOfCymbalsFestiveConclusion: showVersesOfCymbalsFestiveConclusion,
  showGospelResponseFestiveConclusion: showGospelResponseFestiveConclusion,
  isBigFeast: isBigFeast,
  isPalmSunday: isPalmSunday,
  isNotPalmSunday: isNotPalmSunday,
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
  isPentecostFeast: isPentecostFeast,
  isApostlesFast: isApostlesFast,
  ISDioceseMetropolitain: ISDioceseMetropolitain,
  ISDioceseBishop: ISDioceseBishop,
  ISOneMetropolitain: ISOneMetropolitain,
  ISTwoMetropolitain: ISTwoMetropolitain,
  ISThreeMetropolitain: ISThreeMetropolitain,
  ISOneBishop: ISOneBishop,
  ISTwoBishop: ISTwoBishop,
  ISThreeBishop: ISThreeBishop,
  Is3PlusBishops: Is3PlusBishops,
  showWatosConclusion: showWatosConclusion,
  IsDioceseNotPope: IsDioceseNotPope,
  allButTwentyNinth: allButTwentyNinth,
  BishopIsPresent: BishopIsPresent,
  BishopIsPresentOrBigFeast: BishopIsPresentOrBigFeast,
  BishopIsNOTPresent: BishopIsNOTPresent,
  IsNonFastingDays: IsNonFastingDays,
  PioikSaint: PioikSaint,
  IsFastingDays: IsFastingDays,
  stMaryActsResponse: stMaryActsResponse,
  ArchangelGabrielShow: ArchangelGabrielShow,
  ProphecyShow: ProphecyShow,
  JohnTheBaptistShow: JohnTheBaptistShow,
  StandardAgiosShow: StandardAgiosShow,
  ISDioceseMetropolitainAlways: ISDioceseMetropolitainAlways,
  ISDioceseBishopAlways: ISDioceseBishopAlways,
  ShowSotees: ShowSotees,
  AlleluiaStandard: AlleluiaStandard,
  StandardROIConclusion: StandardROIConclusion,
  AdamConclusionDoxologies: AdamConclusionDoxologies,
  FeastsAndFastsOfStMary: FeastsAndFastsOfStMary,
  isLordsFeasts: isLordsFeasts,
  FeastsAndFastsOfStMaryAndHeavenlies: FeastsAndFastsOfStMaryAndHeavenlies,
  isFirstMondayOrLastFridayOfLent: isFirstMondayOrLastFridayOfLent,
};
export default VisibleRules;
