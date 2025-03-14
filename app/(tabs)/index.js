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
  Image,
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
import { getFullViewModel } from "../../viewModel/getFullViewModel";
import { getColor } from "../../helpers/SettingsHelpers.js";

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
    currentSeason,
    dioceseBishop,
    BishopIsPresent,
    BishopsPresent,
    are3PlusBishopsPresent,
  } = useSelector((state) => state.settings);
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");

  const saints = useSelector((state) => state.saints);
  const [isLoading, setIsLoading] = useState(true);

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
      // Immediately show the loading screen
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
      setIsLoading(false); // Hide the loading screen in case of error
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
      setIsLoading(false); // Hide loading on error
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
      setIsLoading(false); // Hide loading on error
    }
  };
  async function navigateToBook(book) {
    // Show loading screen immediately
    setIsLoading(true);

    // Wait a small moment to allow state change to reflect
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Prepare breadcrumb and parameters
    const newBreadcrumb = [
      ...breadcrumbParts,
      { name: book.EnglishTitle, path: book.BookPath },
    ];

    const commonParams = {
      breadcrumb: JSON.stringify(newBreadcrumb),
      bookPath: book.BookPath,
    };

    let values = [];
    let booksContentString = "";
    let menuItemsString = "";

    if (!book.hasSubBooks) {
      // Get the full view model if needed
      console.log("HERE");
      values = getFullViewModel(
        book.BookPath,
        book.mother,
        currentSeason,
        timeTransition,
        dioceseBishop,
        BishopIsPresent,
        BishopsPresent,
        are3PlusBishopsPresent,
        saints
      );
      console.log("AFTER");

      booksContentString = JSON.stringify(values[0]);
      menuItemsString = JSON.stringify(values[1]);
      console.log("END");
    }
    const additionalParams = book.hasSubBooks
      ? {}
      : {
          motherSource: book.mother,
          englishTitle: book.EnglishTitle,
          arabicTitle: book.ArabicTitle,
          bishopButton: book.BishopButton,
          booksContentIn: booksContentString,
          menuItemsIn: menuItemsString,
        };

    try {
      // Now push to the router after the short delay
      await router.push({
        pathname: book.hasSubBooks ? "/" : "/bookscreen/BookScreen",
        params: {
          ...commonParams,
          ...additionalParams,
        },
      });

      // Once navigation is done, hide loading screen
      setIsLoading(false);
    } catch (error) {
      console.error("Error navigating to book:", error);
      // Hide loading screen in case of error
      setIsLoading(false);
    }
  }

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
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, [timeTransition, dispatch]);

  // Immediately show loading screen when isLoading is true
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pageBackgroundColor,
        }}
      >
        <Image
          style={{
            flex: 8,
            height: "50%",
            borderRadius: 100 / 2,
            overflow: "hidden",
          }}
          source={require("../../assets/images/logofinal.png")}
        />
        <ActivityIndicator
          style={{ flex: 2 }}
          size="large"
          color={labelColor}
        />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/copticBackground.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoImage: {
    flex: 8,
    height: "50%",
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
});

export default App;
