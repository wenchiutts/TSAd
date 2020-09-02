import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from 'styled-components/native';

import StoryModal from 'components/StoryModal';
import BottomTabNavigator from 'navigation/BottomTabNavigator';
import PurchaseModal from 'components/PurchaseModal';
import SearchModal from 'components/SearchModal';
import Colors from 'constants/Colors';

enableScreens();
const Stack = createStackNavigator();

export default function App() {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
