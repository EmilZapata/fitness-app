import { Exercise } from "@core/toolbox/interfaces/exercise.interface";
import { hp, wp } from "@core/utils/percentage-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ExerciseDetails() {
  const router = useRouter();
  const { item: itemJson } = useLocalSearchParams<{ item: string }>();
  const item: Exercise = JSON.parse(itemJson);

  const handleGoBack = () => {
    router.canGoBack() ? router.back() : router.push("/home");
  };

  return (
    <View className="flex-1 justify-end bg-black/50">
      <View className="flex-1 mt-12 bg-white rounded-t-[30px] overflow-hidden">
        <View className="shadow-md bg-neutral-200 overflow-hidden rounded-b-[40px]">
          <Image
            source={{ uri: item.gifUrl }}
            contentFit="cover"
            style={{ width: wp(100), height: wp(100) }}
          />
        </View>
        <TouchableOpacity
          onPress={handleGoBack}
          className="mx-2 absolute rounded-full mt-2 right-0"
        >
          <Ionicons name="close-circle" size={hp(4.5)} color="#f43f5e" />
        </TouchableOpacity>

        {/* Details */}
        <ScrollView
          className="mx-4 space-y-2 mt-3"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <Animated.Text
            entering={FadeInDown.duration(300).springify()}
            style={{ fontSize: hp(3.5) }}
            className="font-semibold text-neutral-800 tracking-wide"
          >
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(100).duration(300).springify()}
            style={{ fontSize: hp(2) }}
            className="text-neutral-700 tracking-wide"
          >
            Equipment{" "}
            <Text className="font-bold text-neutral-800">
              {item.equipments}
            </Text>
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(200).duration(300).springify()}
            style={{ fontSize: hp(2) }}
            className="text-neutral-700 tracking-wide"
          >
            Secondary Muscles{" "}
            <Text className="font-bold text-neutral-800">
              {item.secondaryMuscles.join(", ")}
            </Text>
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(300).duration(300).springify()}
            style={{ fontSize: hp(2) }}
            className="text-neutral-700 tracking-wide"
          >
            Target{" "}
            <Text className="font-bold text-neutral-800">
              {item.targetMuscles}
            </Text>
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(400).duration(300).springify()}
            style={{ fontSize: hp(3) }}
            className="font-semibold text-neutral-800 tracking-wide"
          >
            Instructions <Text className="font-bold text-neutral-800"></Text>
          </Animated.Text>
          {item.instructions?.map((instruction, index) => (
            <Animated.Text
              entering={FadeInDown.delay((index + 6) * 100)
                .duration(300)
                .springify()}
              key={index}
              style={{ fontSize: hp(1.7) }}
              className="text-neutral-800 tracking-wide"
            >
              - {instruction}
            </Animated.Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
