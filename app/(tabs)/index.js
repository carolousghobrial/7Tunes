import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BookView from "../../components/homepage/bookView.js";
import homescreenPaths from "../../helpers/homescreenPaths.js";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors";
import { useState, useEffect, useMemo } from "react";
import { setSeason, setItemPurchased } from "../../stores/redux/settings.js";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import Purchases from "react-native-purchases";

const App = () => {
  const {
    bookPath = "myHome",
    breadcrumb = JSON.stringify([{ name: "Home", path: "myHome" }]),
  } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    darkMode,
    timeTransition,
    standardPsalmodyPermission,
    kiahkPsalmodyPermission,
    paschaBookPermission,
    holyLiturgyPermission,
  } = useSelector((state) => state.settings);

  const [isLoading, setIsLoading] = useState(false);

  const activeColors = useMemo(
    () => (darkMode ? Colors["dark"] : Colors["light"]),
    [darkMode]
  );

  const breadcrumbParts = useMemo(() => JSON.parse(breadcrumb), [breadcrumb]);
  const books = homescreenPaths[bookPath]?.books || [];

  const permissionsMap = {
    standardPsalmodyPermission,
    kiahkPsalmodyPermission,
    paschaBookPermission,
    holyLiturgyPermission,
  };

  const handleBookClick = async (book) => {
    try {
      setIsLoading(true);
      const isBought = permissionsMap[book.PermissionStatus] || false;

      if (!book.Enabled) {
        if (!isBought) {
          await restoreAndPurchase(book);
        } else {
          navigateToBook(book);
        }
      } else {
        navigateToBook(book);
      }
    } catch (error) {
      console.error("Error handling book click:", error);
      setIsLoading(false);
    }
  };

  const restoreAndPurchase = async (book) => {
    try {
      const restore = await Purchases.restorePurchases();
      const isEntitled =
        restore.entitlements.active[book.PermissionStatus]?.isActive;

      if (isEntitled) {
        dispatch(setItemPurchased({ permissionId: book.PermissionStatus }));
        navigateToBook(book);
      } else {
        await purchaseBook(book);
      }
    } catch (error) {
      Alert.alert(
        error.message || "An error occurred while restoring purchases."
      );
      setIsLoading(false);
    }
  };

  const purchaseBook = async (book) => {
    try {
      const offerings = await Purchases.getOfferings();
      const packageToBuy =
        offerings.all[book.PurchaseKey]?.availablePackages[0];

      if (!packageToBuy) throw new Error("No offering available for purchase.");

      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      const isEntitled =
        customerInfo.entitlements.active[book.PermissionStatus]?.isActive;

      if (!isEntitled) throw new Error("Purchase unsuccessful.");

      dispatch(setItemPurchased({ permissionId: book.PermissionStatus }));
      navigateToBook(book);
    } catch (error) {
      Alert.alert(error.message || "An error occurred during purchase.");
      setIsLoading(false);
    }
  };

  const navigateToBook = (book) => {
    const newBreadcrumb = [
      ...breadcrumbParts,
      { name: book.EnglishTitle, path: book.BookPath },
    ];
    router.push({
      pathname: book.hasSubBooks ? "/" : "/bookscreen/BookScreen",
      params: {
        breadcrumb: JSON.stringify(newBreadcrumb),
        bookPath: book.BookPath,
        ...(book.hasSubBooks
          ? {}
          : {
              motherSource: book.mother,
              englishTitle: book.EnglishTitle,
              arabicTitle: book.ArabicTitle,
              bishopButton: book.BishopButton,
            }),
      },
    });
    setIsLoading(false);
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumb = breadcrumbParts.slice(0, index + 1);
    const newBookPath =
      newBreadcrumb[newBreadcrumb.length - 1]?.path || "myHome";

    router.push({
      pathname: "/",
      params: {
        breadcrumb: JSON.stringify(newBreadcrumb),
        bookPath: newBookPath,
      },
    });
  };

  useEffect(() => {
    dispatch(
      setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
    );
  }, [timeTransition]);

  return (
    <ImageBackground
      source={require("../../assets/images/copticBackground.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {/* Breadcrumb Navigation */}
        <View
          style={[
            styles.breadcrumbContainer,
            { backgroundColor: activeColors.NavigationBarColor },
          ]}
        >
          {breadcrumbParts.map((crumb, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleBreadcrumbClick(index)}
              style={[
                styles.breadcrumbButton,
                index === breadcrumbParts.length - 1 &&
                  styles.currentBreadcrumb,
              ]}
            >
              <Text
                style={[
                  styles.breadcrumbText,
                  { color: activeColors.PrimaryColor },
                  index === breadcrumbParts.length - 1 &&
                    styles.currentBreadcrumbText,
                ]}
              >
                {index > 0 && <Text style={styles.separator}> {" > "}</Text>}
                {crumb.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book List */}
        <FlatList
          data={books.filter((item) => item.hide !== true)}
          renderItem={({ item }) => (
            <BookView item={item} onClick={() => handleBookClick(item)} />
          )}
          numColumns={2}
          keyExtractor={(item) => item.BookPath}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

export default App;

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1, padding: 10, alignItems: "center" },
  breadcrumbContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  breadcrumbButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    borderRadius: 5,
    justifyContent: "center",
  },
  breadcrumbText: { fontSize: 16 },
  currentBreadcrumbText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  separator: { color: "#888", fontSize: 16 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
