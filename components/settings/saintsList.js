import {
  View,
  Switch,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import {
  changeTextLanguage,
  changeSaint,
} from "../../stores/redux/settings.js";
import SaintModal from "./saintModal";
import images from "../../helpers/imageHelpers";

function SaintsList() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const [selectedSaint, setSelectedSaint] = useState("");
  const [saintModalVisible, setsaintModalVisible] = useState(false);
  const dispatch = useDispatch();
  const tempLang = [
    {
      titleKey: "ARCHANGEL_MICHAEL",
    },
    {
      titleKey: "ARCHANGEL_GABRIEL",
    },
    {
      titleKey: "JOHN_THE_BAPTIST",
    },
    {
      titleKey: "ST_MARK",
    },
    {
      titleKey: "ST_STEPHEN",
    },
    {
      titleKey: "ST_GEORGE",
    },
    {
      titleKey: "ST_PHILOPATER",
    },
    {
      titleKey: "ST_MINA",
    },
    {
      titleKey: "ST_ABANOUB",
    },
    {
      titleKey: "ST_DEMIANA",
    },
    {
      titleKey: "ST_MARINA",
    },
    {
      titleKey: "ST_ANTHONY",
    },
    {
      titleKey: "ST_PAULHERMIT",
    },
    {
      titleKey: "ST_MOSES",
    },
    {
      titleKey: "ST_PISHOI",
    },
    {
      titleKey: "ST_JOHN_THE_SHORT",
    },
    {
      titleKey: "ST_KARAS",
    },
    {
      titleKey: "ST_KIROLLOS_SIXTH",
    },
  ];
  let imageSize = 50;

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  function onSwitch(item, e) {
    dispatch(
      changeTextLanguage({ lang: item.titleKey, value: !item.titleKey })
    );
    const updatedArray = langArray.map((val, i) => {
      if (val.titleKey === item.titleKey) {
        item.isEnabled = e;
        return item;
      }
      return val;
    });
    setLangArray(updatedArray); // set the state to the updated copy
  }
  function openModal(item) {
    try {
      setSelectedSaint(item);
      setsaintModalVisible(true);
    } catch (e) {
      Alert.alert(e);
    }
  }
  function closeModal() {
    setsaintModalVisible(false);
  }
  function updateSaint(saint, saintObject) {
    dispatch(changeSaint({ saint: saint, object: saintObject }));
    setsaintModalVisible(false);
  }
  return (
    <>
      <SaintModal
        visible={saintModalVisible}
        closeModal={closeModal}
        updateSaint={updateSaint}
        saint={selectedSaint}
      ></SaintModal>
      <View
        style={[styles.container, { borderColor: getColor("PrimaryColor") }]}
      >
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("saintsMenu")}
          </Text>
        </View>
        {tempLang.map((lang) => {
          return (
            <Pressable
              key={lang.titleKey}
              onPress={openModal.bind(this, lang.titleKey)}
            >
              <View
                style={[
                  styles.secondContainer,
                  {
                    borderColor: getColor("PrimaryColor"),
                  },
                ]}
              >
                <View style={[styles.imageContainerLandscape, imageStyle]}>
                  <Image style={styles.image} source={images[lang.titleKey]} />
                </View>
                <View style={styles.textview}>
                  <Text
                    style={[styles.text, { color: getColor("PrimaryColor") }]}
                  >
                    {getLanguageValue(lang.titleKey)}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 5,
  },
  secondContainer: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 5,
  },
  titleView: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "english-font",
  },
  textView: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
});

export default SaintsList;
