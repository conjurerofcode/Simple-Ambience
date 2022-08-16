import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SceneButton } from "./components/SceneButton";
import { Scape, scapesList } from "./constants/Scape";
import { Audio } from "expo-av";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const colorz = ["#F44336", "#3F51B5", "#989998", "#4CAF50", "#80CBC4"];
export default function App() {
  const [audio, setAudio] = useState<Audio.Sound>(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const transition = async (newIndex: number) => {
    await audio.pauseAsync();
    await audio.unloadAsync();
    await audio.loadAsync(scapesList[newIndex].track);
    audio.setIsLoopingAsync(true);
    await audio.playAsync();
    setIsPlaying(true);
  };

  const changeScene = async (idx: number) => {
    if (idx == activeIndex) pausePlay();
    else {
      console.log(`Activate: ${idx}`);
      await setActiveIndex(idx);
      transition(idx);
    }
  };

  const rColor = useAnimatedStyle(() => {
    return { backgroundColor: colorz[activeIndex] };
  });

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.top, rColor]}></Animated.View>
      <View style={styles.container}>
        <SceneButton index={0} scape={scapesList[0]} onPress={changeScene} />
        <SceneButton index={1} scape={scapesList[1]} onPress={changeScene} />
        <SceneButton index={2} scape={scapesList[2]} onPress={changeScene} />
        <SceneButton index={3} scape={scapesList[3]} onPress={changeScene} />
        <SceneButton index={4} scape={scapesList[4]} onPress={changeScene} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingTop: 20,
  },
  top: {
    height: "30%",
    width: "100%",
  },
});
