import ImageSlider from "@components/image-slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex flex-1 bg-white space-y-5" edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Punchilne and avatar */}
      <View className="flex-row justify-between items-center mx-5">
        <View className="space-y-2">
          <Text
            style={{ fontSize: hp(4.5) }}
            className="font-bold tracking-wide text-neutral-700"
          >
            Ready to
          </Text>
          <Text
            style={{ fontSize: hp(4.5) }}
            className="font-bold tracking-wide text-rose-500"
          >
            Workout
          </Text>
        </View>
        <View className="flex justify-center items-center space-y-2">
          <Image
            source={require("../assets/images/avatar.png")}
            style={{ width: hp(6), height: hp(6) }}
            className="rounded-full"
          />
          <View
            className="bg-neutral-200 rounded-full flex justify-center items-center border-[3px] border-neutral-300"
            style={{ width: hp(5.5), height: hp(5.5) }}
          >
            <Ionicons name="notifications" size={hp(3)} color="gray" />
          </View>
        </View>
      </View>
      {/* Image slider */}
      <View>
        <ImageSlider />
      </View>
    </SafeAreaView>
  );
}
