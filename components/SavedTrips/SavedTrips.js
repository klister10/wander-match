import React, {useState, useEffect, useRef} from 'react';
import { View, Text, ScrollView } from 'react-native';
import Appstyles from '../../App.scss';
import SavedTripsStyles from './SavedTrips.scss';
import TripCard from './TripCard/TripCard';

export default function SavedTrips ({navigation, route})  {
  const savedTrips =  route.params.savedTrips;
  console.log("savedTrips: ", savedTrips);

  const onTripSelected = (tripIndex) => {
    const selectedTrip = savedTrips[tripIndex];
    console.log("trip selected: ", selectedTrip);
    const url = null; //TODO pull url from destination card
    //TODO: launch URL
  }

  return (
    <View style={[Appstyles.container, SavedTripsStyles.container]}>
      {/*<View style={SavedTripsStyles.srollViewWrapper}>*/}
      <ScrollView style={SavedTripsStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style = {SavedTripsStyles.spacerView}/>
        {savedTrips && savedTrips.length > 0 && savedTrips.map((trip, index) => (
          <TripCard 
            key={trip.title} //TODO: call getTitleText in the API file
            onPress={() => onTripSelected(index)}
            price={trip.price} 
            title={trip.title} // TODO format like on other card
            imgURL={trip.imgURL} //TODO: add default image url
          />
        ))}
        <View style = {SavedTripsStyles.spacerView}/>
      </ScrollView>
      {/*</View> */}
    </View>
  )
};