import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableHighlight } from 'react-native';
import { Camera } from 'expo-camera';

export default class CameraScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false
    }
}
  render() {
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
    	<TouchableHighlight style={styles.captureButton}>
        <Button
        title="SNAP"/>
			</TouchableHighlight>
      </Camera>
    </View>
  );
}
}

const styles = StyleSheet.create({
  captureButton: {
    flex: 0,
		marginBottom:30,
		width:110,
		borderRadius:35,
    backgroundColor: "white",
    alignSelf: 'center',
    margin: 50,
    padding: 5,
    paddingHorizontal: 20
	}
});

CameraScreen.navigationOptions = {
  header: null,
};

