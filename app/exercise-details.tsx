import { Exercise } from "@core/toolbox/interfaces/exercise.interface";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function ExerciseDetails() {
  const { item: itemJson } = useLocalSearchParams<{ item: string }>();
  const item: Exercise = JSON.parse(itemJson);
  console.log("🚀 ~ ExerciseDetails ~ item:", item);

  return (
    <View>
      <Text>ExerciseDetails</Text>
    </View>
  );
}
