import { Platform } from "react-native";

import native from "./index.native";
import web from "./index.web";
console.log("Platform.OS", Platform.OS);
const secureStore = Platform.OS === "web" ? web : native;
export default secureStore;
