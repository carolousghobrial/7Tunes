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
  "[*DIOCESE_BISHOP*]",
  "[*METROPOLITAIN_PRESENT*]",
  "[*METROPOLITAIN_PRESENT2*]",
  "[*METROPOLITAIN_PRESENT3*]",
  "[*BISHOP_PRESENT*]",
  "[*BISHOP_PRESENT2*]",
  "[*BISHOP_PRESENT3*]",
];
const DailyReadingCalendar = require("../assets/json/DailyReadingCalendar.json");

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
    } else {
      processItem(item);
    }
  });

  addReturnButton();

  return [ViewArray, MenuArray];

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
  const myrule =
    foundKeyword === "EMPTY"
      ? null
      : matchRule(thisRule, part, foundKeyword.replace(/[\*\[\]/]/g, ""));
  let newPart = { ...part }; // Clone the 'part' object to avoid side effects
  if (myrule !== null) {
    newPart = {
      ...newPart,
      Arabic: newPart.Arabic?.replace(foundKeyword, myrule.arabic),
      Arabiccoptic: newPart.Arabiccoptic?.replace(
        foundKeyword,
        myrule.arabiccoptic
      ),
      Coptic: newPart.Coptic?.replace(foundKeyword, myrule.coptic),
      English: newPart.English?.replace(foundKeyword, myrule.english),
      Englishcoptic: newPart.Englishcoptic?.replace(
        foundKeyword,
        myrule.englishcoptic
      ),
      Rule: thisRule,
    };
  }

  return newPart;
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

  const isStandardSeasonSunday =
    currentSeason.key !== "GREAT_LENT" &&
    currentSeason.key !== "HOLY_50" &&
    currentSeason.dayOfWeek === 0 &&
    currentSeason.key !== "PALM_SUNDAY" &&
    currentSeason.key !== "RESURRECTION";

  const isStandardSeasonWeekday =
    currentSeason.key !== "GREAT_LENT" &&
    currentSeason.key !== "HOLY_50" &&
    currentSeason.dayOfWeek !== 0;
  const isLenten = currentSeason.key === "GREAT_LENT";
  const isPalmSunday = currentSeason.key === "PALM_SUNDAY";
  const isLazarusSaturday = currentSeason.key === "LAZARUS_SATURDAY";
  const isResurrection = currentSeason.key === "RESURRECTION";
  const isFifties = currentSeason.key === "HOLY_50";
  const isAscension = currentSeason.key === "ASCENSION";
  const isPentecost = currentSeason.key === "PENTECOST";
  if (isResurrection) {
    filePath = updateFilePath(`FiftiesResurrection`);
  } else if (isPalmSunday) {
    filePath = updateFilePath(`GreatFastWeek7Sunday`);
  } else if (isAscension) {
    filePath = updateFilePath(`FiftiesWeek6Thursday`);
  } else if (isPentecost) {
    filePath = updateFilePath(`FiftiesWeek7Sunday`);
  } else if (isLazarusSaturday) {
    filePath = updateFilePath(`GreatFastWeek7Saturday`);
  } else if (isStandardSeasonSunday) {
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29-Koiahk`);
    } else if (currentSeason.key === "TWENTYNINTHTH_COPTIC_MONTH") {
      const day =
        DailyReadingCalendar[currentSeason.copticMonth][
          currentSeason.copticDay.toString()
        ];
      if (day === "ok") {
        filePath = updateFilePath(
          `Days${
            currentSeason.copticMonth
          }${currentSeason.copticDay.toString()}`
        );
      }
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    } else if (currentSeason.key === "ANNUNCIATION") {
      filePath = updateFilePath(`DaysParemhotep29`);
    } else {
      const isHathorMonth = currentSeason.copticMonth === "Hathor";
      const isKoiahkMonth = currentSeason.copticMonth === "Koiahk";
      const isWeek1to4 =
        currentSeason.weekOfMonth >= 1 && currentSeason.weekOfMonth <= 4;
      const isWeek5 = currentSeason.weekOfMonth === 5;
      const isTakeFromHathorTwo = TakeFromHathorTwo(currentSeason);

      if (isWeek1to4) {
        filePath = updateFilePath(
          `Sundays${currentSeason.copticMonth}Week${currentSeason.weekOfMonth}`
        );
      } else if (isTakeFromHathorTwo && isHathorMonth && isWeek5) {
        filePath = updateFilePath("SundaysKoiahkWeek1");
      }
    }
  } else if (isStandardSeasonWeekday) {
    //KatamarosDaysEpep3ApipLiturgyActs
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29-Koiahk`);
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    } else if (currentSeason.key === "JONAH_FAST") {
      filePath = updateFilePath(
        `GreatFastJonah${daysOfWeek[currentSeason.dayOfWeek]}`
      );
    } else if (currentSeason.key === "JONAH_FEAST") {
      filePath = updateFilePath(`JonahPassover`);
    } else {
      //    //KatamarosDaysEpep3ApipLiturgyActs

      const day =
        DailyReadingCalendar[currentSeason.copticMonth][
          currentSeason.copticDay.toString()
        ];
      if (day === "ok") {
        filePath = updateFilePath(
          `Days${
            currentSeason.copticMonth
          }${currentSeason.copticDay.toString()}`
        );
      } else {
        // Extract the number
        let number = day.match(/\d+/)[0];

        // Extract the text
        let text = day.match(/[a-zA-Z]+/)[0];
        filePath = updateFilePath(`Days${text}${number}`);
      }
    }
  } else if (isFifties) {
    //KatamarosFiftiesWeek3SundayLiturgyActs
    filePath = updateFilePath(
      `FiftiesWeek${currentSeason.week}${daysOfWeek[currentSeason.dayOfWeek]}`
    );
  } else if (isLenten) {
    filePath = updateFilePath(
      `GreatFastWeek${currentSeason.week}${daysOfWeek[currentSeason.dayOfWeek]}`
    );
  }
  return filePath;

  function updateFilePath(commonPart) {
    const liturgyPaths = [
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
    ];
    if (liturgyPaths.includes(path)) {
      return filePath + commonPart + path;
    } else {
      return filePath;
    }
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
