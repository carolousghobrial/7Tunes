import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import images from "../helpers/imageHelpers";
import Languages from "../constants/languages";
import { useDispatch, useSelector } from "react-redux";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
const saintsFeastsCalendar = require("../assets/json/saintsFeastsCalendar.json");

const newData = Object.keys(saintsFeastsCalendar).map((saint) => ({
  key: saint,
  img: images[saint],
}));

const VenerationSelectionScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState(["ST_MARY"]);
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (viewportWidth / 2));
    setActiveIndex(index);
  };

  const handleSelect = (key) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(key)
        ? key !== "ST_MARY"
          ? prevItems.filter((item) => item !== key)
          : prevItems
        : [...prevItems, key]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Veneration Saints</Text>
        <FlatList
          style={styles.selectedItemsList}
          data={selectedItems}
          renderItem={({ item }) => (
            <Text style={styles.selectedItemText}>
              {Languages[appLanguage][item]}
            </Text>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
        >
          {newData.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleSelect(item.key)}
              style={[
                styles.slide,
                selectedItems.includes(item.key) && styles.selectedSlide,
              ]}
            >
              <Image source={item.img} style={styles.image} />
              <Text style={styles.title}>
                {Languages[appLanguage][item.key]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        {newData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === Math.floor(activeIndex / 2) ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F5F5F5", // Light background color
  },
  header: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Darker text color
    marginBottom: 10,
  },
  selectedItemsList: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF", // Accent color
  },
  carouselContainer: {
    width: viewportWidth,
    height: viewportHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  slide: {
    height: "80%",
    width: viewportWidth / 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "#FFF",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedSlide: {
    backgroundColor: "#E6F7FF", // Light blue background for selected slide
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  image: {
    resizeMode: "contain",
    width: "80%",
    height: "50%",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#333", // Darker text color
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF", // Accent color
    marginHorizontal: 4,
  },
});

export default VenerationSelectionScreen;
