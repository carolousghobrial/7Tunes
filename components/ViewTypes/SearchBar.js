import React, { useCallback } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const SearchBar = ({
  setClicked,
  clicked,
  handleSearch,
  searchPhrase,
  setSearchPhrase,
}) => {
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
      <View style={[styles.searchBar, clicked && styles.searchBarClicked]}>
        <Feather name="search" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="black"
          value={searchPhrase}
          onChangeText={handleSearch}
          onFocus={tempSetClick}
        />
        {clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={styles.icon}
            onPress={clearSearch}
          />
        )}
      </View>
      {clicked && <Button title="Cancel" onPress={cancelSearch} />}
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
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
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
    color: "black",
  },
});

export default SearchBar;
