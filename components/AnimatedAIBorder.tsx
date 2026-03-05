import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AnimatedAIBorderProps {
  children: React.ReactNode;
}

export default function AnimatedAIBorder({ children }: AnimatedAIBorderProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.glowContainer}>
        <View style={styles.track} />

        <Animated.View style={[styles.rotatingContainer, animatedStyle]}>
          <View style={styles.snakeBlade}>
            <LinearGradient
              colors={[
                "transparent",
                "#34A853", // Green
                "#FBBC05", // Yellow
                "#EA4335", // Red
                "#4285F4", // Blue
              ]}
              locations={[0, 0.4, 0.6, 0.8, 1]}
              start={{ x: 0.3, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        </Animated.View>
      </View>

      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    overflow: "hidden",
    margin: -3,
    backgroundColor: "#1A1A23",
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2C2C38",
    borderRadius: 9999,
  },
  rotatingContainer: {
    position: "absolute",
    width: 2000,
    height: 2000,
    top: "50%",
    left: "50%",
    marginLeft: -1000,
    marginTop: -1000,
  },
  snakeBlade: {
    position: "absolute",
    width: "50%",
    height: "50%",
    top: "50%",
    left: "50%",
  },
  contentContainer: {
    width: "100%",
    zIndex: 1,
  },
});
