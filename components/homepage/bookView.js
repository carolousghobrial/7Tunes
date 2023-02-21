import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import images from "../../helpers/imageHelpers";

function BookView(props) {
  const { width, height } = useWindowDimensions();

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
    height: height / 4,
    alignItems: "center",
    justifyContent: "center",
  };
  let content = (
    <>
      <View style={[styles.bookView, bookviewStyle]}>
        <Pressable
          android_ripple={{ color: "red" }}
          onPress={props.onClick.bind(this, props.item)}
        >
          <View style={[styles.imageContainer, imageStyle]}>
            <Image style={styles.image} source={images[props.item.ImageURL]} />
          </View>

          <View style={styles.textView}>
            <Text style={styles.text}>{props.item.EnglishTitle}</Text>
            <Text style={styles.text}>{props.item.ArabicTitle}</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
  if (width > 500) {
    content = (
      <>
        <View>
          <Pressable
            style={[styles.bookViewLandscape, bookviewStyle]}
            android_ripple={{ color: "red" }}
            onPress={props.onClick.bind(this, props.item)}
          >
            <View style={[styles.imageContainerLandscape, imageStyle]}>
              <Image
                style={styles.image}
                source={images[props.item.ImageURL]}
              />
            </View>

            <View style={styles.textViewLanscape}>
              <Text style={styles.text}>{props.item.EnglishTitle}</Text>
              <Text style={styles.text}>{props.item.ArabicTitle}</Text>
            </View>
          </Pressable>
        </View>
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
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "center",
    margin: 5,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
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
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
