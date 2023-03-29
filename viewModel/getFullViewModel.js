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
} from "../helpers/replacingRules";
import homescreenPaths from "../helpers/homescreenPaths";

export function getFullViewModel(motherSource) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";
  var ViewArray = [];
  var MenuArray = [];
  var key = 0;
  homescreenPaths[motherSource].Main.map((item) => {
    if (item.type === "Title") {
      arabicttl = item.arabic;
      copticttl = item.coptic;
      englishttl = item.english;
    } else {
      if (
        item.Visible === true ||
        VisibleRules[item.Visible](motherSource, item.Path)
      ) {
        switch (item.Type) {
          case "Main":
            //Get View
            const [tempView, tempMenu, mykey] = getMain(
              item.Path,
              motherSource,
              false,
              item.Rule,
              key
            );
            key = mykey;

            ViewArray = ViewArray.concat(tempView);
            MenuArray = MenuArray.concat(tempMenu);
            break;
          case "Button":
            MenuArray.push({
              EnglishTitle: item.Arabic,
              ArabicTitle: item.English,
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
          case "Ritual":
            ViewArray.push({
              part: item,
              key: key,
              EnglishTitle: item.english,
              CopticTitle: item.coptic,
              ArabicTitle: item.arabic,
            });
            key++;

            break;
          case "MainTitle":
            MenuArray.push({
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
              key: key,
            });
            ViewArray.push({
              part: item,
              key: key,
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
            });
            key++;

            break;
          default:
            //Get View
            MenuArray.push({
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
              key: key,
            });
            ViewArray.push({
              part: item,
              key: key,
              EnglishTitle: item.English,
              CopticTitle: item.Coptic,
              ArabicTitle: item.Arabic,
            });
            key++;

            break;
        }
      }
    }
  });
  return [ViewArray, MenuArray];
}
function getMain(Path, motherSource, inHymn, rule, key) {
  var thisRule = rule;
  let myMenuArray = [];
  let myViewArray = [];
  let book = bookPaths[Path];

  let arabicttl = book.ArabicTitle;
  let copticttl = book.CopticTitle;
  let englishttl = book.EnglishTitle;
  if (!inHymn) {
    if (englishttl !== undefined) {
      myMenuArray.push({
        EnglishTitle: englishttl,
        CopticTitle: copticttl,
        ArabicTitle: arabicttl,
        key: key,
      });
      myViewArray.push({
        EnglishTitle: englishttl,
        CopticTitle: copticttl,
        ArabicTitle: arabicttl,
        part: {
          Type: "Title",
          rule: -1,
          visible: 0,
          Side: "Title",
          Arabic: arabicttl,
          Coptic: copticttl,
          English: englishttl,
        },
        key: key,
      });

      key++;
    }
  }
  var hymn = book.Hymn;

  hymn.forEach((part) => {
    if (
      part.Visible === true ||
      VisibleRules[part.Visible](motherSource, part.Path)
    ) {
      if (part.Type === "Main") {
        getMain(part.Path, true, rule);
      } else {
        if (thisRule !== 0 && thisRule != undefined) {
          var newPart = {};
          if (part.Type === "Base") {
            if (part.English.includes("[*COME/RISEN*]")) {
              var replacingWord = "[*COME/RISEN*]";
              var myrule = ComeRisenRule();
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*ROICONCLUSION*]")) {
              var replacingWord = "[*ROICONCLUSION*]";
              var myrule = ROICONCLUSION();
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*GOSPEL_AUTHOR*]")) {
              var replacingWord = "[*GOSPEL_AUTHOR*]";
              var myrule = REPLACEGOSPELAUTHOR(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*PROPHECIES_AUTHOR*]")) {
              var replacingWord = "[*PROPHECIES_AUTHOR*]";
              var myrule = REPLACEPROPHETS(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*HOMILY_FATHER*]")) {
              var replacingWord = "[*HOMILY_FATHER*]";
              var myrule = REPLACEHOMILYFATHERS(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else {
              newPart = part;
            }
          } else if (part.Type === "Melody") {
            if (part.English.includes("[*COME/RISEN*]")) {
              var replacingWord = "[*COME/RISEN*]";
              var myrule = ComeRisenRule();
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*ROICONCLUSION*]")) {
              var replacingWord = "[*ROICONCLUSION*]";
              var myrule = ROICONCLUSION();
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*GOSPEL_AUTHOR*]")) {
              var replacingWord = "[*GOSPEL_AUTHOR*]";
              var myrule = REPLACEGOSPELAUTHOR(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*PASCHA_HOUR_DAY*]")) {
              var replacingWord = "[*PASCHA_HOUR_DAY*]";
              var myrule = REPLACPASCHAHOURDAY(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else if (part.English.includes("[*PROPHECIES_AUTHOR*]")) {
              var replacingWord = "[*PROPHECIES_AUTHOR*]";
              var myrule = REPLACEPROPHETS(thisRule);
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else {
              newPart = part;
            }
          }
          myViewArray.push({
            part: newPart,
            key: key,
            EnglishTitle: englishttl,
            CopticTitle: copticttl,
            ArabicTitle: arabicttl,
          });
          key++;
        } else {
          var newPart = {};
          var replacingWord = "";
          var myrule = {};
          if (part.English.includes("[*COME/RISEN*]")) {
            replacingWord = "[*COME/RISEN*]";
            myrule = ComeRisenRule();
            if (part.Type === "Base") {
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else {
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            }
          } else if (part.English.includes("[*ROICONCLUSION*]")) {
            replacingWord = "[*ROICONCLUSION*]";
            myrule = ROICONCLUSION();
            if (part.Type === "Base") {
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                Arabiccoptic: part.Arabiccoptic.replace(
                  replacingWord,
                  myrule.arabiccoptic
                ),
                Coptic: part.Coptic.replace(replacingWord, myrule.coptic),
                English: part.English.replace(replacingWord, myrule.english),
                Englishcoptic: part.Englishcoptic.replace(
                  replacingWord,
                  myrule.englishcoptic
                ),
                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            } else {
              newPart = {
                Arabic: part.Arabic.replace(replacingWord, myrule.arabic),
                English: part.English.replace(replacingWord, myrule.english),

                Rule: thisRule,
                Side: part.Side,
                Type: part.Type,
                Visible: part.Visible,
              };
            }
          } else {
            newPart = part;
          }
          myViewArray.push({
            part: newPart,
            key: key,
            EnglishTitle: englishttl,
            CopticTitle: copticttl,
            ArabicTitle: arabicttl,
          });
          key++;
        }
      }
    }
  });

  return [myViewArray, myMenuArray, key];
}
