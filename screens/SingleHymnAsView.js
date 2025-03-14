import React, { useState, useRef, memo, useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getColor } from "../helpers/SettingsHelpers.js";
import { getMainExported } from "../viewModel/getFullViewModel.js";
import BaseView from "../components/ViewTypes/BaseView.js";
import MelodyView from "../components/ViewTypes/MelodyView.js";
import TitleView from "../components/ViewTypes/TitleView.js";
import RitualView from "../components/ViewTypes/RitualView.js";
import ButtonView from "../components/ViewTypes/ButtonView.js";
import MainTitleView from "../components/ViewTypes/MainTitleView.js";
import bookPaths from "../helpers/bookPathsHelpers";
import VisibleRules from "../helpers/visibleRules";

const SingleHymnAsView = memo(
  ({ path, motherSource, rule, englishTitle, arabicTitle }) => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation();
    const {
      timeTransition,

      currentSeason,
      dioceseBishop,
      BishopIsPresent,
      BishopsPresent,
      are3PlusBishopsPresent,
    } = useSelector((state) => state.settings);
    const flatListRef = useRef();
    const pageBackgroundColor = getColor("pageBackgroundColor");
    const saints = useSelector((state) => state.saints);

    const title = englishTitle || arabicTitle; // Simplify title logic
    const data = getMain(path, motherSource, rule);

    function getMain(Path, motherSource, rule) {
      myViewArray = [];
      const book = bookPaths[Path];

      try {
        const { ArabicTitle, CopticTitle, EnglishTitle, Hymn } = book;

        // Push title information
        if (EnglishTitle) {
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
              Switch: null,
              Path,
            },
          });
        }

        //Filter visible hymns and process them
        Hymn.filter(isPartVisible).forEach((part) => {});
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
      } catch (err) {}

      return myViewArray;
    }
    const renderItems = useCallback(
      ({ item }) => {
        const { Type } = item.part;

        switch (Type) {
          case "Base":
            return <BaseView item={item.part} />;
          case "Melody":
            return <MelodyView item={item.part} />;
          case "Title":
            return <TitleView item={item.part} />;
          case "Ritual":
            return <RitualView item={item.part} />;
          case "MainTitle":
            return <MainTitleView item={item.part} />;
          case "Button":
            return (
              <ButtonView
                item={item.part}
                flatListRef={flatListRef}
                viewData={data}
                navigation={navigation}
              />
            );
          default:
            return null;
        }
      },
      [data, navigation]
    );

    return (
      <FlatList
        ref={flatListRef}
        style={[styles.container, { backgroundColor: pageBackgroundColor }]}
        showsVerticalScrollIndicator={false}
        data={data}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
    );
  }
);

export default SingleHymnAsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    fontFamily: "coptic-font",
    color: "white",
    justifyContent: "flex-start",
  },
  box: {
    flex: 1,
  },
  floatingText: {
    position: "absolute",
    top: -12,
    fontSize: 25,
    backgroundColor: "transparent",
    color: "#AA4A44",
    zIndex: 1,
  },
});
