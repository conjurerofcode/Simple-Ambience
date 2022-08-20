import React, { useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Scape, scapesList } from "../constants/Scape";

interface ButtonProps {
  index: number;
  scape: Scape;
  onPress: Function;
}

export const SceneButton: React.FC<ButtonProps> = ({
  index,
  scape,
  onPress,
}) => {
  const [isActive, setIsActive] = useState(false);

  const pressHandler = () => {
    onPress(index);
  };

  return (
    <Animated.View style={[styles.icon, { backgroundColor: scape.bgColor }]}>
      <TouchableOpacity
        onPress={pressHandler}
        style={[styles.btn]}
        activeOpacity={1}
      >
        <ImageBackground
          style={styles.img}
          source={scape.icon}
        ></ImageBackground>
      </TouchableOpacity>
      {/* <Animated.View style={[styles.shadow]}></Animated.View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  btn: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: "110%",
    width: "110%",
    alignItems: "center",
    justifyContent: "center",
    bottom: 8,
    right: 2,
  },
  shadow: {
    height: "25%",
    width: "25%",
    borderRadius: 5,
    position: "absolute",
    bottom: -5,
    zIndex: -1,
    transform: [{ scaleX: 3 }],
    backgroundColor: "black",
    opacity: 0.75,
  },
});
