import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import homescreenPaths from "../../helpers/homescreenPaths";

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
  console.log(homescreenPaths["sundayDayEleventhHourcopticProphecies"]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Text>HI</Text>
    </View>
  );
};

export default Test;
