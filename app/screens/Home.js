import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [videosArray, setVideosArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();

  const getVideos = async () => {
    setVideosArray([]);
    let url =
      "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBHJ9bpBej4YiObTnyeybAsJ07EGP0J3EY&q=" +
      searchQuery +
      "&type=video&part=snippet";
    await axios
      .get(
        url,
        {
          headers: {
            Accept: "application/json",
            Content_Type: "application/json",
          },
        },
        { timeout: 10000 }
      )
      .then((response) => {
        // console.log("La respuesta es ", response.data);
        setVideosArray(response.data.items);
        setLoaded(true);
      })
      .catch((error) => {
        console.log("El error ", error);
      });
  };

  useEffect(() => {
    getVideos();
  }, []);

  const handleSearch = () => {
    setSearchQuery(searchQuery);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bigTitle}>Lista de Videos</Text>

      <View style={styles.containerSearch}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onPress={() => getVideos()}
        />
      </View>

      {!loaded && (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}

      {loaded && (
        <View style={styles.listContainer}>
          <FlatList
            data={videosArray}
            numColumns={1}
            horizontal={false}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  // onPress={()  => }
                  onPress={() =>
                    navigation.navigate("VideoScreen", { video: item })
                  }
                >
                  <Image
                    source={{
                      uri: item.snippet.thumbnails.default.url,
                    }}
                    style={styles.imageSize}
                  />
                  <Text style={styles.title}>{item.snippet.title}</Text>
                  <Text style={styles.description}>
                    {item.snippet.description}
                  </Text>
                  <Text style={styles.text}>{item.message}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    justifyContent: "center",
  },
  containerSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },

  listContainer: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  box: {
    backgroundColor: "#F7F9F7",
    borderRadius: 5,
    elevation: 7,
    shadowOpacity: "#023efd",
    alignItems: "center",
    height: 270,
    width: "95%",
    justifyContent: "center",
    margin: 10,
    // flexDirection: "row",
    // flex: 1,
  },
  bigTitle: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 25,
    marginTop: 100,
  },
  text: {
    alignItems: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    margin: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    margin: 5,
  },
  imageSize: {
    width: 100,
    height: 100,
    margin: 15,
    borderRadius: 10,
  },
});
