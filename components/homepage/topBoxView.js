import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import images from "../../helpers/imageHelpers";
import Languages from "../../constants/languages";
import { setSeason } from "../../stores/redux/settings.js";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";

function TopBoxView() {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const appLang = useSelector((state) => state.settings.appLanguage);
  const [seasonText, setSeasonText] = useState("");
  const [copticdate, setCopticDate] = useState("");
  const labelColor = getColor("LabelColor");

  const [imageURL, setImageURL] = useState(currentSeason?.key);
  const dispatch = useDispatch();
  function SetCopticDateTime() {
    setCopticDate(
      Languages[appLang][currentSeason?.copticMonth] +
        " " +
        currentSeason?.copticDay +
        ", " +
        currentSeason?.copticYear
    );
  }
  useEffect(() => {
    updateSeasonText();
    SetCopticDateTime();

    setImageURL(
      currentSeason?.key === "STANDARD" &&
        currentSeason.saintsOfThisDay?.length > 0
        ? currentSeason.saintsOfThisDay[0]
        : currentSeason?.key
    );
  }, [currentSeason]);
  let tempText = getLanguageValue(currentSeason?.key);

  function updateSeasonText() {
    if (["GREAT_LENT", "HOLY_50"].includes(currentSeason?.key)) {
      const weekNum = currentSeason.week;
      tempText =
        appLang === "eng"
          ? `${weekNum}${getOrdinalSuffix(weekNum)} week of ${tempText}`
          : `الأسبوع ${weekNum} من ${tempText}`;
    }
    setSeasonText(tempText);
  }

  function getOrdinalSuffix(num) {
    const j = num % 10,
      k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

  function setLive() {
    const curSeason = setCurrentSeasonLive(timeTransition);
    dispatch(setSeason({ currentSeason: curSeason }));
    setImageURL(
      curSeason?.key === "STANDARD" && curSeason.saintsOfThisDay?.length > 0
        ? curSeason.saintsOfThisDay[0]
        : curSeason?.key
    );
  }

  return (
    <Pressable onPress={setLive}>
      <View style={styles.container}>
        <Image style={styles.image} source={images[imageURL]} />
        <Text style={[styles.text, { color: labelColor }]}>{seasonText}</Text>
        <Text style={{ color: labelColor }}> | </Text>
        <Text style={[styles.text, { color: labelColor }]}>{copticdate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    resizeMode: "cover",
  },
  text: {
    fontSize: 10,
    color: "black",
    textAlign: "center",
  },
});

export default TopBoxView;
