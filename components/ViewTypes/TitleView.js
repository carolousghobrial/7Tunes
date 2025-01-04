import { StyleSheet } from "react-native";
import {
  View,
  Button,
  TextInput,
  ImageBackground,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import bookPaths from "../../helpers/bookPathsHelpers";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";

import images from "../../helpers/imageHelpers";
import { Entypo } from "@expo/vector-icons";

import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

function TitleView({ item, motherSource, navigation }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isSwitchGregorian =
    item.Switch !== undefined && item.Switch.toLowerCase().includes("gregory");
  let flex = "row";
  let Switchflex = "column";
  if (width < height) {
    // Portrait mode
    flex = "column";
    Switchflex = "row";
  }
  //let regex = /2:15-3:25/i;
  const regex = /\d+/g;
  function switchLiturgies() {
    if (item.Switch !== undefined) {
      console.log(item.Switch);
      if (isSwitchGregorian) {
        if (item.mother !== undefined) {
          router.replace({
            pathname: "/bookscreen/BookScreen",
            params: {
              bookPath: "liturgyofStGregory",
              Switch: item.Switch,
            },
          });
          // navigation.replace("BookScreen", {
          //   bookPath: "liturgyofStGregoryCovenantThursday",
          //   Switch: item.Switch,
          // });
        } else {
          router.replace({
            pathname: "/bookscreen/BookScreen",
            params: {
              bookPath: "liturgyofStGregory",
              Switch: item.Switch,
            },
          });
        }
      } else {
        if (item.mother !== undefined) {
          navigation.replace("BookScreen", {
            bookPath: "liturgyofStBasilCovenantThursday",
            Switch: item.Switch,
          });
        } else {
          router.replace({
            pathname: "/bookscreen/BookScreen",
            params: {
              bookPath: "liturgyofStBasil",
              Switch: item.Switch,
            },
          });
        }
      }
    }
  }

  // const printToFile = async () => {
  //   // On iOS/android prints the given html. On web prints the HTML from the current page.
  //   const book = bookPaths[item.Path];

  //   //     let html = `
  //   // <html>
  //   //   <head>
  //   //     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //   // <style>
  //   //      @font-face {
  //   //         font-family: 'Shenouda';
  //   //         src: local('Shenouda'), url('../../assets/fonts/Shenouda.ttf') format('truetype');
  //   //       }
  //   //       h1{
  //   //          font-family: Shenouda
  //   //       }
  //   //     </style>
  //   //   </head>
  //   //   <body style="text-align: center;">
  //   //     <h1 >
  //   //       ${book.CopticTitle}
  //   //     </h1>
  //   // `;
  //   //     book.Hymn.forEach((part) => {
  //   //       html += `
  //   //       <div>
  //   //         <div style="display: flex;">
  //   //           <p style="font-size: 12px; font-weight: normal; ">
  //   //             ${part.Arabic}
  //   //           </p>
  //   //           <p>
  //   //             ${part.Coptic}
  //   //           </p>
  //   //           <p style="font-size: 12px; font-family: Helvetica Neue; font-weight: normal;">
  //   //             ${part.English}
  //   //           </p>
  //   //           <!-- Add your content here for each hymn -->
  //   //         </div>
  //   //       </div>
  //   //       `;
  //   //     });

  //   //     html += `
  //   //         </body>
  //   //       </html>
  //   //     `;

  //   let html = `
  //   <html>
  //     <head>
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //   <style>
  //        @font-face {
  //           font-family: 'Shenouda';
  //           src: local('Shenouda'), url('../../assets/fonts/Shenouda.ttf') format('truetype');
  //         }
  //    </style>
  //     </head>
  //     <body style="text-align: center;">
  //       <h1 style="font-family: Shenouda;">
  //         ${book.CopticTitle}
  //       </h1>
  //         </body>
  //        </html>
  // `;
  //   const { uri } = await Print.printToFileAsync({ html });
  //   console.log("File has been saved to:", uri);
  //   await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  // };
  function openZoomPinch() {
    router.push({
      pathname: "/bookscreen/ZoomAndDrawPage",
      params: {
        path: item.Path,
        rule: item.rule,
        motherSource: motherSource,
      },
    });
  }
  return (
    <View style={[styles.bookView, { flexDirection: flex }]}>
      <View style={{ flex: 8 }}>
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize: fontSize * 1.13, color: getColor("TitleColor") },
            ]}
          >
            {item.English}
          </Text>
        </View>
        {item.Coptic !== undefined ? (
          <View style={styles.textView}>
            <Text
              style={[
                styles.coptic,
                { fontSize: fontSize * 1.13, color: getColor("TitleColor") },
              ]}
            >
              {item.Coptic}
            </Text>
          </View>
        ) : null}
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              {
                fontSize: fontSize * 1.13,
                color: getColor("TitleColor"),
                flexDirection: "row-reverse",
              },
            ]}
          >
            {item.Arabic.replace(regex, (match) => {
              return Number(match).toLocaleString("ar-EG");
            })}
          </Text>
        </View>
      </View>
      {item.Switch !== undefined ? (
        <Pressable
          style={{
            alignContent: "center",
            margin: 5,
          }}
          onPress={switchLiturgies}
        >
          {isSwitchGregorian ? (
            <View style={[styles.switchView, { flexDirection: Switchflex }]}>
              <Image
                style={styles.image}
                source={images["liturgyofStGregory"]}
              />
              <View style={[styles.swapTextView, { flexDirection: flex }]}>
                <Entypo name="swap" size={24} color={getColor("LabelColor")} />
                <Text
                  style={[styles.SwitchText, { color: getColor("LabelColor") }]}
                >
                  St.Gregory
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.switchView, { flexDirection: Switchflex }]}>
              <Image style={styles.image} source={images["liturgyofStBasil"]} />
              <View style={[styles.swapTextView, { flexDirection: flex }]}>
                <Entypo name="swap" size={24} color={getColor("LabelColor")} />
                <Text
                  style={[styles.SwitchText, { color: getColor("LabelColor") }]}
                >
                  St.Basil
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      ) : null}
      {/* <Pressable onPress={openZoomPinch}>
        <Text>PRINT</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    margin: 3,
    borderRadius: 30,
  },
  backgroundimage: {
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  swapTextView: {
    flex: 7,
  },
  SwitchText: {
    fontFamily: "english-font",
    fontSize: 24,
    fontStyle: "italic",
    justifyContent: "center",
    textDecorationLine: "underline",

    alignContent: "center",
  },
  image: {
    flex: 2,
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    marginHorizontal: 10,
    height: 60,
    borderRadius: 100 / 2,
    overflow: "hidden",
    resizeMode: "stretch",
  },
  switchView: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  textView: {
    margin: 2,

    justifyContent: "center",
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "right",
    justifyContent: "center",
    textAlign: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "right",
    writingDirection: "rtl",
    justifyContent: "center",
    textAlign: "center",
  },
  english: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
  },
});
export default memo(TitleView);
