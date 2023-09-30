import { getLanguageValue, getFontSize, getColor } from "./SettingsHelpers.js";
import { useDispatch, useSelector } from "react-redux";
//const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

var moment = require("moment-timezone"); //moment-timezone

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
    name: "Nesi",
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
export function getCopticFastsFeasts(yearSelected) {
  // major feasts
  // fixed to Jan 7 until the year 2100
  var nativity = moment([yearSelected, 0, 7]);
  var nativity2ndDay = moment([yearSelected, 0, 8]);
  var nativityEnd = moment([yearSelected, 0, 7]);
  var epiphany = moment([yearSelected, 0, 19]);
  var epiphany2ndDay = moment([yearSelected, 0, 20]);
  var annunciation = moment([yearSelected, 3, 7]);
  var resurrection = moment(getResurrectionDate(yearSelected));
  var palmSunday = moment(resurrection).subtract(7, "days");
  var ascension = moment(resurrection).add(39, "days");
  var ascension2ndday = moment(ascension).add(1, "days");
  var pentecost = moment(resurrection).add(49, "days");

  // minor feasts
  var circumcision = moment([yearSelected, 0, 14]);
  var entranceTemple = moment([yearSelected, 1, 15]);
  var entryEgypt = moment([yearSelected, 5, 1]);
  var canaMiracle = moment([yearSelected, 0, 21]);
  var transfiguration = moment([yearSelected, 7, 19]);
  var covenantThursday = moment(palmSunday).add(4, "days");
  var ThomasSunday = moment(resurrection).add(7, "days");

  // feasts of the saints
  // St. Mary

  var MaryAnnunciation = moment([yearSelected, 7, 13]);
  var MaryNativity = moment([yearSelected, 4, 9]);
  var MaryPresentation = moment([yearSelected, 11, 12]);
  var MaryDormant = moment([yearSelected, 0, 29]);

  var StMaryAssumption = moment([yearSelected, 7, 22]);
  var apostlesFeast = moment([yearSelected, 6, 12]);
  var newYear = moment([yearSelected, 8, 11]);
  var feastCross1 = moment([yearSelected, 2, 19]);
  var newYearEnd = moment([yearSelected, 8, 26]);
  var feastCross2Start = moment([yearSelected, 8, 27]);
  var feastCross2End = moment([yearSelected, 8, 29]);

  // fasts
  var lent = moment(resurrection).subtract(55, "days");
  var apostlesFast = moment(pentecost).add(1, "days");
  var StMaryFast = moment([yearSelected, 7, 7]);

  // special case since fast spans across years
  if (attributes.todayDate.isBefore(nativity)) {
    var nativityFastStart = moment([yearSelected - 1, 10, 25]);
    var nativityFastEnd = moment(nativity);
  } else {
    var nativityFastStart = moment([yearSelected, 10, 25]);
    var nativityFastEnd = moment(nativity).add(1, "years");
  }

  var nativityParamoun = getParamounDate(nativity);
  var epiphanyParamoun = getParamounDate(epiphany);
  var JonahFast = moment(lent).subtract(14, "days");
  var JonahFeast = moment(JonahFast).add(3, "days");

  // days of Holy Week
  var goodFriday = moment(palmSunday).add(5, "days");
  var LazarusSaturday = moment(palmSunday).subtract(1, "days");

  if (isLeapYear(yearSelected)) {
    nativityEnd = nativityEnd.add(1, "days");
    nativity2ndDay = nativity2ndDay.add(1, "days");
    circumcision = circumcision.add(1, "days");
    epiphany = epiphany.add(1, "days");
    canaMiracle = canaMiracle.add(1, "days");
  }
  if (isLeapYear(yearSelected + 1)) {
    newYear = newYear.add(1, "days");
    newYearEnd = newYearEnd.add(1, "days");
    feastCross2Start = feastCross2Start.add(1, "days");
    feastCross2End = feastCross2End.add(1, "days");
    //nativityFast.add(1, "days");
  }

  var fastFeasts = [];

  fastFeasts.push({
    key: "NATIVITY",
    type: "feast",
    start: nativity,
    end: nativityEnd,
    major: true,
  });

  fastFeasts.push({
    key: "NATIVITY_SECONDDAY",
    type: "feast",
    start: nativity2ndDay,
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
  fastFeasts.push({
    key: "EPIPHANY_SECONDDAY",
    type: "feast",
    start: epiphany2ndDay,
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
    key: "HOLY_WEEK",
    type: "fast",
    start: palmSunday,
    end: resurrection,
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
    key: "ASCENSIONTOPENTECOST",
    type: "feast",
    start: ascension2ndday,
    end: pentecost,
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
    end: newYearEnd,
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
    start: nativity2ndDay,
    end: circumcision,
    major: true,
  });

  return fastFeasts;
}

/**
 * @param  {Object} feastDate - Nativity or Theophany Moment object
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
export function isInFast() {
  var myfastfeasts = getCopticFastsFeasts(moment().year());
  // ignore time and use date only
  var todayDate = moment([
    new Date().getFullYear(),
    today.month(),
    today.date(),
  ]);

  // if day is Saturday or Sunday and not in Great Lent return false
  //array1.find(element => element > 10);
  var GreatLent = myfastfeasts.find((element) => element.key === "GREAT_LENT");
  if (
    (todayDate.day() == 6 || todayDate.day() == 0) &&
    !todayDate.isBetween(GreatLent.start, GreatLent.end, null, "[)")
  ) {
    return false;
  }

  for (var x in myfastfeasts) {
    // beginning of date range is inclusive
    /*
    check if date falls in fast, in major feast period, or on major feast day
    */
    if (
      myfastfeasts[x].type == "fast" &&
      myfastfeasts[x].end !== null &&
      todayDate.isBetween(
        myfastfeasts[x].start,
        myfastfeasts[x].end,
        null,
        "[)"
      )
    ) {
      return true;
    } else if (
      myfastfeasts[x].type == "feast" &&
      myfastfeasts[x].major &&
      myfastfeasts[x].start.isSame(todayDate)
    ) {
      return false;
    } else if (
      myfastfeasts[x].type == "feast" &&
      myfastfeasts[x].major &&
      myfastfeasts[x].end !== null &&
      todayDate.isBetween(
        myfastfeasts[x].start,
        myfastfeasts[x].end,
        null,
        "[)"
      )
    ) {
      return false;
    }
  }

  // finally if day is Wed or Fri return true
  return todayDate.day() == 3 || todayDate.day() == 5;
}
export function plantsSeason(currentDate) {
  // ignore time and use date only
  var todayDate = moment(currentDate);
  var airStart = moment([new Date().getFullYear(), 0, 19]);
  var waterStart = moment([new Date().getFullYear(), 5, 19]);
  var plantsStart = moment([new Date().getFullYear(), 9, 19]);

  if (todayDate.isBetween(airStart, waterStart)) {
    return "air";
  } else if (todayDate.isBetween(waterStart, plantsStart)) {
    return "waters";
  } else {
    return "plants";
  }
}
export function getTodayDate(timeTransition) {
  var todayDate = new Date();
  if (new Date(timeTransition).getHours() <= todayDate.getHours()) {
    todayDate.setDate(todayDate.getDate() + 1);
  }
  todayDate.setHours(0, 0, 0, 0);
  const returnMoment = moment(todayDate);
  return returnMoment;
}

export function setCurrentSeasonByKey(timeTransition, key) {
  var fastsfeasts = getCopticFastsFeasts(moment().year());
  const mySeason = fastsfeasts.find((element) => element.key === key);
  const currentDate = new Date(mySeason.start);
  const copticDate = getCopticDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  var mycurrentSeason = {
    key: mySeason.key,
    start: mySeason.start,
    end: mySeason.end,
    major: mySeason.major,
    week: 1,
    dayOfWeek: currentDate.getDay(),
    gregorianDayOfMonth: currentDate.getDate(),
    gregorianMonth: currentDate.getMonth(),
    gregorianYear: currentDate.getFullYear(),
    isWatos: isWatos(currentDate.getDay()),
    type: mySeason.type,
    plantsSeason: plantsSeason(currentDate),
    copticMonth: copticDate.month,
    copticDay: copticDate.day,
    copticYear: copticDate.year,
  };
  return mycurrentSeason;
}
export function setCurrentSeasonLive(timeTransition) {
  const mySeason = getCurrentSeason(timeTransition)[0];
  const currentDate = new Date(getTodayDate(timeTransition));
  const copticDate = getCopticDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  //  Tobe: 4,
  //Meshir: 5,

  var mycurrentSeason = {
    key: mySeason.key,
    start: mySeason.start,
    end: mySeason.end,
    major: mySeason.major,
    week: getWeeksSinceStartDate(new Date(mySeason.start)),
    dayOfWeek: currentDate.getDay(),
    gregorianDayOfMonth: currentDate.getDate(),
    gregorianMonth: currentDate.getMonth(),
    gregorianYear: currentDate.getFullYear(),
    isWatos: isWatos(currentDate.getDay()),
    type: mySeason.type,
    plantsSeason: plantsSeason(currentDate),
    copticMonth: copticDate.month,
    copticDay: copticDate.day,
    copticYear: copticDate.year,
  };
  return mycurrentSeason;
}
function getWeeksSinceStartDate(startDate) {
  const now = new Date(); // Get the current date
  const msPerWeek = 1000 * 60 * 60 * 24 * 7; // Number of milliseconds in a week
  const diffInMs = now.getTime() - startDate.getTime(); // Difference in milliseconds between now and start date
  const diffInWeeks = Math.ceil(diffInMs / msPerWeek); // Round down to get number of full weeks
  return diffInWeeks;
}
export function getCurrentSeason(timeTransition) {
  var fastsfeasts = getCopticFastsFeasts(moment().year());
  var collection = [];
  // ignore time
  const currentDate = new Date(getTodayDate(timeTransition));

  const copticDate = getCopticDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  var todayDate = getTodayDate(timeTransition);
  fastsfeasts.map((feast) => {
    if (
      (feast.end === null && feast.start.isSame(todayDate)) ||
      (feast.end !== null &&
        todayDate.isBetween(feast.start, feast.end, null, "[]"))
    ) {
      collection.push(feast);
    }
  });
  if (collection.length === 0) {
    let type = "regular";
    if (todayDate.day() === 3 && todayDate.day() === 5) {
      type = "fast";
    }
    if (
      copticDate.day === 29 &&
      (copticDate.month != "Tobe" || copticDate.month != "Meshir")
    ) {
      collection.push({
        key: "TWENTYNINTHTH_COPTIC_MONTH",
        type: "feast",
        start: null,
        end: null,
        major: false,
      });
    }
    collection.push({
      key: "STANDARD",
      type: type,
      start: null,
      end: null,
      major: false,
    });
  }

  return collection;
}

var isLeapYear = function (year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

function getCopticMonthDate(CopticMonthObject, year) {
  var leapYear = isLeapYear(year + 1);
  var m = CopticMonthObject.month;
  var d = CopticMonthObject.day;
  if (CopticMonthObject.leap && leapYear) {
    d++;
  }
  return new Date(year, m - 1, d);
}

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
        Math.floor((gregDate - copticMonthStartDate) / (1000 * 24 * 3600)) + 1;
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

export function getCopticDateString(year, month, day) {
  return getLanguageValue(month) + " " + day + ", " + year;
}

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

export function isWatos(dayOfWeek) {
  if (dayOfWeek < 3) {
    return false;
  }
  return true;
}

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
