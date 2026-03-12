import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface Props {
  rating: number; // Il voto attuale (0-5)
  onRate: (stars: number) => void;
  size?: number;
  gap?: number;
}

const MovieRating = ({ rating, onRate, size = 18, gap = 6 }: Props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onRate(star)}
          style={({ pressed }) => [
            { marginRight: gap, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? "#FFD700" : "#666666"}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default MovieRating;
