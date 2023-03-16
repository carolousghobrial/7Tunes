import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { getSeason } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";

import {
  getCurrentSeason,
  isInFast,
  getCopticFastsFeasts,
} from "../helpers/copticMonthsHelper.js";

export const ComeRisenRule = () => {
  const fastsFeasts = getCopticFastsFeasts();
  const today = moment();
  const currentSeason = useSelector((state) => state.settings.currentSeason);
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

export const ROICONCLUSION = () => {
  const fastsFeasts = getCopticFastsFeasts();
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
