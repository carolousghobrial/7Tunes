import { createContext, useState } from "react";

export const SettingsContext = createContext({
  appLanguage: "",
  changeLanguage: (lang) => {},
  appTheme: "",
  changeAppTheme: (theme) => {},
  textFontSize: 0,
  changeFontSize: (direction) => {},
  todayPrayer: true,
  changeTodayPrayer: () => {},
});

function SettingsContextProvider({ children }) {
  const minFont = 10;
  const maxFont = 40;
  const [fontSize, setFontSize] = useState(20);
  const [isTodayPrayer, setisTodayPrayer] = useState(true);
  const [appLanguage, setappLanguage] = useState("eng");
  const [appTheme, setappTheme] = useState("eng");

  function changeFontSize(direction) {
    if (direction === "plus") {
      if (fontSize < maxFont) {
        setFontSize(fontSize + 2);
      }
    } else {
      if (fontSize > minFont) {
        setFontSize(fontSize - 2);
      }
    }
    //setFavoriteMealIds((currentFavIds) => [...currentFavIds, id]);
  }
  function changeTodayPrayer() {
    setisTodayPrayer(!isTodayPrayer);
  }
  function changeLanguage(lang) {
    setappLanguage(lang);
  }
  function changeAppTheme(theme) {
    setappTheme(theme);
  }
  //   function removeFavoirte(id) {
  //     setFavoriteMealIds((currentFavIds) =>
  //       currentFavIds.filter((mealId) => mealId !== id)
  //     );
  //   }
  const value = {
    appLanguage: appLanguage,
    changeLanguage: changeLanguage,
    appTheme: appTheme,
    changeAppTheme: changeAppTheme,
    textFontSize: fontSize,
    changeFontSize: changeFontSize,
    todayPrayer: isTodayPrayer,
    changeTodayPrayer: changeTodayPrayer,
  };
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
export default SettingsContextProvider;
