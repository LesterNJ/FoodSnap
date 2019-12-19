import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import Environment from '../config/environment';
import firebase from '../config/firebase';
import { Button } from 'react-native-elements';

export default class CameraScreen extends React.Component {
  state = {
    image: null,
    uploading: false,
    googleResponse: null,
    results: [],
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  foodDetails = async (detail, name) => {
    try {
      let data = await fetch(
        'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' +
          detail +
          '&type=f&format=json&api_key='+Environment.USDA_API_KEY
      ).then(food => food.json());
      this.setState({ name: name });
      this.setState({ kcal: data.foods[0].food.nutrients[1].value });
      this.setState({ protein: data.foods[0].food.nutrients[3].value });
      this.setState({ fat: data.foods[0].food.nutrients[4].value });
      this.setState({ carbs: data.foods[0].food.nutrients[6].value })
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let { image } = this.state;
    const { results } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.getStartedContainer}>
          {image ? null : (
            <Text style={styles.getStartedText}>What are you eating?</Text>
          )}
        </View>

        <View style={styles.helpContainer}>
          <Button
            onPress={this._pickImage}
            title="Pick an image from camera roll"
          />

          <Button onPress={this._takePhoto} title="Take a photo" />
          {this.state.kcal ? (
            <View>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.name}
                {'\n'}Energy: {this.state.kcal}kcal{'\n'}Protein:{' '}
                {this.state.protein}g{'\n'} Fat: {this.state.fat}g{'\n'}
                Carbohydrate: {this.state.carbs}
                {'\n'}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          {results.length ? (
            <ScrollView>
              {results.map((results, idx) => (
                <View key={idx}>
                  <Text>
                    <Button
                      onPress={() =>
                        this.foodDetails(results.ndbno, results.name)
                      }
                      title="test"
                    />
                    Description: {results.name}
                    {'\n'}Manufacturer: {results.manu}
                    {'\n'}
                    {'\n'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View>
              {this.state.googleResponse && (
                <FlatList
                  data={this.state.googleResponse.responses[0].labelAnnotations}
                  extraData={this.state}
                  keyExtractor={this._keyExtractor}
                  renderItem={({ item }) => (
                    <View>
                      <Button
                        title={item.description}
                        onPress={() => this.foodList(item.description)}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          )}
          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}
        </View>
      </View>
    );
  }

  organize = array => {
    return array.map(function(item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image, googleResponse } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 20,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => this.submitToGoogle()}
          title="Scan"
        />

        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;

  _renderItem = item => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (error) {
      console.log(error);
      alert('Upload failed, please try again');
    } finally {
      this.setState({ uploading: false });
    }
  };

  foodList = async item => {
    try {
      let data = await fetch(
        'https://api.nal.usda.gov/ndb/search/?format=json&q=' +
          item +
          '&sort=r&max=10&api_key='+Environment.USDA_API_KEY
      ).then(food => food.json());
      this.setState({ results: data.list.item });
      // console.log(this.state.results)
    } catch (error) {
      console.log(error);
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              // { type: 'LANDMARK_DETECTION', maxResults: 5 },
              // { type: 'FACE_DETECTION', maxResults: 5 },
              // { type: 'LOGO_DETECTION', maxResults: 5 },
              // { type: 'TEXT_DETECTION', maxResults: 5 },
              // { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              // { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
              // { type: 'IMAGE_PROPERTIES', maxResults: 5 },
              // { type: 'CROP_HINTS', maxResults: 5 },
              // { type: 'WEB_DETECTION', maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: image,
              },
            },
          },
        ],
      });
      let response = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=' +
          Environment.GOOGLE_CLOUD_VISION_API_KEY,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: body,
        }
      );
      let responseJson = await response.json();
      this.setState({
        googleResponse: responseJson,
        uploading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

CameraScreen.navigationOptions = {
  title: 'Capture',
  // header: null,
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTitleStyle: { color: 'green' },
};

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(error) {
      console.log(error);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});
