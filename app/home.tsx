import BodyParts from "@components/body-parts";
import ImageSlider from "@components/image-slider";
import { userPreferences } from "@core/storage/user-preferences";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    userPreferences.setLanguage(newLang);
  };

  return (
    <SafeAreaView className="flex flex-1 bg-white space-y-5" edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Punchline and avatar */}
      <View className="flex-row justify-between items-center mx-5">
        <View className="space-y-2">
          <Text
            style={{ fontSize: hp(4.5) }}
            className="font-bold tracking-wide text-neutral-700"
          >
            {t("home.readyTo")}
          </Text>
          <Text
            style={{ fontSize: hp(4.5) }}
            className="font-bold tracking-wide text-rose-500"
          >
            {t("home.workout")}
          </Text>
        </View>
        <View className="flex justify-center items-center space-y-2">
          <Image
            source={require("../assets/images/avatar.webp")}
            style={{ width: hp(6), height: hp(6) }}
            className="rounded-full"
          />
          <TouchableOpacity
            onPress={toggleLanguage}
            className="bg-neutral-200 rounded-full flex justify-center items-center border-[3px] border-neutral-300"
            style={{ width: hp(5.5), height: hp(5.5) }}
          >
            <Text
              style={{ fontSize: hp(1.8) }}
              className="font-bold text-neutral-600 uppercase"
            >
              {i18n.language === "en" ? "ES" : "EN"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Image slider */}
      <View>
        <ImageSlider />
      </View>

      {/* Body parts list */}
      <View className="flex-1">
        <BodyParts />
      </View>
    </SafeAreaView>
  );
}
