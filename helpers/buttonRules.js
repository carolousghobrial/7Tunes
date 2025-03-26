import { useRouter } from "expo-router";

function useButtonRules(item, motherSource, flatListRef, viewData, router) {
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

  // Unified book screen opener
  const openBookScreen = (replace = false) =>
    navigateToScreen(
      "/bookscreen/BookScreen",
      {
        bookPath: item.Path,
        englishTitle: item.English,
        arabicTitle: item.Arabic,
        motherSource: item.mother,
        Switch: item.Switch,
      },
      replace
    );

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
