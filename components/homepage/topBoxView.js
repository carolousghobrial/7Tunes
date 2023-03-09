import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import React, { useState, useEffect } from "react";

function TopBoxView() {
  const [seasonText, setseasonText] = useState("");
  const mySeason = getCurrentSeason()[0];
  useEffect(() => {
    // Update the document title using the browser API
    SetCurrentSeason();
  });
  function SetCurrentSeason() {
    switch (mySeason.key) {
      case "GREAT_LENT":
        let tempText = "";
        const currentDate = moment();

        const startWeek = moment(mySeason.start).startOf("week");
        const endWeek = moment(mySeason.end).startOf("week");

        var weekNum = currentDate.isoWeek() - startWeek.isoWeek();
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
        tempText += weekNum + " Week of the Great Lent";
        setseasonText(tempText);
        break;
    }
  }

  return (
    <View style={styles.bookView}>
      <Image
        style={styles.image}
        source={require("../../assets/images/coptic.png")}
      />
      <View style={styles.textView}>
        <Text style={styles.text}>
          {getCopticDateString(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
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
    flexDirection: "row",
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
