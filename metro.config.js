// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);
// config.resolver.unstable_enablePackageExports = false;

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

config.resolver.unstable_conditionNames = ["browser", "require", "react-native"];

module.exports = {
  ...withNativeWind(config, { input: "./src/global.css" }),
};