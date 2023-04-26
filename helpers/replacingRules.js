import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { getSeason } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";
const bishopsList = require("../assets/json/bishopsList.json");

import {
  getCurrentSeason,
  isInFast,
  getCopticFastsFeasts,
} from "../helpers/copticMonthsHelper.js";

export const ComeRisenRule = () => {
  const fastsFeasts = getCopticFastsFeasts(moment().year());
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  var date = new Date(
    currentSeason.gregorianYear,
    currentSeason.gregorianMonth,
    currentSeason.gregorianDayOfMonth,
    0,
    0,
    0,
    0
  );
  var today = new moment(date);
  var Kiahk = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");
  var Resurrection = fastsFeasts.find(
    (element) => element.key === "RESURRECTION"
  );
  var PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
  switch (currentSeason.key) {
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return {
        english: "were born",
        coptic: "aumack",
        arabic: "ولدت",
        englishcoptic: "avmask",
        arabiccoptic: "افماسك",
      };

    case "EPIPHANY":
    case "EPIPHANY_PARAMOUN":
    case "EPIPHANY_SECONDDAY":
      return {
        english: "were baptised",
        coptic: "aksi`wmc",
        arabic: "اعتمدت",
        englishcoptic: "akchi-oms",
        arabiccoptic: "اكتشي أومس",
      };
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
    case "COVENANT_THURSDAY":
      return {
        english: "were crucified",
        coptic: "aua]k",
        arabic: "صلبت",
        englishcoptic: "av-ashk",
        arabiccoptic: "اف اشك",
      };
    default:
      break;
  }
  if (today.isBetween(Resurrection.start, PENTECOST.start)) {
    return {
      english: "have risen",
      coptic: "aktwnk",
      arabic: "قمت",
      englishcoptic: "aktonk",
      arabiccoptic: "اكتونك",
    };
  } else if (today.isBetween(PENTECOST.start, Kiahk.start)) {
    if (today.day() === 0) {
      return {
        english: "have risen",
        coptic: "aktwnk",
        arabic: "قمت",
        englishcoptic: "aktonk",
        arabiccoptic: "اكتونك",
      };
    }
  }
  return {
    english: "have come",
    coptic: "ak`i",
    arabic: "اتيت",
    englishcoptic: "ak-ee",
    arabiccoptic: "اك إي",
  };
};

export const ROICONCLUSION = (motherSource) => {
  if (motherSource === "kiahkPsalmody") {
    return {
      english: "The Begotten of the Father before all ages. ",
      coptic: "Pimici `ebol=en `Viwt =ajwou `nni`ewn throu.",
      arabic: "المولود من الآب قبل كل الدهور. ",
      englishcoptic: "Pi-misi evol khen efiot , khago-oo en-ni e-on teero",
      arabiccoptic: "بي ميسي إيفول خين إيفيوت خاجو أو إنني إي أون تيرو",
    };
  } else if (motherSource === "lentenPsalmody") {
    return {
      english:
        "who fasted for us, forty days and forty nights, to save us from our sins.",
      coptic:
        "vh`etaf`ernhcteuin `e`\\rhi `ejwn> `n`\\me `n`e\\o`ou nem `\\me `n`ejwr\\> ]a `ntefcwtten =en nennobi.",
      arabic: "الذي صام عنا، أربعين يوماً وأربعين ليلة، حتي خلصنا من خطايانا.",
      englishcoptic:
        "Vee-etaf ernes-tevin e-ehreei egon: en-ehme en-ehooo nem ehme en-egorh: sha entef-sot-ten khen nen-novi.",
      arabiccoptic:
        "في إيتاف إيرنيستيفين إهري إيجون: إين إيهمي إين إيهووؤ نيم إيهمي إين إيجوره: شا إينتيف سوتتين خين نين نوفي.",
    };
  }
  const fastsFeasts = getCopticFastsFeasts(moment().year());
  const today = moment();
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  var ASCENSION = fastsFeasts.find((element) => element.key === "ASCENSION");
  var PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
  switch (currentSeason.key) {
    case "COPTIC_NEW_YEAR":
      return {
        english:
          "bless the crown of the year, with Your goodness O Lord, the rivers and the fountains, the plants and the fruits.",
        coptic:
          "`cmou `epi`xlom `nte ;rompi> \\iten tekmet`xrhctoc `Psoic> niiarwou nem nimoumi> nem nici; nem nikarpoc.",
        arabic:
          "بارك إكليل [هذه] السنة، بصلاحك يا رب، الأنهار والينابيع، والزروع والأثمار",
        englishcoptic:
          "Esmoo e-pi-eklom ente-ti rompi, he-ten tek-met-ekhrestos Ep-shois, ni-a-ro-oo nem ni-mo-me, nem ni-siti nem ni-karpos.",
        arabiccoptic:
          "إزموا إيه بي إكلوم انتيه تي رومبي، هيتين تيك ميت إخريستوس إبشويس، ني أروؤ نيم ني مومي، نيم ني سيتي نيم ني كاربوس.",
      };
    case "FEAST_OF_CROSS":
    case "FEAST_OF_CROSS_3":
    case "HOLY_WEEK":
      return {
        english:
          "who was crucified on the cross, destroy Satan under our feet ",
        coptic:
          "vh`etaua]f `epi`ctauroc> ek`e=om=em `m`pcatanac> capecht `nnensalauj",
        arabic: "الذى صلبت على الصليب وسحقت الشيطان تحت أقدامنا",
        englishcoptic:
          "vi etaf ashf epistavros Ek-ekhomkhem emepsatanas, sapeseet en-nen echalavg.",
        arabiccoptic:
          "فى إيطاف أشف إبى إسطافروس إك إ خومخيم إم إبساطاناس. سابيسيت إن نين إتشالافج.",
      };
    case "NATIVITY":
    case "NATIVITY_PARAMOUN":
    case "NATIVITY_PERIOD":
    case "FEAST_OF_CIRCUMCISION":
      return {
        english:
          "Who was born in Bethlehem, according to the prophetic sayings.",
        coptic: "Vh`etaumacf =en Bhqleem kata ni`cmh `m`provhtikon.",
        arabic: "الذي ولد في بيت لحم كالأخبار النبوية.",
        englishcoptic:
          "Vi-etaf masf khen Vethle-eem , kata ni esmi em epro-phitikon. ",
        arabiccoptic:
          "في ايطاف ماسف خين بيتليئيم : كاطا ني اسمي ام ابروفيتيكون  .",
      };

    case "EPIPHANY":
    case "EPIPHANY_PARAMOUN":
    case "EPIPHANY_SECONDDAY":
      return {
        english: "The Son of God, Who was baptized in the Jordan.",
        coptic: "P]hri `m`Vnou;> Vh`etafsiwmc =en Piiordanhc.",
        arabic: "إبن الله، الذي إعتمد في الأردن",
        englishcoptic:
          "Epsheeri em-Evnooti: Vi-etaf etchy oms khen pi-yordanees ",
        arabiccoptic: "إيبشيري إميفنووتي: في ايطافتشي أومس خين بى يوردانيس .",
      };
    case "ANNUNCIATION":
      return {
        english: "The Son of God, was incarnate from the Virgin.",
        coptic: "P]hri `m`Vnou;> afsicar[ `ebol =en :parqenoc.",
        arabic: "إبن الله، تجسد من العذراء.",
        englishcoptic:
          "Epsheeri em-Evnooti: afechi-sarex evol khen Ti-Parthenos.",
        arabiccoptic: "إيبشيري إميفنووتي: افتشي ساركس إيفول خين تيبارثينوس.",
      };
    case "FEAST_OF_CIRCUMCISION":
      return {
        english: " The Son of God, accepted unto Himself circumcision.",
        coptic: "P]hri `m`Vnou;>  af]wop `erof `mpicebi.",
        arabic: "ابن الله قبل إليه الختان.",
        englishcoptic: "Epsheeri em-Evnooti: afshop erof empi-sevi",
        arabiccoptic: "إيبشيري إميفنووتي: افشوب ايروف امبي سيفي",
      };
    case "ENTRY_EGYPT":
      return {
        english: " The Son of God, came to the land of Egypt.",
        coptic: "P]hri `m`Vnou;>  af`i `e=oun `e`pkai `nXhmi.",
        arabic: "ابن الله دخل إلي أرض مصر..",
        englishcoptic: "Epsheeri em-Evnooti: av-ee ekhon epkahi en-Keemi",
        arabiccoptic: "إيبشيري إميفنووتي: افئي إيخون إبكاهي إن كيمي",
      };
    case "WEDDING_CANA":
      return {
        english: " The Son of God, blessed the water and changed it into wine",
        coptic: "P]hri `m`Vnou;>  af`cmou `enimwou afaitou `nhrp",
        arabic: "ابن الله بارك المياه فصيرها خمراً.",
        englishcoptic: "Epsheeri em-Evnooti: av-esmo eni-mo-oo af-aito en-eerp",
        arabiccoptic: "إيبشيري إميفنووتي: اف إزمو ان نيموؤو اف ايتو إن ايرب",
      };
    case "PRESENTATION_TEMPLE":
      return {
        english: " The Son of God,He entered into the temple",
        coptic: "P]hri `m`Vnou;>  afse `eqoun `epiervei",
        arabic: "ابن الله دخل إلى الهيكل.",
        englishcoptic: "Epsheeri em-Evnooti: af-ee ekhon epi-erfei",
        arabiccoptic: "إيبشيري إميفنووتي: اف ى إيخون اى بى إرفيى",
      };
    case "TRANSFIGURATION":
      return {
        english: " The Son of God, was transfigured upon Mount Tabor",
        coptic: "P]hri `m`Vnou;>  af]wbt `ejen pitwou `nQabwr",
        arabic: "ابن الله تجلى على جبل تابور..",
        englishcoptic: "Epsheeri em-Evnooti: af-shobt ejen pi-to-oo en-Taboor",
        arabiccoptic: "إيبشيري إميفنووتي: اف شوبت إيجين بيتوأو إن تابور",
      };
    case "NATIVITY_FAST":
      return {
        english: "The Begotten of the Father before all ages. ",
        coptic: "Pimici `ebol=en `Viwt =ajwou `nni`ewn throu.",
        arabic: "المولود من الآب قبل كل الدهور. ",
        englishcoptic: "Pi-misi evol khen efiot , khago-oo en-ni e-on teero",
        arabiccoptic: "بي ميسي إيفول خين إيفيوت خاجو أو إنني إي أون تيرو",
      };
    case "GREAT_LENT":
      return {
        english:
          "who fasted for us, forty days and forty nights, to save us from our sins.",
        coptic:
          "vh`etaf`ernhcteuin `e`\\rhi `ejwn> `n`\\me `n`e\\o`ou nem `\\me `n`ejwr\\> ]a `ntefcwtten =en nennobi.",
        arabic:
          "الذي صام عنا، أربعين يوماً وأربعين ليلة، حتي خلصنا من خطايانا.",
        englishcoptic:
          "Vee-etaf ernes-tevin e-ehreei egon: en-ehme en-ehooo nem ehme en-egorh: sha entef-sot-ten khen nen-novi.",
        arabiccoptic:
          "في إيتاف إيرنيستيفين إهري إيجون: إين إيهمي إين إيهووؤ نيم إيهمي إين إيجوره: شا إينتيف سوتتين خين نين نوفي.",
      };
    case "RESURRECTION":
    case "THOMAS_SUNDAY":
      return {
        english:
          "the King of glory, who has risen from the dead on the third day.",
        coptic:
          "`Pouro `nte `p`wou> aftwnf `ebol =en nheqmwout =en pi`e\\oou `mma\\]omt.",
        arabic: "ملك المجد، (الذي) قام من بين الأموات في اليوم الثالث.",
        englishcoptic:
          "Ep-oro ente ep-o-oo, aftonf evol khennieth-mo-oot khenpi-eho-oo emmah-shomt.",
        arabiccoptic:
          "أبؤرو انتيه ابؤؤ افتونف ايفول خين ني ايث موؤت خين بي ايهوؤ امماه شومت",
      };
    case "ASCENSION":
      return {
        english:
          "who is risen from the dead, ascended into the heavens, and is seated at the right hand of His Father.",
        coptic:
          "aftwnf `ebol =en nheqmwout> ouo\\ af]enaf `e`p]wi `enivhou`i> af\\emci caou`inam `mPefiwt.",
        arabic: "الذي قام من بين الأموات، وصعد إلى السموات، وجلس عن يمين أبيه.",
        englishcoptic:
          "Aftonf evol khen ni-ethmo-ot, owoh afshenaf epshoi eni-fi-owwe, af-hemsi sa-ow-we-nam empef-iot.",
        arabiccoptic:
          "آفطونف إيﭬول خين ني إثموأووت : أووه آفشيناف إيه إبشوي إيه ني في أووي : آفهيمسي صا أووي نام إمبيف يوت",
      };
    case "HOLY_50":
      if (today.isBetween(ASCENSION.start, PENTECOST.start)) {
        return {
          english:
            "who is risen from the dead, ascended into the heavens, and is seated at the right hand of His Father.",
          coptic:
            "aftwnf `ebol =en nheqmwout> ouo\\ af]enaf `e`p]wi `enivhou`i> af\\emci caou`inam `mPefiwt.",
          arabic:
            "الذي قام من بين الأموات، وصعد إلى السموات، وجلس عن يمين أبيه.",
          englishcoptic:
            "Aftonf evol khen ni-ethmo-ot, owoh afshenaf epshoi eni-fi-owwe, af-hemsi sa-ow-we-nam empef-iot.",
          arabiccoptic:
            "آفطونف إيﭬول خين ني إثموأووت : أووه آفشيناف إيه إبشوي إيه ني في أووي : آفهيمسي صا أووي نام إمبيف يوت",
        };
      } else {
        return {
          english:
            "the King of glory, who has risen from the dead on the third day.",
          coptic:
            "`Pouro `nte `p`wou> aftwnf `ebol =en nheqmwout =en pi`e\\oou `mma\\]omt.",
          arabic: "ملك المجد، (الذي) قام من بين الأموات في اليوم الثالث.",
          englishcoptic:
            "Ep-oro ente ep-o-oo, aftonf evol khennieth-mo-oot khenpi-eho-oo emmah-shomt.",
          arabiccoptic:
            "أبؤرو انتيه ابؤؤ افتونف ايفول خين ني ايث موؤت خين بي ايهوؤ امماه شومت",
        };
      }
    case "PENTECOST":
      return {
        english:
          "who has risen and ascended, and sent to us the Paraclete, the Spirit of truth.",
        coptic:
          "vh`etaftwnf ouo\\ af]enaf> afouwrp nan `mPiparaklhton> Pi`pneuma `nte ;meqmhi.",
        arabic: "الذي قام ثم صعد، وأرسل لنا البارقليط، روح الحق.",
        englishcoptic:
          "ve-etaftonf owoh af-she-naf, af-oo-orb nan empi-parak-liton, pi-epnevma ente-ti-meth-mee.",
        arabiccoptic:
          "في إيتافطونف اووه آفشيناف : آف أووأورب نان إمبي باراكليتون : بي بنيﭭما إنتي تي ميثمي",
      };
    default:
      //Air
      if (currentSeason.plantsSeason == "air") {
        return {
          english:
            "bless the air of heaven , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou ni`ahr `nte `tve Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ أهويةَ السماءِ ولتكن رحمتُك وسلامُك حِصناً لشعبِك",
          englishcoptic:
            "Esmo eni a-eer ente etve , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إي ني آإير إنتي إتفي ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
      //waters
      else if (currentSeason.plantsSeason == "waters") {
        return {
          english:
            "bless the waters of the river , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou nimwou `m`viaro Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ مياهَ النهرِ ولتكن رحمتُك وسلامُك حِصناً لشعبِك  ",
          englishcoptic:
            "Esmo eni-mo-oo em efiaro , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إي ني موؤ إم إفيارو ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
      //plants
      else {
        return {
          english:
            "bless the seeds and the herbs , May Your mercy and Your peace be a fortress to Your people. ",
          coptic:
            "Cmou `enici; nem nicim Mare peknai nem tekhirhnh oi `ncobt `mpeklaoc.",
          arabic: "بارِكْ الزروعَ والعشبَ ولتكن رحمتُك وسلامُك حِصناً لشعبِك  ",
          englishcoptic:
            "Esmo eni-sitee nem ni sim , mare pek nai nem tek hiriny oi en soft empek laos ",
          arabiccoptic:
            "إسمو إيني سيتي نيم ني سيم ماري بيك ناي نيم تيك هيريني أوى إن سوفت إم بيك لاؤس",
        };
      }
  }
};

export const REPLACEGOSPELAUTHOR = (author) => {
  switch (author) {
    case 1:
      return {
        english: "Matthew",
        coptic: "Matqeon",
        arabic: "متى",
        englishcoptic: "Mat-theon",
        arabiccoptic: "ماتثيؤن",
      };
    case 2:
      return {
        english: "Mark",
        coptic: "Markon",
        arabic: "مرقس",
        englishcoptic: "Markon",
        arabiccoptic: "ماركون",
      };
    case 3:
      return {
        english: "Luke",
        coptic: "Loukan",
        arabic: "لوقا",
        englishcoptic: "Lokan",
        arabiccoptic: "لوكان",
      };
    case 4:
      return {
        english: "John",
        coptic: "Iwannhn",
        arabic: "يوحنا",
        englishcoptic: "Yoanin",
        arabiccoptic: "يوأنين",
      };
  }
};

export const REPLACPASCHAHOURDAY = (paschaHourDay) => {
  switch (paschaHourDay) {
    //SundayDay
    case "SundayDayNinthHour":
      return {
        english: "Ninth Hour of Hosanna Sunday",
        arabic: " الساعة التاسعة من يوم احد الشعانين",
      };
    case "SundayDayEleventhHour":
      return {
        english: "Eleventh Hour of Hosanna Sunday",
        arabic: " الساعة الحادية عشر من يوم احد الشعانين",
      };
    //MondayEve
    case "MondayEveFirstHour":
      return {
        english: "First Hour of the eve of Monday",
        arabic: " باكر ليلة الأثنين ",
      };
    case "MondayEveThirdHour":
      return {
        english: "Third Hour of the eve of Monday",
        arabic: " الساعة الثالثة من ليلة الأثنين ",
      };
    case "MondayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Monday",
        arabic: " الساعة السادسة من ليلة الأثنين ",
      };

    case "MondayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Monday",
        arabic: " الساعة التاسعة من ليلة الأثنين ",
      };
    case "MondayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Monday",
        arabic: " الساعة الحادية عشر من ليلة الأثنين",
      };
    //MondayDay
    case "MondayDayFirstHour":
      return {
        english: "First Hour of Monday",
        arabic: " باكر يوم الأثنين ",
      };
    case "MondayDayThirdHour":
      return {
        english: "Third Hour of Monday",
        arabic: " الساعة الثالثة من يوم الأثنين ",
      };
    case "MondayDaySixthHour":
      return {
        english: "Sixth Hour of Monday",
        arabic: " الساعة السادسة من يوم الأثنين ",
      };

    case "MondayDayNinthHour":
      return {
        english: "Ninth Hour of Monday",
        arabic: " الساعة التاسعة من يوم الأثنين ",
      };
    case "MondayDayEleventhHour":
      return {
        english: "Eleventh Hour of Monday",
        arabic: " الساعة الحادية عشر من يوم الأثنين",
      };
    //TuesdayEve
    case "TuesdayEveFirstHour":
      return {
        english: "First Hour of the eve of Tuesday",
        arabic: " باكر ليلة الثلاثاء ",
      };
    case "TuesdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Tuesday",
        arabic: " الساعة الثالثة من ليلة الثلاثاء ",
      };
    case "TuesdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Tuesday",
        arabic: " الساعة السادسة من ليلة الثلاثاء ",
      };

    case "TuesdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Tuesday",
        arabic: " الساعة التاسعة من ليلة الثلاثاء ",
      };
    case "TuesdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Tuesday",
        arabic: " الساعة الحادية عشر من ليلة الثلاثاء",
      };
    //TuesdayDay
    case "TuesdayDayFirstHour":
      return {
        english: "First Hour of Tuesday",
        arabic: " باكر يوم الثلاثاء ",
      };
    case "TuesdayDayThirdHour":
      return {
        english: "Third Hour of Tuesday",
        arabic: " الساعة الثالثة من يوم الثلاثاء ",
      };
    case "TuesdayDaySixthHour":
      return {
        english: "Sixth Hour of Tuesday",
        arabic: " الساعة السادسة من يوم الثلاثاء ",
      };

    case "TuesdayDayNinthHour":
      return {
        english: "Ninth Hour of Tuesday",
        arabic: " الساعة التاسعة من يوم الثلاثاء ",
      };
    case "TuesdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Tuesday",
        arabic: " الساعة الحادية عشر من يوم الثلاثاء",
      };
    //WednesdayEve
    case "WednesdayEveFirstHour":
      return {
        english: "First Hour of the eve of Wednesday",
        arabic: " باكر ليلة الأربعاء ",
      };
    case "WednesdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Wednesday",
        arabic: " الساعة الثالثة من ليلة الأربعاء ",
      };
    case "WednesdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Wednesday",
        arabic: " الساعة السادسة من ليلة الأربعاء ",
      };

    case "WednesdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Wednesday",
        arabic: " الساعة التاسعة من ليلة الأربعاء ",
      };
    case "WednesdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Wednesday",
        arabic: " الساعة الحادية عشر من ليلة الأربعاء",
      };
    //WednesdayDay
    case "WednesdayDayFirstHour":
      return {
        english: "First Hour of Wednesday",
        arabic: " باكر يوم الأربعاء ",
      };
    case "WednesdayDayThirdHour":
      return {
        english: "Third Hour of Wednesday",
        arabic: " الساعة الثالثة من يوم الأربعاء ",
      };
    case "WednesdayDaySixthHour":
      return {
        english: "Sixth Hour of Wednesday",
        arabic: " الساعة السادسة من يوم الأربعاء ",
      };

    case "WednesdayDayNinthHour":
      return {
        english: "Ninth Hour of Wednesday",
        arabic: " الساعة التاسعة من يوم الأربعاء ",
      };
    case "WednesdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Wednesday",
        arabic: " الساعة الحادية عشر من يوم الأربعاء",
      };
    //ThursdayEve
    case "ThursdayEveFirstHour":
      return {
        english: "First Hour of the eve of Covenant Thursday",
        arabic: " باكر ليلة خميس العهد ",
      };
    case "ThursdayEveThirdHour":
      return {
        english: "Third Hour of the eve of Covenant Thursday",
        arabic: " الساعة الثالثة من ليلة خميس العهد ",
      };
    case "ThursdayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Covenant Thursday",
        arabic: " الساعة السادسة من ليلة خميس العهد ",
      };

    case "ThursdayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Covenant Thursday",
        arabic: " الساعة التاسعة من ليلة خميس العهد ",
      };
    case "ThursdayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Covenant Thursday",
        arabic: " الساعة الحادية عشر من ليلة خميس العهد",
      };
    //ThursdayDay
    case "ThursdayDayFirstHour":
      return {
        english: "First Hour of Covenant Thursday",
        arabic: " باكر يوم خميس العهد ",
      };
    case "ThursdayDayThirdHour":
      return {
        english: "Third Hour of Covenant Thursday",
        arabic: " الساعة الثالثة من يوم خميس العهد ",
      };
    case "ThursdayDaySixthHour":
      return {
        english: "Sixth Hour of Covenant Thursday",
        arabic: " الساعة السادسة من يوم خميس العهد ",
      };

    case "ThursdayDayNinthHour":
      return {
        english: "Ninth Hour of Covenant Thursday",
        arabic: " الساعة التاسعة من يوم خميس العهد ",
      };
    case "ThursdayDayEleventhHour":
      return {
        english: "Eleventh Hour of Covenant Thursday",
        arabic: " الساعة الحادية عشر من يوم خميس العهد",
      };
    //FridayEve
    case "FridayEveFirstHour":
      return {
        english: "First Hour of the eve of Good Friday",
        arabic: " باكر ليلة الجمعة العظيمة ",
      };
    case "FridayEveThirdHour":
      return {
        english: "Third Hour of the eve of Good Friday",
        arabic: " الساعة الثالثة من ليلة الجمعة العظيمة ",
      };
    case "FridayEveSixthHour":
      return {
        english: "Sixth Hour of the eve of Good Friday",
        arabic: " الساعة السادسة من ليلة الجمعة العظيمة ",
      };

    case "FridayEveNinthHour":
      return {
        english: "Ninth Hour of the eve of Good Friday",
        arabic: " الساعة التاسعة من ليلة الجمعة العظيمة ",
      };
    case "FridayEveEleventhHour":
      return {
        english: "Eleventh Hour of the eve of Good Friday",
        arabic: " الساعة الحادية عشر من ليلة الجمعة العظيمة",
      };
    //FridayDay
    case "FridayDayFirstHour":
      return {
        english: "First Hour of Good Friday",
        arabic: " باكر يوم الجمعة العظيمة ",
      };
    case "FridayDayThirdHour":
      return {
        english: "Third Hour of Good Friday",
        arabic: " الساعة الثالثة من يوم الجمعة العظيمة ",
      };
    case "FridayDaySixthHour":
      return {
        english: "Sixth Hour of Good Friday",
        arabic: " الساعة السادسة من يوم الجمعة العظيمة ",
      };

    case "FridayDayNinthHour":
      return {
        english: "Ninth Hour of Good Friday",
        arabic: " الساعة التاسعة من يوم الجمعة العظيمة ",
      };
    case "FridayDayEleventhHour":
      return {
        english: "Eleventh Hour of Good Friday",
        arabic: " الساعة الحادية عشر من يوم الجمعة العظيمة",
      };
    case "FridayDayTwelfthHour":
      return {
        english: "Twelfth Hour of Good Friday",
        arabic: " الساعة الثانية عشر من يوم الجمعة العظيمة",
      };
    case "BrightSaturdayFirstHour":
      return {
        english: "Matins of Bright Saturday",
        arabic: " باكر يوم سبت النور",
      };
  }
};

export const REPLACEPROPHETS = (prophet) => {
  switch (prophet) {
    case "Genesis":
      return {
        english: " The book of Genesis of Moses",
        coptic: " `pjwm `n;Genecic `nte Mw`ucic",
        arabic: "  سفر التكوين لموسى  ",
        englishcoptic: " Epgom enti-jenesis ente Moysis",
        arabiccoptic: " تيجنسيس انتى موسيس  . ",
      };
    case "Exodus":
      return {
        english: " The book of Exodus of Moses",
        coptic: " `pjwm `nte Pido[odoc `nte Mw`ucic",
        arabic: "  سفر الخروج لموسى  ",
        englishcoptic: " Epgom ente pidoxodos ente Moysis",
        arabiccoptic: " إبجوم انتى ذوكصوذوس انتى موسيس  . ",
      };
    case "Leviticus":
      return {
        english: " The book of Leviticus of Moses",
        coptic: " `pjwm nte piLeuitikon `nte Mw`ucic",
        arabic: "  سفر اللاويين لموسى  ",
        englishcoptic: " Epgom ente pi-levitikon ente Moysis",
        arabiccoptic: " إبجوم انتى بيليفيتيكون انتى موسيس  . ",
      };
    case "Numbers":
      return {
        english: " The book of Numbers of Moses",
        coptic: " `pjwm `nte pi`ariqmoc`nte Mw`ucic",
        arabic: "  سفر العدد لموسى  ",
        englishcoptic: " Epgom ente pi-arithmos ente Moysis",
        arabiccoptic: " إبجوم انتى بي اريثموس انتى موسيس  . ",
      };
    case "Deuterodasnomy":
      return {
        english: " The book of Deuteronomy of Moses",
        coptic: " `pjwm nte Pideuteronomion `nte Mw`ucic",
        arabic: "  سفر التثنية لموسى  ",
        englishcoptic: " Epgom ente Pidet-rono-meyon ente Moysis",
        arabiccoptic: " إبجوم انتى بيديترونوميون انتى موسيس  . ",
      };
    case "Isaiah":
      return {
        english: " Isaiah",
        coptic: "Hcai`hac",
        arabic: "  اشعياء ",
        englishcoptic: " Isa-eyas",
        arabiccoptic: " ايسائياس . ",
      };
    case "Jeremiah":
      return {
        english: " Jeremiah",
        coptic: "Iermiac",
        arabic: "  إرميا ",
        englishcoptic: " Yermeyas",
        arabiccoptic: " إريمياس",
      };
    case "Lamentations":
      return {
        english: " The Lamentations of Jeremiah",
        coptic: " qrinoi Iermiac",
        arabic: "مراثي إرميا ",
        englishcoptic: " Ethri-noi Yermeyas ",
        arabiccoptic: " إثرينوي إريمياس  ",
      };
    case "Wisdom":
      return {
        english: " The book of Wisdom of Solomon",
        coptic: " ;covi`a `nte Colomwn",
        arabic: "  سفر الحكمة لسليمان الحكيم ",
        englishcoptic: " Ti-Sofia ente Solomon ",
        arabiccoptic: " تي سوفياانتى سولومون ",
      };
    case "Proverbs":
      return {
        english: " The Proverbs of Solomon",
        coptic: " niparoimia `nte Colomwn",
        arabic: "  سفر الأمثال لسليمان الحكيم",
        englishcoptic: " ni-paroi-mia ente Solomon",
        arabiccoptic: " ني باروميا انتى سولومون ",
      };
    case "Job":
      return {
        english: " Job",
        coptic: " Iwb pi`qmhi",
        arabic: "  أيوب الصديق ",
        englishcoptic: " Yob pi-ethmi",
        arabiccoptic: " يوب بي إثمي",
      };
    case "Zechariah":
      return {
        english: " Zechariah",
        coptic: " Zaxariac",
        arabic: "  زكريا ",
        englishcoptic: " Zakhareyas",
        arabiccoptic: " زخارياس",
      };
    case "Micah":
      return {
        english: " Micah",
        coptic: " Mixeoc",
        arabic: "  ميخا",
        englishcoptic: " Mikhe-os",
        arabiccoptic: " ميخيئوس ",
      };
    case "Amos":
      return {
        english: " Amos",
        coptic: " Amoc",
        arabic: "  عاموس ",
        englishcoptic: " Amos",
        arabiccoptic: " اموس . ",
      };
    case "Joel":
      return {
        english: "Joel",
        coptic: " Iouhl",
        arabic: "  يوئيل ",
        englishcoptic: " Yo-eel",
        arabiccoptic: "يوئيل . ",
      };
    case "Jonah":
      return {
        english: " Jonah ",
        coptic: " Iwna ",
        arabic: "  يونان",
        englishcoptic: " Yona",
        arabiccoptic: "  يونا  ",
      };
    case "Nahum":
      return {
        english: " Nahum",
        coptic: " Naoum",
        arabic: "  ناحوم ",
        englishcoptic: " Na-om",
        arabiccoptic: " ناؤوم ",
      };
    case "Zephaniah":
      return {
        english: "Zephaniah",
        coptic: " Covoniac ",
        arabic: "  صفنيا",
        englishcoptic: " Sofonias",
        arabiccoptic: " صوفونياس ",
      };
    case "Sirach":
      return {
        english: "Joshua the son of Sirach",
        coptic: " Ihcou `p]hri `nCirax",
        arabic: "  يشوع ابن سيراخ  ",
        englishcoptic: " Isou epshiri en-Sirakh ",
        arabiccoptic: " ايسو ابشيري ان سيراخ ",
      };
    case "Malachi":
      return {
        english: " Malachi",
        coptic: " Malaxiac",
        arabic: "  ملاخي ",
        englishcoptic: " Malakheyas",
        arabiccoptic: " مالاخياس",
      };
    case "Hosea":
      return {
        english: "Hosea",
        coptic: " Wci`e",
        arabic: " هوشع ",
        englishcoptic: " Osey-e ",
        arabiccoptic: " اوسيا ",
      };
    case "Kings1":
      return {
        english: "the Book of First Kings",
        coptic: " qmetouro `n a/",
        arabic: "  سفر الملوك الأول ",
        englishcoptic: " ethmetoro en o-weet",
        arabiccoptic: " إثميت أورو ان أوييت",
      };
    case "Ezekiel":
      return {
        english: "Ezekiel",
        coptic: " Iezekihl",
        arabic: "  حزقيال ",
        englishcoptic: " Ezeki-el",
        arabiccoptic: " إزيكييل ",
      };
    case "Daniel":
      return {
        english: "Daniel",
        coptic: " Danihl",
        arabic: "  دانيال ",
        englishcoptic: " Dani-eel",
        arabiccoptic: " دانييل . ",
      };
  }
};
export const REPLACEHOMILYFATHERS = (father) => {
  switch (father) {
    case "Shenouda":
      return {
        english: " Shenouda the Archmandrite",
        coptic: " }enou; pi`arxhman`drithc",
        arabic: " شنودة رئيس المتوحدين  ",
        englishcoptic: " Shenouti pi-Arshi manedretees",
        arabiccoptic: " شينوتي بي أرشي مان ادراتيس  ",
      };
    case "John":
      return {
        english: " John Chrysostom",
        coptic: " Iwannhc pi`xrucoctomoc ",
        arabic: " يوحنا فم الذهب  ",
        englishcoptic: " Youannis pi-Ekhri-zostomos",
        arabiccoptic: " يؤانس بى إخري ذوستوموس",
      };
    case "Severus":
      return {
        english: " Severus",
        coptic: " Ceuhrianoc",
        arabic: " ساويروس",
        englishcoptic: " Severianos",
        arabiccoptic: " سيفيريانوس",
      };
    case "Athanasius":
      return {
        english: " Athanasius the Apostolic",
        coptic: " Aqanacioc pi`apotolikoc",
        arabic: " أثانسيوس الرسولى",
        englishcoptic: " أثانسيوس بى أبوسطوليكوس ",
        arabiccoptic: " Athanasius Pi-Apostolikos",
      };
  }
};

export const REPLACEPOPE = () => {
  return {
    english: bishopsList.POPE.English,
    coptic: bishopsList.POPE.Coptic,
    arabic: bishopsList.POPE.Arabic,
    englishcoptic: bishopsList.POPE.Englishcoptic,
    arabiccoptic: bishopsList.POPE.Arabiccoptic,
  };
};
export const REPLACANTIOCHEPOPE = () => {
  return {
    english: bishopsList.ANTIOCH_POPE.English,
    coptic: bishopsList.ANTIOCH_POPE.Coptic,
    arabic: bishopsList.ANTIOCH_POPE.Arabic,
    englishcoptic: bishopsList.ANTIOCH_POPE.Englishcoptic,
    arabiccoptic: bishopsList.ANTIOCH_POPE.Arabiccoptic,
  };
};
