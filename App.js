import React from 'react';
import { Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { Notifications } from 'expo';

import store from './store';
import registerForNotifications from './services/push_notifications';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import ReviewScreen from './screens/ReviewScreen';
import SettingScreen from './screens/SettingScreen';

export default class App extends React.Component {
  componentDidMount() {
    registerForNotifications();
    Notifications.addListener(notification => {
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        Alert.alert('New Push Notification', text, [{ text: 'Ok' }]);
      }
    });
  }

  render() {
    const MainNavigator = TabNavigator(
      {
        welcome: { screen: WelcomeScreen },
        auth: { screen: AuthScreen },
        main: {
          screen: TabNavigator(
            {
              map: { screen: MapScreen },
              deck: { screen: DeckScreen },
              review: {
                screen: StackNavigator({
                  review: { screen: ReviewScreen },
                  setting: { screen: SettingScreen }
                })
              }
            },
            {
              tabBarPosition: 'bottom',
              swipeEnabled: false,
              tabBarOptions: {
                labelStyle: { fontSize: 12 }
              }
            }
          )
        }
      },
      {
        navigationOptions: {
          tabBarVisible: false
        },
        lazy: true
      }
    );

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}
