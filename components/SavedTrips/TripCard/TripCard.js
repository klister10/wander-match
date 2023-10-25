import React, {useState, useEffect, useRef} from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import TripCardStyles from './TripCard.scss';

export default function TripCard ({imgURL, price, title, onPress})  {

  //TODO: abstract this and destination card into a single 
  //      component with a modifiable height to reduce code duplication

  //TODO: add backup images to this as well
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={TripCardStyles.container}>
        <ImageBackground 
          source={{uri: imgURL}}
          style={TripCardStyles.backgroundImageWrapper}
          imageStyle={TripCardStyles.backgroundImage}
        >
          <View style={TripCardStyles.blurWrap}>
            <ImageBackground 
              source={{uri: imgURL}} 
              blurRadius={20}
              style={TripCardStyles.blurImageStyle}
              imageStyle={TripCardStyles.backgroundImage}
            >
              <Text style={TripCardStyles.title}>{title}</Text>
              <Text style={TripCardStyles.price}>${price}</Text>
            </ImageBackground>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  )
};