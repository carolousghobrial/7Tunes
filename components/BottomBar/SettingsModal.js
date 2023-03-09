import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import AppTheme from "../settings/appTheme";
import FontSize from "../settings/fontSize";
import VisibleLangs from "../settings/visibleLangs";
import TodaysPrayer from "../settings/todaysPrayer";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
// import GestureRecognizer, {
//   swipeDirections,
// } from "react-native-swipe-gestures";

function SettingsModal({ visible, closeModal }) {
  // const { width, height } = useWindowDimensions();

  // let content = (
  //   <>
  //     <View>
  //       <Pressable onPress={closeModal}>
  //         <View
  //           style={{
  //             height: "50%",
  //             marginTop: "auto",
  //             backgroundColor: "transparent",
  //           }}
  //         ></View>
  //       </Pressable>

  //       <View
  //         style={{
  //           height: "50%",
  //           marginTop: "auto",
  //           backgroundColor: getColor("NavigationBarColor"),
  //         }}
  //       >
  //         <ScrollView>
  //           <FontSize></FontSize>
  //           <VisibleLangs></VisibleLangs>
  //         </ScrollView>
  //       </View>
  //     </View>
  //   </>
  // );
  // if (width > 500) {
  //   content = (
  //     <>
  //       <View style={{ flexDirection: "row" }}>
  //         <Pressable onPress={closeModal}>
  //           <View
  //             style={{
  //               width: "50%",
  //               marginTop: "auto",
  //               backgroundColor: "transparent",
  //             }}
  //           ></View>
  //         </Pressable>

  //         <View
  //           style={{
  //             width: "50%",
  //             marginTop: "auto",
  //             backgroundColor: getColor("NavigationBarColor"),
  //           }}
  //         >
  //           <ScrollView>
  //             <FontSize></FontSize>
  //             <VisibleLangs></VisibleLangs>
  //           </ScrollView>
  //         </View>
  //       </View>
  //     </>
  //   );
  // }
  return (
    // <GestureRecognizer
    //   style={{ flex: 1 }}
    //   onSwipeDown={() => this.setModalVisible(false)}
    // >
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
      <View
        style={{
          marginTop: "auto",
          backgroundColor: getColor("NavigationBarColor"),
        }}
      >
        <ScrollView>
          <FontSize></FontSize>
          <VisibleLangs></VisibleLangs>
        </ScrollView>
      </View>
    </Modal>
    // </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 35,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SettingsModal;
