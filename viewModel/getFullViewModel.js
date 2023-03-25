import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";
import {
  ComeRisenRule,
  ROICONCLUSION,
  REPLACEGOSPELAUTHOR,
  REPLACEPROPHETS,
  REPLACPASCHAHOURDAY,
} from "../helpers/replacingRules";
export function getFullViewModel(motherSource, data) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";
  var ViewArray = [];
  var MenuArray = [];
  var key = 0;

  data.Main.map((item) => {
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
          default:
            //Get View
            MenuArray.push({
              EnglishTitle: item.english,
              CopticTitle: item.coptic,
              ArabicTitle: item.arabic,
              key: key,
            });
            ViewArray.push({
              part: item,
              key: key,
              EnglishTitle: item.english,
              CopticTitle: item.coptic,
              ArabicTitle: item.arabic,
            });
            key++;

            break;
        }
      }
    }
  });

  return [ViewArray, MenuArray];
}
function getMain(Path, inHymn, rule, key) {
  console.log(rule);
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
  hymn.map((part) => {
    part.Rule = rule;
    if (
      part.Visible === true ||
      VisibleRules[part.Visible](motherSource, part.Path)
    ) {
      if (part.Type === "Main") {
        getMain(part.Path, true, rule);
      } else {
        if (part.Rule !== 0 && part.Rule != undefined) {
          if (part.Type === "Base") {
            if (part.English.includes("[*COME/RISEN*]")) {
              var comeriserule = ComeRisenRule();
              part.English = part.English.replace(
                "[*COME/RISEN*]",
                comeriserule.english
              );
              part.Coptic = part.Coptic.replace(
                "[*COME/RISEN*]",
                comeriserule.coptic
              );
              part.Arabic = part.Arabic.replace(
                "[*COME/RISEN*]",
                comeriserule.arabic
              );
              part.Englishcoptic = part.Englishcoptic.replace(
                "[*COME/RISEN*]",
                comeriserule.englishcoptic
              );
              part.Arabiccoptic = part.Arabiccoptic.replace(
                "[*COME/RISEN*]",
                comeriserule.arabiccoptic
              );
            } else if (part.English.includes("[*ROICONCLUSION*]")) {
              var rule = ROICONCLUSION();
              part.English = part.English.replace(
                "[*ROICONCLUSION*]",
                rule.english
              );
              part.Coptic = part.Coptic.replace(
                "[*ROICONCLUSION*]",
                rule.coptic
              );
              part.Arabic = part.Arabic.replace(
                "[*ROICONCLUSION*]",
                rule.arabic
              );
              part.Englishcoptic = part.Englishcoptic.replace(
                "[*ROICONCLUSION*]",
                rule.englishcoptic
              );
              part.Arabiccoptic = part.Arabiccoptic.replace(
                "[*ROICONCLUSION*]",
                rule.arabiccoptic
              );
            } else if (part.English.includes("[*GOSPEL_AUTHOR*]")) {
              var replacingWord = "[*GOSPEL_AUTHOR*]";
              var myrule = REPLACEGOSPELAUTHOR(part.Rule);
              part.English = part.English.replace(
                replacingWord,
                myrule.english
              );
              part.Coptic = part.Coptic.replace(replacingWord, myrule.coptic);
              part.Arabic = part.Arabic.replace(replacingWord, myrule.arabic);
              part.Englishcoptic = part.Englishcoptic.replace(
                replacingWord,
                myrule.englishcoptic
              );
              part.Arabiccoptic = part.Arabiccoptic.replace(
                replacingWord,
                myrule.arabiccoptic
              );
            } else if (part.English.includes("[*PROPHECIES_AUTHOR*]")) {
              var replacingWord = "[*PROPHECIES_AUTHOR*]";
              var myrule = REPLACEPROPHETS(part.Rule);
              part.English = part.English.replace(
                replacingWord,
                myrule.english
              );
              part.Coptic = part.Coptic.replace(replacingWord, myrule.coptic);
              part.Arabic = part.Arabic.replace(replacingWord, myrule.arabic);
              part.Englishcoptic = part.Englishcoptic.replace(
                replacingWord,
                myrule.englishcoptic
              );
              part.Arabiccoptic = part.Arabiccoptic.replace(
                replacingWord,
                myrule.arabiccoptic
              );
            }
          } else if (part.Type === "Melody") {
            if (part.English.includes("[*COME/RISEN*]")) {
              var comeriserule = ComeRisenRule();
              part.English = part.English.replace(
                "[*COME/RISEN*]",
                comeriserule.english
              );
              part.Arabic = part.Arabic.replace(
                "[*COME/RISEN*]",
                comeriserule.arabic
              );
            } else if (part.English.includes("[*ROICONCLUSION*]")) {
              var rule = ROICONCLUSION();
              part.English = part.English.replace(
                "[*ROICONCLUSION*]",
                rule.english
              );
              part.Arabic = part.Arabic.replace(
                "[*ROICONCLUSION*]",
                rule.arabic
              );
            } else if (part.English.includes("[*GOSPEL_AUTHOR*]")) {
              var replacingWord = "[*GOSPEL_AUTHOR*]";
              var myrule = REPLACEGOSPELAUTHOR(part.Rule);

              part.English = part.English.replace(
                replacingWord,
                myrule.english
              );
              part.Arabic = part.Arabic.replace(replacingWord, myrule.arabic);
            } else if (part.English.includes("[*PASCHA_HOUR_DAY*]")) {
              var replacingWord = "[*PASCHA_HOUR_DAY*]";
              console.log(part.Rule);
              var myrule = REPLACPASCHAHOURDAY(part.Rule);
              console.log(myrule);
              part.English = part.English.replace(
                replacingWord,
                myrule.english
              );
              part.Arabic = part.Arabic.replace(replacingWord, myrule.arabic);
            } else if (part.English.includes("[*PROPHECIES_AUTHOR*]")) {
              var replacingWord = "[*PROPHECIES_AUTHOR*]";
              var myrule = REPLACEPROPHETS(part.Rule);
              console.log(myrule);

              part.English = part.English.replace(
                replacingWord,
                myrule.english
              );
              part.Arabic = part.Arabic.replace(replacingWord, myrule.arabic);
            }
          }
        }

        myViewArray.push({
          part: part,
          key: key,
          EnglishTitle: englishttl,
          CopticTitle: copticttl,
          ArabicTitle: arabicttl,
        });
        key++;
      }
    }
  });

  return [myViewArray, myMenuArray, key];
}
