import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import React, { useState, useEffect } from "react";
import images from "../../helpers/imageHelpers";
import Languages from "../../constants/languages";
import { setSeason } from "../../stores/redux/settings.js";

function TopBoxView() {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const appLang = useSelector((state) => state.settings.appLanguage);
  const weekOf = getLanguageValue("week_of");
  const season = getLanguageValue(currentSeason.key);
  const [seasonText, setseasonText] = useState("");
  const [date, setDate] = useState("");
  const [imageURL, setImageURL] = useState(currentSeason.key);
  const [copticdate, setCopticDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    // Update the document title using the browser API
    SetCurrentSeason();
    SetDateTime();
    SetCopticDateTime();
    setImageURL(
      currentSeason.key === "STANDARD" &&
        currentSeason.saintsOfThisDay?.length > 0
        ? currentSeason.saintsOfThisDay[0]
        : currentSeason.key
    );
  }, [currentSeason]);

  function SetCurrentSeason() {
    switch (currentSeason.key) {
      case "GREAT_LENT":
      case "HOLY_50":
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
    try {
      var date = new Date(
        currentSeason.gregorianYear,
        currentSeason.gregorianMonth,
        currentSeason.gregorianDayOfMonth,
        0,
        0,
        0,
        0
      );
      setDate(moment(date).format("dddd, MMMM Do YYYY"));
    } catch (error) {}
  }
  function SetCopticDateTime() {
    setCopticDate(
      Languages[appLang][currentSeason.copticMonth] +
        " " +
        currentSeason.copticDay +
        ", " +
        currentSeason.copticYear
    );
  }
  function setLive() {
    const curSeason = setCurrentSeasonLive(timeTransition);
    dispatch(setSeason({ currentSeason: curSeason }));
    setImageURL(
      curSeason.key === "STANDARD" && curSeason.saintsOfThisDay?.length > 0
        ? curSeason.saintsOfThisDay[0]
        : curSeason.key
    );
  }
  return (
    <Pressable onPress={setLive}>
      <View style={styles.bookView}>
        <Image style={styles.image} source={images[imageURL]} />
        <View style={styles.textView}>
          <Text style={styles.text}>{copticdate}</Text>
          <Text style={styles.text}>{date}</Text>
          <Text style={styles.text}>{seasonText}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    margin: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // semi-transparent background
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
    borderRadius: 100 / 2,
    overflow: "hidden",
    resizeMode: "stretch",
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
