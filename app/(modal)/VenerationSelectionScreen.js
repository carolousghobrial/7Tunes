import React, { useState, memo } from "react";
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
import images from "../../helpers/imageHelpers";
import Languages from "../../constants/languages";
import { useSelector } from "react-redux";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
const saintsFeastsCalendar = require("../../assets/json/saintsFeastsCalendar.json");

const newData = Object.keys(saintsFeastsCalendar).map((saint) => ({
  key: saint,
  img: images[saint],
}));

const VenerationSelectionScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState(["ST_MARY"]);
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (viewportWidth / 2)
    );
    setActiveIndex(index);
  };

  const handleSelect = (key) => {
    if (selectedItems.length < 3) {
      setSelectedItems((prevItems) =>
        prevItems.includes(key)
          ? key !== "ST_MARY"
            ? prevItems.filter((item) => item !== key)
            : prevItems
          : [...prevItems, key]
      );
    }
  };

  const renderSelectedItem = ({ item }) => (
    <Text style={styles.selectedItemText}>{Languages[appLanguage][item]}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Veneration Saints</Text>
        <FlatList
          style={styles.selectedItemsList}
          data={selectedItems}
          renderItem={renderSelectedItem}
          showsHorizontalScrollIndicator={true}
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
              accessible
              accessibilityLabel={`Select ${Languages[appLanguage][item.key]}`}
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
    paddingVertical: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  selectedItemsList: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  carouselContainer: {
    height: viewportHeight * 0.35, // Reduce the height for a closer fit
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Add margin to lift it slightly
  },
  scrollViewContent: {
    alignItems: "center",
  },
  slide: {
    height: "80%",
    width: viewportWidth / 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedSlide: {
    backgroundColor: "#E6F7FF",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  image: {
    width: "80%",
    height: "50%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    position: "relative", // Change from absolute to relative
    marginTop: 10, // Space from the bottom of the carousel
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginHorizontal: 4,
  },
});

export default memo(VenerationSelectionScreen);
