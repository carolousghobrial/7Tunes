import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import images from "../../helpers/imageHelpers";

function BookView({ item, onClick, onLongPress }) {
  const { width, height } = useWindowDimensions();
  const isTablet = useSelector((state) => state.settings.isTablet);
  const fontSize = isTablet ? 30 : 20;
  let imageSize = 300;
  if (width > height) {
    // Landscape mode
    imageSize = 100;
  } else {
    // Portrait mode
    imageSize = 120;
  }

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  const bookviewStyle = {
    width: width / 2.5,
    height: height / 3.5,
    alignItems: "center",
    justifyContent: "center",
  };
  let content = (
    <>
      <TouchableOpacity
        onLongPress={onLongPress.bind(this, item)}
        onPress={onClick.bind(this, item)}
      >
        <View style={[styles.bookView, bookviewStyle]}>
          <View style={[styles.imageContainer, imageStyle]}>
            <Image style={styles.image} source={images[item.ImageURL]} />
          </View>

          <View style={styles.textView}>
            <Text
              style={[styles.text, { fontSize, fontFamily: "english-font" }]}
            >
              {item.EnglishTitle}
            </Text>
            <Text
              style={[styles.text, { fontSize, fontFamily: "arabic-font" }]}
            >
              {item.ArabicTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
  if (width > 500) {
    content = (
      <>
        <TouchableOpacity
          android_ripple={{ color: "#AA4A44" }}
          onLongPress={onLongPress.bind(this, item)}
          onPress={onClick.bind(this, item)}
        >
          <View style={[styles.bookViewLandscape, bookviewStyle]}>
            <View style={[styles.imageContainerLandscape, imageStyle]}>
              <Image style={styles.image} source={images[item.ImageURL]} />
            </View>

            <View style={styles.textViewLanscape}>
              <Text
                style={[styles.text, { fontSize, fontFamily: "english-font" }]}
              >
                {item.EnglishTitle}
              </Text>
              <Text
                style={[styles.text, { fontSize, fontFamily: "arabic-font" }]}
              >
                {item.ArabicTitle}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
  return <View>{content}</View>;
}

export default BookView;

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "column",
    borderColor: "black",
  },
  bookViewLandscape: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    marginVertical: 10,
    margin: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  imageContainerLandscape: {
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  imageContainer: {
    borderColor: "black",
    overflow: "hidden",
    alignItems: "center",
    margin: 5,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  textView: {
    flex: 2,
    borderColor: "black",
    justifyContent: "center",
  },
  textViewLanscape: {
    flex: 2,
    borderColor: "black",
    justifyContent: "flex-start",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});
