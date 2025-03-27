import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Tooltip } from "@rneui/themed";
import { getLanguageValue } from "../../helpers/SettingsHelpers";

import MenuItem from "../../components/BottomBar/MenuItem.js";
import SettingsScreen from "../(tabs)/settings.js";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Counter from "../../components/ViewTypes/CounterView.js";
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
import { getColor } from "../../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../../viewModel/getFullViewModel";
import FloatingButton from "../../components/ViewTypes/FloatingBishopButton";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

const Drawer = createDrawerNavigator();

const BookScreen = memo(() => {
  const flatListRef = useRef();
  const route = useRoute();
  const { index, values, bookPath } = route.params || {};
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const [navbarVisibility, setNavbarVisibility] = useState(true);

  const [bookContents, setBookContents] = useState(values);
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const navigation = useNavigation();

  useEffect(() => {
    const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    const fontSize = isTablet ? 30 : 15;

    navigation.getParent()?.setOptions({
      title:
        appLanguage === "eng"
          ? bookContents[0]?.part?.English
          : bookContents[0]?.part?.Arabic,
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
      headerShown: navbarVisibility,
    });

    setIsLoading(false); // Set loading state directly without timeout
  }, [appLanguage, bookContents, appLanguage, flatListRef, navbarVisibility]);

  useEffect(() => {
    if (index !== undefined) {
      flatListRef.current?.scrollToIndex({ index: index.key, animated: false });
    }
  }, [bookContents, index]);

  const onScrollToIndexFailed = useCallback((error) => {
    setIsLoading(true);
    const offset = error.averageItemLength * error.index;
    flatListRef.current?.scrollToOffset({ offset, animated: false });

    setTimeout(() => {
      setIsLoading(false);

      flatListRef.current?.scrollToIndex({
        index: error.index,
        animated: false,
        viewPosition: 0,
      });
    }, 2); // Delay to allow for smooth scrolling animation
  }, []);
  const [tooltipVisible, setTooltipVisible] = useState({});

  const handleLongPress = (key) => {
    setTooltipVisible((prev) => ({ ...prev, [key]: true }));
  };

  const handleClose = (key) => {
    setTooltipVisible((prev) => ({ ...prev, [key]: false }));
  };
  const copyPartToClipboard = (item) => {
    console.log(item.English);
  };
  const renderItems = useCallback(
    ({ item, index }) => {
      const viewTypeMap = {
        Base: <BaseView item={item.part} mykey={item.key} />,
        Melody: <MelodyView item={item.part} />,
        Title: <TitleView item={item.part} />,
        Ritual: <RitualView item={item.part} />,
        MainTitle: <MainTitleView item={item.part} />,
        Button: (
          <ButtonView
            item={item.part}
            index={index}
            motherSource={bookPath}
            flatListRef={flatListRef}
            bookContents={bookContents}
            setBookContents={setBookContents}
          />
        ),
        MainAccordion: (
          <AccordionView
            mykey={item.key}
            item={item.part}
            motherSource={bookPath}
            initialExpanded={true}
          />
        ),

        Accordion: (
          <AccordionView
            mykey={item.key}
            item={item.part}
            motherSource={bookPath}
            initialExpanded={false}
          />
        ),
      };

      return viewTypeMap[item.part.Type];
    },
    [bookContents, bookPath]
  );
  // const ItemWithTooltip = ({ item }) => {
  //   const [tooltipVisible, setTooltipVisible] = useState(false);

  //   const handleLongPress = () => setTooltipVisible(true);
  //   const handleClose = () => setTooltipVisible(false);

  //   const viewTypeMap = {
  //     Base: <BaseView item={item.part} mykey={item.key} />,
  //     Melody: <MelodyView item={item.part} />,
  //     Title: <TitleView item={item.part} />,
  //     Ritual: <RitualView item={item.part} />,
  //     MainTitle: <MainTitleView item={item.part} />,
  //     Button: <ButtonView item={item.part} />,
  //     MainAccordion: (
  //       <AccordionView
  //         mykey={item.key}
  //         item={item.part}
  //         initialExpanded={true}
  //       />
  //     ),
  //     Counter: (
  //       <Counter
  //         target={item.part.CountNum}
  //         incrementBy={item.part.IncrementBy}
  //       />
  //     ),
  //     Accordion: (
  //       <AccordionView
  //         mykey={item.key}
  //         item={item.part}
  //         initialExpanded={false}
  //       />
  //     ),
  //   };

  //   return (
  //     <View>
  //       <View style={{ position: "absolute", zIndex: 999 }}>
  //         <Tooltip
  //           visible={tooltipVisible}
  //           onOpen={handleLongPress}
  //           onClose={handleClose}
  //           popover={
  //             <TouchableOpacity
  //               onPress={copyPartToClipboard.bind(this, item.part)}
  //             >
  //               <Text>Copy Part</Text>
  //             </TouchableOpacity>
  //           }
  //         ></Tooltip>
  //       </View>

  //       <TouchableOpacity onLongPress={handleLongPress} onPress={hideHeader}>
  //         {viewTypeMap[item.part.Type]}
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  const previousOffsetRef = useRef(0);

  const SCROLL_THRESHOLD = 100; // Adjust this value as needed

  const handleScroll = useCallback(
    (event) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const scrollDifference = Math.abs(
        currentOffset - previousOffsetRef.current
      );
      const isScrollingDown = currentOffset > previousOffsetRef.current;

      if (scrollDifference > SCROLL_THRESHOLD) {
        if (isScrollingDown && navbarVisibility) {
          setNavbarVisibility(false);
        } else if (!isScrollingDown && !navbarVisibility) {
          setNavbarVisibility(true);
        }

        previousOffsetRef.current = currentOffset; // Update only when threshold is exceeded
      }
    },
    [navbarVisibility]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: pageBackgroundColor }]}
    >
      {isLoading && (
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: pageBackgroundColor },
          ]}
        >
          <Image
            style={styles.logo}
            source={require("../../assets/images/logofinal.png")}
          />
          <ActivityIndicator size="large" color={labelColor} />
        </View>
      )}
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        scrollEventThrottle={16} // Improve performance
        showsVerticalScrollIndicator={true}
        data={bookContents}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
        onScrollToIndexFailed={onScrollToIndexFailed}
        bounces={false}
        onScroll={handleScroll}
        removeClippedSubviews={true}
      />
      {bishopIsPresent && <FloatingButton navigation={navigation} />}
    </SafeAreaView>
  );
});

const DrawerScreen = () => {
  const route = useRoute();
  const { bookPath, motherSource } = route.params || {};
  const values = getFullViewModel(bookPath, motherSource);
  const menuItems = values[1]; // Array of items to populate the drawer
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");
  const isTablet = useSelector((state) => state.settings.isTablet);
  const router = useRouter();

  const handleNavigateToBookScreen = useCallback((props, item) => {
    props.navigation.navigate("BookScreen", { index: item });
  }, []);

  const openSettings = useCallback(
    (props) => {
      router.push({ pathname: "/bookscreen/settingsModal" });
    },
    [router]
  );

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
            label={getLanguageValue("settings")}
            labelStyle={{ color: labelColor }}
            onPress={() => openSettings(props)}
          />
          <DrawerContentScrollView {...props}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleNavigateToBookScreen(props, item)}
              >
                <MenuItem item={item} />
              </TouchableOpacity>
            ))}
          </DrawerContentScrollView>
        </ImageBackground>
      )}
      screenOptions={{
        swipeEdgeWidth: isTablet ? 900 : 400,
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
        initialParams={{ values: values[0], bookPath }}
        options={({ route }) => {
          const { englishTitle } = route.params;
          return {
            title: getLanguageValue("Return"),
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
  safeArea: {
    flex: 1,
  },
  backgroundimage: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  headerButton: {
    paddingRight: 15,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
  },
});
