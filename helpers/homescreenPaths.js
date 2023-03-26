const homescreenPaths = {
  myHome: require("../assets/json/menuJson/mainMenu.json"),
  psalmody: require("../assets/json/menuJson/psalmody/psalmody.json"),
  liturgy: require("../assets/json/menuJson/liturgy/liturgy.json"),
  pascha: require("../assets/json/menuJson/pascha/pascha.json"),
  veneration: require("../assets/images/mary.jpg"),
  index: require("../assets/images/indexpic.png"),
  vp: require("../assets/json/menuJson/psalmody/vesperspraises.json"),
  mp: require("../assets/json/menuJson/psalmody/midnightpraises.json"),
  paschaSunday: require("../assets/json/menuJson/pascha/sunday.json"),
  paschamondayeve: require("../assets/json/menuJson/pascha/mondayeve.json"),
  paschamonday: require("../assets/json/menuJson/pascha/monday.json"),
  paschatuesdayeve: require("../assets/json/menuJson/pascha/tuesdayeve.json"),
  paschatuesday: require("../assets/json/menuJson/pascha/tuesday.json"),
  paschawednesdayeve: require("../assets/json/menuJson/pascha/wednesdayeve.json"),
  paschawednesday: require("../assets/json/menuJson/pascha/wednesday.json"),
  paschathursdayeve: require("../assets/json/menuJson/pascha/thursdayeve.json"),
  paschathursday: require("../assets/json/menuJson/pascha/thursday.json"),
  paschafridayeve: require("../assets/json/menuJson/pascha/fridayeve.json"),
  paschafriday: require("../assets/json/menuJson/pascha/friday.json"),
  // brightSaturday: require("../assets/json/menuJson/pascha/saturday.json"),
  //Table Of Contents
  morningDoxology: require("../assets/json/books/booksTable/Praises/MorningDoxology/morningDoxology"),
  standardPsalmody: require("../assets/json/books/booksTable/Praises/MidnightPraises/standardPsalmody.json"),
  kiahkPsalmody: require("../assets/json/books/booksTable/Praises/MidnightPraises/kiahkPsalmody.json"),
  lentenPsalmody: require("../assets/json/books/booksTable/Praises/MidnightPraises/lentenPsalmody.json"),
  standardVespersPraises: require("../assets/json/books/booksTable/Praises/VespersPraises//standardVespersPraises.json"),
  kiahkVespersPraises: require("../assets/json/books/booksTable/Praises/VespersPraises/kiahkVespersPraises.json"),
  lentenVespersPraises: require("../assets/json/books/booksTable/Praises/VespersPraises/lentenVespersPraises.json"),
  //Theotokias
  sundayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/sundayTheotokiaMenu.json"),
  mondayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/mondayTheotokiaMenu.json"),
  tuesdayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/tuesdayTheotokiaMenu.json"),
  wednesdayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/wednesdayTheotokiaMenu.json"),
  thursdayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/thursdayTheotokiaMenu.json"),
  fridayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/fridayTheotokiaMenu.json"),
  saturdayTheotokiaMenu: require("../assets/json/books/booksTable/Praises/MidnightPraises/Theotokias/saturdayTheotokiaMenu.json"),
  //veneration
  venerations: require("../assets/json/books/booksTable/Venerations/venerations.json"),
  //Doxologies
  doxologies: require("../assets/json/books/booksTable/Praises/MidnightPraises/doxologies.json"),
  //Liturgies
  //RaisingOfIncense
  vespers: require("../assets/json/books/booksTable/Liturgies/RaisingOfIncense/vespers.json"),
  matins: require("../assets/json/books/booksTable/Liturgies/RaisingOfIncense/matins.json"),
  palmSundayProcession: require("../assets/json/books/booksContent/RaisingOfIncense/PalmSundayProcession.json"),
  //Pascha
  //Sunday
  //GeneralFuneral
  generalFuneral: require("../assets/json/books/booksTable/Pascha/Sunday/GeneralFuneral/generalFuneral.json"),
  generalFuneralcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/GeneralFuneral/copticPsalmAndGospel.json"),
  generalFuneralPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/GeneralFuneral/PsalmAndGospel.json"),
  generalFuneralcopticPaulineEpistle: require("../assets/json/books/booksTable/Pascha/Sunday/GeneralFuneral/copticPaulineEpistle.json"),
  generalFuneralPaulineEpistle: require("../assets/json/books/booksTable/Pascha/Sunday/GeneralFuneral/PaulineEpistle.json"),
  //SundayDay
  //NinthHour
  sundayDayNinthHourMain: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/NinthHour/mainPrayer.json"),
  sundayDayNinthHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/NinthHour/copticPsalmAndGospel.json"),
  sundayDayNinthHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/NinthHour/PsalmAndGospel.json"),
  sundayDayNinthHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/NinthHour/copticProphecies.json"),
  sundayDayNinthHourProphecies: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/NinthHour/Prophecies.json"),
  //Eleventh
  sundayDayEleventhHourMain: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/EleventhHour/mainPrayer.json"),
  sundayDayEleventhHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/EleventhHour/copticPsalmAndGospel.json"),
  sundayDayEleventhHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/EleventhHour/PsalmAndGospel.json"),
  sundayDayEleventhHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/EleventhHour/copticProphecies.json"),
  sundayDayEleventhHourProphecies: require("../assets/json/books/booksTable/Pascha/Sunday/SundayDay/EleventhHour/Prophecies.json"),
  //MondayDay
  //FirstHour
  MondayDayFirstHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/FirstHour/mainPrayer.json"),
  MondayDayFirstHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/FirstHour/copticPsalmAndGospel.json"),
  MondayDayFirstHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/FirstHour/PsalmAndGospel.json"),
  MondayDayFirstHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/FirstHour/copticProphecies.json"),
  MondayDayFirstHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/FirstHour/Prophecies.json"),
  //ThirdHour
  MondayDayThirdHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/ThirdHour/mainPrayer.json"),
  MondayDayThirdHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/ThirdHour/copticPsalmAndGospel.json"),
  MondayDayThirdHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/ThirdHour/PsalmAndGospel.json"),
  MondayDayThirdHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/ThirdHour/copticProphecies.json"),
  MondayDayThirdHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/ThirdHour/Prophecies.json"),
  //Sixth
  MondayDaySixthHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/SixthHour/mainPrayer.json"),
  MondayDaySixthHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/SixthHour/copticPsalmAndGospel.json"),
  MondayDaySixthHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/SixthHour/PsalmAndGospel.json"),
  MondayDaySixthHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/SixthHour/copticProphecies.json"),
  MondayDaySixthHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/SixthHour/Prophecies.json"),
  //NinthHour
  MondayDayNinthHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/NinthHour/mainPrayer.json"),
  MondayDayNinthHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/NinthHour/copticPsalmAndGospel.json"),
  MondayDayNinthHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/NinthHour/PsalmAndGospel.json"),
  MondayDayNinthHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/NinthHour/copticProphecies.json"),
  MondayDayNinthHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/NinthHour/Prophecies.json"),
  //Eleventh
  MondayDayEleventhHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/EleventhHour/mainPrayer.json"),
  MondayDayEleventhHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/EleventhHour/copticPsalmAndGospel.json"),
  MondayDayEleventhHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/EleventhHour/PsalmAndGospel.json"),
  MondayDayEleventhHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/EleventhHour/copticProphecies.json"),
  MondayDayEleventhHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayDay/EleventhHour/Prophecies.json"),
  //MondayEve
  //FirstHour
  MondayEveFirstHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/FirstHour/mainPrayer.json"),
  MondayEveFirstHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/FirstHour/copticPsalmAndGospel.json"),
  MondayEveFirstHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/FirstHour/PsalmAndGospel.json"),
  MondayEveFirstHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/FirstHour/copticProphecies.json"),
  MondayEveFirstHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/FirstHour/Prophecies.json"),
  //ThirdHour
  MondayEveThirdHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/ThirdHour/mainPrayer.json"),
  MondayEveThirdHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/ThirdHour/copticPsalmAndGospel.json"),
  MondayEveThirdHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/ThirdHour/PsalmAndGospel.json"),
  MondayEveThirdHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/ThirdHour/copticProphecies.json"),
  MondayEveThirdHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/ThirdHour/Prophecies.json"),
  //Sixth
  MondayEveSixthHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/SixthHour/mainPrayer.json"),
  MondayEveSixthHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/SixthHour/copticPsalmAndGospel.json"),
  MondayEveSixthHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/SixthHour/PsalmAndGospel.json"),
  MondayEveSixthHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/SixthHour/copticProphecies.json"),
  MondayEveSixthHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/SixthHour/Prophecies.json"),
  //NinthHour
  MondayEveNinthHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/NinthHour/mainPrayer.json"),
  MondayEveNinthHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/NinthHour/copticPsalmAndGospel.json"),
  MondayEveNinthHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/NinthHour/PsalmAndGospel.json"),
  MondayEveNinthHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/NinthHour/copticProphecies.json"),
  MondayEveNinthHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/NinthHour/Prophecies.json"),
  //Eleventh
  MondayEveEleventhHourMain: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/EleventhHour/mainPrayer.json"),
  MondayEveEleventhHourcopticPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/EleventhHour/copticPsalmAndGospel.json"),
  MondayEveEleventhHourPsalmAndGospel: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/EleventhHour/PsalmAndGospel.json"),
  MondayEveEleventhHourcopticProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/EleventhHour/copticProphecies.json"),
  MondayEveEleventhHourProphecies: require("../assets/json/books/booksTable/Pascha/Monday/MondayEve/EleventhHour/Prophecies.json"),
};

export default homescreenPaths;
