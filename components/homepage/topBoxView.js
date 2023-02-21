import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { useState } from "react";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
function TopBoxView() {
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
    height: 100,
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
    fontSize: 25,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TopBoxView;
