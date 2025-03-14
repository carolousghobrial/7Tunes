import { useRouter } from "expo-router";
import { getFullViewModel } from "../viewModel/getFullViewModel";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Button, Alert } from "react-native";

function useButtonRules(
  item,
  motherSource,
  flatListRef,
  viewData,
  router,
  currentSeason,
  timeTransition,
  dioceseBishop,
  BishopIsPresent,
  BishopsPresent,
  are3PlusBishopsPresent,
  saints
) {
  // Helper for updating item counts

  const updateItemCount = () => {
    const oldCount = item.Count;
    const newCount = ++item.Count;
    const replaceCount = (text) =>
      text.replace(`( ${oldCount} )`, `( ${newCount} )`);
    item.English = replaceCount(item.English);
    item.Arabic = replaceCount(item.Arabic);

    if (newCount >= 12) item.Visible = "hide";
  };

  // Navigate to a screen
  const navigateToScreen = (pathname, params = {}, replace = false) =>
    router[replace ? "replace" : "push"]({
      pathname,
      params,
    });

  const openBookScreen = async (replace = false) => {
    try {
      // Fetch the view model values
      Alert.alert("Loading....", "loading...");
      const values = getFullViewModel(
        item.Path,
        item.mother,
        currentSeason,
        timeTransition,
        dioceseBishop,
        BishopIsPresent,
        BishopsPresent,
        are3PlusBishopsPresent,
        saints
      );

      // Prepare the parameters for the navigation
      const additionalParams = {
        motherSource: item.mother,
        englishTitle: item.English,
        arabicTitle: item.Arabic,
        bishopButton: false, // Consider changing this based on actual requirements
        booksContentIn: JSON.stringify(values[0]),
        menuItemsIn: JSON.stringify(values[1]),
      };

      // Perform navigation
      await router.push({
        pathname: "/bookscreen/BookScreen",
        params: { ...additionalParams },
      });
    } catch (error) {
      // Handle any navigation errors
      console.error("Error navigating to book:", error);
      Alert.alert("An error occurred", "Please try again later.");
    } finally {
      // Optional: If you're using a loading spinner, you can stop it here.
      // Example: setIsLoading(false); (Ensure `setIsLoading` is defined somewhere)
    }
  };

  // Open a single hymn view
  const openViewSingleHymn = () =>
    navigateToScreen("/bookscreen/ViewSingleHymn", {
      path: item.Path,
      motherSource,
      rule: item.Rule,
      englishTitle: item.English,
      arabicTitle: item.Arabic,
    });

  // Scroll up button rule
  const ThokTeTiGomScrollUpButtonRule = () => {
    const index = viewData.findIndex(
      (part) => part.EnglishTitle === "Pascha Praise"
    );
    updateItemCount();
    flatListRef.current.scrollToIndex({ index: index + 3, animated: false });
  };
  // Scroll up button rule
  const SkipShortLitanies = () => {
    const index = viewData.findIndex(
      (part) => part.path === "RaisingOfIncenseAbsolution"
    );
    flatListRef.current.scrollToIndex({ index: index - 7, animated: false });
  };
  const SkipTasbehaCommemoration = () => {
    const index = viewData.findIndex((part) => part.part.Path === "doxologies");
    flatListRef.current.scrollToIndex({ index: index - 4, animated: false });
  };

  return {
    OpenTheotokiaButtonRule: openBookScreen,
    OpenDoxologiesButtonRule: openBookScreen,
    OpenPalmSundayProcessionButtonRule: openBookScreen,
    OpenPageButtonRule: openBookScreen,
    OpenNewPageButtonRule: () => openBookScreen(true),
    ThokTeTiGomScrollUpButtonRule,
    SkipTasbehaCommemoration: SkipTasbehaCommemoration,
    SkipShortLitanies: SkipShortLitanies,
    OpenSinglePageButtonRule: openViewSingleHymn,
    PopPage: () => router.back(),
  };
}

export default useButtonRules;
