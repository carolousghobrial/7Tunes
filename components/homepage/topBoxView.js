import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import React, { useState, useEffect } from "react";
import "moment/locale/ar";
import images from "../../helpers/imageHelpers";

function TopBoxView() {
  const [seasonText, setseasonText] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    // Update the document title using the browser API
    SetDateTime();
    SetCurrentSeason();
  });
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const appLang = useSelector((state) => state.settings.appLanguage);
  const weekOf = getLanguageValue("week_of");
  const season = getLanguageValue(currentSeason.key);
  function SetCurrentSeason() {
    switch (currentSeason.key) {
      case "GREAT_LENT":
      case "HOLY_50":
      case "NATIVITY_FAST":
        let tempText = "";
        let weekNum = currentSeason.week;
        if (appLang === "eng") {
          switch (weekNum) {
            case 1:
              weekNum += "st";
              break;
            case 2:
              weekNum += "nd";
              break;
            case 3:
              weekNum += "rd";
              break;
            default:
              weekNum += "th";
              break;
          }

          tempText += weekNum + " " + weekOf + " " + season;

          setseasonText(tempText);
        } else {
          tempText += weekOf + weekNum + " من " + season;

          setseasonText(tempText);
        }

        break;
      default:
        setseasonText(season);
        break;
    }
  }
  function SetDateTime() {
    if (appLang === "eng") {
      moment().locale("en");
      var mydate = moment().format("dddd, MMMM Do YYYY");
      setDate(mydate);
    } else {
      var mydate = moment().locale("ar").format("LLLL");
      setDate(mydate);
    }
  }

  return (
    <View style={styles.bookView}>
      <Image style={styles.image} source={images[currentSeason.key]} />
      <View style={styles.textView}>
        <Text style={styles.text}>
          {getCopticDateString(
            currentSeason.copticYear,
            currentSeason.copticMonth,
            currentSeason.copticDay
          )}
        </Text>
        <Text style={styles.text}>{moment().format("dddd, MMMM Do YYYY")}</Text>
        <Text style={styles.text}>{seasonText}</Text>
      </View>

      {/* <Text>{getCopticFastsFeasts()}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row-reverse",
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 5,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
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
});

export default TopBoxView;
