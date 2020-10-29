import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Analytics from 'expo-firebase-analytics';

import StoryModal from 'components/StoryModal';
import BottomTabNavigator from 'navigation/BottomTabNavigator';
import PurchaseModal from 'components/PurchaseModal';
import SearchModal from 'components/SearchModal';
import Colors from 'constants/Colors';
import configureStore from 'store/configureStore';
import { getAuthStateAction } from 'modules/auth/authActions';
import { connectAppStore } from 'actions/paymentActions';
import {
  checkSubscriptionStatus,
  updateUserProfile,
  updateLaunchTimesAction,
} from 'actions/userActions';
import LoginStack from 'navigation/LoginStack';
import { IgUserNameContext, useCheckUserLoginIg } from 'modules/instagram/useCheckUserLoginIg';
import Splash from 'components/Splash';

enableScreens();
const Stack = createStackNavigator();

const { store, persistor } = configureStore();

const Root = () => {
  const { igUserNameContext, igUserNameState } = useCheckUserLoginIg(store);
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    const init = async () => {
      const { user } = await store.dispatch(getAuthStateAction());
      store.dispatch(updateUserProfile(user));
      await store.dispatch(connectAppStore());
      store.dispatch(checkSubscriptionStatus());
    };
    init();
    store.dispatch(updateLaunchTimesAction());
  }, []);

  if (igUserNameState.isLoading) {
    return <Splash />;
  }
  return (
    <IgUserNameContext.Provider value={igUserNameContext}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer
          ref={navigationRef}
          onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
          onStateChange={() => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              Analytics.setCurrentScreen(currentRouteName);
            }
            routeNameRef.current = currentRouteName;
          }}
        >
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
            mode="modal"
          >
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
              <Stack.Screen name="Login" component={LoginStack} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </IgUserNameContext.Provider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Splash />} persistor={persistor}>
        <ThemeProvider theme={Colors}>
          <Root />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
