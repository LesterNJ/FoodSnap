import React from 'react';
import { SearchBar } from 'react-native-elements';
import { View, Text, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';

export default class SearchScreen extends React.Component {
  state = {
    search: '',
    results: [],
  };

  updateSearch = search => {
    this.setState({ search });
  };

  foodSearch = async item => {
    Keyboard.dismiss()
    try {
      let data = await fetch(
        'https://api.nal.usda.gov/ndb/search/?format=json&q=' +
          item +
          '&sort=r&max=20&api_key='+Environment.USDA_API_KEY
      ).then(food => food.json());
      this.setState({ results: data.list.item });
    } catch (error) {
      console.log(error);
    }
  };

  foodDetails = async (detail, name) => {
    try {
      let data = await fetch(
        'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' +
          detail +
          '&type=f&format=json&api_key='+Environment.USDA_API_KEY
      ).then(food => food.json());
      this.setState({
        name: name,
        kcal: data.foods[0].food.nutrients[1].value,
        protein: data.foods[0].food.nutrients[3].value,
        fat: data.foods[0].food.nutrients[4].value,
        carbs: data.foods[0].food.nutrients[6].value
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { search, results } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <SearchBar
          placeholder="Type your search here..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <Button
          title="Search"
          onPress={() => this.foodSearch(this.state.search)}
        />

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
          <View></View>
        )}
      </View>
    );
  }
}

SearchScreen.navigationOptions = {
  title: 'Search for foods',
  // header: null,
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTitleStyle: { color: 'green' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'red',
  },
  headline: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
});
