import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import moment from "moment-timezone"; // moment-timezone

import bookPaths from "../helpers/bookPathsHelpers";
import homescreenPaths from "../helpers/homescreenPaths";
import VisibleRules from "../helpers/visibleRules";
import {
  getCopticDateString,
  getCopticDate,
  getParamounDate,
} from "../helpers/copticMonthsHelper";
export const keywords = [
  "[*TEMP*]",
  "[*COME/RISEN*]",
  "[*ROICONCLUSION*]",
  "[*GOSPEL_AUTHOR*]",
  "[*PROPHECIES_AUTHOR*]",
  "[*PASCHA_HOUR_DAY*]",
  "[*HOMILY_FATHER*]",
  "[*STANDARD_GOSPEL_AUTHOR*]",
  "[*CATHOLIC_AUTHOR*]",
  "[*PAULINE_AUTHOR*]",
  "[*POPE*]",
  "[*ANTIOCH_POPE*]",
  "[*ERITREAN_POPE*]",
  "[*DIOCESE_BISHOP*]",
  "[*METROPOLITAIN_PRESENT*]",
  "[*METROPOLITAIN_PRESENT2*]",
  "[*METROPOLITAIN_PRESENT3*]",
  "[*BISHOP_PRESENT*]",
  "[*BISHOP_PRESENT2*]",
  "[*BISHOP_PRESENT3*]",
];
const DailyReadingCalendar = require("../assets/json/DailyReadingCalendar.json");
const GreatFastPropheciesCount = require("../assets/json/GreatFastPropheciesCount.json");
const ProphecycheckList = [
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
export function getFullViewModel(motherSource, mother) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";
  const ViewArray = [];
  const MenuArray = [];
  let key = 0;

  const hymns = homescreenPaths[motherSource]?.Main || [];
  const visibleHymns = hymns.filter((hymn) =>
    isHymnVisible(hymn, motherSource, mother)
  );

  visibleHymns.forEach((item) => {
    if (item.Type === "Title") {
      updateTitles(item);
    } else if (item.Type === "PropheciesType") {
      addPropheciesForDay();
      //updateTitles(item);
    } else {
      processItem(item);
    }
  });

  addReturnButton();

  return [ViewArray, MenuArray];
  function addPropheciesForDay() {
    const currentSeason = useSelector((state) => state.settings.currentSeason);
    if (!["GREAT_LENT", "JONAH_FAST"].includes(currentSeason.key)) return;
    if (currentSeason.key === "JONAH_FAST") {
      const dayOfWeek = daysOfWeek[currentSeason.dayOfWeek];
      const propheciesCount =
        GreatFastPropheciesCount?.["Jonah"]?.[dayOfWeek] || 0;

      for (let i = 1; i <= propheciesCount; i++) {
        const readingPath = `KatamarosGreatFastJonah${dayOfWeek}MatinsProphecy${i}`;
        const book = bookPaths[readingPath];

        if (!book) continue; // Skip if book path is missing

        const rule = ProphecycheckList.find((item) =>
          book.EnglishTitle.includes(item.keyword)
        )?.returnValue;
        [
          ["PaschaPropheciesIntroduction", rule],
          [readingPath, 0],
          ["PaschaPropheciesConclusion", 0],
        ].forEach(([path, ruleValue]) => {
          const [view, menu, updatedKey] = getMain(
            path,
            motherSource,
            false,
            ruleValue,
            key
          );
          key = updatedKey;
          ViewArray.push(...view);
          if (menu) MenuArray.push(...menu);
        });
      }
    } else {
      const lentWeek = `Week${currentSeason.week}`;
      const dayOfWeek = daysOfWeek[currentSeason.dayOfWeek];
      const propheciesCount =
        GreatFastPropheciesCount?.[lentWeek]?.[dayOfWeek] || 0;

      for (let i = 1; i <= propheciesCount; i++) {
        const readingPath = `KatamarosGreatFast${lentWeek}${dayOfWeek}MatinsProphecy${i}`;
        const book = bookPaths[readingPath];

        if (!book) continue; // Skip if book path is missing

        const rule = ProphecycheckList.find((item) =>
          book.EnglishTitle.includes(item.keyword)
        )?.returnValue;
        [
          ["PaschaPropheciesIntroduction", rule],
          [readingPath, 0],
          ["PaschaPropheciesConclusion", 0],
        ].forEach(([path, ruleValue]) => {
          const [view, menu, updatedKey] = getMain(
            path,
            motherSource,
            false,
            ruleValue,
            key
          );
          key = updatedKey;
          ViewArray.push(...view);
          if (menu) MenuArray.push(...menu);
        });
      }
    }
  }

  // Helper functions
  function isHymnVisible(hymn, motherSource, mother) {
    const temppath = hymn.SAINT || hymn.Path;
    const tempMother = mother || motherSource;
    return (
      hymn.Visible === true ||
      mother === "index" ||
      VisibleRules[hymn.Visible]?.(tempMother, temppath)
    );
  }

  function updateTitles(item) {
    arabicttl = item.Arabic || arabicttl;
    copticttl = item.Coptic || copticttl;
    englishttl = item.English || englishttl;
  }

  function processItem(item) {
    const typeHandlers = {
      Main: processMainOrDefault,
      Default: processMainOrDefault,
      MainWithTitle: processMainWithTitle,
      Ritual: processRitualOrGetDaysReading,
      GetDaysReading: processRitualOrGetDaysReading,
      default: () => pushToArrays(item, key++, false),
    };

    (typeHandlers[item.Type] || typeHandlers.default)(item);
  }

  function processMainOrDefault(item) {
    const [tempView, tempMenu, updatedKey] = getMain(
      item.Path,
      motherSource,
      false,
      item.Rule,
      key,
      item.Switch
    );
    key = updatedKey;
    ViewArray.push(...tempView);
    MenuArray.push(...tempMenu);
  }

  function processMainWithTitle(item) {
    const [tempView, tempMenu, updatedKey] = getMainWithTitle(
      item.Path,
      motherSource,
      item.Rule,
      key
    );
    key = updatedKey;
    ViewArray.push(...tempView);
    MenuArray.push(...tempMenu);
  }

  function processRitualOrGetDaysReading(item) {
    if (item.Type === "GetDaysReading") {
      const filePath = GetTodaysReadingPath(item.Path);
      if (filePath !== "Katamaros") {
        const [tempView, tempMenu, updatedKey] = getMain(
          filePath,
          motherSource,
          false,
          item.Rule,
          key,
          undefined
        );
        key = updatedKey;
        ViewArray.push(...tempView);
        MenuArray.push(...tempMenu);
      }
    } else {
      pushToArrays(item, key++, true);
    }
  }

  function pushToArrays(item, currentKey, isRitual) {
    const { English, Coptic, Arabic } = item;

    if (!isRitual) {
      MenuArray.push({
        EnglishTitle: English,
        CopticTitle: Coptic,
        ArabicTitle: Arabic,
        key: currentKey,
      });
    }

    ViewArray.push({
      part: item,
      key: currentKey,
      EnglishTitle: englishttl,
      CopticTitle: copticttl,
      ArabicTitle: arabicttl,
    });
  }

  function addReturnButton() {
    const returnButton = {
      Type: "Button",
      Arabic: " العودة",
      English: "Return",
      Rule: "PopPage",
      Visible: true,
      Path: "",
    };
    pushToArrays(returnButton, key++);
  }
}

export function getMain(Path, motherSource, inHymn, rule, key, switchWord) {
  const thisRule = rule;
  const myMenuArray = [];
  const myViewArray = [];
  const book = bookPaths[Path];

  try {
    const { ArabicTitle, CopticTitle, EnglishTitle, Hymn } = book;

    if (!inHymn && EnglishTitle) {
      const menuEntry = { EnglishTitle, CopticTitle, ArabicTitle, key };
      myMenuArray.push(menuEntry);

      myViewArray.push({
        EnglishTitle,
        CopticTitle,
        ArabicTitle,
        part: {
          Type: "Title",
          rule: -1,
          visible: 0,
          Side: "Title",
          Arabic: ArabicTitle,
          Coptic: CopticTitle,
          English: EnglishTitle,
          Switch: switchWord,
          Path,
        },
        key,
      });

      key++;
    }

    const visibleParts = Hymn.filter((part) =>
      isPartVisible(part, motherSource)
    );

    visibleParts.forEach((part) => {
      key = processInnerPart(
        part,
        motherSource,
        thisRule,
        key,
        myViewArray,
        Path,
        {
          EnglishTitle,
          CopticTitle,
          ArabicTitle,
        }
      );
    });
  } catch (err) {
    myMenuArray.pop();
    // console.error(err);
  }

  return [myViewArray, myMenuArray, key];
}

function processInnerPart(
  part,
  motherSource,
  thisRule,
  key,
  myViewArray,
  Path,
  titles
) {
  const { EnglishTitle, CopticTitle, ArabicTitle } = titles;

  const addViewEntry = (addPart) => {
    myViewArray.push({
      part: addPart,
      path: Path,
      key,
      EnglishTitle,
      CopticTitle,
      ArabicTitle,
    });
    key++;
  };

  const handlers = {
    Main: () => {
      const [tempView, , newKey] = getMain(
        part.Path,
        motherSource,
        true,
        thisRule,
        key
      );
      myViewArray.push(...tempView);
      key = newKey;
    },
    GetDaysReading: () => {
      const filePath = GetTodaysReadingPath(part.Path);
      if (filePath !== "Katamaros") {
        const [tempView, , newKey] = getMain(
          filePath,
          motherSource,
          false,
          thisRule,
          key
        );
        myViewArray.push(...tempView);
        key = newKey;
      }
    },
    GetDaysReadingPalmSunday: () => {
      const [tempView, , newKey] = getMain(
        part.Path,
        motherSource,
        false,
        thisRule,
        key
      );
      myViewArray.push(...tempView);
      key = newKey;
    },
    default: () => {
      const newRule = thisRule || motherSource;
      const addPart = addItemsToArray(part, newRule);
      addViewEntry(addPart);
    },
  };

  (handlers[part.Type] || handlers.default)();
  return key;
}

export function getMainWithTitle(Path, motherSource, rule, key) {
  const thisRule = rule;
  const myMenuArray = [];
  const myViewArray = [];
  const book = bookPaths[Path];

  try {
    const { ArabicTitle, CopticTitle, EnglishTitle, Hymn } = book;

    // Process title if it exists
    if (EnglishTitle) {
      const menuEntry = { EnglishTitle, CopticTitle, ArabicTitle, key };
      myMenuArray.push(menuEntry);

      const titleView = {
        EnglishTitle,
        CopticTitle,
        ArabicTitle,
        part: {
          Type: "Title",
          rule: -1,
          visible: 0,
          Side: "Title",
          Arabic: ArabicTitle,
          Coptic: CopticTitle,
          English: EnglishTitle,
          Switch: switchWord,
          Path: Path,
        },
        key,
      };
      myViewArray.push(titleView);
      key++;
    }

    // Filter and process visible hymn parts
    Hymn.filter((part) => isPartVisible(part, motherSource)).forEach((part) => {
      key = processPart(part, motherSource, thisRule, key, myViewArray, Path, {
        EnglishTitle,
        CopticTitle,
        ArabicTitle,
      });
    });
  } catch (err) {
    myMenuArray.pop();
  }

  return [myViewArray, myMenuArray, key];
}

// Helper function to check if a part is visible
function isPartVisible(part, motherSource) {
  const temppath =
    part.SAINT && !motherSource?.toLowerCase().includes("index")
      ? part.SAINT
      : part.Path;

  return (
    part.Visible === true ||
    VisibleRules[part.Visible]?.(motherSource, temppath) ||
    (motherSource?.toLowerCase().includes("index") &&
      !motherSource?.toLowerCase().includes("papal"))
  );
}

function processPart(
  part,
  motherSource,
  thisRule,
  key,
  myViewArray,
  Path,
  titles
) {
  const { EnglishTitle, CopticTitle, ArabicTitle } = titles;

  const addViewEntry = (partDetails) => {
    myViewArray.push({
      part: partDetails,
      path: Path,
      key,
      EnglishTitle,
      CopticTitle,
      ArabicTitle,
    });
    key++;
  };

  const processMain = (path, withTitle = false) => {
    const func = withTitle ? getMainWithTitle : getMain;
    const [tempView, , newKey] = func(
      path,
      motherSource,
      withTitle,
      thisRule,
      key
    );
    myViewArray.push(...tempView);
    key = newKey;
  };

  const handlers = {
    Main: () => processMain(part.Path),
    GetDaysReading: () => {
      const filePath = GetTodaysReadingPath(part.Path);
      if (filePath !== "Katamaros") processMain(filePath);
    },
    GetDaysReadingPalmSunday: () => processMain(part.Path, true),
    default: () => {
      const newRule = thisRule || motherSource;
      const partDetails = addItemsToArray(part, newRule);
      addViewEntry(partDetails);
    },
  };

  (handlers[part.Type] || handlers.default)();
  return key;
}

function addItemsToArray(part, thisRule) {
  const foundKeyword = findMatchingSubstring(part.English, keywords);
  if (foundKeyword === "EMPTY") return part; // Early return if no match

  const cleanedKeyword = foundKeyword.replace(/[\*\[\]/]/g, "");
  const myrule = matchRule(thisRule, part, cleanedKeyword);
  if (!myrule) return part; // If no rule is found, return original part

  // Clone and update only when necessary
  const updatedPart = { ...part, Rule: thisRule };
  const replacements = {
    Arabic: myrule.arabic,
    Arabiccoptic: myrule.arabiccoptic,
    Coptic: myrule.coptic,
    English: myrule.english,
    Englishcoptic: myrule.englishcoptic,
  };

  Object.keys(replacements).forEach((key) => {
    if (updatedPart[key]) {
      updatedPart[key] = updatedPart[key].replace(
        foundKeyword,
        replacements[key]
      );
    }
  });

  return updatedPart;
}

const matchRule = (rule, part, item) => {
  return VisibleRules[item]?.(rule, part);
};

export function TakeFromHathorTwo(currentSeason) {
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

  let firstDay = moment([
    currentSeason.gregorianYear,
    copticMonthFound.month - 1,
    copticMonthFound.day +
      (copticDate.month === "Hathor" && copticDate.day === 30 ? 1 : 0),
  ]);
  // Calculate the number of days in the month
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
  if (numSundays < 4) {
    return true;
  } else {
    return false;
  }
}
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export function GetTodaysReadingPath(path) {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  let filePath = "Katamaros";

  const { key, dayOfWeek, week, copticMonth, copticDay, weekOfMonth } =
    currentSeason;

  const isStandardSeasonSunday =
    !["GREAT_LENT", "HOLY_50", "PALM_SUNDAY", "RESURRECTION"].includes(key) &&
    dayOfWeek === 0;
  const isStandardSeasonWeekday =
    !["GREAT_LENT", "HOLY_50"].includes(key) && dayOfWeek !== 0;

  const seasonMappings = {
    RESURRECTION: "FiftiesResurrection",
    PALM_SUNDAY: "GreatFastWeek7Sunday",
    ASCENSION: "FiftiesWeek6Thursday",
    PENTECOST: "FiftiesWeek7Sunday",
    LAZARUS_SATURDAY: "GreatFastWeek7Saturday",
    HOLY_50: `FiftiesWeek${week}${daysOfWeek[dayOfWeek]}`,
    GREAT_LENT: `GreatFastWeek${week}${daysOfWeek[dayOfWeek]}`,
  };

  if (seasonMappings[key]) {
    return updateFilePath(seasonMappings[key]);
  }

  if (isStandardSeasonSunday) {
    return getStandardSeasonSundayPath();
  }

  if (isStandardSeasonWeekday) {
    return getStandardSeasonWeekdayPath();
  }

  return filePath;

  /** Updates the file path based on common part */
  function updateFilePath(commonPart) {
    const liturgyPaths = new Set([
      "VespersPsalm",
      "VespersGospel",
      "MatinsPsalm",
      "MatinsProphecy1",
      "MatinsProphecy2",
      "MatinsProphecy3",
      "MatinsProphecy4",
      "MatinsProphecy5",
      "MatinsProphecy6",
      "MatinsProphecy7",
      "MatinsProphecy8",
      "MatinsProphecy9",
      "MatinsProphecy10",
      "MatinsProphecy11",
      "MatinsGospel",
      "LiturgyPauline",
      "LiturgyCatholic",
      "LiturgyActs",
      "LiturgyPsalm",
      "LiturgyGospel",
      "LiturgyPaulineCoptic",
      "LiturgyCatholicCoptic",
      "LiturgyActsCoptic",
      "EveningPsalm",
      "EveningGospel",
    ]);

    return liturgyPaths.has(path)
      ? `${filePath}${commonPart}${path}`
      : filePath;
  }

  /** Determines Sunday readings */
  function getStandardSeasonSundayPath() {
    const specialDays = {
      NATIVITY: "DaysKoiahk29",
      EPIPHANY: "DaysTobe11",
      ANNUNCIATION: "DaysParemhotep29",
    };

    if (specialDays[key]) {
      return updateFilePath(specialDays[key]);
    }

    if (
      key === "TWENTYNINTHTH_COPTIC_MONTH" &&
      DailyReadingCalendar[copticMonth][copticDay] === "ok"
    ) {
      return updateFilePath(`Days${copticMonth}${copticDay}`);
    }

    if (weekOfMonth >= 1 && weekOfMonth <= 4) {
      return updateFilePath(`Sundays${copticMonth}Week${weekOfMonth}`);
    }

    if (
      TakeFromHathorTwo(currentSeason) &&
      copticMonth === "Hathor" &&
      weekOfMonth === 5
    ) {
      return updateFilePath("SundaysKoiahkWeek1");
    }

    return filePath;
  }

  /** Determines weekday readings */
  function getStandardSeasonWeekdayPath() {
    const specialDays = {
      NATIVITY: "DaysKoiahk29",
      EPIPHANY: "DaysTobe11",
      JONAH_FAST: `GreatFastJonah${daysOfWeek[dayOfWeek]}`,
      JONAH_FEAST: "JonahPassover",
    };

    if (specialDays[key]) {
      return updateFilePath(specialDays[key]);
    }

    const day = DailyReadingCalendar[copticMonth]?.[copticDay];
    if (day === "ok") {
      return updateFilePath(`Days${copticMonth}${copticDay}`);
    }

    const matches = day?.match(/(\d+)|([a-zA-Z]+)/g);
    return matches
      ? updateFilePath(`Days${matches[1] || ""}${matches[2] || ""}`)
      : filePath;
  }
}

function findMatchingSubstring(str, substringsArray) {
  const foundSubstring = substringsArray.find((substring) =>
    str?.includes(substring)
  );
  return foundSubstring ? foundSubstring : "EMPTY";
}
function countSundays(yearSelected) {
  const { month: copticMonth, day: copticDay } = CopticMonthObjects.find(
    (month) => month.name === "Koiahk"
  );

  const copticDate = getCopticDate(yearSelected, copticMonth - 1, copticDay);
  const isHathorEnd = copticDate.month === "Hathor" && copticDate.day === 30;

  const firstDay = moment([
    yearSelected,
    copticMonth - 1,
    copticDay + (isHathorEnd ? 1 : 0),
  ]);

  const lastDay = moment(getParamounDate(moment([yearSelected + 1, 0, 7])));

  const numSundays = Array.from(
    { length: lastDay.diff(firstDay, "days") },
    (_, i) => firstDay.clone().add(i, "days")
  ).filter((day) => day.day() === 0).length;

  return numSundays;
}
