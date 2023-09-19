
import { Button, Text, View } from 'react-native';
import Appstyles from '../../App.scss';
import HelloWorldHomeStyles from './HelloWorldHome.scss';

export default function HelloWorldHome({navigation, route}) {
  return (
    <View style={Appstyles.container}>
      <Text style={HelloWorldHomeStyles.text}>Hello World!</Text>
      <Button
        title="Go to Hello World's profile"
        onPress={() =>
          navigation.navigate('Profile', {name: 'Hello World'})
        }
      />
    </View>
    
  );
}