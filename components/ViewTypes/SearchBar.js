import React, { useCallback } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
const SearchBar = ({
  setClicked,
  clicked,
  handleSearch,
  searchPhrase,
  setSearchPhrase,
}) => {
  let labelColor = getColor("LabelColor");
  let backgroundColor = getColor("NavigationBarColor");
  const tempSetClick = useCallback(() => {
    setClicked(true);
  }, [setClicked]);

  const clearSearch = () => {
    handleSearch("");
    Keyboard.dismiss();
  };

  const cancelSearch = () => {
    Keyboard.dismiss();
    setClicked(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBar,
          { backgroundColor: backgroundColor },
          clicked && styles.searchBarClicked,
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={labelColor}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: labelColor }]}
          placeholder="Search"
          placeholderTextColor={labelColor}
          value={searchPhrase}
          onChangeText={handleSearch}
          onFocus={tempSetClick}
        />
        {clicked && (
          <Entypo
            name="cross"
            size={20}
            color={labelColor}
            style={styles.icon}
            onPress={clearSearch}
          />
        )}
      </View>
      {clicked && (
        <Button
          style={{ color: labelColor }}
          title="Cancel"
          onPress={cancelSearch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: "row",
    width: "100%",
  },
  searchBar: {
    padding: 10,
    opacity: 0.8,
    flexDirection: "row",
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBarClicked: {
    width: "80%",
    justifyContent: "space-evenly",
  },
  icon: {
    marginLeft: 1,
    padding: 1,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});

export default SearchBar;
