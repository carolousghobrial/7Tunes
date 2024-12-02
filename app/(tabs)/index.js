import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import BookView from "../../components/homepage/bookView.js";
import homescreenPaths from "../../helpers/homescreenPaths.js";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors";
import * as Updates from "expo-updates";
import { useState, useCallback, useEffect } from "react";
import { setSeason } from "../../stores/redux/settings.js";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import Purchases from "react-native-purchases";
import { setItemPurchased } from "../../stores/redux/settings";

function App() {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const activeColors = darkMode === false ? Colors["light"] : Colors["dark"];
  const {
    bookPath = "myHome",
    breadcrumb = JSON.stringify([{ name: "Home", path: "myHome" }]),
  } = useLocalSearchParams();
  const router = useRouter();
  const isStandardBought = useSelector(
    (state) => state.settings.standardPsalmodyPermission
  );
  const isKiahkBought = useSelector(
    (state) => state.settings.kiahkPsalmodyPermission
  );
  const isPaschaBought = useSelector(
    (state) => state.settings.paschaBookPermission
  );
  const isLiturgyBought = useSelector(
    (state) => state.settings.holyLiturgyPermission
  );
  // Parse breadcrumb data
  const breadcrumbParts = JSON.parse(breadcrumb);

  // Get books based on the current bookPath
  const books = homescreenPaths[bookPath]?.books || [];

  // Navigate when a book is clicked
  const handleBookClick = async (book) => {
    try {
      let isBought = false;

      // Determine the purchase status based on permission
      const permissionStatusMap = {
        standardPsalmodyPermission: isStandardBought,
        kiahkPsalmodyPermission: isKiahkBought,
        paschaBookPermission: isPaschaBought,
        holyLiturgyPermission: isLiturgyBought,
      };
      isBought = permissionStatusMap[book.PermissionStatus] || false;
      if (!book.Enabled) {
        //setIsLoading(true);

        if (!isBought) {
          try {
            // Restore purchases to check active entitlements
            const restore = await Purchases.restorePurchases();

            const bookPermission =
              restore.entitlements.active[book.PermissionStatus]?.isActive;

            if (!bookPermission) {
              // Fetch available offerings
              const offerings = await Purchases.getOfferings();

              // Get the specific offering for the book
              const offeringToBuy = offerings.current?.availablePackages.find(
                (pkg) => pkg.identifier === book.offering
              );

              if (offeringToBuy) {
                try {
                  // Attempt to purchase the package
                  const { customerInfo } = await Purchases.purchasePackage(
                    offeringToBuy
                  );
                  console.log(customerInfo);

                  // Check if the entitlement is now active
                  const isEntitlementActive =
                    customerInfo.entitlements.active[book.PermissionStatus]
                      ?.isActive;

                  if (isEntitlementActive) {
                    // Update store state if purchase was successful
                    dispatch(
                      setItemPurchased({ permissionId: book.PermissionStatus })
                    );
                  } else {
                    throw new Error("Purchase was not successful.");
                  }
                } catch (purchaseError) {
                  // Handle purchase errors
                  Alert.alert(
                    purchaseError.message ||
                      "An error occurred during the purchase."
                  );
                }
              } else {
                throw new Error("Offering not found for this book.");
              }
            } else {
              // If the entitlement is already active
              dispatch(
                setItemPurchased({ permissionId: book.PermissionStatus })
              );
            }
          } catch (restoreError) {
            // Handle restore errors
            Alert.alert(
              restoreError.message ||
                "An error occurred while restoring purchases."
            );
          }
        }

        // setIsLoading(false);
        //return;
      }

      // Handle navigation for enabled books
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
    } catch (error) {
      console.error("Error handling book click:", error);
      setIsLoading(false);
    }
  };
  const onLongPress = async (item) => {
    try {
      if (item.BishopButton !== undefined) {
        router.push({
          pathname: "/(modal)/BishopPresentView",
          params: {
            modal: true,
          },
        });
      }
    } catch (e) {}
  };
  // Breadcrumb navigation logic
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
  function setLive() {
    dispatch(
      setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
    );
  }
  const onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert("New Update!", updateString, [
          {
            text: "Restart the App",
            onPress: () => onUpdates(),
          },
        ]);
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      // alert(`Error fetching latest Expo update: ${error}`);
    }
  };

  const onUpdates = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };
  useEffect(() => {
    setLive();
    onFetchUpdateAsync();
  }, [navigation]);
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
                  index === breadcrumbParts.length - 1 && {
                    color: activeColors.PrimaryColor,
                  },
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
          data={books}
          renderItem={({ item }) => (
            <BookView
              item={item}
              onClick={() => handleBookClick(item)}
              onLongPress={() => onLongPress(item)}
            />
          )}
          numColumns={2}
          keyExtractor={(item) => item.BookPath}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

export default App;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  breadcrumbContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: "#f7f7f7", // Light background for breadcrumbs
    borderRadius: 10, // Rounded corners
    marginHorizontal: 10, // Space from screen edges
    marginVertical: 5, // Space from other elements
    borderWidth: 1, // Add a border for clarity
    borderColor: "#ddd", // Light gray border color
    shadowColor: "#000", // Shadow for a slight lift effect
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  breadcrumbButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4, // Space between items
    borderRadius: 5, // Rounded edges for buttons
    alignItems: "center",
    justifyContent: "center",
  },
  breadcrumbText: {
    fontSize: 16,
  },

  currentBreadcrumbText: {
    fontWeight: "bold",
    color: "#004ba0", // Darker blue for current breadcrumb
  },
  separator: {
    color: "#888", // Lighter color for separator
    fontSize: 16,
  },
});
