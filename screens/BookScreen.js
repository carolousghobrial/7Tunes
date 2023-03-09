import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  FlatList,
  Animated,
  Pressable,
  StatusBar,
} from "react-native";

import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import bookPaths from "../helpers/bookPathsHelpers";
import { useDispatch, useSelector } from "react-redux";
import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import ExpanderView from "../components/ViewTypes/ExpanderView";
import BottomBar from "../components/BottomBar/BottomBar";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";
const _spacing = 10;
function BookScreen({ navigation, route }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const fadeAnim = new Animated.Value(1);

  var pageBackgroundColor = getColor("pageBackgroundColor");

  const motherSource = route.params.bookPath;
  const data = getFullViewModel(homescreenPaths[motherSource], motherSource);

  //

  function hideHeader() {
    // Function to change navigation options
    StatusBar.setHidden(NavbarVisibility);

    navigation.setOptions({
      headerShown: !NavbarVisibility,
    });

    setNavbarVisibility(!NavbarVisibility);
  }

  function renderItems(itemData) {
    let content = {};
    // setNavbarTitle(itemData.item.CopticTitle);
    switch (itemData.item.part.type) {
      case "Base":
        //MainView
        //check Rule
        //check Visible
        //Get View

        content = <BaseView item={itemData.item.part}></BaseView>;
        //content = <Text>Main</Text>;

        // viewArray.push(
        //
        // );
        break;
      case "Melody":
        //Title
        //check Rule
        //check Visible
        //Get View
        content = <MelodyView item={itemData.item.part}></MelodyView>;
        // content = <Text>Main</Text>;

        break;
      case "Title":
        //Title
        //check Rule
        //check Visible
        //Get View
        content = <TitleView item={itemData.item.part}></TitleView>;
        //content = <Text>Main</Text>;

        break;
      case "Ritual":
        //Ritual
        //check Rule
        //check Visible
        //Get View
        content = <RitualView item={itemData.item.part}></RitualView>;
        //content = <Text>Main</Text>;

        break;
      case "Button":
        //Button
        //check Rule
        //check Visible
        //Get View
        content = <ButtonView item={itemData.item.part}></ButtonView>;
        break;

      default:
        return <Text>Default</Text>;
        break;
    }
    return <Pressable onPress={hideHeader}>{content}</Pressable>;
  }
  return (
    <View style={[styles.container, { backgroundColor: pageBackgroundColor }]}>
      <FlatList
        data={data}
        pagingEnabled={true}
        renderItem={renderItems}
        keyExtractor={(item, index) => {
          return index;
        }}
      />
      {NavbarVisibility && <BottomBar navigation={navigation} />}
      {/* {NavbarVisibility ? <BottomBar navigation={navigation} /> : null} */}
      {/* <Animated.View style={{ opacity: fadeAnim }}>
        
      </Animated.View> */}
    </View>
  );
}

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
    top: -12, // adjust the top position to make it float over the base letter
    fontSize: 25,
    backgroundColor: "transparent",
    color: "red", // set the color of the floating letter
    zIndex: 1, // set the zIndex to bring the floating letter to the top
  },
});
