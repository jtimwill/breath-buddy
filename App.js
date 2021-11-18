// Base Animation: https://reactnative.dev/docs/animated#composing-animations
// Loop: https://stackoverflow.com/questions/31578069/repeat-animation-with-new-animated-api
// Stop Loop: https://stackoverflow.com/questions/44022964/how-to-stop-react-native-animation
// Create Coutdown Timer: https://stackoverflow.com/questions/51695887/countdown-timer-in-react-native
// Draw Circle: https://codedaily.io/tutorials/The-Shapes-of-React-Native
// Delay: https://hackernoon.com/react-native-animation-guide-poz31is
// Glow: https://css-tricks.com/how-to-create-neon-text-with-css/
// Timer 2: https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
// Timter 3: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
// ResetAnimVal: https://stackoverflow.com/questions/51712114/how-to-reset-a-react-native-animation
// Animate Color: https://medium.com/wesionary-team/animating-colors-in-react-native-36b637afef02
// General Animation 1: https://medium.com/react-native-training/react-native-animations-using-the-animated-api-ebe8e0669fae
// General Animation 2: https://blog.bitsrc.io/making-animations-in-react-native-the-simplified-guide-6580f961f6e8
// Interpolate: https://codedaily.io/tutorials/Animate-Colors-with-React-Native-Interpolate

import React, { useRef, useState, useEffect } from "react";
import { Provider, Appbar, Text } from "react-native-paper";
import {
  Animated,
  Easing,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";

const App = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const [inhale, setInhale] = useState(1);
  const [exhale, setExhale] = useState(1);
  const [hold, setHold] = useState(1);
  const [gameState, setGameState] = useState("play");
  const [breathState, setBreathState] = useState("exhale");
  const [breathCount, setBreathCount] = useState(0);

  // **************************************** Timer ****************************************
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timeOut;

    if (gameState === "play") {
      const newBreathState = getBreathState(seconds);
      if (breathState !== newBreathState) {
        setBreathState(newBreathState);
        if (newBreathState === "Inhale") inhaleAnimation();
        if (newBreathState === "Stop") stopAnimation();
        if (newBreathState === "Exhale") exhaleAnimation();
      }

      timeOut = setTimeout(() => {
        setSeconds((seconds) => {
          if (seconds <= 0) {
            resetTime();
            setBreathCount(breathCount + 1);
          }
          return seconds - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timeOut);
  }, [gameState, seconds]);
  // **************************************** Timer ****************************************

  const gameMap = {
    play: <Entypo name="controller-paus" size={48} color="#FFFFF0" />,
    stop: <Entypo name="controller-stop" size={48} color="#FFFFF0" />,
    reset: <Entypo name="controller-play" size={48} color="#FFFFF0" />,
  };

  const getBreathState = (currentTime) => {
    if (currentTime > hold + exhale) return "Inhale";

    if (currentTime > exhale) return "Hold";

    return "Exhale";
  };

  const handleButton = () => {
    if (gameState === "play") {
      setGameState("stop");
      stopAnimation();
    }

    if (gameState === "stop") {
      setGameState("reset");
      resetTime();
      setBreathCount(0);
      setBreathState("");
      fadeAnim.setValue(0.5);
    }

    if (gameState === "reset") {
      setGameState("play");
    }
  };

  const inhaleAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: inhale * 1000,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const stopAnimation = () => {
    Animated.timing(fadeAnim).stop();
  };

  const exhaleAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: exhale * 1000,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const resetTime = () => {
    setSeconds(inhale + hold + exhale);
  };

  useEffect(() => {
    setGameState("reset");
    resetTime();
    setBreathState("new");
    fadeAnim.setValue(0.5);
  }, [inhale, hold, exhale]);

  const getColor = fadeAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: ["red", "blue"],
  });

  const getBreathText = () => {
    if (breathState === "Inhale") return "Inhale 👃";
    if (breathState === "Hold") return "Hold 😐";
    if (breathState === "Exhale") return "Exhale 😮";
  };

  return (
    <Provider>
      <Appbar.Header
        style={{ backgroundColor: "#6320EE", borderBottomWidth: 2 }}
      >
        <Appbar.Content
          title="Breathing Buddy"
          titleStyle={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#FFFFF0",
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          {/* <Text style={styles.counter}>{gameState}</Text> */}
          <Text style={styles.counter}>{`Breath Count: ${breathCount}`}</Text>
        </View>
        <View style={styles.ringContainer}>
          {/* <Text>{seconds}s</Text> */}
          <Text style={styles.breathStateText}>
            {gameState === "play" ? getBreathText() : "--"}
          </Text>
          {
            /*(gameState === "play" || gameState === "stop")*/ true && (
              <Animated.View
                style={[
                  /*styles.circle,*/
                  { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
                ]}
              >
                <FontAwesome5
                  name="lungs"
                  size={175}
                  color="#FFB6C1"
                  style={styles.shadowStylesStrong}
                />
              </Animated.View>
            )
          }
        </View>
        <View style={styles.pickerRowContainer}>
          <BreathPicker title={"Inhale"} getter={inhale} setter={setInhale} />
          <BreathPicker title={"Hold"} getter={hold} setter={setHold} />
          <BreathPicker title={"Exhale"} getter={exhale} setter={setExhale} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleButton}
            style={[styles.button, styles.shadowStylesStrong]}
          >
            {gameMap[gameState]}
          </TouchableOpacity>
        </View>
      </View>
      {/* <Appbar style={styles.footer} /> */}
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 4,
    backgroundColor: "#87CEFA",
  },
  countContainer: {
    borderRadius: 4,
    margin: 8,
    flex: 0.5,
    backgroundColor: "#FFFFF0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  ringContainer: {
    flex: 3,
    backgroundColor: "#87CEFA",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerRowContainer: {
    flex: 2,
    backgroundColor: "#87CEFA",
    flexDirection: "row",
    paddingRight: 4,
  },
  pickerContainer: {
    flex: 1,
    margin: 8,
    marginRight: 4,
    backgroundColor: "#FFFFF0",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
  },
  breathStateText: {
    marginBottom: 20,
    fontSize: 30,
    fontWeight: "bold",
  },
  pickerTitleText: {
    marginTop: 5,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "#87CEFA",
  },
  button: {
    margin: 12,
    backgroundColor: "#6320EE",
    borderRadius: 15,
    padding: 5,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "black",
  },
  shadowStylesStrong: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.6,
    shadowRadius: 7.49,

    elevation: 12,
  },

  circle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: "white",
    borderColor: "blue",
    borderWidth: 10,
  },
  footer: {
    backgroundColor: "blue",
  },
  pickerStyle: {
    // backgroundColor: "grey",
    // color: 'black',
    flex: 1,
    fontSize: 25,
    textAlign: "left",
    fontWeight: "bold",
  },
  counter: {
    fontSize: 17,
    fontStyle: "italic",
  },
});

export default App;

// text-shadow:
// 0 0 7px #fff,
// 0 0 10px #fff,
// 0 0 21px #fff,
// 0 0 42px #0fa,
// 0 0 82px #0fa,
// 0 0 92px #0fa,
// 0 0 102px #0fa,
// 0 0 151px #0fa;
// }

const BreathPicker = ({ title, getter, setter }) => {
  const times = [];
  for (let i = 1; i <= 10; ++i) {
    times.push({ label: `${i} sec`, value: i });
  }

  return (
    <View style={[styles.pickerContainer, styles.shadowStylesStrong]}>
      <Text style={styles.pickerTitleText}>{title}</Text>
      <Picker
        style={styles.pickerStyle}
        selectedValue={getter}
        onValueChange={(itemValue, itemIndex) => setter(itemValue)}
      >
        {times.map((time) => (
          <Picker.Item label={time.label} value={time.value} key={time.label} />
        ))}
      </Picker>
    </View>
  );
};
