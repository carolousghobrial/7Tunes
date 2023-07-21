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
import BishopPresentView from "./BishopPresentView.js";

function BishopModal({ visible, closeModal }) {
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
    // continueToBook({
    //   bishopsPresent: bishopsPresent,
    // });
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
    >
      <View style={{ backgroundColor: pageBackgroundColor, flex: 1 }}>
        <BishopPresentView
          visible={visible}
          closeModal={closeModal}
        ></BishopPresentView>
      </View>
    </Modal>
  );
}
export default BishopModal;
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
