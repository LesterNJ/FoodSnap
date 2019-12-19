import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image
} from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
    style={styles.img}
    resizeMode="cover"
    source={require("../assets/images/pizza.jpeg")}>
    <View style={{ flex: 1, flexDirection: "column" }}>
      {/* <Text style={styles.words}>Food</Text> */}
      <View style={styles.container}>
          {/* <View style={styles.header}></View> */}
          <Image style={styles.avatar} source={{uri: 'http://www.lesterdominguez.com/assets/css/images/me.jpg'}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>Lester Dominguez</Text>
              <Text style={styles.info}>FullStack Software Engineer</Text>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Log out</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>

    </View>
    </ImageBackground>
  );
}

HomeScreen.navigationOptions = {
  title: 'Profile Screen',
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTitleStyle: { color: 'green' },
  // header: null,
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center"
  },
  words: {
    flex: 3,
    fontFamily: "space-mono",
    fontSize: 40,
    color: "#fffaf0",
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center",
    marginTop:100
  },
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:250,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00cc66",
  },
});
