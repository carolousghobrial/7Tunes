import React, { useState, useRef, useEffect } from "react";
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
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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
export function getFullViewModel(
  motherSource,
  mother,
  currentSeason,
  timeTransition,
  dioceseBishop,
  BishopIsPresent,
  BishopsPresent,
  are3PlusBishopsPresent,
  saints
) {
  let arabicTitle = "",
    copticTitle = "",
    englishTitle = "";
  const ViewArray = [],
    MenuArray = [];
  let key = 0;

  // Retrieve hymns from the homescreen paths
  const hymns = homescreenPaths[motherSource]?.Main || [];

  // Process visible hymns
  hymns.filter(isHymnVisible).forEach(processItem);

  // Add Return Button after processing hymns
  addReturnButton();

  // Return both view and menu arrays
  return [ViewArray, MenuArray];

  // Function to check if a hymn is visible
  function isHymnVisible(hymn) {
    const tempMother = mother || motherSource;
    const visibleRule = VisibleRules[hymn.Visible];
    return (
      hymn.Visible === true ||
      mother === "index" ||
      (visibleRule &&
        visibleRule(
          tempMother,
          hymn.SAINT || hymn.Path,
          currentSeason,
          timeTransition,
          dioceseBishop,
          BishopIsPresent,
          BishopsPresent,
          are3PlusBishopsPresent,
          saints
        ))
    );
  }

  // Function to process an individual item
  function processItem(item) {
    const handlers = {
      Title: () => updateTitles(item),
      PropheciesType: addPropheciesForDay,
      Main: () => processMainOrDefault(item),
      Default: () => processMainOrDefault(item),
      MainWithTitle: () => processMainWithTitle(item),
      Ritual: () => pushToArrays(item, true),
      GetDaysReading: () => processRitualOrGetDaysReading(item),
      default: () => pushToArrays(item),
    };

    // Execute appropriate handler based on item type
    (handlers[item.Type] || handlers.default)();
  }

  // Function to update the titles if available
  function updateTitles({ Arabic, Coptic, English }) {
    arabicTitle = Arabic || arabicTitle;
    copticTitle = Coptic || copticTitle;
    englishTitle = English || englishTitle;
  }

  // Function to handle prophecies based on the current season
  function addPropheciesForDay() {
    if (!["GREAT_LENT", "JONAH_FAST"].includes(currentSeason.key)) return;

    const isJonahFast = currentSeason.key === "JONAH_FAST";
    const weekOrJonah = isJonahFast ? "Jonah" : `Week${currentSeason.week}`;
    const dayOfWeek = daysOfWeek[currentSeason.dayOfWeek];
    const propheciesCount =
      GreatFastPropheciesCount?.[weekOrJonah]?.[dayOfWeek] || 0;

    // Add prophecies for the day
    for (let i = 1; i <= propheciesCount; i++) {
      const readingPath = `KatamarosGreatFast${
        isJonahFast ? "Jonah" : weekOrJonah
      }${dayOfWeek}MatinsProphecy${i}`;
      const book = bookPaths[readingPath];
      if (!book) continue;

      const rule = ProphecycheckList.find(({ keyword }) =>
        book.EnglishTitle.includes(keyword)
      )?.returnValue;

      // Push view and menu for prophecies
      [
        "PaschaPropheciesIntroduction",
        readingPath,
        "PaschaPropheciesConclusion",
      ].forEach((path) => {
        const [view, menu, updatedKey] = getMain(path, rule, null, false);
        key = updatedKey;
        ViewArray.push(...view);
        if (menu) MenuArray.push(...menu);
      });
    }
  }

  // Function to process main or default items
  function processMainOrDefault(item) {
    if (item.Type === "MainWithTitle" || item.Type === "Title") {
      pushTitleToArrays(item); // Push title first
    }

    const [view, menu, updatedKey] = getMain(item.Path, item.Rule, item.Switch);
    key = updatedKey;

    // Push view and menu after title (if any)
    ViewArray.push(...view);
    MenuArray.push(...menu);
  }

  // Function to process main items with title
  function processMainWithTitle(item) {
    pushTitleToArrays(item); // Push title first

    const [view, menu, updatedKey] = getMainWithTitle(item.Path, item.Rule);
    key = updatedKey;

    // Push view and menu after title
    ViewArray.push(...view);
    MenuArray.push(...menu);
  }
  function updateFilePath(path) {
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
      ? `${currentSeason.filePath}${path}`
      : filePath;
  }
  // Function to process GetDaysReading and Ritual items
  function processRitualOrGetDaysReading(item) {
    if (item.Type === "GetDaysReading") {
      const filePath = updateFilePath(item.Path);
      if (filePath !== "Katamaros") {
        const [view, menu, updatedKey] = getMain(filePath, item.Rule);
        key = updatedKey;
        ViewArray.push(...view);
        MenuArray.push(...menu);
      }
    } else {
      pushToArrays(item, true);
    }
  }

  // Function to push item into arrays
  function pushToArrays(item, isRitual = false) {
    if (!isRitual) {
      MenuArray.push({
        EnglishTitle: item.English,
        CopticTitle: item.Coptic,
        ArabicTitle: item.Arabic,
        key,
      });
    }
    ViewArray.push({
      part: item,
      key,
      EnglishTitle: englishTitle,
      CopticTitle: copticTitle,
      ArabicTitle: arabicTitle,
    });
    key++;
  }

  // Function to add a return button
  function addReturnButton() {
    pushToArrays({
      Type: "Button",
      Arabic: " العودة",
      English: "Return",
      Rule: "PopPage",
      Visible: true,
      Path: "",
    });
  }

  // Function to get main data for a specific path
  function getMain(Path, rule, switchWord = null, inHymn) {
    const myMenuArray = [],
      myViewArray = [];
    const book = bookPaths[Path];

    try {
      const { ArabicTitle, CopticTitle, EnglishTitle, Hymn } = book;

      // Push title information
      if (EnglishTitle && !inHymn) {
        myMenuArray.push({ EnglishTitle, CopticTitle, ArabicTitle, key });
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

      // Filter visible hymns and process them
      Hymn.filter(isPartVisible).forEach((part) => {
        key = processInnerPart(part, rule, myViewArray, Path, {
          ArabicTitle,
          CopticTitle,
          EnglishTitle,
        });
      });
    } catch (err) {
      myMenuArray.pop(); // Remove invalid menu item
      console.error(`Error processing path: ${Path}`, err);
    }

    return [myViewArray, myMenuArray, key];
  }

  // Function to check if part is visible
  function isPartVisible(part) {
    const motherSourceLower = motherSource?.toLowerCase();
    const temppath =
      part.SAINT && !motherSourceLower?.includes("index")
        ? part.SAINT
        : part.Path;
    return (
      part.Visible === true ||
      VisibleRules[part.Visible]?.(
        motherSource,
        temppath,
        currentSeason,
        timeTransition,
        dioceseBishop,
        BishopIsPresent,
        BishopsPresent,
        are3PlusBishopsPresent,
        saints
      ) ||
      (motherSourceLower?.includes("index") &&
        !motherSourceLower.includes("papal"))
    );
  }

  // Function to find the matching substring
  function findMatchingSubstring(str, substringsArray) {
    return (
      substringsArray.find((substring) => str?.includes(substring)) || "EMPTY"
    );
  }

  // Function to process inner part
  function processInnerPart(part, thisRule, myViewArray, Path, titles) {
    const { EnglishTitle, CopticTitle, ArabicTitle } = titles;
    const foundKeyword = findMatchingSubstring(part.English, keywords);

    let updatedPart = { ...part }; // Initialize updated part

    if (foundKeyword !== "EMPTY") {
      const cleanedKeyword = foundKeyword.replace(/[\*\[\]/]/g, "");
      const newRule = thisRule || motherSource;
      const myrule = VisibleRules[cleanedKeyword]?.(
        newRule,
        part,
        currentSeason
      );

      if (myrule) {
        const replacements = {
          Arabic: myrule.arabic,
          Arabiccoptic: myrule.arabiccoptic,
          Coptic: myrule.coptic,
          English: myrule.english,
          Englishcoptic: myrule.englishcoptic,
        };

        // Apply replacements
        Object.keys(replacements).forEach((key) => {
          if (updatedPart[key]) {
            updatedPart[key] = updatedPart[key].replace(
              foundKeyword,
              replacements[key]
            );
          }
        });
      }
    }

    // Add part to view array
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

    // Process special cases
    const handlers = {
      Main: () => handleSpecialCase(part.Path, false),
      GetDaysReading: () => handleSpecialCase(updateFilePath(part.Path), true),
      GetDaysReadingPalmSunday: () => handleSpecialCase(part.Path, true),
      default: () => addViewEntry(updatedPart),
    };

    function handleSpecialCase(path, isReading) {
      const [tempView, , newKey] = getMain(path, thisRule, null, true);
      myViewArray.push(...tempView);
      key = newKey;
    }

    // Execute handler for part type
    (handlers[part.Type] || handlers.default)();

    return key;
  }

  // Function to push title into arrays
  function pushTitleToArrays(item) {
    const { Arabic, Coptic, English } = item;
    ViewArray.push({
      part: {
        Type: "Title",
        rule: -1,
        visible: 0,
        Side: "Title",
        Arabic: Arabic || arabicTitle,
        Coptic: Coptic || copticTitle,
        English: English || englishTitle,
        Path: item.Path,
      },
      key,
    });

    MenuArray.push({
      EnglishTitle: English || englishTitle,
      CopticTitle: Coptic || copticTitle,
      ArabicTitle: Arabic || arabicTitle,
      key,
    });

    key++; // Increment key after adding the title
  }
}

// Helper function to check if a part is visible

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
