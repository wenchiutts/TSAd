import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from 'screens/LoginScreen';
import InsLoginScreen from 'screens/InsLoginScreen';
import BackButton from 'components/header/BackButton';
import Colors from 'constants/Colors';

const Stack = createStackNavigator();

const LoginStack = ({ navigation, route }) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: Colors.screenBackground,
          borderBottomWidth: 0,
          shadowRadius: 0,
          shadowOffset: {
            height: 0,
          },
        },
        headerTintColor: Colors.primary.lightBlue,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="InsLogin"
        component={InsLoginScreen}
        options={{
          title: 'Login',
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;