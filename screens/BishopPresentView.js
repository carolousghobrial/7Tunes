import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useWindowDimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import AllBishopsPopup from "../components/settings/allbishopsPopup.js";
import { getLanguageValue, getColor } from "../helpers/SettingsHelpers.js";
import {
  changeBishopPresent,
  updateBishopsPresent,
  changeBishopIsPresent,
  changeismorethan3BishopPresent,
} from "../stores/redux/settings.js";

function BishopPresentView({ bottomSheetRef, snapPoints }) {
  const { width, height } = useWindowDimensions();
  const [ModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.settings.darkMode);
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const ismorethan3BishopPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );

  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const navigationBarColor = getColor("NavigationBarColor");
  const primaryColor = getColor("PrimaryColor");
  const secondaryColor = getColor("SecondaryColor");
  const labelColor = getColor("LabelColor");
  const morethan3BishopsText = getLanguageValue("moreThan3Bishops");
  const setBishopText = getLanguageValue("setBishop");
  const BishopIsPresentText = getLanguageValue("BishopIsPresent");
  const AddBishops = getLanguageValue("AddBishops");
  const BishopsPresentText = getLanguageValue("BishopsPresent");

  const [bishopsPresent, setBishopsPresent] = useState(BishopsPresent);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      ></BottomSheetBackdrop>
    ),
    []
  );

  const toggleSwitch = () => {
    try {
      dispatch(changeBishopPresent());
    } catch (e) {
      console.warn(e);
    }
  };

  const toggle3PlusSwitch = () => {
    dispatch(changeismorethan3BishopPresent());
  };

  const setBishopClicked = (bishop) => {
    // setBishopsPresent();
    const updateArray = [...bishopsPresent, bishop];
    dispatch(updateBishopsPresent({ BishopsPresent: updateArray }));
    setBishopsPresent(updateArray);
    closeListModal();
  };

  const deleteBishopHandler = (id) => {
    const newBishops = bishopsPresent.filter((bishop) => bishop.key !== id);
    dispatch(updateBishopsPresent({ BishopsPresent: newBishops }));

    setBishopsPresent(newBishops);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeListModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* AllBishopsPopup component */}
      <AllBishopsPopup
        visible={ModalVisible}
        closeModal={() => setModalVisible(false)}
        setBishop={setBishopClicked}
      ></AllBishopsPopup>

      {/* Bishop Present View */}
      <View style={styles.container}>
        <View style={styles.switchView}>
          <View style={styles.titleView}>
            <Text style={[styles.title, { fontSize, color: primaryColor }]}>
              {BishopIsPresentText}
            </Text>
          </View>
          <View style={styles.switch}>
            <Switch
              trackColor={{
                false: navigationBarColor,
                true: secondaryColor,
              }}
              ios_backgroundColor={
                darkMode ? secondaryColor : navigationBarColor
              }
              value={BishopIsPresent}
              onValueChange={toggleSwitch}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Show more than 3 Bishops Switch */}
        {BishopIsPresent && (
          <View style={styles.switchView}>
            <View style={styles.titleView}>
              <Text style={[styles.title, { fontSize, color: primaryColor }]}>
                {morethan3BishopsText}
              </Text>
            </View>
            <View style={styles.switch}>
              <Switch
                trackColor={{
                  false: navigationBarColor,
                  true: secondaryColor,
                }}
                ios_backgroundColor={
                  darkMode ? secondaryColor : navigationBarColor
                }
                value={ismorethan3BishopPresent}
                onValueChange={toggle3PlusSwitch}
                thumbColor="white"
              />
            </View>
          </View>
        )}

        {/* Bishops Present List */}
        {BishopIsPresent && !ismorethan3BishopPresent ? (
          <View style={{ width: "100%" }}>
            {bishopsPresent.length < 3 && (
              <Pressable onPress={openModal} style={styles.addButton}>
                <Text style={styles.buttonText}>{AddBishops}</Text>
              </Pressable>
            )}

            <Text
              style={[
                styles.title,
                {
                  fontSize,
                  color: primaryColor,
                  textDecorationLine: "underline",
                },
              ]}
            >
              {BishopsPresentText}
            </Text>

            {bishopsPresent.map((bishop, index) => (
              <View style={styles.existingView} key={index}>
                <View style={[styles.popeView, { flexDirection: "row" }]}>
                  <Text
                    style={[
                      styles.popeText,
                      {
                        color: labelColor,
                        flex: 8,
                        alignContent: "flex-start",
                      },
                    ]}
                  >
                    {bishop.Rank === "Bishop"
                      ? " His Grace Bishop "
                      : " His Eminence Metropolitan "}
                    {bishop.English}
                  </Text>
                  <Pressable
                    style={{ margin: 3 }}
                    onPress={() => deleteBishopHandler(bishop.key)}
                  >
                    <AntDesign
                      name="closecircle"
                      size={24}
                      color={labelColor}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
}

export default BishopPresentView;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
    flexDirection: "column",
  },
  switchView: {
    flexDirection: "row",
  },
  titleView: {
    margin: 10,
    flex: 8,
  },
  title: {
    fontFamily: "english-font",
  },
  switch: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  popeView: {
    alignContent: "center",
    justifyContent: "center",
  },
  popeText: {
    fontFamily: "englishtitle-font",
    fontSize: 25,
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  existingView: {
    // Add any styles specific to the existing bishop view here
    // For example, you can add margin, padding, or border styles
  },
});
