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
export function getFullViewModel(motherSource, mother) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";
  const ViewArray = [];
  const MenuArray = [];
  let key = 0;
  const visibleHymns = homescreenPaths[motherSource].Main.filter((hymn) => {
    const temppath = hymn.SAINT || hymn.Path;
    const tempMother = mother || motherSource;

    return (
      hymn.Visible === true ||
      mother === "index" ||
      VisibleRules[hymn.Visible]?.(tempMother, temppath)
    );
  }).forEach((item) => {
    if (item.type === "Title") {
      ({ Arabic, Coptic, English } = item);
    } else {
      switch (item.Type) {
        case "Main":
        case "Default":
          processMainOrDefault(item);
          break;
        case "Ritual":
        case "GetDaysReading":
          processRitualOrGetDaysReading(item);
          break;
        default:
          pushToArrays(item, key++, false);
          break;
      }
    }
  });

  function processMainOrDefault(item) {
    const [tempView, tempMenu, mykey] = getMain(
      item.Path,
      motherSource,
      false,
      item.Rule,
      key,
      item.Switch
    );
    key = mykey;
    ViewArray.push(...tempView);
    MenuArray.push(...tempMenu);
  }

  function processRitualOrGetDaysReading(item) {
    if (item.Type === "GetDaysReading") {
      const filePath = GetTodaysReadingPath(item.Path);
      if (filePath !== "Katamaros") {
        const [tempView, tempMenu, mykey] = getMain(
          filePath,
          motherSource,
          false,
          item.Rule,
          key,
          undefined
        );
        key = mykey;
        ViewArray.push(...tempView);
        MenuArray.push(...tempMenu);
      }
    } else {
      pushToArrays(item, key++, true);
    }
  }

  pushToArrays(
    {
      Type: "Button",
      Arabic: " العودة",
      English: "Return",
      Rule: "PopPage",
      Visible: true,
      Path: "",
    },
    key++
  );

  return [ViewArray, MenuArray];

  function pushToArrays(item, currentKey, ritual) {
    const { English, Coptic, Arabic } = item;
    if (!ritual) {
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
}

export function getMain(Path, motherSource, inHymn, rule, key, switchWord) {
  const thisRule = rule;
  const myMenuArray = [];
  const myViewArray = [];
  const book = bookPaths[Path];
  try {
    const { ArabicTitle, CopticTitle, EnglishTitle, Hymn } = book;
    if (!inHymn && EnglishTitle !== undefined && EnglishTitle !== "") {
      const menuEntry = {
        EnglishTitle,
        CopticTitle,
        ArabicTitle,
        key,
      };

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
          Path: Path,
        },
        key,
      });

      key++;
    }

    const visibleParts = Hymn.filter((part) => {
      const temppath =
        part.SAINT !== undefined &&
        !motherSource?.toLowerCase().includes("index")
          ? part.SAINT
          : part.Path;

      const isPartVisible =
        part.Visible === true ||
        VisibleRules[part.Visible]?.(motherSource, temppath) ||
        (motherSource?.toLowerCase().includes("index") &&
          !motherSource?.toLowerCase().includes("papal"));

      return isPartVisible;
    }).forEach((part) => {
      const processMainType = () => {
        const [tempView, , mykey] = getMain(
          part.Path,
          motherSource,
          true,
          thisRule,
          key
        );
        key = mykey;
        myViewArray.push(...tempView);
      };

      const processGetDaysReadingType = () => {
        const filePath = GetTodaysReadingPath(part.Path);
        if (filePath !== "Katamaros") {
          const [tempView, , mykey] = getMain(
            filePath,
            motherSource,
            false,
            thisRule,
            key
          );
          key = mykey;
          myViewArray.push(...tempView);
        }
      };

      const processOtherTypes = () => {
        const addPart = addItemsToArray(part, thisRule);
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

      switch (part.Type) {
        case "Main":
          processMainType();
          break;
        case "GetDaysReading":
          processGetDaysReadingType();
          break;
        default:
          processOtherTypes();
          break;
      }
    });
  } catch (err) {
    myViewArray.pop();
    myMenuArray.pop();
    console.error(err);
  }

  return [myViewArray, myMenuArray, key];
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
  if (isStandardSeasonSunday) {
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29`);
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    } else {
      const isHathorMonth = currentSeason.copticMonth === "Hathor";
      const isKoiahkMonth = currentSeason.copticMonth === "Koiahk";
      const isWeek1to4 =
        currentSeason.weekOfMonth >= 1 && currentSeason.weekOfMonth <= 4;
      const isWeek5 = currentSeason.weekOfMonth === 5;
      const isTakeFromHathorTwo = TakeFromHathorTwo(currentSeason);

      if (isWeek1to4) {
        filePath = updateFilePath(
          `Sundays${currentSeason.copticMonth}Week${
            isTakeFromHathorTwo && isKoiahkMonth
              ? currentSeason.weekOfMonth + 1
              : currentSeason.weekOfMonth
          }`
        );
      } else if (isTakeFromHathorTwo && isHathorMonth && isWeek5) {
        filePath = updateFilePath("SundaysKoiahkWeek1");
      }
    }
  } else if (isStandardSeasonWeekday) {
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29`);
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    } else if (currentSeason.key === "JONAH_FAST") {
      filePath = updateFilePath(
        `GreatFastJonah${daysOfWeek[currentSeason.dayOfWeek]}`
      );
    } else if (currentSeason.key === "JONAH_FEAST") {
      filePath = updateFilePath(`JonahPassover`);
    }
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
      "MatinsGospel",
      "LiturgyPauline",
      "LiturgyCatholic",
      "LiturgyActs",
      "LiturgyPsalm",
      "LiturgyGospel",
      "LiturgyPaulineCoptic",
      "LiturgyCatholicCoptic",
      "LiturgyActsCoptic",
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
  const copticMonthFound = CopticMonthObjects.find(
    (month) => month.name === "Koiahk"
  );

  const copticDate = getCopticDate(
    yearSelected,
    copticMonthFound.month - 1,
    copticMonthFound.day
  );

  let firstDay = moment([
    yearSelected,
    copticMonthFound.month - 1,
    copticMonthFound.day +
      (copticDate.month === "Hathor" && copticDate.day === 30 ? 1 : 0),
  ]);

  // Calculate the number of days in the month
  const lastDay = moment(getParamounDate(moment([yearSelected + 1, 0, 7])));

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
  return numSundays;
}
