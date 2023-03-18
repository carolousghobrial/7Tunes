import {
  StyleSheet,
  Dimensions,
  Text,
  useWindowDimensions,
  View,
  Button,
  FlatList,
} from "react-native";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";

function HomepageScreen({ navigation, route }) {
  const data = homescreenPaths[route.params.bookPath];
  function bookClick(item) {
    if (item.Enabled) {
      if (item.hasSubBooks) {
        navigation.push("HomepageScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
        });
      } else {
        navigation.push("BookScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
          motherSource: item.BookPath,
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.books}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          return <BookView item={item.item} onClick={bookClick} />;
        }}
        numColumns={2}
        keyExtractor={(item, index) => {
          return item.BookPath;
        }}
      />
    </View>
  );
}

export default HomepageScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
