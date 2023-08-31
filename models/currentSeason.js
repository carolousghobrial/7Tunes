class CurrentSeason {
  constructor(
    key,
    week,
    dayOfWeek,
    gregorianDayOfMonth,
    gregorianMonth,
    gregorianYear,
    isWatos,
    type,
    start,
    end,
    major,
    plantsSeason,
    copticMonth,
    copticYear
  ) {
    this.key = key;
    this.week = week;
    this.dayOfWeek = dayOfWeek;
    this.gregorianDayOfMonth = gregorianDayOfMonth;
    this.gregorianMonth = gregorianMonth;
    this.gregorianYear = gregorianYear;
    this.isWatos = isWatos;
    this.type = type;
    this.start = new Date(start);
    this.end = new Date(end);
    this.major = major;
    this.plantsSeason = plantsSeason;
    this.copticMonth = copticMonth;
    this.copticYear = copticYear;
  }
}

export default CurrentSeason;
