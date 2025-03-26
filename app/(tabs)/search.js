import React, { useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import SearchBar from "../../components/ViewTypes/SearchBar";
import bookPaths from "../../helpers/bookPathsHelpers";
import { getLanguageValue } from "../../helpers/SettingsHelpers";

const copticMap = {
  Ⲫ: "V",
  ⲫ: "v",
  Ⲥ: "C",
  "̀": "`",
  ⲛ: "n",
  Ϩ: "|",
  Ϫ: "J",
  Ⲧ: "T",
  ⲟ: "o",
  ⲩ: "u",
  ϯ: ";",
  " ": " ",
  ⲡ: "p",
  ⲓ: "i",
  ϣ: "]",
  ⲁ: "a",
  ⲉ: "e",
  ϩ: "\\",
  ":": ">",
  ⲏ: "h",
  ⲧ: "t",
  ϥ: "f",
  ⲕ: "k",
  ⲱ: "w",
  Ⲁ: "A",
  ⲙ: "m",
  ⲣ: "r",
  ϫ: "j",
  ".": ".",
  Ⲟ: "O",
  ϧ: "=",
  ⲥ: "c",
  ⲑ: "q",
  Ⲡ: "P",
  ⲇ: "d",
  ⲃ: "b",
  ⲗ: "l",
  ⲅ: "g",
  Ϣ: "}",
  ϭ: "s",
  Ⲓ: "I",
  ⲭ: "x",
  Ⲑ: "q",
  D: "D",
  ⲝ: "[",
  C: "c",
  Ⲕ: "K",
  Ϧ: "+",
  ⲍ: "z",
  Ⲉ: "E",
  Ⲛ: "N",
  ⲯ: "y",
  Ϯ: ":",
  Ⲙ: "M",
  Ⲇ: "D",
  Ⲃ: "B",
  Ⲅ: "G",
  Ⲭ: "X",
  Ⲯ: "Y",
  Ϥ: "F",
  Ⲩ: "U",
  Ⲗ: "L",
  "+": "",
  ⲋ: "6",
  Ⲏ: "H",
  Ⲝ: "{",
  Ⲣ: "R",
  Ⲱ: "W",
  Ϭ: "S",
};

function BigSearchScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const router = useRouter();

  const languageOptions = [
    { label: getLanguageValue("english"), value: "english" },
    { label: getLanguageValue("coptic"), value: "coptic" },
    { label: getLanguageValue("arabic"), value: "arabic" },
    { label: getLanguageValue("copticarabic"), value: "copticarabic" },
    { label: getLanguageValue("copticenglish"), value: "copticenglish" },
  ];

  const highlightText = (text, term, fontFamily) => {
    if (!text) return null;

    const trimmedTerm = term.trim();
    const regex = new RegExp(`(${trimmedTerm})`, "gi");
    const parts = text.split(regex);

    return (
      <Text style={{ fontFamily, fontSize: 18 }}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={{
              backgroundColor:
                part.toLowerCase() === trimmedTerm.toLowerCase()
                  ? "yellow"
                  : "transparent",
              fontFamily,
            }}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  const getLanguageSettings = (language) => {
    const settings = {
      english: { key: "English", font: "english-font" },
      coptic: { key: "Coptic", font: "coptic-font" },
      arabic: { key: "Arabic", font: "arabic-font" },
      copticarabic: { key: "Arabiccoptic", font: "coptic-font" },
      copticenglish: { key: "Englishcoptic", font: "english-font" },
    };
    return settings[language] || {};
  };

  const openPage = (item) => {
    router.push({
      pathname: "/bookscreen/ViewSingleHymnSearch",
      params: {
        path: item.key,
        searchPhrase,
        partClicked: item.part.English,
        englishTitle: item.englishTitle,
        arabicTitle: item.arabicTitle,
      },
    });
  };

  const renderItem = useCallback(
    ({ item }) => {
      const { key, font } = getLanguageSettings(selectedLanguage);
      if (!key || !font) return null;

      const highlightedContent = highlightText(
        item.part[key],
        searchPhrase,
        font
      );
      const title =
        item[selectedLanguage.toLowerCase() + "Title"] || item["englishTitle"];
      const bookey = item["key"];

      return (
        <Pressable onPress={() => openPage(item)} style={styles.resultItem}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {<Text style={styles.subtitle}>{bookey}</Text>}
          </View>
          {highlightedContent}
        </Pressable>
      );
    },
    [searchPhrase, selectedLanguage]
  );

  const handleSearch = useCallback(
    (text) => {
      if (selectedLanguage === "coptic") {
        text = text
          .split("") // Split the text into individual characters
          .map((char) => copticMap[char] || char) // Convert or keep original
          .join(""); // Join back into a string
      }

      setSearchPhrase(text);
      if (text.trim() === "") {
        setCurrentData([]);
        return;
      }

      const results = [];
      let listKeyCounter = 0;
      const searchLower = text.toLowerCase().trim();

      Object.keys(bookPaths).forEach((bookKey) => {
        bookPaths[bookKey].Hymn.forEach((item) => {
          const checkProperty = (property) => {
            if (
              item[property] &&
              item[property].toLowerCase().includes(searchLower)
            ) {
              listKeyCounter++;
              results.push({
                key: bookKey,
                part: item,
                englishTitle: bookPaths[bookKey].EnglishTitle,
                arabicTitle: bookPaths[bookKey].ArabicTitle,
                listKey: listKeyCounter,
              });
            }
          };

          switch (selectedLanguage) {
            case "english":
              checkProperty("English");
              break;
            case "coptic":
              checkProperty("Coptic");
              break;
            case "arabic":
              checkProperty("Arabic");
              break;
            case "copticarabic":
              checkProperty("Arabiccoptic");
              break;
            case "copticenglish":
              checkProperty("Englishcoptic");
              break;
            default:
              break;
          }
        });
      });

      setCurrentData(results);
    },
    [selectedLanguage]
  );

  return (
    <View style={styles.container}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        handleSearch={handleSearch}
      />
      <DropDownPicker
        open={dropdownOpen}
        value={selectedLanguage}
        items={languageOptions}
        setOpen={setDropdownOpen}
        setValue={setSelectedLanguage}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
      />
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.listKey.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f4f4f4", // Lighter background color for a more subtle look
  },
  subtitle: {
    fontSize: 14,
    color: "#666", // Lighter color for subtitle to distinguish from the main title
    marginTop: 5,
    fontFamily: "english-font", // Change this to the appropriate font for subtitles
  },
  resultItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: 10,
  },
  titleContainer: {
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007bff", // Optional: Add color for better separation
    paddingBottom: 5,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 24,
    color: "#333",
  },
  dropdownContainer: {
    marginVertical: 15,
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
  },
  flatListContainer: {
    paddingBottom: 25,
  },
  resultItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: 10,
  },
  titleContainer: {
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007bff", // Adding color to the border
    paddingBottom: 5,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 24,
    color: "#333",
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  highlightedText: {
    backgroundColor: "yellow", // Consistent highlight color
  },
});

export default BigSearchScreen;
