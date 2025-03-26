import React, { useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import moment from "moment";
import PropTypes from "prop-types";
import {
  setCurrentSeasonLive,
  setCurrentSeasonByKey,
} from "../../helpers/copticMonthsHelper";
import {
  getCopticDateString,
  getCopticDate,
} from "../../helpers/copticMonthsHelper.js";
import images from "../../helpers/imageHelpers.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { setSeason } from "../../stores/redux/settings";

function FeastModal() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { feast } = useLocalSearchParams();
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const dispatch = useDispatch();
  const router = useRouter();

  // Parsed feast data
  const myFeast = JSON.parse(feast);
  const { key, start, end } = myFeast;
  console.log(myFeast);
  // Dynamic Styles and Layout
  const isLandscape = width > height;
  const flexDirection = isLandscape ? "row" : "column";
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  const imageSize = Math.min(width, height) / 2; // Dynamically calculate image size

  // Colors and Strings
  const labelColor = getColor("LabelColor");
  const backgroundColor = getColor("NavigationBarColor");
  const title = getLanguageValue(key);
  const fact = getLanguageValue(key + "_FACT");

  // Dates
  const startMoment = moment(start);
  const endMoment = moment(end);

  const copticStartDate = getCopticDate(
    startMoment.year(),
    startMoment.month(),
    startMoment.date()
  );
  const copticStartDateString = getCopticDateString(
    copticStartDate.year,
    copticStartDate.month,
    copticStartDate.day
  );
  const copticEndDate = getCopticDate(
    endMoment.year(),
    endMoment.month(),
    endMoment.date()
  );
  const copticEndDateString = getCopticDateString(
    copticEndDate.year,
    copticEndDate.month,
    copticEndDate.day
  );
  const getFormattedDate = useCallback((date) => {
    if (!date) return "";
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.format("MMM Do YYYY") : "";
  }, []);
  const startMomentString = getFormattedDate(start);
  const endMomentString = end ? ` - ${getFormattedDate(end)}` : "";

  function setFeast(feast) {
    const myCurrentSeason = setCurrentSeasonByKey(timeTransition, feast);
    dispatch(setSeason({ currentSeason: myCurrentSeason }));
    router.back();
  }
  useEffect(() => {
    navigation.setOptions({
      title: title || "Default Title",
      presentation: "modal",
      headerRight: () => (
        <Pressable
          onPressIn={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      ),
    });
  }, [navigation, title, router]);
  return (
    <SafeAreaView
      style={[styles.container, { flexDirection, backgroundColor }]}
    >
      {/* Saint Image and Title */}
      <View style={styles.imageContainer}>
        <Image
          source={images[key]}
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
          resizeMode="contain"
        />
        <Text style={[styles.text, { color: labelColor }]}>{title}</Text>
      </View>

      {/* Date Information */}
      <View style={styles.optionsContainer}>
        <Text style={[styles.text, { color: labelColor }]}>
          {startMomentString} {endMomentString}
        </Text>
        <Text style={[styles.text, { color: labelColor }]}>
          {copticStartDateString} {copticEndDateString}
        </Text>
      </View>

      <ScrollView>
        <Text style={[styles.text, { color: labelColor }]}>{fact}</Text>
      </ScrollView>

      {/* Save Button */}
      <Pressable
        style={[styles.button, { borderColor: labelColor }]}
        onPress={setFeast.bind(this, myFeast)}
      >
        <Text style={styles.buttonText}>Set</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    resizeMode: "contain",
  },
  text: {
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 28,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default FeastModal;
