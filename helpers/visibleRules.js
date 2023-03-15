import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { getSeason } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";

import {
  getCurrentSeason,
  isInFast,
  getCopticFastsFeasts,
} from "../helpers/copticMonthsHelper.js";

function VisibleRules() {
  const fastsFeasts = getCopticFastsFeasts();
  const today = moment();
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  function FirstVisible() {
    return true;
  }

  const TennavRule = () => {
    var Kiahk = fastsFeasts.find((element) => element.key === "NATIVITY_FAST");
    var Resurrection = fastsFeasts.find(
      (element) => element.key === "RESURRECTION"
    );
    var PENTECOST = fastsFeasts.find((element) => element.key === "PENTECOST");
    if (todayPrayer) {
      if (today.isBetween(Resurrection.start, PENTECOST.start)) {
        return true;
      } else if (today.isBetween(PENTECOST.start, Kiahk.start)) {
        if (today.day() === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const SundayThetokiaWeekdaysPraisesRule = () => {
    if (todayPrayer) {
      if (today.day() != 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const data = [
    { rule: "TennavRule", visible: TennavRule() },
    {
      rule: "SundayThetokiaWeekdaysPraisesRule",
      visible: SundayThetokiaWeekdaysPraisesRule(),
    },
    { rule: 0, visible: true },
  ];
  return data;
}
export default VisibleRules;
