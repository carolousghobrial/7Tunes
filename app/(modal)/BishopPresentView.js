import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useWindowDimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

import AllBishopsPopup from "../../components/settings/allbishopsPopup.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";
import {
  changeBishopPresent,
  updateBishopsPresent,
  changeismorethan3BishopPresent,
} from "../../stores/redux/settings.js";

function BishopPresentView({ bottomSheetRef, snapPoints }) {
  const { width, height } = useWindowDimensions();
  const { modal } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  // Selectors
  const darkMode = useSelector((state) => state.settings.darkMode);
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const ismorethan3BishopPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  const fontSize = useSelector((state) => state.settings.textFontSize);

  // Colors and Labels
  const navigationBarColor = getColor("NavigationBarColor");
  const primaryColor = getColor("PrimaryColor");
  const secondaryColor = getColor("SecondaryColor");
  const labelColor = getColor("LabelColor");

  const BishopIsPresentText = getLanguageValue("BishopIsPresent");
  const morethan3BishopsText = getLanguageValue("moreThan3Bishops");
  const AddBishops = getLanguageValue("AddBishops");
  const BishopsPresentText = getLanguageValue("BishopsPresent");

  // States
  const [ModalVisible, setModalVisible] = useState(false);
  const [bishopsPresent, setBishopsPresent] = useState(BishopsPresent);

  // Handlers
  const toggleSwitch = useCallback(() => {
    dispatch(changeBishopPresent());
  }, [dispatch]);

  const toggle3PlusSwitch = useCallback(() => {
    dispatch(changeismorethan3BishopPresent());
  }, [dispatch]);

  const setBishopClicked = useCallback(
    (bishop) => {
      const updatedBishops = [...bishopsPresent, bishop];
      dispatch(updateBishopsPresent({ BishopsPresent: updatedBishops }));
      setBishopsPresent(updatedBishops);
      setModalVisible(false);
    },
    [bishopsPresent, dispatch]
  );

  const deleteBishopHandler = useCallback(
    (id) => {
      const updatedBishops = bishopsPresent.filter(
        (bishop) => bishop.key !== id
      );
      dispatch(updateBishopsPresent({ BishopsPresent: updatedBishops }));
      setBishopsPresent(updatedBishops);
    },
    [bishopsPresent, dispatch]
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (modal) {
      navigation.setOptions({
        title: "Bishop is Here?",
        presentation: "modal",
        headerRight: () => (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        ),
      });
    }
  }, [navigation, router]);

  return (
    <>
      <AllBishopsPopup
        visible={ModalVisible}
        closeModal={closeModal}
        setBishop={setBishopClicked}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: navigationBarColor,
            borderColor: primaryColor,
          },
        ]}
      >
        <View style={styles.switchView}>
          <Text style={[styles.title, { fontSize, color: primaryColor }]}>
            {BishopIsPresentText}
          </Text>
          <Switch
            trackColor={{ false: navigationBarColor, true: secondaryColor }}
            ios_backgroundColor={darkMode ? secondaryColor : navigationBarColor}
            value={BishopIsPresent}
            onValueChange={toggleSwitch}
            thumbColor="white"
          />
        </View>

        {BishopIsPresent && (
          <>
            <View style={styles.switchView}>
              <Text
                style={[
                  styles.title,
                  { fontSize, color: primaryColor, flex: 1 },
                ]}
              >
                {morethan3BishopsText}
              </Text>
              <Switch
                trackColor={{ false: navigationBarColor, true: secondaryColor }}
                ios_backgroundColor={
                  darkMode ? secondaryColor : navigationBarColor
                }
                value={ismorethan3BishopPresent}
                onValueChange={toggle3PlusSwitch}
                thumbColor="white"
              />
            </View>

            {!ismorethan3BishopPresent && (
              <View style={styles.bishopsContainer}>
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

                {bishopsPresent.map((bishop) => (
                  <View style={styles.existingView} key={bishop.key}>
                    <Text
                      style={[styles.popeText, { color: labelColor, flex: 1 }]}
                    >
                      {bishop.Rank === "Bishop"
                        ? " His Grace Bishop "
                        : " His Eminence Metropolitan "}
                      {bishop.English}
                    </Text>
                    <Pressable onPress={() => deleteBishopHandler(bishop.key)}>
                      <AntDesign
                        name="closecircle"
                        size={24}
                        color={labelColor}
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
}

export default BishopPresentView;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: "column",
  },
  switchView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginVertical: 10,
  },
  title: {
    fontFamily: "english-font",
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
  bishopsContainer: {
    width: "100%",
    alignItems: "center",
  },
  existingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginVertical: 5,
  },
  popeText: {
    fontFamily: "englishtitle-font",
    fontSize: 18,
    padding: 5,
  },
});
