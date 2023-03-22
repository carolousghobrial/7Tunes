import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";

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
            let book = bookPaths[item.Path];
            arabicttl = book.ArabicTitle;
            copticttl = book.CopticTitle;
            englishttl = book.EnglishTitle;
            MenuArray.push({
              EnglishTitle: englishttl,
              CopticTitle: copticttl,
              ArabicTitle: arabicttl,
              key: key,
            });
            ViewArray.push({
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
            var hymn = book.Hymn;
            hymn.map((part) => {
              ViewArray.push({
                part: part,
                key: key,
                EnglishTitle: englishttl,
                CopticTitle: copticttl,
                ArabicTitle: arabicttl,
              });

              key++;
            });

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
