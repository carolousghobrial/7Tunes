import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";

function FirstVisible() {
  return true;
}
const VisibleRules = [
  { rule: "firstVisible", visible: FirstVisible() },
  { rule: 0, visible: true },
];

export default VisibleRules;
