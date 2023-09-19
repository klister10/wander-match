import { Text } from 'react-native';

export default function ProfileScreen ({navigation, route})  {
  return <Text>This is {route.params.name}'s profile</Text>;
};