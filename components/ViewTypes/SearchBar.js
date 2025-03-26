import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { getColor } from "../../helpers/SettingsHelpers";

const SearchBar = ({ handleSearch, searchPhrase, setSearchPhrase }) => {
  const labelColor = getColor("LabelColor");
  const backgroundColor = getColor("NavigationBarColor");

  const clearSearch = () => {
    setSearchPhrase("");
    handleSearch("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { backgroundColor }]}>
        <Feather
          name="search"
          size={20}
          color={labelColor}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: labelColor }]}
          placeholder="Search..."
          placeholderTextColor={labelColor}
          value={searchPhrase}
          onChangeText={(text) => {
            setSearchPhrase(text);
            handleSearch(text);
          }}
          returnKeyType="search"
        />
        {searchPhrase.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Entypo
              name="cross"
              size={20}
              color={labelColor}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    opacity: 0.9,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
  },
  icon: {
    padding: 5,
  },
});

export default SearchBar;
