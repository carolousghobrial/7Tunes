import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getSeason } from "./SettingsHelpers.js";
import { useState, useEffect } from "react";

function VisibleRules() {
  function FirstVisible() {
    return true;
  }
  function TennavRule() {
    console.log(getSeason());
    return true;
  }
  const data = [
    { rule: "firstVisible", visible: FirstVisible() },
    { rule: "TennavRule", visible: TennavRule() },
    { rule: 0, visible: true },
  ];
  return data;
}
export default VisibleRules;
