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
import LoginScreen from 'screens/LoginScreen';
import { IgUserNameContext, useCheckUserLoginIg } from 'modules/instagram/useCheckUserLoginIg';

enableScreens();
const Stack = createStackNavigator();

const { store } = configureStore();

export default function App() {
  React.useEffect(() => {
    store.dispatch(getAuthStateAction());
  }, []);
  const { igUserNameContext, igUserNameState } = useCheckUserLoginIg(store);

  return (
    <Provider store={store}>
      <ThemeProvider theme={Colors}>
        <IgUserNameContext.Provider value={igUserNameContext}>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    borderBottomWidth: 0,
                    shadowRadius: 0,
                    shadowOffset: {
                      height: 0,
                    },
                  },
                  headerTransparent: true,
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                  },
                  headerTitleAlign: 'center',
                  headerHideShadow: true,
                }}
                mode="modal">
                {igUserNameState?.username !== undefined ? (
                  <>
                    <Stack.Screen name="Root" component={BottomTabNavigator} />
                    <Stack.Screen name="story" component={StoryModal} />
                    <Stack.Screen name="purchase" component={PurchaseModal} />
                    <Stack.Screen name="search" component={SearchModal} />
                  </>
                ) : (
                  <Stack.Screen name="Login" component={LoginScreen} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </IgUserNameContext.Provider>
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
