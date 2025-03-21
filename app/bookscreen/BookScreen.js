import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import MenuItem from "../../components/BottomBar/MenuItem.js";
import SettingsScreen from "../(tabs)/settings.js";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import AccordionView from "../../components/ViewTypes/AccordionView.js";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native"; // Use for receiving params from navigation

import BaseView from "../../components/ViewTypes/BaseView";
import MelodyView from "../../components/ViewTypes/MelodyView";
import TitleView from "../../components/ViewTypes/TitleView";
import RitualView from "../../components/ViewTypes/RitualView";
import ButtonView from "../../components/ViewTypes/ButtonView";
import MainTitleView from "../../components/ViewTypes/MainTitleView";
import LoadingScreen from "../../screens/LoadingScreen";
import SettingsModal from "../../components/BottomBar/SettingsModal";
import ContentsModal from "../../components/BottomBar/ContentsModal";
import { getColor } from "../../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../../viewModel/getFullViewModel";
import FloatingButton from "../../components/ViewTypes/FloatingBishopButton";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

const Drawer = createDrawerNavigator();

const BookScreen = () => {
  const dispatch = useDispatch();
  const flatListRef = useRef();
  const { bookPath, motherSource, indexToScroll, bishopButton, Switch } =
    useLocalSearchParams();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const isAndroid = Platform.OS === "ios" ? false : true;
  const values = getFullViewModel(bookPath, motherSource);

  const [bookContents, setBookContents] = useState(
    getFirstContinuousRangeWithUniquePaths(7, values[0])
  );

  function getFirstContinuousRangeWithUniquePaths(
    pathCount,
    data,
    currentPaths = []
  ) {
    const uniquePaths = new Set(currentPaths);
    let endIndex = -1;

    // Iterate through the data and track unique paths
    for (let i = 0; i < data.length; i++) {
      const path = data[i].path || data[i].part?.Path;

      if (path && !uniquePaths.has(path)) {
        uniquePaths.add(path);

        // Once we have enough unique paths, record the index and break
        if (uniquePaths.size === pathCount) {
          endIndex = i;
          break;
        }
      }
    }

    // If we found the required number of unique paths, return the slice; otherwise, return all data
    return endIndex !== -1 ? data.slice(0, endIndex + 1) : data;
  }
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      const firstItem = viewableItems[0]?.item;
      const newPath = firstItem?.part?.Path || firstItem?.path;

      if (!newPath || bookContents.length === values[0].length) return;

      // Compute unique paths only when `bookContents` changes
      const uniquePaths = bookContents.map(
        (item) => item.path || item.part?.Path
      );

      const newContents = getFirstContinuousRangeWithUniquePaths(
        2,
        values[0],
        uniquePaths
      );

      // Only update the state if there is a change in contents
      if (JSON.stringify(bookContents) !== JSON.stringify(newContents)) {
        setBookContents(newContents);
      }
    },
    [bookContents, values]
  );

  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const navigation = useNavigation();

  useEffect(() => {
    const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    const fontSize = isTablet ? 30 : 15;

    navigation.getParent()?.setOptions({
      title: bookContents[0]?.part?.English,
      headerStyle: {
        headerTintColor: labelColor, // Change back button color
        backgroundColor: NavigationBarColor,
      },
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPressIn={() => navigation.openDrawer()}
        >
          <MaterialCommunityIcons
            name="table-of-contents"
            size={40}
            color={labelColor}
          />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: labelColor,

        fontSize,
        fontFamily,
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, [appLanguage, bookContents, flatListRef]);

  const scrollToKey = (key) => {
    try {
      const targetIndex = values[0]?.findIndex(
        ({ key: itemKey }) => itemKey === key.key
      );
      if (targetIndex === -1) return; // Exit if the key is not found

      setIsLoading(true); // Start loading

      if (targetIndex >= bookContents.length) {
        // Load data until the target index if not already loaded
        loadDataUntilIndex(targetIndex);
      } else {
        // Scroll directly if data is already loaded
        scrollToIndex(targetIndex);
      }
    } catch (error) {
      console.error("An error occurred in scrollToKey:", error);

      try {
        console.log("Attempting recovery: scrolling to the bottom.");
        scrollToIndex(bookContents.length - 1); // Scroll to the bottom

        // Retry scrolling to the target key
        setTimeout(() => {
          const targetIndex = values[0]?.findIndex(
            ({ key: itemKey }) => itemKey === key.key
          );
          if (targetIndex !== -1) {
            scrollToIndex(targetIndex);
          } else {
            console.warn("Key still not found after recovery attempt.");
          }
        }, 500); // Delay to ensure smooth recovery
      } catch (recoveryError) {
        console.error("Recovery attempt failed:", recoveryError);
      }
    }
  };
  const route = useRoute();

  const { index } = route.params || {};

  useEffect(() => {
    if (index) {
      scrollToKey(index);
    }
  }, [index]);
  const loadDataUntilIndex = (targetIndex) => {
    // Avoid redundant data loading
    setBookContents((prevContents) => {
      if (prevContents.length >= targetIndex + 1) return prevContents; // Data is already loaded

      const newRangeStart = prevContents.length;
      const newRangeEnd = targetIndex + 5; // Load up to the target index (inclusive)
      const newData = values[0].slice(newRangeStart, newRangeEnd);

      return [...prevContents, ...newData];
    });

    // Use setTimeout to scroll after the data is loaded and rendered
    setTimeout(() => {
      scrollToIndex(targetIndex);
    }, 200); // Ensure the state update and render are complete before scrolling
  };

  const scrollToIndex = (targetIndex) => {
    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: false,
    });
    setIsLoading(false); // Stop loading after scrolling is complete
  };

  // Handle scroll failures
  const handleScrollToIndexFailed = ({ index }) => {
    setTimeout(() => {
      flatListRef.current.scrollToIndex({
        index,
        animated: false, // You can keep this as true for smooth scrolling
      });
    }, 200); // Add a small delay to allow items to be rendered
  };
  const renderItems = ({ item }) => {
    const viewTypeMap = {
      Base: <BaseView item={item.part} mykey={item.key} />,
      Melody: <MelodyView item={item.part} />,
      Title: <TitleView item={item.part} />,
      Ritual: <RitualView item={item.part} />,
      MainTitle: <MainTitleView item={item.part} />,
      Button: (
        <ButtonView
          item={item.part}
          motherSource={bookPath}
          flatListRef={flatListRef}
          viewData={bookContents}
        />
      ),
      Accordion: (
        <AccordionView
          mykey={item.key}
          item={item.part}
          motherSource={bookPath}
        />
      ),
    };
    return viewTypeMap[item.part.Type];
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pageBackgroundColor,
        }}
      >
        <Image
          style={{
            flex: 8,
            height: "50%",
            borderRadius: 100 / 2,
            overflow: "hidden",
          }}
          source={require("../../assets/images/logofinal.png")}
        />
        <ActivityIndicator
          style={{ flex: 2 }}
          size="large"
          color={labelColor}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pageBackgroundColor }}>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1, backgroundColor: pageBackgroundColor }}
        initialNumToRender={bookContents.length}
        showsVerticalScrollIndicator={false}
        data={bookContents}
        onViewableItemsChanged={handleViewableItemsChanged}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
        onScrollToIndexFailed={handleScrollToIndexFailed} // Add error handler
        bounces={false}
        removeClippedSubviews={true}
      />
      {bishopIsPresent && bishopButton && (
        <FloatingButton navigation={navigation} />
      )}
    </SafeAreaView>
  );
};

const DrawerScreen = () => {
  const { bookPath, motherSource } = useLocalSearchParams();
  const values = getFullViewModel(bookPath, motherSource);
  const menuItems = values[1]; // Array of items to populate the drawer
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");
  const isTablet = useSelector((state) => state.settings.isTablet);
  const router = useRouter();

  // Navigation function to reduce repetition
  const handleNavigateToBookScreen = (props, item) => {
    props.navigation.navigate("BookScreen", {
      index: item, // Pass the item to the BookScreen
    });
  };
  const openSettings = (props) => {
    router.push({
      pathname: "/bookscreen/settingsModal",
    });
  };
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <ImageBackground
          source={require("../../assets/images/titleBackground.png")}
          resizeMode="cover"
          style={[
            styles.backgroundimage,
            { backgroundColor: pageBackgroundColor },
          ]}
        >
          <DrawerItemList {...props} />

          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="settings" color={labelColor} size={size} />
            )}
            label="Settings"
            labelStyle={{ color: labelColor }} // Correct way to change label color
            onPress={() => openSettings(props)}
          />
          <DrawerContentScrollView {...props}>
            {/* Custom Drawer Item */}
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key} // Assuming item.id is unique
                style={styles.drawerItem}
                onPress={() => handleNavigateToBookScreen(props, item)} // Using extracted function
              >
                <MenuItem item={item} />
              </TouchableOpacity>
            ))}
          </DrawerContentScrollView>
        </ImageBackground>
      )}
      screenOptions={{
        swipeEdgeWidth: isTablet ? 700 : 400,
        headerShown: true,
        drawerPosition: "right",
        drawerLabelStyle: {
          fontSize: 18,
          color: labelColor,
        },
        drawerType: "front",
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#666",
      }}
    >
      <Drawer.Screen
        name="BookScreen"
        component={BookScreen}
        initialParams={{
          bookPath: "myHome",
        }}
        options={({ route }) => {
          const { englishTitle } = route.params;
          return {
            title: "Return",
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="book"
                color={labelColor}
                size={size}
              />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  backgroundimage: {
    resizeMode: "cover",
    justifyContent: "center",
    flex: 1,
  },
});
