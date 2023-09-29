import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";
import {
  ComeRisenRule,
  ROICONCLUSION,
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

  if (!inHymn && EnglishTitle !== undefined) {
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
    "*GOSPEL_AUTHOR*]",
    "[*PROPHECIES_AUTHOR*]",
    "[*PASCHA_HOUR_DAY*]",
    "[*HOMILY_FATHER*]",
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
        case "[*PASCHA_HOUR_DAY*]":
          myrule = REPLACPASCHAHOURDAY(thisRule);
          break;
        case "[*PROPHECIES_AUTHOR*]":
          myrule = REPLACEPROPHETS(thisRule);
          break;
        case "[*POPE*]":
          myrule = REPLACEPOPE();
          break;
        case "[*DIOCESE_BISHOP*]":
          myrule = REPLACEDIOCESEBISHOP();
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

function findMatchingSubstring(str, substringsArray) {
  const foundSubstring = substringsArray.find((substring) =>
    str?.includes(substring)
  );
  return foundSubstring ? foundSubstring : null;
}
