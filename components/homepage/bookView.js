import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import images from "../../helpers/imageHelpers";

function BookView({ item, onClick, onLongPress }) {
  const { width, height } = useWindowDimensions();
  const isTablet = useSelector((state) => state.settings.isTablet);

  const isLandscape = width > height;

  const cardWidth = isLandscape ? width / 3 : width / 2.5;
  const cardHeight = isLandscape ? height / 4.5 : height / 3.5;

  const fontSize = isTablet ? 24 : 16;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => onClick(item)}
      // onLongPress={() => onLongPress(item)}
      android_ripple={{ color: "#D3D3D3" }}
    >
      <ImageBackground
        source={images[item.ImageURL]}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.textBox}>
          <Text style={[styles.title, styles.englishTitle, { fontSize }]}>
            {item.EnglishTitle}
          </Text>
          <Text style={[styles.title, styles.arabicTitle, { fontSize }]}>
            {item.ArabicTitle}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default BookView;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    resizeMode: "cover",
  },
  textBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  englishTitle: {
    marginBottom: 5,
  },
  arabicTitle: {
    writingDirection: "rtl",
  },
});
