import { BODY_PARTS } from "@core/constants";
import { hp, wp } from "@core/utils/percentage-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function BodyParts() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="mx-4">
      <Text
        style={{ fontSize: hp(3) }}
        className="font-semibold text-neutral-700"
      >
        {t("bodyParts.title")}
      </Text>
      <FlatList
        data={BODY_PARTS}
        numColumns={2}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => (
          <BodyPartCard router={router} index={index} item={item} />
        )}
      />
    </View>
  );
}

const BodyPartCard = ({
  item,
  index,
  router,
}: {
  item: (typeof BODY_PARTS)[0];
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
        onPress={() => router.push({ pathname: "/exercises", params: item })}
        style={{ width: wp(44), height: wp(52) }}
        className="flex justify-end p-4 mb-4 rounded-[35px] overflow-hidden"
      >
        <Image
          source={item.image}
          resizeMode="cover"
          style={{ width: wp(44), height: wp(52) }}
          className="rounded-[35px] absolute"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={{ width: wp(44), height: wp(15) }}
          start={{
            x: 0.5,
            y: 0,
          }}
          end={{
            x: 0.5,
            y: 1,
          }}
          className="absolute bottom-0"
        />

        <Text
          style={{ fontSize: hp(2.3) }}
          className="text-white font-semibold text-center tracking-wide"
        >
          {item.name[0].toUpperCase() + item.name.slice(1)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
