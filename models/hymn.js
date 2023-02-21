class Hymn {
  constructor(
    type,
    rule,
    visible,
    side,
    arabic,
    coptic,
    english,
    arabiccoptic,
    englishcoptic
  ) {
    this.type = type;
    this.rule = rule;
    this.visible = visible;
    this.side = side;
    this.arabic = arabic;
    this.coptic = coptic;
    this.english = english;
    this.arabiccoptic = arabiccoptic;
    this.englishcoptic = englishcoptic;
  }
}

export default Hymn;
