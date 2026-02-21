import { BlurView } from "expo-blur";
import { cssInterop } from "nativewind";
import React from "react";
import { ViewProps } from "react-native";

cssInterop(BlurView, { className: "style" });

// it's the interface of the GlassView component so it's the type of the props that the component will receive
interface GlassViewProps extends ViewProps {
  intensity?: number; // the number of the intensity of the glass
  tint?: "light" | "dark" | "default"; // the tint of the glass
}

const GlassView = ({
  children,
  style,
  intensity = 50,
  tint = "dark",
  ...props
}: GlassViewProps) => {
  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={style}
      {...(props as any)}
    >
      {children}
    </BlurView>
  );
};

export default GlassView;
