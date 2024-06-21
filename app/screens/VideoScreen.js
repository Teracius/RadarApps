import {
  StyleSheet,
  Button,
  View,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import * as ScreenOrientation from "expo-screen-orientation";
import { captureRef, captureScreen } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VideoScreen(props) {
  const navigation = useNavigation();
  const videoScreenShot = useRef();
  const [snapshotImg, setSetsnapshotImg] = useState();
  const [urlVideo, setUrlVideo] = useState();
  const [loaded, setLoaded] = useState(false);

  const [status, setStatus] = React.useState({});
  const [videoInfo, setvideoInfo] = useState("");
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const onfullScreen = useCallback((isFullscreen) => {
    if (isFullscreen) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  });

  const onStateChange = useCallback((state) => {
    console.log(state);
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    storageData();
    setPlaying((prev) => !prev);
  }, []);

  // I was trying to save all the refs pointing in one persisting
  // array, saving the exaact minute and second
  // that de user left the video and show it in other screen, sorted in one
  // list, thoses videos in the exact same point
  // this function do that, but I couldnt put it because of the time that
  // I  had.
  const storageData = async () => {
    // AsyncStorage.clear();
    let time = await playerRef.current.getCurrentTime();
    let videoInfoCurrent = props.route.params.video;
    let key = "timeRefFixed";
    let value = time;
    videoInfoCurrent[key] = value;
    let videoInfoJson = await JSON.stringify(videoInfoCurrent);
    let videosArrayString = [];

    const actualArrayOfVideos = await AsyncStorage.getItem("videos");

    if (actualArrayOfVideos !== null) {
      let obj1 = JSON.parse(actualArrayOfVideos); // los hago json
      const arrayOfactualArrayOfVideos = Object.values(obj1); // los hago objetos
      console.log("el array de jsons videos: ", arrayOfactualArrayOfVideos);
      videosArrayString = [...arrayOfactualArrayOfVideos]; // copio los objetos al arreglo vacio
    }
    videosArrayString.push(videoInfoCurrent);
    console.log(videosArrayString); // meto el video objeto al arreflo
    let jsonVideosArrayString = JSON.stringify(videosArrayString);
    try {
      await AsyncStorage.setItem("videos", jsonVideosArrayString.toString());
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  const snapshot = async () => {
    const result = await captureRef(videoScreenShot, {
      format: "png",
      quality: 0.8,
    });
    console.log(result);
    setSetsnapshotImg(result);

    try {
      // Request device storage access permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Save image to media library
        await MediaLibrary.saveToLibraryAsync(result);

        console.log("Image successfully saved");
      }
    } catch (error) {
      console.log(error);
    }
    Alert.alert("Notificación", "Captura guardada!!!", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const setInfoOfProps = () => {
    setvideoInfo(props.route.params.video);

    // Use this commented line if the videos dont load, the API of youtube
    // have a limited number of calls that we can do per day.
    // console.log(
    //   `https://www.youtube.com/watch?v=${props.route.params.video.id.videoId}`
    // );
    setUrlVideo(
      `https://www.youtube.com/watch?v=${props.route.params.video.id.videoId}`
    );
    setLoaded(true);
  };

  useEffect(() => {
    setInfoOfProps();
  }, []);

  return (
    <View style={{ marginTop: 50 }}>
      {!loaded && (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}

      {loaded && (
        <View>
          <View style={{ alignSelf: "flex-start" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>GO BACK</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              fontStyle: "italic",
              alignSelf: "center",
              margin: 20,
            }}
          >
            Video Player
          </Text>
          <View
            collapsable={false}
            ref={videoScreenShot}
            style={{ alignItems: "center" }}
          >
            <YoutubePlayer
              ref={playerRef}
              height={220}
              width={380}
              play={playing}
              webViewStyle={{ opacity: 0.99, minHeight: 1 }}
              webViewProps={{
                androidHardwareAccelerationDisabled: true,
                renderToHardwareTextureAndroid: true,
                androidLayerType:
                  Platform.OS === "android" && Platform.Version <= 22
                    ? "hardware"
                    : "none",
              }}
              //Usar esta linea si el API de Youtube no funciona
              // videoId={"iee2TATGMyI"}
              // videoId={videoInfo}
              videoId={props.route.params.video.id.videoId}
              onChangeState={onStateChange}
              onFullScreenChange={onfullScreen}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>Link del video actual </Text>
            <Text
              style={{ color: "blue" }}
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${videoInfo}`)
              }
            >
              {urlVideo}
            </Text>
          </View>

          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <TouchableOpacity
              onPress={togglePlaying}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>
                {playing ? "pause" : "play"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={snapshot}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Take Snapshot</Text>
            </TouchableOpacity>
          </View>

          {snapshotImg && (
            <Text style={{ fontSize: 14, alignSelf: "center" }}>
              Snapshot Preview:
            </Text>
          )}
          {snapshotImg && (
            <Image
              resizeMode="contain"
              style={styles.snapshotImg}
              source={{ uri: snapshotImg }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
  buttons: {
    marginTop: 10,
  },

  snapshotImg: {
    width: 400,
    height: 200,
    margin: 5,
    marginBottom: 15,
    alignSelf: "center",
  },

  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#A8C2EE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
