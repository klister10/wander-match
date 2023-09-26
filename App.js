import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Appstyles from './App.scss';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './components/StartScreen/StartScreen';
import SwipeUI from './components/SwipeUI/SwipeUI';

const Stack = createNativeStackNavigator();

/*TODO figure out how to style at the App level*/
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor: 'white',
      }}>
        <Stack.Screen
          name="Home"
          component={StartScreen}
          options={{title: 'StartScreen', headerShown: false}}
        />
        <Stack.Screen 
          name="SwipeUI" 
          component={SwipeUI} 
          options={{title: "", headerTransparent: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

