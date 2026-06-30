const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
let config = getDefaultConfig(projectRoot);

config = withNativeWind(config, { input: "./global.css" });

// @clerk/expo ships platform files that call requireNativeModule, which crashes in Expo Go.
// Use the base module with requireOptionalNativeModule so JS-only auth works without a dev build.
const clerkOptionalNativeModule = path.join(
  projectRoot,
  "node_modules/@clerk/expo/dist/specs/NativeClerkModule.js",
);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);

  if (
    resolution?.filePath?.includes(`${path.sep}@clerk${path.sep}expo${path.sep}`) &&
    path.basename(resolution.filePath).startsWith("NativeClerkModule.") &&
    path.basename(resolution.filePath) !== "NativeClerkModule.js"
  ) {
    return { type: "sourceFile", filePath: clerkOptionalNativeModule };
  }

  return resolution;
};

module.exports = config;
