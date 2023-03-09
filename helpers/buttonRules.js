import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";

const hello = () => {
  Alert.alert("HELLO");
};
const ButtonRules = [{ title: "hello", onPress: hello }];

export default ButtonRules;
