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

import AppTheme from "../settings/appTheme";
import FontSize from "../settings/fontSize";
import VisibleLangs from "../settings/visibleLangs";
import PresentationMode from "../settings/presentationMode";

import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";

function SettingsModal({ bottomSheetRef, snapPoints }) {
  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  let flexDirection = "column";
  if (width > height) {
    flexDirection = "row";
  }

  const wrapperStyle = {
    flexDirection: flexDirection,
  };

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

  return (
    <BottomSheetModal
      style={[styles.container, wrapperStyle]}
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View>
        {/* Close Button */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: labelColor }]}>Settings</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => bottomSheetRef.current.dismiss()}
          >
            <AntDesign name="closecircle" size={30} color={labelColor} />
          </Pressable>
        </View>

        <ScrollView>
          <AppTheme />
          <PresentationMode />
          <FontSize />
          <VisibleLangs />
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
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
