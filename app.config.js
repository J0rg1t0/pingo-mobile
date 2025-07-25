export default {
  expo: {
    name: "pingo-mobile",
    slug: "pingo-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["location"],
        NSLocationAlwaysAndWhenInUseUsageDescription: "Este app precisa acessar sua localização em segundo plano para alarmes.",
        NSLocationWhenInUseUsageDescription: "Este app precisa acessar sua localização para alarmes baseados em localização."
      }
    },
    android: {
      package: "com.pingo.mobile", // Obrigatório
      permissions: [
        "ACCESS_BACKGROUND_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.API_KEY_GOOGLE_MAPS, // ou coloque direto a chave
        },
      },
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Permitir que o PinGo acesse sua localização mesmo em segundo plano.",
          isAndroidBackgroundLocationEnabled: true
        }
      ]
    ],
    extra: {
      apiKeyGoogleMaps: process.env.API_KEY_GOOGLE_MAPS,
      eas: {
        projectId: "6cdf472b-eda3-44d0-a6eb-8a79d2399444"      }
    },
  }
};
