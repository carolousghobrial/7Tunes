import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";

const slides = [
  {
    id: 1,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 2,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 3,
    title: "Slide 3",
    content: "This is the third slide",
  },
  {
    id: 13,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 22,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 33,
    title: "Slide 3",
    content: "This is the third slide",
  },
  {
    id: 14,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 25,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 36,
    title: "Slide 3",
    content: "This is the third slide",
  },
  {
    id: 17,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 28,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 39,
    title: "Slide 3",
    content: "This is the third slide",
  },
  {
    id: 19,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 29,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 38,
    title: "Slide 3",
    content: "This is the third slide",
  },
  {
    id: 43,
    title: "Slide 1",
    content: "This is the first slide",
  },
  {
    id: 51,
    title: "Slide 2",
    content: "This is the second slide",
  },
  {
    id: 62,
    title: "Slide 3",
    content: "This is the third slide",
  },
];

const Test = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 30);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    flatListRef.current.scrollToIndex({
      index: currentIndex,
      animated: true,
    });
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={{ width: "100%", height: "100%" }}>
      <Text>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderItem}
      pagingEnabled
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default Test;
