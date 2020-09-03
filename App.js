import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';

import StoryModal from 'components/StoryModal';
import BottomTabNavigator from 'navigation/BottomTabNavigator';
import PurchaseModal from 'components/PurchaseModal';
import SearchModal from 'components/SearchModal';
import Colors from 'constants/Colors';
import configureStore from 'store/configureStore';
import { getAuthStateAction } from 'modules/auth/authActions';

enableScreens();
const Stack = createStackNavigator();

const { store } = configureStore();

export default function App() {
  React.useEffect(() => {
    store.dispatch(getAuthStateAction());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={Colors}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator mode="modal">
              <Stack.Screen name="Root" component={BottomTabNavigator} />
              <Stack.Screen name="story" component={StoryModal} />
              <Stack.Screen name="purchase" component={PurchaseModal} />
              <Stack.Screen name="search" component={SearchModal} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
