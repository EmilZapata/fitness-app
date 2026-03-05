import { hp, wp } from "@core/utils/percentage-screen";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const SKELETON_COUNT = 6;

export default function ExerciseCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View
      className="flex-row flex-wrap justify-between"
      style={{ paddingTop: 20 }}
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <View key={index} className="py-3 space-y-2">
          <Animated.View
            className="bg-neutral-300 rounded-[25px]"
            style={{
              width: wp(44),
              height: wp(52),
              opacity,
            }}
          />
          <Animated.View
            className="bg-neutral-300 rounded-lg self-center"
            style={{
              width: wp(30),
              height: hp(1.7),
              marginTop: 8,
              opacity,
            }}
          />
        </View>
      ))}
    </View>
  );
}
