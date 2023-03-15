import React, { useState } from "react";
import { FlatList, View, Text, Button } from "react-native";

function Test() {
  const [initialIndex, setInitialIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  var data = [
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
    "Pankaj",
    "Rita",
    "Mohan",
    "Amit",
    "Babulal",
    "Sakshi",
  ];

  const handleButtonClick = () => {
    // Generate a random index between 0 and the length of the data array
    const newIndex = Math.floor(Math.random() * data.length);
    console.log(newIndex);
    setInitialIndex(newIndex);
    setRefresh(true);
  };

  return (
    <View>
      <Button
        title="Reload with new initialScrollIndex"
        onPress={handleButtonClick}
      />
      <FlatList
        data={data}
        extraData={refresh}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ fontSize: 30 }}>{item}</Text>}
        initialScrollIndex={initialIndex}
      />
    </View>
  );
}

export default Test;
