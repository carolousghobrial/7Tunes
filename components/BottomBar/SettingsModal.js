import React, { useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";

import AppTheme from "../settings/appTheme";
import FontSize from "../settings/fontSize";
import VisibleLangs from "../settings/visibleLangs";
import PresentationMode from "../settings/presentationMode";

function SettingsModal({ bottomSheetRef }) {
  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  const data = [
    {
      id: "2",
      content: "AppTheme",
    },
    {
      id: "3",
      content: "FontSize",
    },
    {
      id: "4",
      content: "PresentationMode",
    },

    {
      id: "6",
      content: "VisibleLangs",
    },
  ];
  const flexDirection = width > height ? "row" : "column";

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const closeBottomSheet = () => {
    bottomSheetRef.current.dismiss();
  };

  function SettingsItem({ item }) {
    const viewTypeMap = {
      AppTheme: <AppTheme />,
      FontSize: <FontSize />,

      VisibleLangs: <VisibleLangs />,
      PresentationMode: <PresentationMode />,
    };
    const itemToReturn = viewTypeMap[item.content];
    return viewTypeMap[item.content];
  }
  return (
    <BottomSheetModal
      style={[styles.container, { flexDirection }]}
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={["90%"]}
      backdropComponent={renderBackdrop}
    >
      {/* Close Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: labelColor }]}>Settings</Text>
        <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
          <AntDesign name="closecircle" size={30} color={labelColor} />
        </Pressable>
      </View>
      <BottomSheetFlatList
        style={{ flex: 1 }}
        data={data}
        renderItem={({ item }) => <SettingsItem item={item} />}
        keyExtractor={(item, index) => item.id}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  flatList: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
  },
  closeButton: {
    alignItems: "flex-end",
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 25,
    flex: 8,
  },
});

export default SettingsModal;
