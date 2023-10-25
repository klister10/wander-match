import React, {useState, useEffect, useRef} from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import Appstyles from '../../App.scss';
import SavedTripsStyles from './SavedTrips.scss';
import TripCard from './TripCard/TripCard';

export default function SavedTrips ({navigation, route})  {
  const savedTrips =  route.params.savedTrips;
  const selectedDepartureDate = route.params.selectedDepartureDate;
  const selectedReturnDate = route.params.selectedReturnDate;
  const selectedAirportCode = route.params.selectedAirportCode;
  console.log("savedTrips: ", savedTrips);

  const formatDateForDeeplink = (date) => {
    return "" + date.year%100 +  date.month +  date.day;
  }

  const onTripSelected = async (tripIndex) => {
    const selectedTrip = savedTrips[tripIndex];
    console.log("trip selected: ", selectedTrip);

    //TODO: choose between the below two approaches

    //APPROACH 1: show the user flights on the days returned by the API
    //const departureDate = formatDateForDeeplink(selectedTrip.departureDate);
    //const returnDate = formatDateForDeeplink(selectedTrip.returnDate);

    //APPROACH 2: show the user flights on the days they chose
    const departureDate = formatDateForDeeplink(selectedDepartureDate);
    const returnDate = formatDateForDeeplink(selectedReturnDate);

    const url = 'https://www.skyscanner.com/transport/flights/'
                + selectedAirportCode + '/' 
                + selectedTrip.iataCode + '/'
                + departureDate/* formatted like 231114 */ + '/'
                + returnDate /* formatted like 231123 */ 
                + "/'?adultsv2=1&cabinclass=economy&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1"; 
                //TODO generate real monitizable URL and pull from destination card
                // we might have to build full live flight search to enable this
    //TODO: launch URL
    console.log("URL to launch: ", url);
    const supported = await Linking.canOpenURL(url);
    if(supported){
      await Linking.openURL(url);
    } else {
      console.log("could not open URL");
      //TODO handle this error case
    }
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