import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Animated,
  Pressable,
  StatusBar,
} from "react-native";
import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import MainTitleView from "../components/ViewTypes/MainTitleView";
import Icon from "react-native-vector-icons/Ionicons";

import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  PureComponent,
  useMemo,
} from "react";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getMain } from "../viewModel/getFullViewModel";
const ViewSingleHymn = React.memo(({ navigation, route }) => {
  const flatListRef = useRef();
  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const path = route.params.path;
  var pageBackgroundColor = getColor("pageBackgroundColor");
  let labelColor = getColor("LabelColor");

  const motherSource = route.params.motherSource;
  const rule = route.params.rule;
  const data = getMain(path, motherSource, false, rule, 0)[0];
  const renderItems = ({ item }) => {
    let content = {};
    switch (item.part.Type) {
      case "Base":
        content = <BaseView item={item.part}></BaseView>;

        break;
      case "Melody":
        content = <MelodyView item={item.part}></MelodyView>;

        break;
      case "Title":
        content = <TitleView item={item.part}></TitleView>;

        break;
      case "Ritual":
        content = <RitualView item={item.part}></RitualView>;

        break;
      case "MainTitle":
        content = <MainTitleView item={item.part}></MainTitleView>;

        break;
      case "Button":
        content = (
          <ButtonView
            item={item.part}
            flatListRef={flatListRef}
            viewData={memoizedData}
            navigation={navigation}
          ></ButtonView>
        );
        break;
      default:
        return <Text>Default</Text>;
        break;
    }
    return <Pressable onPress={hideHeader}>{content}</Pressable>;
  };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      //sehowMcuhToScroll(viewableItems.length - 1);
    }
  }).current;
  useEffect(() => {
    navigation.setOptions({
      headerShown: NavbarVisibility,
    });
  }, [NavbarVisibility]);

  const settingsPressed = () => {
    navigation.navigate("SettingsModal");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Pressable style={{ marginHorizontal: 5 }} onPress={settingsPressed}>
            <Icon name="ios-settings-outline" size={30} color={labelColor} />
          </Pressable>
        </>
      ),
    });
  }, [navigation]);

  function hideHeader() {
    setNavbarVisibility(!NavbarVisibility);
  }

  return (
    <View style={[styles.container, { backgroundColor: pageBackgroundColor }]}>
      <FlatList
        ref={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        data={data}
        // initialScrollIndex={scrollToIndex}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => {
          return item.key;
        }}
      />
    </View>
  );
});

export default ViewSingleHymn;

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
