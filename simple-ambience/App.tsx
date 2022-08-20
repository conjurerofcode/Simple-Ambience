import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SceneButton } from "./components/SceneButton";
import { Scape, scapesList } from "./constants/Scape";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type LoopFunction = "LOOP" | "CYCLE" | "OFF";

const colorz = [
  "rgb(54, 56, 52)",
  "rgb(80, 83, 166)",
  "rgb(43, 17, 44)",
  "rgb(97, 101, 36)",
  "rgb(62, 176, 183)",
];
export default function App() {
  const [audio, setAudio] = useState<Audio.Sound>(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loopOrCycle, setLoopOrCycle] = useState<LoopFunction>("OFF");

  const currIndex = useSharedValue(0);
  const progress = useSharedValue(0);

  const [bgColor, setBgColor] = useState(colorz[currIndex.value]);

  // const animatedColor = useAnimatedStyle(() => {
  //   const backgroundColor = interpolateColor(
  //     progress.value,
  //     [0, 1],
  //     ["white", "black"]
  //   );
  //   return { backgroundColor };
  // });

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

  const pausePlay = async () => {
    if (isPlaying) {
      await audio.pauseAsync();
    } else {
      await audio.playAsync();
    }
    setIsPlaying((prev) => !prev);
  };

  const bgTransition = async (prevIndex: number, nextIndex: number) => {
    // Animated.timing(progress, {
    //   toValue: 1,
    //   duration: 500
    // }).start();
    console.log(`change colors from index ${prevIndex} to ${nextIndex}`);
  };

  const transition = async (newIndex: number) => {
    await audio.pauseAsync();
    await audio.unloadAsync();
    await audio.loadAsync(scapesList[newIndex].track);
    audio.setIsLoopingAsync(true);
    await audio.playAsync();
    setIsPlaying(true);
  };

  const changeScene = async (newIdx: number) => {
    console.log(progress.value);
    const previousIndex = currIndex.value;
    await bgTransition(previousIndex, newIdx);
    if (newIdx == activeIndex) pausePlay();
    else {
      await setActiveIndex(newIdx);
      currIndex.value = newIdx;
      transition(newIdx);
    }
    console.log(`${scapesList[currIndex.value].bgColor}`);
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

  const rColor = useAnimatedStyle(() => {
    // const backgroundColor = interpolateColor(
    //   progress.value,
    //   [0, 1],
    //   [bgColor, colorz[activeIndex]]
    // );

    return { backgroundColor: colorz[currIndex.value] };
  });
  // const rColor = useAnimatedStyle(() => {
  //   return { backgroundColor: colorz[activeIndex] };
  // });

  return (
    <Animated.View style={[styles.main, rColor]}>
      <Animated.View style={[styles.top]}>
        <Text style={[styles.title]}>Simple Ambience</Text>
        <View style={styles.features}>
          <TouchableOpacity
            style={styles.loopButton}
            onPress={loopCycleHandler}
          >
            {loopOrCycle === "OFF" && (
              <Text style={{ fontSize: 20 }}>Loop / Cycle</Text>
            )}
            {loopOrCycle === "LOOP" && (
              <MaterialIcons name="repeat" size={50} color="black" />
            )}
            {loopOrCycle === "CYCLE" && (
              <MaterialIcons name="queue-play-next" size={50} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.sceneSelection}>
        <SceneButton index={0} scape={scapesList[0]} onPress={changeScene} />
        <SceneButton index={1} scape={scapesList[1]} onPress={changeScene} />
        <SceneButton index={2} scape={scapesList[2]} onPress={changeScene} />
        <SceneButton index={3} scape={scapesList[3]} onPress={changeScene} />
        <SceneButton index={4} scape={scapesList[4]} onPress={changeScene} />
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
    height: "80%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    height: "100%",
    width: "75%",
    fontSize: 50,
    color: "white",
    textAlign: "center",
    top: 100,
  },
  features: {
    width: "100%",
    height: "15%",
    position: "absolute",
    bottom: 0,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    paddingLeft: 10,
  },
  sceneSelection: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    paddingTop: 20,
  },
  loopButton: {
    borderColor: "black",
    borderWidth: 1,
    width: "20%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});
