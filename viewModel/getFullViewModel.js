import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import moment from "moment-timezone"; // moment-timezone

import {
  ComeRisenRule,
  REPLACEPAULINEAUTHOR,
  ROICONCLUSION,
  REPLACECATHOLICAUTHOR,
  REPLACEGOSPELAUTHOR,
  REPLACEPROPHETS,
  REPLACPASCHAHOURDAY,
  REPLACEHOMILYFATHERS,
  REPLACEPOPE,
  REPLACANTIOCHEPOPE,
  REPLACEDIOCESEBISHOP,
  REPLACEMETROPOLITAINAVAILABLE,
  REPLACEMETROPOLITAINAVAILABLETWO,
  REPLACEMETROPOLITAINAVAILABLETHREE,
  REPLACEBISHOPAVAILABLE,
  REPLACEBISHOPAVAILABLETWO,
  REPLACEBISHOPAVAILABLETHREE,
} from "../helpers/replacingRules";

import bookPaths from "../helpers/bookPathsHelpers";
import homescreenPaths from "../helpers/homescreenPaths";
import VisibleRules from "../helpers/visibleRules";
import {
  getCopticDateString,
  getCopticDate,
  getParamounDate,
} from "../helpers/copticMonthsHelper";

export function getFullViewModel(motherSource, mother) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";
  const ViewArray = [];
  const MenuArray = [];
  let key = 0;

  const homeItems = homescreenPaths[motherSource];
  homeItems.Main.forEach((item) => {
    if (item.type === "Title") {
      arabicttl = item.Arabic;
      copticttl = item.Coptic;
      englishttl = item.English;
    } else {
      let temppath = item.SAINT ?? item.Path;
      let tempMother = mother ?? motherSource;

      const isVisible =
        item.Visible === true ||
        mother === "index" ||
        VisibleRules[item.Visible](tempMother, temppath);

      if (isVisible) {
        switch (item.Type) {
          case "Main":
          case "Default":
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
            break;
          case "Ritual":
            ViewArray.push({
              part: item,
              key,
              EnglishTitle: englishttl,
              CopticTitle: copticttl,
              ArabicTitle: arabicttl,
            });
            key++;
            break;
          case "GetDaysReading":
            var filePath = GetTodaysReadingPath(item.Path);
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
            break;
          default:
            MenuArray.push({
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
              key,
            });
            ViewArray.push({
              part: item,
              key,
              EnglishTitle: englishttl,
              CopticTitle: copticttl,
              ArabicTitle: arabicttl,
            });
            key++;
            break;
        }
      }
    }
  });

  ViewArray.push({
    part: {
      Type: "Button",
      Arabic: " العودة",
      English: "Return",
      Rule: "PopPage",
      Visible: true,
      Path: "",
    },
    key: key,
    EnglishTitle: undefined,
    CopticTitle: undefined,
    ArabicTitle: undefined,
  });

  return [ViewArray, MenuArray];
}

export function getMain(Path, motherSource, inHymn, rule, key, switchWord) {
  const thisRule = rule;
  const myMenuArray = [];
  const myViewArray = [];
  const book = bookPaths[Path];
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
  Hymn.forEach((part) => {
    const temppath =
      part.SAINT !== undefined && !motherSource?.toLowerCase().includes("index")
        ? part.SAINT
        : part.Path;

    const isVisible =
      part.Visible === true ||
      VisibleRules[part.Visible](motherSource, temppath) ||
      (motherSource?.toLowerCase().includes("index") &&
        !motherSource?.toLowerCase().includes("papal"));

    if (!isVisible) return;

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

  return [myViewArray, myMenuArray, key];
}

export function addItemsToArray(part, thisRule) {
  let newPart = { ...part }; // Clone the 'part' object to avoid side effects
  const keywords = [
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
  ]; // Default replacing word
  let myrule = {};
  if (thisRule !== 0 && thisRule != undefined) {
    // Check for specific cases and apply the corresponding rule
    if (part.Type === "Base") {
      const foundKeyword = findMatchingSubstring(part.English, keywords);

      switch (foundKeyword) {
        case "[*COME/RISEN*]":
          myrule = ComeRisenRule();
          break;
        case "[*ROICONCLUSION*]":
          myrule = ROICONCLUSION();
          break;
        case "[*GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(thisRule);
          break;
        case "[*STANDARD_GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(getGospelAuthor(part));
          break;
        case "[*CATHOLIC_AUTHOR*]":
          myrule = REPLACECATHOLICAUTHOR(getCatholicAuthor(part));
          break;
        case "[*PAULINE_AUTHOR*]":
          myrule = REPLACEPAULINEAUTHOR(getPaulineAuthor(part));
          break;
        case "[*PASCHA_HOUR_DAY*]":
          myrule = REPLACPASCHAHOURDAY(thisRule);
          break;
        case "[*PROPHECIES_AUTHOR*]":
          myrule = REPLACEPROPHETS(thisRule);
          break;
        case "[*HOMILY_FATHER*]":
          myrule = REPLACEHOMILYFATHERS(thisRule);
          break;
        case "[*POPE*]":
          myrule = REPLACEPOPE();
          break;
        case "[*ANTIOCH_POPE*]":
          myrule = REPLACANTIOCHEPOPE();
          break;
        case "[*DIOCESE_BISHOP*]":
          myrule = REPLACEDIOCESEBISHOP();
          break;
        case "[*METROPOLITAIN_PRESENT*]":
          myrule = REPLACEMETROPOLITAINAVAILABLE();
          break;
        case "[*METROPOLITAIN_PRESENT2*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETWO();
          break;
        case "[*METROPOLITAIN_PRESENT3*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETHREE();
          break;
        case "[*BISHOP_PRESENT*]":
          myrule = REPLACEBISHOPAVAILABLE();
          break;
        case "[*BISHOP_PRESENT2*]":
          myrule = REPLACEBISHOPAVAILABLETWO();
          break;
        case "[*BISHOP_PRESENT3*]":
          myrule = REPLACEBISHOPAVAILABLETHREE();
          break;
        default:
          myrule = {
            english: "..",
            coptic: "..",
            arabic: "..",
            englishcoptic: "..",
            arabiccoptic: "..",
          };
          break;
      }
      // Apply the rule to the 'newPart' object properties
      if (myrule !== undefined) {
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
    } else if (part.Type === "Melody") {
      const foundKeyword = findMatchingSubstring(part.English, keywords);
      switch (foundKeyword) {
        case "[*COME/RISEN*]":
          myrule = ComeRisenRule();
          break;
        case "[*ROICONCLUSION*]":
          myrule = ROICONCLUSION();
          break;
        case "[*GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(thisRule);
          break;
        case "[*STANDARD_GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(getGospelAuthor(part));

          break;
        case "[*CATHOLIC_AUTHOR*]":
          myrule = REPLACECATHOLICAUTHOR(getCatholicAuthor(part));
          break;
        case "[*PAULINE_AUTHOR*]":
          myrule = REPLACEPAULINEAUTHOR(getPaulineAuthor(part));
          break;
        case "[*PASCHA_HOUR_DAY*]":
          myrule = REPLACPASCHAHOURDAY(thisRule);
          break;
        case "[*PROPHECIES_AUTHOR*]":
          myrule = REPLACEPROPHETS(thisRule);
          break;
        case "[*POPE*]":
          myrule = REPLACEPOPE();
          break;
        case "[*ANTIOCH_POPE*]":
          myrule = REPLACANTIOCHEPOPE();
          break;
        case "[*DIOCESE_BISHOP*]":
          myrule = REPLACEDIOCESEBISHOP();
          break;
        case "[*METROPOLITAIN_PRESENT*]":
          myrule = REPLACEMETROPOLITAINAVAILABLE();
          break;
        case "[*METROPOLITAIN_PRESENT2*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETWO();
          break;
        case "[*METROPOLITAIN_PRESENT3*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETHREE();
          break;
        case "[*BISHOP_PRESENT*]":
          myrule = REPLACEBISHOPAVAILABLE();
          break;
        case "[*BISHOP_PRESENT2*]":
          myrule = REPLACEBISHOPAVAILABLETWO();
          break;
        case "[*BISHOP_PRESENT3*]":
          myrule = REPLACEBISHOPAVAILABLETHREE();
          break;
        default:
          myrule = {
            english: "..",
            coptic: "..",
            arabic: "..",
            englishcoptic: "..",
            arabiccoptic: "..",
          };
          break;
      }
      if (myrule !== undefined) {
        // Apply the rule to the 'newPart' object properties

        newPart = {
          ...newPart,
          Arabic: newPart.Arabic?.replace(foundKeyword, myrule.arabic),
          English: newPart.English?.replace(foundKeyword, myrule.english),
          Rule: thisRule,
        };
      }
    }
  } else {
    // Check for specific cases and apply the corresponding rule
    if (part.Type === "Base") {
      const foundKeyword = findMatchingSubstring(part.English, keywords);

      switch (foundKeyword) {
        case "[*COME/RISEN*]":
          myrule = ComeRisenRule();
          break;
        case "[*ROICONCLUSION*]":
          myrule = ROICONCLUSION();
          break;
        case "[*STANDARD_GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(getGospelAuthor(part));

          break;
        case "[*CATHOLIC_AUTHOR*]":
          myrule = REPLACECATHOLICAUTHOR(getCatholicAuthor(part));
          break;
        case "[*PAULINE_AUTHOR*]":
          myrule = REPLACEPAULINEAUTHOR(getPaulineAuthor(part));
          break;
        case "[*POPE*]":
          myrule = REPLACEPOPE();
          break;
        case "[*ANTIOCH_POPE*]":
          myrule = REPLACANTIOCHEPOPE();
          break;
        case "[*DIOCESE_BISHOP*]":
          myrule = REPLACEDIOCESEBISHOP();
          break;
        case "[*METROPOLITAIN_PRESENT*]":
          myrule = REPLACEMETROPOLITAINAVAILABLE();
          break;
        case "[*METROPOLITAIN_PRESENT2*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETWO();
          break;
        case "[*METROPOLITAIN_PRESENT3*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETHREE();
          break;
        case "[*BISHOP_PRESENT*]":
          myrule = REPLACEBISHOPAVAILABLE();
          break;
        case "[*BISHOP_PRESENT2*]":
          myrule = REPLACEBISHOPAVAILABLETWO();
          break;
        case "[*BISHOP_PRESENT3*]":
          myrule = REPLACEBISHOPAVAILABLETHREE();
          break;
        default:
          myrule = {
            english: "..",
            coptic: "..",
            arabic: "..",
            englishcoptic: "..",
            arabiccoptic: "..",
          };
          break;
      }
      if (myrule !== undefined) {
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
      // Apply the rule to the 'newPart' object properties
    } else if (part.Type === "Melody") {
      const foundKeyword = findMatchingSubstring(part.English, keywords);

      switch (foundKeyword) {
        case "[*POPE*]":
          myrule = REPLACEPOPE();
          break;
        case "[*ANTIOCH_POPE*]":
          myrule = REPLACANTIOCHEPOPE();
          break;
        case "[*DIOCESE_BISHOP*]":
          myrule = REPLACEDIOCESEBISHOP();
          break;
        case "[*STANDARD_GOSPEL_AUTHOR*]":
          myrule = REPLACEGOSPELAUTHOR(getGospelAuthor(part));
          break;
        case "[*CATHOLIC_AUTHOR*]":
          myrule = REPLACECATHOLICAUTHOR(getCatholicAuthor(part));
          break;
        case "[*PAULINE_AUTHOR*]":
          myrule = REPLACEPAULINEAUTHOR(getPaulineAuthor(part));
          break;
        case "[*PAULINE_AUTHOR*]":
          myrule = REPLACEPAULINEAUTHOR(getPaulineAuthor(part));
          break;
        case "[*METROPOLITAIN_PRESENT*]":
          myrule = REPLACEMETROPOLITAINAVAILABLE();
          break;
        case "[*METROPOLITAIN_PRESENT2*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETWO();
          break;
        case "[*METROPOLITAIN_PRESENT3*]":
          myrule = REPLACEMETROPOLITAINAVAILABLETHREE();
          break;
        case "[*BISHOP_PRESENT*]":
          myrule = REPLACEBISHOPAVAILABLE();
          break;
        case "[*BISHOP_PRESENT2*]":
          myrule = REPLACEBISHOPAVAILABLETWO();
          break;
        case "[*BISHOP_PRESENT3*]":
          myrule = REPLACEBISHOPAVAILABLETHREE();
          break;
        default:
          myrule = {
            english: "..",
            coptic: "..",
            arabic: "..",
            englishcoptic: "..",
            arabiccoptic: "..",
          };
          break;
      }
      if (myrule !== undefined) {
        newPart = {
          ...newPart,
          Arabic: newPart.Arabic?.replace(foundKeyword, myrule.arabic),
          English: newPart.English?.replace(foundKeyword, myrule.english),
          Rule: thisRule,
        };
      }
      // Apply the rule to the 'newPart' object properties
    }
  }

  return newPart;
}
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
function GetTodaysReadingPath(path) {
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

  if (isStandardSeasonSunday) {
    const isHathorMonth = currentSeason.copticMonth === "Hathor";
    const isKoiahkMonth = currentSeason.copticMonth === "Koiahk";
    const isWeek1to4 =
      currentSeason.weekOfMonth >= 1 && currentSeason.weekOfMonth <= 4;
    const isWeek5 = currentSeason.weekOfMonth === 5;
    const isTakeFromHathorTwo = TakeFromHathorTwo(currentSeason);
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29`);
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    } else if (isWeek1to4) {
      if (isTakeFromHathorTwo && isKoiahkMonth) {
        filePath = updateFilePath(
          `Sundays${currentSeason.copticMonth}Week${
            currentSeason.weekOfMonth + 1
          }`
        );
      } else {
        filePath = updateFilePath(
          `Sundays${currentSeason.copticMonth}Week${currentSeason.weekOfMonth}`
        );
      }
    } else if (isTakeFromHathorTwo && isHathorMonth && isWeek5) {
      filePath = updateFilePath("SundaysKoiahkWeek1");
    } else {
      filePath = "Katamaros";
    }
  } else if (isStandardSeasonWeekday) {
    if (currentSeason.key === "NATIVITY") {
      filePath = updateFilePath(`DaysKoiahk29`);
    } else if (currentSeason.key === "EPIPHANY") {
      filePath = updateFilePath(`DaysTobe11`);
    }
    // else {
    //   filePath = updateFilePath(
    //     `Days${currentSeason.copticMonth}${currentSeason.copticDay}`
    //   );
    // }
  }
  return filePath;

  function updateFilePath(commonPart) {
    switch (path) {
      case "VespersPsalm":
      case "VespersGospel":
      case "MatinsPsalm":
      case "MatinsGospel":
      case "LiturgyPauline":
      case "LiturgyCatholic":
      case "LiturgyActs":
      case "LiturgyPsalm":
      case "LiturgyGospel":
        return filePath + commonPart + path;
      case "LiturgyPaulineCoptic":
      case "LiturgyCatholicCoptic":
      case "LiturgyActsCoptic":
        // Alert.alert(filePath + commonPart + path);

        return filePath + commonPart + path;
      default:
        return filePath;
    }
  }
}

function getAuthor(part, checkList) {
  const completePath = GetTodaysReadingPath(part.mother);
  if (completePath === "Katamaros") {
    return "NONE";
  }

  const book = bookPaths[completePath];
  const { EnglishTitle } = book;

  for (const item of checkList) {
    if (EnglishTitle.includes(item.keyword)) {
      return item.returnValue;
    }
  }
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

function findMatchingSubstring(str, substringsArray) {
  const foundSubstring = substringsArray.find((substring) =>
    str?.includes(substring)
  );
  return foundSubstring ? foundSubstring : null;
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
