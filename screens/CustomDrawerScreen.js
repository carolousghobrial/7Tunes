import { StyleSheet, ImageBackground } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import TopBoxView from "../components/homepage/topBoxView";
const CustomDrawerScreen = (props) => {
  return (
    <ImageBackground
      source={require("../assets/images/copticBackground.png")}
      resizeMode="cover"
      style={styles.backgroundimage}
    >
      <DrawerContentScrollView {...props}>
        <TopBoxView></TopBoxView>
        <DrawerItemList {...props}></DrawerItemList>
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

export default CustomDrawerScreen;

const styles = StyleSheet.create({
  backgroundimage: {
    resizeMode: "cover",
    justifyContent: "center",
    flex: 1,
  },
});
