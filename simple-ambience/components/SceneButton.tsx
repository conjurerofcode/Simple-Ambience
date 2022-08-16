import React, { useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Scape } from "../constants/Scape";

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
    <Animated.View style={[styles.icon]}>
      <TouchableOpacity onPress={pressHandler} style={styles.btn}>
        {/* <ImageBackground
              style={styles.img}
              source={scape.icon}
            ></ImageBackground> */}
      </TouchableOpacity>
      {/* <Animated.View style={[styles.shadow]}></Animated.View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "blue",
    margin: 5,
  },
  btn: {
    height: "100%",
    width: "100%",
  },
  img: {
    height: "100%",
    width: "100%",
  },
  shadow: {
    height: "25%",
    width: "25%",
    borderRadius: 5,
    position: "absolute",
    bottom: -8,
    zIndex: -1,
    transform: [{ scaleX: 3 }],
    backgroundColor: "black",
  },
});
