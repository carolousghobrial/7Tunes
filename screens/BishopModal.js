import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

import AllBishopsPopup from "../components/settings/allbishopsPopup.js";
import BishopPresentView from "./BishopPresentView.js";
import { getColor, getLanguageValue } from "../helpers/SettingsHelpers.js";
import {
  changeBishopIsPresent,
  changeismorethan3BishopPresent,
} from "../stores/redux/settings.js";
import { AntDesign } from "@expo/vector-icons";

function BishopModal({ bottomSheetRef, snapPoints }) {
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const [ModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);

  const [bishopsPresent, setbishopsPresent] = useState(BishopsPresent);

  const toggleSwitch = () => {
    try {
      setBishopIsPresent(!BishopIsPresent);
      dispatch(changeBishopIsPresent());
    } catch (e) {
      console.warn(e);
    }
  };

  const toggle3PlusSwitch = () => {
    dispatch(changeismorethan3BishopPresent());
  };

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: labelColor }]}>
          Table of Contents
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => bottomSheetRef.current.dismiss()}
        >
          <AntDesign name="closecircle" size={30} color={labelColor} />
        </Pressable>
      </View>

      <BishopPresentView />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
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
    marginHorizontal: 10,
    flex: 8,
  },
});

export default BishopModal;
