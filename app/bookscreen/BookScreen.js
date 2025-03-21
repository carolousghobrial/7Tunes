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
  const flatListRef = useRef();
  const route = useRoute(); // Access route parameters

  const { values, bookPath, index } = route.params || {}; // Retrieve parameters

  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );

  const [isLoading, setIsLoading] = useState(true);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const navigation = useNavigation();
  useEffect(() => {
    const fontSize = isTablet ? 30 : 15;

    navigation.getParent()?.setOptions({
      title: values[0]?.part?.English,
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
        fontFamily: "english-font",
        fontSize,
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, []);

  useEffect(() => {
    if (index) {
      const targetIndex = values?.findIndex(
        ({ key: itemKey }) => itemKey === index.key
      );
      if (targetIndex === -1) return; // Exit if the key is not found

      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: false,
      });
    }
  }, [index]);

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
          viewData={values}
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
        initialNumToRender={values.length}
        showsVerticalScrollIndicator={false}
        data={values}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
        onScrollToIndexFailed={handleScrollToIndexFailed} // Add error handler
        bounces={false}
        extraData={bookPath}
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
          bookPath: bookPath,
          values: values[0],
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
