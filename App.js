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
import { connectAppStore } from 'actions/paymentActions';
import { checkSubscriptionStatus } from 'actions/userActions';
import LoginScreen from 'screens/LoginScreen';
import { IgUserNameContext, useCheckUserLoginIg } from 'modules/instagram/useCheckUserLoginIg';
import Splash from 'components/Splash';

enableScreens();
const Stack = createStackNavigator();

const { store } = configureStore();

export default function App() {
  React.useEffect(() => {
    const init = async () => {
      store.dispatch(getAuthStateAction());
      await store.dispatch(connectAppStore());
      store.dispatch(checkSubscriptionStatus());
    };
    init();
  }, []);
  const { igUserNameContext, igUserNameState } = useCheckUserLoginIg(store);

  if (igUserNameState.isLoading) {
    return <Splash />;
  }

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
                    backgroundColor: Colors.screenBackground,
                    borderBottomWidth: 0,
                    shadowRadius: 0,
                    shadowOffset: {
                      height: 0,
                    },
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                  },
                  headerTitleAlign: 'center',
                  headerHideShadow: true,
                }}
                mode="modal">
                {igUserNameState?.isLogin ? (
                  <>
                    <Stack.Screen
                      name="Root"
                      component={BottomTabNavigator}
                      options={({ route }) => {
                        const routeName =
                          route.state?.routes[route.state.index]?.name ||
                          route.state?.routes[0]?.name ||
                          'Home';
                        if (routeName === 'Home' || routeName === 'Insight') {
                          return { headerShown: false };
                        }
                        return { headerShown: true };
                      }}
                    />
                    <Stack.Screen
                      name="story"
                      component={StoryModal}
                      options={{
                        headerShown: false,
                        cardStyle: {
                          backgroundColor: Colors.screenBackground,
                        },
                      }}
                    />
                    <Stack.Screen name="purchase" component={PurchaseModal} />
                    <Stack.Screen name="search" component={SearchModal} />
                  </>
                ) : (
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                  />
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
