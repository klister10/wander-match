
import { Button, Text, View } from 'react-native';
import Appstyles from '../../App.scss';
import StartScreenStyles from './StartScreen.scss';

export default function StartScreen({navigation, route}) {
  return (
    <View style={Appstyles.container}>
      <Button
        title="Start Swiping!"
        onPress={() =>
          navigation.navigate('SwipeUI', {budget: 600, maxDuration: 12, maxStops: 1})
        }
      />
    </View>
  );
}