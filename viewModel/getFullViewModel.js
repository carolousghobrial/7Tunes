import React, { useState, useRef, useEffect } from "react";
import bookPaths from "../helpers/bookPathsHelpers";

export function getFullViewModel(data, motherSource) {
  var ViewArray = [];
  data.main.map((item) => {
    switch (item.type) {
      case "Main":
        //MainView
        //check Rule
        //check Visible
        //Get View
        var arabicttl = bookPaths[motherSource][item.path].arabictitle;
        var copticttl = bookPaths[motherSource][item.path].englishtitle;
        var englishttl = bookPaths[motherSource][item.path].coptictitle;
        var hymn = bookPaths[motherSource][item.path].hymn;

        hymn.map((part) => {
          ViewArray.push({
            part: part,
            ArabicTitle: arabicttl,
            CopticTitle: copticttl,
            EnglishTitle: englishttl,
          });
        });
        // content = <Text>Main</Text>;

        // viewArray.push(
        //
        // );
        break;
      default:
        ViewArray.push({
          part: item,
        });
        break;
    }
  });
  //console.log(ViewArray);
  return ViewArray;
}
