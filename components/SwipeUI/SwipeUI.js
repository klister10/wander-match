import React, {useState, useEffect, useRef} from 'react';
import TinderCard from 'react-tinder-card';
import { View, Text, Pressable } from 'react-native';
import Appstyles from '../../App.scss';
import SwipeUIStyles from './SwipeUI.scss';
import DestinationCard from './DestinationCard/DestinationCard';
import { getDestinationsWithPrices } from '../../services/flightsAPI';

let destinationCards = [ //TODO: replace this with real data. meantime move this to a dummy data file
  {title: "Cusco, Peru", price: 1193, imgURL: 'https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20180301163920/iStock-540409466-1024x586.jpg'},
  {title: "Venice, Italy", price: 650, imgURL: 'https://lp-cms-production.imgix.net/2021-06/GettyRF_543346423.jpg'},
  {title: "Athens, Greece", price: 634, imgURL: 'https://greecetravelideas.com/wp-content/uploads/2021/01/Parthenon-Athens-min.jpg'},
  {title: "Barcelona, Spain", price: 507, imgURL: 'https://lp-cms-production.imgix.net/2019-06/8ae1c56041e64517e29372a889f1beb7-la-sagrada-familia.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200'},
  {title: "Bangkok, Thailand", price: 1446, imgURL: 'https://linkstravelandtours.co.uk/wp-content/uploads/2018/12/bangkok-temple-dawn-thailand.jpg'},
  {title: "Hanoi, Vietnam", price: 1702, imgURL: 'https://content.r9cdn.net/rimg/dimg/9f/f9/b80f2b97-city-34211-1648f9bdee7.jpg?width=1366&height=768&xhint=1744&yhint=910&crop=true'},
  {title: "Medellín, Colombia", price: 246, imgURL: 'https://en.casacol.co/wp-content/uploads/sites/3/2021/06/Medellin-Colombia.jpg'},
];

//const defaultImageURL = 'https://en.casacol.co/wp-content/uploads/sites/3/2021/06/Medellin-Colombia.jpg';//TODO: choose a better default
const defaultImageURL = 'https://lh3.googleusercontent.com/places/ANXAkqFLgHGB86IZNGj_6sT26shFPxNm1anQm1aXwQ-T4F7judZtDMvZZR7yrm7TZouaVJHOK5MTcltzQIYX2N1PkRY6d2Z7gIQKRg=s1600-w400';

let savedCards = [];

export default function SwipeUI ({navigation, route})  {
  const selectedAirportCode =  route.params.selectedAirport.iataCode;
  const selectedDepartureDate = route.params.selectedDepartureDate; 
  const selectedReturnDate = route.params.selectedReturnDate;  
  console.log("selectedAirportCode: ", selectedAirportCode);
  console.log("selectedDepartureDate in swipe ui: ", selectedDepartureDate); //TODO figure out why this is loading twice
  
  //TODO: figure out why I need refs to successfully increment this counter
  //const initialCardIndex = 0;
  //const [cardIndex, setCardIndex] = useState(initialCardIndex);
  const cardIndexRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [doneSwiping, setDoneSwiping] = useState(false);

  //did mount
  useEffect(() => {
    //TODO: write error handling
    getDestinationsWithPrices(selectedAirportCode, selectedDepartureDate, selectedReturnDate).then((response) => {
      console.log("pre-sliced response: ", response);
      destinationCards = response.slice(0, 10); //TODO: this is because of performance limitations. figure out how to load them 2 at a time or something to avoid this. also make sure to implement the suggestion to kill the card once its off the screen
      console.log("destinationCards: ", destinationCards);
      setLoading(false); //TODO: write a better UI for the loading state
      cardIndexRef.current = destinationCards.length - 1; //we count down from the last card because the cards are displayed in reverse order
    });
  }, []);

  //const currentCard = destinationCards[cardIndex];

  const onSwipe = (direction) => {
    console.log("in onSwipe. direction: ", direction, ", currentIndex: ", cardIndexRef.current);
    if(direction == "right"){
      console.log("because the direction was right, saving destination: ", destinationCards[cardIndexRef.current]);
      savedCards.push(destinationCards[cardIndexRef.current]);
    }
    console.log("cardIndex: ", cardIndexRef.current, ", destinationCards.length: ", destinationCards.length);
    /*if(cardIndexRef.current >= destinationCards.length - 1){
      setDoneSwiping(true);
    }*/ //we're counting down now
    if(cardIndexRef.current <= 0){
      setDoneSwiping(true);
    }
    incrementCardIndex(); // TODO: figure out how to do this safely (rather than referencing current state like this)
    console.log('You swiped: ' + direction)
  }

  const incrementCardIndex = () => {
    console.log("in incrementCardIndex");
    //setCardIndex(cardIndexRef.current + 1);
    cardIndexRef.current = cardIndexRef.current - 1; //counting down instead of up because cards are displayed in reverse order (they're a stack)
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  const onDoneSwiping = () => {
    console.log("done swiping!");
    //TODO: navigat to a new screen that shows the saved trips
    navigation.navigate('SavedTrips', { 
      savedTrips: savedCards,
    });
  }

  //TODO: split the city name somewhere else
  return (
    <View style={[Appstyles.container, SwipeUIStyles.container]}>
      {!loading && !doneSwiping && destinationCards.map((destination, index) => (
        <TinderCard 
          key={destination.title}
          onSwipe={onSwipe} 
          onCardLeftScreen={() => onCardLeftScreen('fooBar')} 
          preventSwipe={['down', 'up']}
        >
          <DestinationCard price={destination.price} title={destination.title} imgURL={destination.imgURL || defaultImageURL} />
        </TinderCard>
      ))}
      {doneSwiping &&
        <Pressable 
          style={Appstyles.primaryButton}  //TODO: make this a shared component to make all buttons look the same
          onPress={onDoneSwiping}                      //TODO: style this as disabled when the airport code hasn't been filled in
        > 
          <Text style={Appstyles.primaryButtonText}>{"See my Saved Trips"}</Text>
        </Pressable> 
      }
    </View>
  )
};