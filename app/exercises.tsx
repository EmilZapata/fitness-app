import { useApiBodyPart } from "@core/hooks/api/rapid/body-part.hook";
import { hp, wp } from "@core/utils/percentage-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, StatusBar, TouchableOpacity } from "react-native";

export default function Exercises() {
  const router = useRouter();
  const item = useLocalSearchParams<{ name: string; image: any }>();

  const { data, isLoading } = useApiBodyPart(item.name as string);

  useEffect(() => {
    if (item.name && !isLoading && !data) {
      handleGoBack();
    }
  }, [item.name, isLoading, data]);

  const handleGoBack = () => {
    router.canGoBack() ? router.back() : router.push("/");
  };

  return (
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <Image
        source={item.image}
        style={{ width: wp(100), height: hp(45) }}
        className="rounded-b-[40px]"
      />
      <TouchableOpacity
        onPress={() => handleGoBack()}
        className="bg-rose-500 mx-4 absolute rounded-full flex justify-center pr-1 items-center "
        style={{ height: hp(5.5), width: hp(5.5), marginTop: hp(5) }}
      >
        <Ionicons name="chevron-back-outline" size={hp(4)} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}
