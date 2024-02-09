import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  useWindowDimensions,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
  FlatList,
} from "react-native";
import { changeonboardingViewed } from "../stores/redux/settings.js";

import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import OnboardingItem from "./OnboardingItem.js";
import Paginator from "./Paginator.js";
import NextButton from "./NextButton.js";
import { useDispatch, useSelector } from "react-redux";
import ApplicationLanguage from "../components/settings/applicationLanguage.js";
import AppTheme from "../components/settings/appTheme.js";
import TodaysPrayer from "../components/settings/todaysPrayer.js";
import FontSize from "../components/settings/fontSize.js";
import PresentationMode from "../components/settings/presentationMode.js";
import VisibleLangs from "../components/settings/visibleLangs.js";
import PopeBishop from "../components/settings/popeBishop.js";
import { ScrollView } from "react-native";
function Onboarding({ navigation, route }) {
  const { width, height } = useWindowDimensions();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  var pageBackgroundColor = getColor("pageBackgroundColor");
  var LabelColor = getColor("LabelColor");
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0] !== undefined) {
      setCurrentIndex(viewableItems[0]?.index);
    }
  }).current;
  const dispatch = useDispatch();

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef(null);
  let labelColor = getColor("LabelColor");
  const scrollX = useRef(new Animated.Value(0)).current;
  const data = [
    {
      id: "1",
      content: <ApplicationLanguage></ApplicationLanguage>,
    },
    {
      id: "2",
      content: <AppTheme></AppTheme>,
    },
    {
      id: "3",
      content: <FontSize></FontSize>,
    },
    {
      id: "4",
      content: <PresentationMode></PresentationMode>,
    },
    {
      id: "5",
      content: <TodaysPrayer></TodaysPrayer>,
    },
    {
      id: "6",
      content: (
        <ScrollView>
          <VisibleLangs />
        </ScrollView>
      ),
    },
    {
      id: "7",
      content: (
        <ScrollView>
          <PopeBishop />
        </ScrollView>
      ),
    },
  ];

  const ScrollTo = () => {
    if (currentIndex < data.length - 1) {
      slidesRef.current.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      try {
        dispatch(changeonboardingViewed());
      } catch (err) {}
    }
  };

  return (
    <View
      style={{
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: pageBackgroundColor,
        opacity: 0.7,
      }}
    >
      <View style={{ flex: 7, margin: 5 }}>
        <Text style={[styles.maintitle, { color: LabelColor }]}>
          {getLanguageValue("onboardingScreen")}
        </Text>
        <FlatList
          data={data}
          ref={slidesRef}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEnabled={false}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          onViewableItemsChanged={viewableItemsChanged}
        />
      </View>
      <View style={{ flex: 3 }}>
        <Paginator data={data} scrollX={scrollX} />
        <NextButton
          percentage={(currentIndex + 1) * (100 / data.length)}
          ScrollTo={ScrollTo}
        />
      </View>
    </View>
  );
}
export default Onboarding;
const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 5,
  },
  maintitle: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    fontWeight: "bold",

    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 20,
  },
  image: {
    flex: 8,
    height: "50%",
    borderRadius: 100 / 2,
    overflow: "hidden",
  },

  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 20,
  },
  textView: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});
