import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";
import { useDispatch, useSelector } from "react-redux";

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
import homescreenPaths from "../helpers/homescreenPaths";

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
      let temppath = item.SAINT !== undefined ? item.SAINT : item.Path;
      let tempMother = mother !== undefined ? mother : motherSource;

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
              key
            );
            key = mykey;
            ViewArray.push(...tempView);
            MenuArray.push(...tempMenu);
            break;
          case "Ritual":
            ViewArray.push({
              part: item,
              key: key,
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
                key
              );
              key = mykey;
              ViewArray.push(...tempView);
              MenuArray.push(...tempMenu);
            }
          default:
            MenuArray.push({
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
              key: key,
            });
            ViewArray.push({
              part: item,
              key: key,
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

export function getMain(Path, motherSource, inHymn, rule, key) {
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

    if (part.Type === "Main") {
      const [tempView, , mykey] = getMain(
        part.Path,
        motherSource,
        true,
        thisRule,
        key
      );
      key = mykey;
      myViewArray.push(...tempView);
    } else if (part.Type === "GetDaysReading") {
      var filePath = GetTodaysReadingPath(part.Path);
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
    } else {
      const addPart = addItemsToArray(part, thisRule);
      myViewArray.push({
        part: addPart,
        key,
        EnglishTitle,
        CopticTitle,
        ArabicTitle,
      });
      key++;
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
          break;
      }
      // Apply the rule to the 'newPart' object properties
      newPart = {
        ...newPart,
        Arabic: newPart.Arabic.replace(foundKeyword, myrule.arabic),
        Arabiccoptic: newPart.Arabiccoptic.replace(
          foundKeyword,
          myrule.arabiccoptic
        ),
        Coptic: newPart.Coptic.replace(foundKeyword, myrule.coptic),
        English: newPart.English.replace(foundKeyword, myrule.english),
        Englishcoptic: newPart.Englishcoptic.replace(
          foundKeyword,
          myrule.englishcoptic
        ),
        Rule: thisRule,
      };
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
          break;
      }

      // Apply the rule to the 'newPart' object properties
      newPart = {
        ...newPart,
        Arabic: newPart.Arabic.replace(foundKeyword, myrule.arabic),
        English: newPart.English.replace(foundKeyword, myrule.english),
        Rule: thisRule,
      };
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
          break;
      }

      // Apply the rule to the 'newPart' object properties
      newPart = {
        ...newPart,
        Arabic: newPart.Arabic.replace(foundKeyword, myrule.arabic),
        Arabiccoptic: newPart.Arabiccoptic.replace(
          foundKeyword,
          myrule.arabiccoptic
        ),
        Coptic: newPart.Coptic.replace(foundKeyword, myrule.coptic),
        English: newPart.English.replace(foundKeyword, myrule.english),
        Englishcoptic: newPart.Englishcoptic.replace(
          foundKeyword,
          myrule.englishcoptic
        ),
        Rule: thisRule,
      };
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
          break;
      }

      // Apply the rule to the 'newPart' object properties
      newPart = {
        ...newPart,
        Arabic: newPart.Arabic.replace(foundKeyword, myrule.arabic),
        English: newPart.English.replace(foundKeyword, myrule.english),
        Rule: thisRule,
      };
    }
  }

  return newPart;
}

function GetTodaysReadingPath(path) {
  let filePath = "Katamaros";
  const currentSeason = useSelector((state) => state.settings.currentSeason);

  if (currentSeason.key === "STANDARD" && currentSeason.dayOfWeek === 0) {
    filePath += "Sundays";

    if (["Paope", "Hathor"].includes(currentSeason.copticMonth)) {
      filePath += "Hathor";

      switch (currentSeason.weekOfMonth) {
        case 1:
        case 2:
        case 3:
        case 4:
          filePath += `Week${currentSeason.weekOfMonth}`;
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
              filePath += path;
              break;
          }
          break;
      }
    }
  }

  return filePath;
}
function getGospelAuthor(part) {
  const completePath = GetTodaysReadingPath(part.mother);
  if (completePath == "Katamaros") {
    return "NONE";
  }
  const book = bookPaths[completePath];

  const { EnglishTitle } = book;
  if (EnglishTitle.includes("Matthew")) {
    return 1;
  }
  if (EnglishTitle.includes("Mark")) {
    return 2;
  }
  if (EnglishTitle.includes("Luke")) {
    return 3;
  }
  if (EnglishTitle.includes("John")) {
    return 4;
  }
}
function getCatholicAuthor(part) {
  const completePath = GetTodaysReadingPath(part.mother);
  if (completePath == "Katamaros") {
    return "NONE";
  }
  const book = bookPaths[completePath];

  const { EnglishTitle } = book;
  if (EnglishTitle.includes("James")) {
    return "James";
  }
  if (EnglishTitle.includes("Jude")) {
    return "Jude";
  }
  if (EnglishTitle.includes("1 Peter")) {
    return "1Peter";
  }
  if (EnglishTitle.includes("2 Peter")) {
    return "2Peter";
  }
  if (EnglishTitle.includes("1 John")) {
    return "1John";
  }
  if (EnglishTitle.includes("2 John")) {
    return "2John";
  }
  if (EnglishTitle.includes("3 John")) {
    return "3John";
  }
}
function getPaulineAuthor(part) {
  const completePath = GetTodaysReadingPath(part.mother);
  console.log(completePath);
  if (completePath == "Katamaros") {
    return "NONE";
  }
  const book = bookPaths[completePath];

  const { EnglishTitle } = book;
  if (EnglishTitle.includes("1 Timothy")) {
    return "1Timothy";
  }
  if (EnglishTitle.includes("2 Timothy")) {
    return "2Timothy";
  }
  if (EnglishTitle.includes("1 Thessalonians")) {
    return "1Thessalonians";
  }
  if (EnglishTitle.includes("2 Thessalonians")) {
    return "2Thessalonians";
  }
  if (EnglishTitle.includes("1 Corinthians")) {
    return "1Corinthians";
  }
  if (EnglishTitle.includes("2 Corinthians")) {
    return "2Corinthians";
  }
  if (EnglishTitle.includes("Titus")) {
    return "Titus";
  }
  if (EnglishTitle.includes("Philemon")) {
    return "Philemon";
  }
  if (EnglishTitle.includes("Hebrews")) {
    return "Hebrews";
  }
  if (EnglishTitle.includes("Galatians")) {
    return "Galatians";
  }
  if (EnglishTitle.includes("Ephesians")) {
    return "Ephesians";
  }
  if (EnglishTitle.includes("Philippians")) {
    return "Philippians";
  }
  if (EnglishTitle.includes("Colossians")) {
    return "Colossians";
  }
  if (EnglishTitle.includes("Romans")) {
    return "Romans";
  }
}
function findMatchingSubstring(str, substringsArray) {
  const foundSubstring = substringsArray.find((substring) =>
    str?.includes(substring)
  );
  return foundSubstring ? foundSubstring : null;
}
