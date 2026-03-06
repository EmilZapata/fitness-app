import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import "../global.css";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex flex-1 justify-end">
      <StatusBar barStyle="light-content" />
      <Image
        className="h-full w-full absolute"
        source={require("../assets/images/welcome.webp")}
      />
      <LinearGradient
        colors={["transparent", "#18181b"]}
        style={{
          width: wp(100),
          height: hp(70),
        }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        className="flex justify-end pb-12 space-y-8"
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex items-center"
        >
          <Text
            style={{ fontSize: hp(5) }}
            className="text-white font-bold tracking-wide"
          >
            {t("welcome.title")}{" "}
            <Text className="text-rose-500">{t("welcome.highlight")}</Text>
          </Text>
          <Text
            style={{ fontSize: hp(5) }}
            className="text-white font-bold tracking-wide"
          >
            {t("welcome.subtitle")}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity
            onPress={() => router.navigate("/home")}
            style={{ height: hp(7), width: wp(80) }}
            className="bg-rose-500 flex items-center justify-center mx-auto rounded-full border-[1px] border-neutral-200"
          >
            <Text
              style={{ fontSize: hp(3) }}
              className="text-white font-bold tracking-wide"
            >
              {t("welcome.cta")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
