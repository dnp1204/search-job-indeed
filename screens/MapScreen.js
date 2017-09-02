import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { MapView } from 'expo';
import { Button, Icon, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../actions';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="my-location" size={30} color={tintColor} />;
    }
  };

  state = {
    mapLoaded: false,
    term: ''
  };

  componentDidMount() {
    this.setState({ mapLoaded: true });
    navigator.geolocation.getCurrentPosition(position => {
      const { coords: { longitude, latitude } } = position;
      this.setState({
        region: {
          longitude,
          latitude,
          longitudeDelta: 0.04,
          latitudeDelta: 0.09
        }
      });
    });
  }

  onRegionChangeComplete = region => {
    this.setState({ region });
  };

  onButtonPress = () => {
    const { region, term } = this.state;
    this.props.fetchJobs(region, term, () => {
      this.props.navigation.navigate('deck');
    });
    this.setState({ term: '' });
  };

  onSearchInput = (value) => {
    this.setState({ term: value });
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={this.state.region}
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChangeComplete}
        />
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Job Type..."
            round
            lightTheme
            value={this.state.term}
            containerStyle={styles.searchInput}
            onChangeText={this.onSearchInput}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            large
            title="Search This Area"
            backgroundColor="#009688"
            icon={{ name: 'search' }}
            onPress={this.onButtonPress}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  searchContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0
  },

  searchInput: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    opacity: 0.7,
    height: 40
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  }
};

export default connect(null, actions)(MapScreen);
