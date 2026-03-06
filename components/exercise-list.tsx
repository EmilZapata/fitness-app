import { Exercise } from "@core/toolbox/interfaces/exercise.interface";
import { hp, wp } from "@core/utils/percentage-screen";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ExerciseListProps {
  data: Exercise[];
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

export default function ExerciseList({
  data,
  onEndReached,
  isFetchingNextPage,
}: ExerciseListProps) {
  const router = useRouter();

  return (
    <View>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.exerciseId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => (
          <ExerciseCard router={router} index={index} item={item} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" className="py-4" />
          ) : null
        }
      />
    </View>
  );
}

const ExerciseCard = ({
  item,
  index,
  router,
}: {
  item: Exercise;
  index: number;
  router: ReturnType<typeof useRouter>;
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400)
        .delay(index * 150)
        .springify()
        .damping(50)}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/exercise-details",
            params: { item: JSON.stringify(item) },
          })
        }
        className="flex py-3 space-y-2"
      >
        <View className="bg-neutral-200 shadow rounded-[25px] overflow-hidden">
          <Image
            source={{ uri: item.gifUrl }}
            contentFit="cover"
            style={{ width: wp(44), height: wp(52) }}
            className="rounded-[25px]"
          />
        </View>

        <Text
          style={{ fontSize: hp(1.7), maxWidth: wp(44) }}
          className="text-neutral-700 font-semibold ml-1 tracking-wide text-center"
        >
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
