import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  Image,
  Switch,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PropTypes from "prop-types";

import images from "../../helpers/imageHelpers.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";
import { changeSaint } from "../../stores/redux/saints";
import Languages from "../../constants/languages";

function UpdatedSaintsModal() {
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const { saint } = useLocalSearchParams();
  const mySaint = JSON.parse(saint);
  const navigation = useNavigation();
  const router = useRouter();
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const lang = Languages[appLanguage];
  const labelColor = getColor("LabelColor");
  const saints = useSelector((state) => state.saints);
  const [saintSelected, setSaintSelected] = useState(saints[mySaint.titleKey]);
  const saintTitle = getLanguageValue(mySaint.titleKey);
  const imageSize = Math.min(width, height) / 2; // Dynamically calculate image size
  const flexDirection = width > height ? "row" : "column";

  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      title: saintTitle,
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
  }, [navigation, router]);

  // Handle saint selection toggle
  const toggleSaintSelection = useCallback((key, value) => {
    setSaintSelected((prev) => ({ ...prev, [key]: value }));
  }, []);
  console.log(Object.keys(saintSelected));
  // Update saint
  const handleUpdateSaint = useCallback(() => {
    dispatch(changeSaint({ saint: mySaint.titleKey, object: saintSelected }));
    router.back();
  }, [dispatch, mySaint, saintSelected]);

  return (
    <SafeAreaView style={[styles.container, { flexDirection: flexDirection }]}>
      {/* Saint Image and Title */}
      <View style={[styles.imageContainer]}>
        <Image
          source={images[mySaint.titleKey]}
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
        />
        <Text style={[styles.text, { color: "black" }]}>{saintTitle}</Text>
      </View>

      {/* Saint Options */}
      <View style={styles.optionsContainer}>
        <FlatList
          data={Object.keys(saintSelected)}
          keyExtractor={(key) => key}
          renderItem={({ item: key }) => (
            <View style={styles.optionRow}>
              <Text style={[styles.text, { flex: 7 }]}>{lang[key]}</Text>
              <Switch
                style={{ flex: 3 }}
                value={saintSelected[key]}
                onValueChange={(value) => toggleSaintSelection(key, value)}
              />
            </View>
          )}
          contentContainerStyle={styles.optionsContainer}
        />
      </View>

      {/* Save Button */}
      <Pressable
        style={[styles.button, { borderColor: labelColor }]}
        onPress={handleUpdateSaint}
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
    resizeMode: "stretch",
  },
  text: {
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  optionsContainer: {
    flex: 1,
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
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

UpdatedSaintsModal.propTypes = {
  saint: PropTypes.object,
};

export default UpdatedSaintsModal;
