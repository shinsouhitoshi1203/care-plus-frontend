const env = {
  _: process.env.EXPO_PUBLIC_NODE_ENV || "development",
  baseAPI: process.env.EXPO_PUBLIC_API_BASE_URL,
};

export default env;
