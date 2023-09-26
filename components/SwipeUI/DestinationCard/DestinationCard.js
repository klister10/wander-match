import { View, Text, ImageBackground } from 'react-native';
import DestinationCardStyles from './DestinationCard.scss';

const image = {uri: 'https://greecetravelideas.com/wp-content/uploads/2021/01/Parthenon-Athens-min.jpg'};

/*
 <ImageBackground 
    source={image} 
    resizeMode="cover" 
    style={DestinationCardStyles.backgroundImageContainer}
    imageStyle={DestinationCardStyles.backgroundImage}
  >
    <Text style={DestinationCardStyles.title}>{title}</Text>
    <Text style={DestinationCardStyles.price}>${price}</Text>
  </ImageBackground>
*/  

export default function DestinationCard ({price, title, imgURL})  {
  return (
    <View style={DestinationCardStyles.container}>
    <ImageBackground 
      source={{uri: imgURL}}
      style={DestinationCardStyles.imageStyle}
      imageStyle={DestinationCardStyles.backgroundImage}
    >
      <View style={DestinationCardStyles.blurWrap}>
        <ImageBackground 
          source={{uri: imgURL}} 
          blurRadius={20}
          style={DestinationCardStyles.blurImageStyle}
          imageStyle={DestinationCardStyles.backgroundImage}
        >
          <Text style={DestinationCardStyles.title}>{title}</Text>
          <Text style={DestinationCardStyles.price}>${price}</Text>
        </ImageBackground>
      </View>
    </ImageBackground>
     
    </View>
  )
};