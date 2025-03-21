import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import images from "../../helpers/imageHelpers";
import { getColor } from "../../helpers/SettingsHelpers";

function TitleView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const router = useRouter();

  const isSwitchGregorian = item.Switch?.toLowerCase().includes("gregory");
  const titleColor = getColor("TitleColor");
  const labelColor = getColor("LabelColor");

  const switchLiturgies = () => {
    if (item.Switch) {
      const bookPath = isSwitchGregorian
        ? "liturgyofStGregory"
        : "liturgyofStBasil";
      router.replace({
        pathname: "/bookscreen/BookScreen",
        params: { bookPath, Switch: item.Switch },
      });
    }
  };

  const renderText = (text, fontFamily) => (
    <Text
      style={[
        styles.text,
        { fontSize: fontSize * 1.13, color: titleColor, fontFamily },
      ]}
    >
      {text}
    </Text>
  );

  return (
    <View style={styles.bookView}>
      <View style={styles.textContainer}>
        {item.English && renderText(item.English, "english-font")}
        {item.Coptic && renderText(item.Coptic, "coptic-font")}
        {item.Arabic && (
          <Text
            style={[
              styles.text,
              styles.arabicText,
              { fontSize: fontSize * 1.13, color: titleColor },
            ]}
          >
            {item.Arabic.replace(/\d+/g, (match) =>
              Number(match).toLocaleString("ar-EG")
            )}
          </Text>
        )}
      </View>

      {item.Switch && (
        <Pressable style={styles.switchButton} onPress={switchLiturgies}>
          <View style={styles.switchView}>
            <Image
              style={styles.image}
              source={
                images[
                  isSwitchGregorian ? "liturgyofStGregory" : "liturgyofStBasil"
                ]
              }
            />
            <View style={styles.swapTextView}>
              <Entypo name="swap" size={24} color={labelColor} />
              <Text style={[styles.switchText, { color: labelColor }]}>
                {isSwitchGregorian ? "St. Gregory" : "St. Basil"}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    margin: 5,
    borderRadius: 20,
    padding: 10,
    elevation: 3,
    flexDirection: "row",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    marginVertical: 5,
  },
  arabicText: {
    fontFamily: "arabictitle-font",
  },
  switchButton: {
    alignItems: "center",
    margin: 5,
  },
  switchView: {
    alignItems: "center",
  },
  swapTextView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  switchText: {
    fontSize: 18,
    fontStyle: "italic",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
});

export default TitleView;
