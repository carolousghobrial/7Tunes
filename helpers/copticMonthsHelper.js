var moment = require("moment");
var today = moment();

attributes = {
  englishCheckbox: true,
  copticCheckbox: true,
  arabicCheckbox: false,
  lightThemeCheckbox: false,
  presentationModeCheckbox: false,
  todayDate: today,
  day: today.date(),
  monthIndex: today.month(),
  year: today.year(),
  time: today.hours(),
  fontScale: 1,
  autoLoad: true,
};

var CopticMonthObjects = [
  {
    name: "Thoout",
    index: 0,
    month: 9,
    day: 11,
    leap: true,
  },
  {
    name: "Paope",
    index: 1,
    month: 10,
    day: 11,
    leap: true,
  },
  {
    name: "Hathor",
    index: 2,
    month: 11,
    day: 10,
    leap: true,
  },
  {
    name: "Koiahk",
    index: 3,
    month: 12,
    day: 10,
    leap: true,
  },
  {
    name: "Tobe",
    index: 4,
    month: 1,
    day: 9,
    leap: true,
  },
  {
    name: "Meshir",
    index: 5,
    month: 2,
    day: 8,
    leap: true,
  },
  {
    name: "Paremhotep",
    index: 6,
    month: 3,
    day: 10,
    leap: false,
  },
  {
    name: "Parmoute",
    index: 7,
    month: 4,
    day: 9,
    leap: false,
  },
  {
    name: "Pashons",
    index: 8,
    month: 5,
    day: 9,
    leap: false,
  },
  {
    name: "Paone",
    index: 9,
    month: 6,
    day: 8,
    leap: false,
  },
  {
    name: "Epep",
    index: 10,
    month: 7,
    day: 8,
    leap: false,
  },
  {
    name: "Mesore",
    index: 11,
    month: 8,
    day: 7,
    leap: false,
  },
  {
    name: "Pi Kogi Enavot",
    index: 12,
    month: 9,
    day: 6,
    leap: false,
  },
];

// enumerate Coptic months
var CMs = {
  Thoout: 0,
  Paope: 1,
  Hathor: 2,
  Koiahk: 3,
  Tobe: 4,
  Meshir: 5,
  Paremhotep: 6,
  Parmoute: 7,
  Pashons: 8,
  Paone: 9,
  Epep: 10,
  Mesore: 11,
  Nesi: 12,
};

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// /**
//  * @param  {Object} attributes - Attributes object defined in NavSubMenuStore
//  * @returns {Object} collection of fasts & feasts with start and end dates
//  */
export function getCopticFastsFeasts() {
  // major feasts
  // fixed to Jan 7 until the year 2100
  var nativity = moment([today.year(), 0, 7]);
  var epiphany = moment([today.year(), 0, 19]);
  var annunciation = moment([today.year(), 3, 7]);
  var resurrection = moment(getResurrectionDate(today.year()));
  var palmSunday = moment(resurrection).subtract(7, "days");
  var ascension = moment(resurrection).add(39, "days");
  var pentecost = moment(resurrection).add(49, "days");

  // minor feasts
  var circumcision = moment([today.year(), 0, 14]);
  var entranceTemple = moment([today.year(), 1, 15]);
  var entryEgypt = moment([today.year(), 5, 1]);
  var canaMiracle = moment([today.year(), 0, 21]);
  var transfiguration = moment([today.year(), 7, 19]);
  var covenantThursday = moment(palmSunday).add(4, "days");
  var ThomasSunday = moment(resurrection).add(7, "days");

  // feasts of the saints
  // St. Mary

  var MaryAnnunciation = moment([today.year(), 7, 13]);
  var MaryNativity = moment([today.year(), 4, 9]);
  var MaryPresentation = moment([today.year(), 11, 12]);
  var MaryDormant = moment([today.year(), 0, 29]);

  var StMaryAssumption = moment([today.year(), 7, 22]);
  var apostlesFeast = moment([today.year(), 6, 12]);
  var newYear = moment([today.year(), 8, 11]);
  var feastCross1 = moment([today.year(), 2, 19]);
  var feastCross2Start = moment([today.year(), 8, 27]);
  var feastCross2End = moment([today.year(), 8, 29]);

  // fasts
  var lent = moment(resurrection).subtract(55, "days");
  var apostlesFast = moment(pentecost).add(1, "days");
  var StMaryFast = moment([today.year(), 7, 7]);

  // special case since fast spans across years
  if (attributes.todayDate.isBefore(nativity)) {
    var nativityFastStart = moment([today.year() - 1, 10, 25]);
    var nativityFastEnd = moment(nativity);
  } else {
    var nativityFastStart = moment([today.year(), 10, 25]);
    var nativityFastEnd = moment(nativity).add(1, "years");
  }

  var nativityParamoun = getParamounDate(nativity);
  var epiphanyParamoun = getParamounDate(epiphany);
  var JonahFast = moment(lent).subtract(14, "days");
  var JonahFeast = moment(JonahFast).add(3, "days");

  // days of Holy Week
  var goodFriday = moment(palmSunday).add(5, "days");
  var LazarusSaturday = moment(palmSunday).subtract(1, "days");

  if (isLeapYear(today.year())) {
    nativity.add(1, "days");
    circumcision.add(1, "days");
    epiphany.add(1, "days");
    canaMiracle.add(1, "days");
  }
  if (isLeapYear(today.year() + 1)) {
    newYear.add(1, "days");
    feastCross2Start.add(1, "days");
    feastCross2End.add(1, "days");
    //nativityFast.add(1, "days");
  }

  var fastFeasts = [];

  fastFeasts.push({
    key: "NATIVITY",
    type: "feast",
    start: nativity,
    end: null,
    major: true,
  });

  fastFeasts.push({
    key: "EPIPHANY",
    type: "feast",
    start: epiphany,
    end: null,
    major: true,
  });

  /*
  Anba Mettaous Rites books confirms this rite by saying, about the Annunciation:
  "If the Annunciation feast falls on the last Friday of Lent, or Lazarus Saturday, or Hosanna Sunday,
  or Holy Week to the second day of the Resurrection Feast, it is not celebrated
  since these days carry/include Lordly events that are non-recurring [in the liturgical year]"
  http://tasbeha.org/community/discussion/16098/annunciation-not-being-celebrated
  */
  if (
    !annunciation.isBetween(
      moment(LazarusSaturday),
      moment(resurrection).add(1, "days"),
      null,
      "()"
    )
  )
    fastFeasts.push({
      key: "ANNUNCIATION",
      type: "feast",
      start: annunciation,
      end: null,
      major: true,
    });

  fastFeasts.push({
    key: "RESURRECTION",
    type: "feast",
    start: resurrection,
    end: null,
    major: true,
  });

  fastFeasts.push({
    key: "PALM_SUNDAY",
    type: "feast",
    start: palmSunday,
    end: null,
    major: true,
  });

  fastFeasts.push({
    key: "ASCENSION",
    type: "feast",
    start: ascension,
    end: null,
    major: true,
  });

  fastFeasts.push({
    key: "PENTECOST",
    type: "feast",
    start: pentecost,
    end: null,
    major: true,
  });

  fastFeasts.push({
    key: "FEAST_OF_CIRCUMCISION",
    type: "feast",
    start: circumcision,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "ENTRY_EGYPT",
    type: "feast",
    start: entryEgypt,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "WEDDING_CANA",
    type: "feast",
    start: canaMiracle,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "PRESENTATION_TEMPLE",
    type: "feast",
    start: entranceTemple,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "TRANSFIGURATION",
    type: "feast",
    start: transfiguration,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "COVENANT_THURSDAY",
    type: "feast",
    start: covenantThursday,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "THOMAS_SUNDAY",
    type: "feast",
    start: ThomasSunday,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "ASSUMPTION_STMARY",
    type: "feast",
    start: StMaryAssumption,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "FEAST_OF_APOSTLES",
    type: "feast",
    start: apostlesFeast,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "COPTIC_NEW_YEAR",
    type: "feast",
    start: newYear,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "FEAST_OF_CROSS",
    type: "feast",
    start: feastCross1,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "FEAST_OF_CROSS_3",
    type: "feast",
    start: feastCross2Start,
    end: feastCross2End,
    major: false,
  });

  fastFeasts.push({
    key: "FAST_OF_APOSTLES",
    type: "fast",
    start: apostlesFast,
    end: apostlesFeast,
    major: true,
  });

  fastFeasts.push({
    key: "FAST_STMARY",
    type: "fast",
    start: StMaryFast,
    end: StMaryAssumption,
    major: false,
  });

  fastFeasts.push({
    key: "NATIVITY_FAST",
    type: "fast",
    start: nativityFastStart,
    end: nativityFastEnd,
    major: true,
  });

  fastFeasts.push({
    key: "GOOD_FRIDAY",
    type: "fast",
    start: goodFriday,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "LAZARUS_SATURDAY",
    type: "fast",
    start: LazarusSaturday,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "JONAH_FEAST",
    type: "feast",
    start: JonahFeast,
    end: null,
    major: false,
  });

  fastFeasts.push({
    key: "JONAH_FAST",
    type: "fast",
    start: JonahFast,
    end: JonahFeast,
    major: false,
  });

  fastFeasts.push({
    key: "GREAT_LENT",
    type: "fast",
    start: lent,
    end: resurrection,
    major: true,
  });
  fastFeasts.push({
    key: "HOLY_50",
    type: "feast",
    start: resurrection,
    end: apostlesFast,
    major: true,
  });

  fastFeasts.push({
    key: "NATIVITY_PARAMOUN",
    type: "fast",
    start: nativityParamoun,
    end: nativity,
    major: false,
  });

  fastFeasts.push({
    key: "EPIPHANY_PARAMOUN",
    type: "fast",
    start: epiphanyParamoun,
    end: epiphany,
    major: false,
  });

  fastFeasts.push({
    key: "NATIVITY_PERIOD",
    type: "feast",
    start: nativity,
    end: circumcision,
    major: true,
  });
  return fastFeasts;
}

/**
 * @param  {Object} feastDate - Nativity or Epiphany Moment object
 * @returns {Object}
 */
var getParamounDate = function (feastDate) {
  // Sunday
  if (feastDate.day() == 0) {
    return moment(feastDate).subtract(2, "days");
    // Monday
  } else if (feastDate.day() == 1) {
    return moment(feastDate).subtract(3, "days");
  } else {
    return moment(feastDate).subtract(1, "days");
  }
};

/**
 * @param  {Object} attributes - Attributes object defined in NavSubMenuStore
 * @returns {boolean}
 */
// var isInFast = function (attributes) {
//   var fastsfeasts = getCopticFastsFeasts(attributes);
//   // ignore time and use date only
//   var todayDate = moment([
//     new Date().getFullYear(),
//     attributes.monthIndex,
//     attributes.day,
//   ]);

//   // if day is Saturday or Sunday and not in Great Lent return false
//   var GreatLent = fastsfeasts[FastFeastNames.GREAT_LENT];
//   if (
//     (todayDate.day() == 6 || todayDate.day() == 0) &&
//     !todayDate.isBetween(GreatLent.start, GreatLent.end, null, "[)")
//   ) {
//     return false;
//   }

//   for (var x in fastsfeasts) {
//     // beginning of date range is inclusive
//     /*
//     check if date falls in fast, in major feast period, or on major feast day
//     */
//     if (
//       fastsfeasts[x].type == "fast" &&
//       fastsfeasts[x].end !== null &&
//       todayDate.isBetween(fastsfeasts[x].start, fastsfeasts[x].end, null, "[)")
//     ) {
//       return true;
//     } else if (
//       fastsfeasts[x].type == "feast" &&
//       fastsfeasts[x].major &&
//       fastsfeasts[x].start.isSame(todayDate)
//     ) {
//       return false;
//     } else if (
//       fastsfeasts[x].type == "feast" &&
//       fastsfeasts[x].major &&
//       fastsfeasts[x].end !== null &&
//       todayDate.isBetween(fastsfeasts[x].start, fastsfeasts[x].end, null, "[)")
//     ) {
//       return false;
//     }
//   }

//   // finally if day is Wed or Fri return true
//   return todayDate.day() == 3 || todayDate.day() == 5;
// };

/**
 * @param {Object} attributes - Attributes object defined in NavSubMenuStore
 * @returns {Array} list of FastFeastNames items
 */
export function getCurrentSeason() {
  var fastsfeasts = getCopticFastsFeasts();
  var collection = [];
  // ignore time
  var todayDate = moment([
    new Date().getFullYear(),
    attributes.monthIndex,
    attributes.day,
  ]);
  fastsfeasts.map((feast) => {
    if (
      (feast.end === null && feast.start.isSame(todayDate)) ||
      (feast.end !== null &&
        todayDate.isBetween(feast.start, feast.end, null, "[)"))
    ) {
      collection.push(feast);
    }
  });
  // for (var x in fastsfeasts) {
  //   // beginning of date range is inclusive
  //   console.log(x);

  // }

  return collection;
}

var isLeapYear = function (year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

var getCopticMonthDate = function (CopticMonthObject, year) {
  var leapYear = isLeapYear(year + 1);
  var m = CopticMonthObject.month;
  var d = CopticMonthObject.day;
  if (CopticMonthObject.leap && leapYear) {
    d++;
  }
  return new Date(year, m - 1, d);
};

export function getCopticDate(year, monthIndex, day) {
  var copticMonth;
  var copticMonthIndex = 0;
  var copticDay = day;
  var copticYear = year - 284;
  var copticNewYearDay = isLeapYear(year + 1) ? 12 : 11;
  // Coptic New Year
  if (monthIndex >= 8 && day >= copticNewYearDay) {
    copticYear++;
  }

  for (var i = 0; i < CopticMonthObjects.length; i++) {
    var m = CopticMonthObjects[i];
    // wrap around to beginning
    var m_next = CopticMonthObjects[(i + 1) % CopticMonthObjects.length];

    var gregDate = new Date(year, monthIndex, day, 12, 0, 0);
    var copticMonthStartDate;
    var copticMonthEndDate;

    // special cases for new Gregorian year
    if (monthIndex == 0 && m.index == 3) {
      copticMonthStartDate = getCopticMonthDate(m, year - 1);
      copticMonthEndDate = getCopticMonthDate(m_next, year);
    } else if (monthIndex == 11 && m_next.index == 4) {
      copticMonthStartDate = getCopticMonthDate(m, year);
      copticMonthEndDate = getCopticMonthDate(m_next, year + 1);
    } else {
      copticMonthStartDate = getCopticMonthDate(m, year);
      copticMonthEndDate = getCopticMonthDate(m_next, year);
    }

    if (gregDate >= copticMonthStartDate && gregDate < copticMonthEndDate) {
      copticMonth = m.name;
      copticMonthIndex = m.index;
      copticDay =
        Math.floor((gregDate - copticMonthStartDate) / (1000 * 24 * 3600)) + 2;
      break;
    }
  }

  return {
    month: copticMonth,
    monthIndex: copticMonthIndex,
    day: copticDay,
    year: copticYear,
  };
}

var getCopticDateString = function (year, monthIndex, day) {
  var copticDate = getCopticDate(year, monthIndex, day);
  return copticDate.month + " " + copticDate.day + ", " + copticDate.year;
};

var getResurrectionDate = function (year) {
  // Meeus Julian algorithm
  var a = year % 4;
  var b = year % 7;
  var c = year % 19;
  var d = (19 * c + 15) % 30;
  var e = (2 * a + 4 * b - d + 34) % 7;
  var monthIndex = Math.floor((d + e + 114) / 31) - 1;
  var day = ((d + e + 114) % 31) + 14;
  return new Date(year, monthIndex, day);
};

var getDateString = function (year, monthIndex, day) {
  return monthNames[monthIndex] + " " + day + ", " + year;
};

var getNumericDateString = function (year, monthIndex, day) {
  var pad = "0";
  var strDay = day.toString();
  var strMonth = (monthIndex + 1).toString();
  if (strMonth.length < 2) {
    strMonth = "0" + strMonth;
  }
  if (strDay.length < 2) {
    strDay = "0" + strDay;
  }

  return strMonth + "/" + strDay + "/" + year;
};

var AdamOrWatos = function (year, monthIndex, day) {
  var date = new Date(year, monthIndex, day);
  if (date.getDay() < 3) {
    return "adam";
  }
  return "watos";
};

var CopticDateComparator = function (
  month1,
  day1,
  month2,
  day2,
  monthIndex0,
  day0
) {
  /*
  test if date0 is between date1 and date2 by treating Coptic months as circular array
  */

  var monthIndex1 = CMs[month1];
  var monthIndex2 = CMs[month2];
  var offset;

  if (monthIndex2 < monthIndex1) {
    offset = monthIndex2 + 13 - monthIndex1;
  } else {
    offset = monthIndex2 - monthIndex1;
  }

  // wrap around to beginning of year
  for (var i = monthIndex1; i <= monthIndex1 + offset; i++) {
    if (monthIndex0 == i % 13) {
      // edge cases
      if (
        (monthIndex0 == monthIndex1 && day0 >= day1) ||
        (monthIndex0 == monthIndex2 && day0 <= day2) ||
        (monthIndex0 != monthIndex1 && monthIndex0 != monthIndex2)
      ) {
        return true;
      }
    }
  }
  return false;
};
// default getCopticDate;
//module.exports.getCopticDate = getCopticDate;
module.exports.getCopticDateString = getCopticDateString;
module.exports.getResurrectionDate = getResurrectionDate;
module.exports.getDateString = getDateString;
module.exports.getNumericDateString = getNumericDateString;
module.exports.AdamOrWatos = AdamOrWatos;
module.exports.CopticDateComparator = CopticDateComparator;
//module.exports.getCopticFastsFeasts = getCopticFastsFeasts;
//module.exports.isInFast = isInFast;
// module.exports.FastFeastNames = FastFeastNames;
