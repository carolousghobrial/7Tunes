import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Switch,
  GestureRecognizer,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import AllBishopsPopup from "../components/settings/allbishopsPopup.js";
import { AntDesign } from "@expo/vector-icons";
import {
  changeBishopPresent,
  updateBishopsPresent,
  changeisBishopHere,
  changeismorethan3BishopPresent,
} from "../stores/redux/settings.js";

function BishopPresentView({ visible, closeModal }) {
  const { width, height } = useWindowDimensions();

  let viewheight = "70%";
  let viewwidth = "100%";
  if (width > height) {
    flexDirection = "row";
    viewheight = "100%";
    viewwidth = "50%";
  }
  const darkMode = useSelector((state) => state.settings.darkMode);
  const [BishopIsPresent, setBishopIsPresent] = useState(
    useSelector((state) => state.settings.isBishopHere)
  );

  const ismorethan3BishopPresent = useSelector(
    (state) => state.settings.ismorethan3BishopPresent
  );
  const BishopsPresent = useSelector((state) => state.settings.BishopsPresent);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const language = useSelector((state) => state.settings.appLanguage);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  var pageBackgroundColor = getColor("pageBackgroundColor");
  let labelColor = getColor("LabelColor");
  let primaryColor = getColor("PrimaryColor");
  let secondaryColor = getColor("SecondaryColor");
  let navigationBarColor = getColor("NavigationBarColor");
  let morethan3BishopsText = getLanguageValue("moreThan3Bishops");
  let setBishopText = getLanguageValue("setBishop");
  let BishopIsPresentText = getLanguageValue("BishopIsPresent");
  const dispatch = useDispatch();

  let flexDirection = "row";

  const [isloadingIndicator, setisloadingIndicator] = useState(false);

  const [ModalVisible, setModalVisible] = useState(false);
  const [bishopsPresent, setbishopsPresent] = useState(BishopsPresent);

  function setBishopClicked(bishop) {
    setbishopsPresent([...bishopsPresent, bishop]);

    closeListModal();
  }
  function deleteBishopHandler(id) {
    var newBishops = bishopsPresent.filter((bishop) => bishop.key != id);
    setbishopsPresent(newBishops);
  }
  function openModal() {
    setModalVisible(true);
  }
  function closeListModal() {
    setModalVisible(false);
  }
  function loadingActivate() {
    dispatch(updateBishopsPresent({ BishopsPresent: bishopsPresent }));
    closeModal();
  }
  function toggleSwitch() {
    try {
      setBishopIsPresent(!BishopIsPresent);
      dispatch(changeisBishopHere());
    } catch (e) {
      console.warn(e);
    }
  }
  function toggle3PlusSwitch() {
    dispatch(changeismorethan3BishopPresent());
  }

  return (
    <>
      <AllBishopsPopup
        visible={ModalVisible}
        closeModal={closeModal}
        setBishop={setBishopClicked}
      ></AllBishopsPopup>
      <SafeAreaView style={[styles.container]}>
        <View style={{ margin: 5, flex: 8 }}>
          <View style={[styles.switchView, { flexDirection: flexDirection }]}>
            <View style={styles.titleView}>
              <Text
                style={[
                  styles.title,
                  { fontSize: fontSize, color: primaryColor },
                ]}
              >
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

          {BishopIsPresent ? (
            <View style={[styles.switchView, { flexDirection: flexDirection }]}>
              <View style={styles.titleView}>
                <Text
                  style={[
                    styles.title,
                    { fontSize: fontSize, color: primaryColor },
                  ]}
                >
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
          ) : null}

          {BishopIsPresent && ismorethan3BishopPresent == false ? (
            <View>
              {bishopsPresent.length < 3 ? (
                <Pressable onPress={openModal} style={styles.addButton}>
                  <Text style={styles.buttonText}>Add Bishop</Text>
                </Pressable>
              ) : null}
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: fontSize,
                    color: primaryColor,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                Bishops Present
              </Text>
              {bishopsPresent.map((bishop, index) => (
                <View key={index} style={styles.existingView}>
                  <View
                    style={[styles.popeView, { flexDirection: "row" }]}
                    key={bishop.key}
                  >
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
                      onPress={deleteBishopHandler.bind(this, bishop.key)}
                    >
                      <AntDesign name="closecircle" size={24} color="black" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <Pressable
          onPress={loadingActivate}
          style={[styles.addButton, { flex: 2 }]}
        >
          <Text style={styles.buttonText}>Exit</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
export default BishopPresentView;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    height: "50%",
    justifyContent: "center",
  },
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 5,
  },
  titleView: {
    flex: 2,
    margin: 10,
  },
  title: {
    fontFamily: "english-font",
  },
  image: {
    flex: 8,
    height: "50%",
    borderRadius: 100 / 2,
    overflow: "hidden",
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
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    backgroundColor: "#AA4A44",
    borderWidth: 5,
    margin: 10,
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
});
