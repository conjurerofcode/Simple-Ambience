import { Audio, AVPlaybackSource } from "expo-av";
import { ImageSourcePropType } from "react-native";

export interface Scape {
  name: string;
  gif: ImageSourcePropType;
  track: AVPlaybackSource;
  bgColor: string;
  prev?: Scape;
  next?: Scape;
  icon: ImageSourcePropType;
}

const fire: Scape = {
  name: "fire",
  gif: require("../assets/fire.webp"),
  track: require("../tracks/fire.wav"),
  bgColor: "rgb(54, 56, 52)",
  icon: require("../assets/fire.png"),
};

const rain: Scape = {
  name: "rain",
  gif: require("../assets/rain.gif"),
  track: require("../tracks/rain.wav"),
  bgColor: "rgb(80, 83, 166)",
  icon: require("../assets/rain.png"),
};

const cave: Scape = {
  name: "cave",
  gif: require("../assets/cave.gif"),
  track: require("../tracks/cave.wav"),
  bgColor: "rgb(43, 17, 44)",
  icon: require("../assets/cave.png"),
};

const forest: Scape = {
  name: "forest",
  gif: require("../assets/forest.gif"),
  track: require("../tracks/forest.wav"),
  bgColor: "rgb(97, 101, 36)",
  icon: require("../assets/forest.png"),
};

const beach: Scape = {
  name: "beach",
  gif: require("../assets/beach.gif"),
  track: require("../tracks/beach.wav"),
  bgColor: "rgb(62, 176, 183)",
  icon: require("../assets/beach.png"),
};

let list = [fire, rain, cave, forest, beach];

for (let i = 0; i < list.length; i++) {
  if (i < list.length) list[i].next = list[i + 1];
  if (i > 0) list[i].prev = list[i - 1];
}

export const scapesList = list;
