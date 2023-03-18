import React, { useState } from "react";
import { FlatList, View, Text, Button, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";

function Test() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleCollapsed}>
        <Text>{collapsed ? "Show" : "Hide"}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <Text>This is some collapsible content!</Text>
      </Collapsible>
    </View>
  );
}

export default Test;
