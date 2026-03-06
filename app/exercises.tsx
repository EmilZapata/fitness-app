import ExerciseCardSkeleton from "@components/exercise-card-skeleton";
import ExerciseList from "@components/exercise-list";
import { useApiBodyPart } from "@core/hooks/api/rapid/body-part.hook";
import { hp, wp } from "@core/utils/percentage-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

export default function Exercises() {
  const router = useRouter();
  const { t } = useTranslation();
  const item = useLocalSearchParams<{ name: string; image: any }>();
  const hasParams = !!item.name;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useApiBodyPart(hasParams ? item.name : "");

  useEffect(() => {
    if (!hasParams) {
      handleGoBack();
      return;
    }
    if (!isLoading && !data) {
      handleGoBack();
    }
  }, [hasParams, isLoading, data]);

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

      {/* Exercises */}
      <View className="mx-4 space-y-3 mt-2">
        <Text
          style={{ fontSize: hp(3) }}
          className="font-semibold text-neutral-700"
        >
          {t("exercises.title", { bodyPart: item?.name?.charAt(0).toUpperCase() + item?.name?.slice(1) })}
        </Text>
        <View className="mb-10">
          {isLoading ? (
            <ExerciseCardSkeleton />
          ) : (
            <ExerciseList
              data={data ?? []}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
