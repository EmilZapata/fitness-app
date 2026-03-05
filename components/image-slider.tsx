import { SLIDER_IMAGES } from "@core/constants";
import { Image } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const SLIDER_WIDTH = wp(100);
const ITEM_WIDTH = wp(100);

export default function ImageSlider() {
  return (
    <Carousel
      data={SLIDER_IMAGES}
      loop
      autoPlay
      snapEnabled
      autoPlayInterval={4000}
      width={SLIDER_WIDTH}
      height={hp(25)}
      style={{ display: "flex", alignItems: "center" }}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.875,
        parallaxScrollingOffset: 87.5,
      }}
      renderItem={({ item, animationValue }) => {
        const animatedStyle = useAnimatedStyle(() => {
          const scale = withTiming(
            interpolate(
              animationValue.value,
              [-1, 0, 1],
              [0.85, 1, 0.85], // adyacentes 85%, en foco 100%
            ),
            { duration: 200, easing: Easing.bezier(0, 0, 0.58, 1) },
          );
          return {
            opacity: interpolate(
              animationValue.value,
              [-1, 0, 1],
              [0.7, 1, 0.7],
            ),
            transform: [
              {
                scale,
              },
            ],
          };
        });
        return (
          <Animated.View
            style={[{ width: ITEM_WIDTH, height: hp(25) }, animatedStyle]}
          >
            <Image
              source={item}
              style={{
                width: ITEM_WIDTH,
                height: hp(25),
                borderRadius: 30,
                flex: 1,
                resizeMode: "cover",
              }}
            />
          </Animated.View>
        );
      }}
    />
  );
}

// const ItemCard = ({ item, index }, parallaxProps) => {
//   return (
//     <View style={{ width: ITEM_WIDTH, height: hp(25) }}>
//       <ParallaxImage
//         source={item}
//         style={{
//           width: ITEM_WIDTH,
//           height: ITEM_WIDTH * 0.65,
//           borderRadius: 20,
//         }}
//         resizeMode="cover"
//         {...parallaxProps}
//       />
//     </View>
//   );
// };
