import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native";
import images from "../../helpers/imageHelpers";

import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";

function FeastView({ item, onClick }) {
  let imageSize = 75;
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.bookViewLandscape]}
        android_ripple={{ color: "red" }}
        onPress={onClick.bind(this, item)}
      >
        <View style={[styles.imageContainerLandscape, imageStyle]}>
          <Image style={styles.image} source={images[item.key]} />
        </View>

        <View style={styles.textViewLanscape}>
          <Text style={styles.text}>{getLanguageValue(item.key)}</Text>
          <Text style={styles.text}>
            {item.start.format("MMM Do YYYY")}
            {item.end !== null ? "-" : null}
            {item.end !== null ? item.end.format("MMM Do YYYY") : null}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 5,
    margin: 5,
    padding: 5,
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
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  bookViewLandscape: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  textViewLanscape: {
    flex: 2,
    borderColor: "black",
    justifyContent: "flex-start",
  },
});

export default FeastView;
