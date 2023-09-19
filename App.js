import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Appstyles from './App.scss';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HelloWorldHome from './components/HelloWorldHome/HelloWorldHome';
import HelloWorldProfile from './components/HelloWorldProfile/HelloWorldProfile';

const Stack = createNativeStackNavigator();

/*TODO figure out how to style at the App level*/
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HelloWorldHome}
          options={{title: 'Home', headerShown: false}}
        />
        <Stack.Screen name="Profile" component={HelloWorldProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

