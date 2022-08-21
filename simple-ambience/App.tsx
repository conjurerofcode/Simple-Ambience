import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SceneButton } from "./components/SceneButton";
import { Scape, scapesList } from "./constants/Scape";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { BackgroundColors, InvertedColors } from "./constants/Colors";

import Animated, {
  FadeIn,
  FadeInDown,
  FlipInYRight,
  interpolateColor,
  RotateInDownLeft,
  RotateOutUpRight,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type LoopFunction = "LOOP" | "CYCLE" | "OFF";

// const colorz = [
//   "rgb(54, 56, 52)",
//   "rgb(80, 83, 166)",
//   "rgb(43, 17, 44)",
//   "rgb(97, 101, 36)",
//   "rgb(62, 176, 183)",
// ];
// const fontColorz = [
//   "rgb(201, 199, 203)",
//   "rgb(175, 172, 89)",
//   "rgb(212, 238, 211)",
//   "rgb(158, 154, 219)",
//   "rgb(193, 79, 72)",
// ];
export default function App() {
  const [audio, setAudio] = useState<Audio.Sound>(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loopOrCycle, setLoopOrCycle] = useState<LoopFunction>("OFF");

  const currIndex = useSharedValue(0);
  const progress = useSharedValue(0);

  const [bgColor, setBgColor] = useState([
    BackgroundColors[currIndex.value],
    BackgroundColors[currIndex.value],
  ]);

  const [invertedBgColor, setInvertedBgColor] = useState([
    InvertedColors[currIndex.value],
    InvertedColors[currIndex.value],
  ]);

  let ran = false;
  const init = async () => {
    if (ran === true) return;
    console.log("Initializing track...");
    const { sound } = await Audio.Sound.createAsync(
      scapesList[activeIndex].track
    );
    sound.setIsLoopingAsync(true);
    setAudio(sound);
    ran = true;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(`Active index: ${activeIndex}`);
  }, [activeIndex]);

  const newProgress = useSharedValue(0);
  useEffect(() => {
    console.log(`Background COlor: ${bgColor}`);
    newProgress.value = newProgress.value === 0 ? withTiming(1) : withTiming(0);
  }, [bgColor]);

  const pausePlay = async () => {
    if (isPlaying) {
      await audio.pauseAsync();
    } else {
      await audio.playAsync();
    }
    setIsPlaying((prev) => !prev);
  };

  const transitionBackground = async (prevIndex: number, nextIndex: number) => {
    const colors =
      newProgress.value === 0
        ? [BackgroundColors[prevIndex], BackgroundColors[nextIndex]]
        : [BackgroundColors[nextIndex], BackgroundColors[prevIndex]];

    const invertedColors =
      newProgress.value === 0
        ? [InvertedColors[prevIndex], InvertedColors[nextIndex]]
        : [InvertedColors[nextIndex], InvertedColors[prevIndex]];

    await setBgColor((prev) => [...colors]);
    await setInvertedBgColor((prev) => invertedColors);

    progress.value = withTiming(nextIndex);
    // console.log(`change colors from index ${prevIndex} to ${nextIndex}`);
  };

  const transitionAudio = async (newIndex: number) => {
    await audio.pauseAsync();
    await audio.unloadAsync();
    await audio.loadAsync(scapesList[newIndex].track);
    audio.setIsLoopingAsync(true);
    await audio.playAsync();
    setIsPlaying(true);
  };

  const changeScene = async (newIdx: number) => {
    const previousIndex = currIndex.value;
    await transitionBackground(previousIndex, newIdx);
    if (newIdx == activeIndex) pausePlay();
    else {
      await setActiveIndex(newIdx);
      currIndex.value = newIdx;
      transitionAudio(newIdx);
    }
    //console.log(`${scapesList[currIndex.value].bgColor}`);
  };

  function throttle(cb: Function, delay = 1000) {
    let shouldWait = false;

    return () => {
      if (shouldWait) return;

      cb();
      shouldWait = true;

      setTimeout(() => {
        shouldWait = false;
      }, delay);
    };
  }

  const sceneButtonHandler = (newIndex: number) => {
    throttle(() => {
      changeScene(newIndex);
    });
  };

  const loopCycleHandler = () => {
    switch (loopOrCycle) {
      case "CYCLE":
        setLoopOrCycle((prev) => "LOOP");
        break;
      case "LOOP":
        setLoopOrCycle((prev) => "OFF");
        break;
      case "OFF":
        setLoopOrCycle((prev) => "CYCLE");
        break;
      default:
        break;
    }
  };

  // Source: https://stackoverflow.com/a/54569758
  // function invertHex(hex: string) {
  //   return (Number(`0x1${hex}`) ^ 0xffffff)
  //     .toString(16)
  //     .substring(1)
  //     .toUpperCase();
  // }

  const rColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      newProgress.value,
      [0, 1],
      bgColor
    );

    return { backgroundColor };
  });

  const rInvertedText = useAnimatedStyle(() => {
    const color = interpolateColor(newProgress.value, [0, 1], invertedBgColor);

    return { color };
  });

  const rInvertedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      newProgress.value,
      [0, 1],
      invertedBgColor
    );

    return { backgroundColor };
  });

  return (
    <Animated.View style={[styles.main, rColor]}>
      <Animated.View style={[styles.top]}>
        <Animated.Text
          style={[styles.title, rInvertedText, rColor, { fontSize: 65 }]}
        >
          Simple Ambience
        </Animated.Text>

        <View style={[styles.features]}>
          <Animated.View style={[styles.loopButton, rInvertedColor]}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={loopCycleHandler}
              activeOpacity={1}
            >
              {loopOrCycle === "OFF" && (
                <Animated.View
                  entering={RotateInDownLeft}
                  exiting={RotateOutUpRight}
                >
                  <Text style={{ fontSize: 20 }}>Loop / Cycle</Text>
                </Animated.View>
              )}
              {loopOrCycle === "LOOP" && (
                <Animated.View
                  entering={RotateInDownLeft}
                  exiting={RotateOutUpRight}
                >
                  <MaterialIcons name="repeat" size={50} color="black" />
                </Animated.View>
              )}
              {loopOrCycle === "CYCLE" && (
                <Animated.View
                  entering={RotateInDownLeft}
                  exiting={RotateOutUpRight}
                >
                  <MaterialIcons
                    name="queue-play-next"
                    size={50}
                    color="black"
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.sceneSelection}>
        {scapesList.map((scape, index, arr) => {
          return (
            <SceneButton
              key={index}
              index={index}
              scape={scape}
              onPress={changeScene}
            ></SceneButton>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  top: {
    height: "90%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    position: "absolute",
    height: "100%",
    width: "75%",
    color: "white",
    textAlign: "center",
    top: 100,
    fontWeight: "bold",
  },
  features: {
    width: "100%",
    height: "15%",
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    paddingLeft: 20,
    marginBottom: 10,
  },
  sceneSelection: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingTop: 20,
  },
  loopButton: {
    borderRadius: 500,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
