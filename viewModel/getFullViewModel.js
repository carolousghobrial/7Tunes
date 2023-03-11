import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";

export function getFullViewModel(data) {
  let arabicttl = "";
  let copticttl = "";
  let englishttl = "";

  var ViewArray = [];
  var MenuArray = [];
  var key = 0;
  data.main.map((item) => {
    if (item.type === "Title") {
      arabicttl = item.arabic;
      copticttl = item.coptic;
      englishttl = item.english;
    } else {
      if (VisibleRules.find((data) => data.rule === item.visible).visible) {
        switch (item.type) {
          case "Main":
            //Get View
            let book = bookPaths[item.path];
            arabicttl = book.arabictitle;
            copticttl = book.coptictitle;
            englishttl = book.englishtitle;
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
                type: "Title",
                rule: -1,
                visible: 0,
                side: "Title",
                arabic: arabicttl,
                coptic: copticttl,
                english: englishttl,
              },
              key: key,
            });

            key++;
            var hymn = book.hymn;

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
          default:
            //Get View
            MenuArray.push({
              EnglishTitle: item.english,
              CopticTitle: "",
              ArabicTitle: item.arabic,
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

  return [ViewArray, MenuArray];
}
