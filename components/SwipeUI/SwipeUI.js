import React, {useState, useEffect} from 'react';
import TinderCard from 'react-tinder-card';
import { View, Text } from 'react-native';
import Appstyles from '../../App.scss';
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

export default function SwipeUI ({navigation, route})  {
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  //did mount
  useEffect(() => {
    //TODO: write error handling
    getDestinationsWithPrices('SDF', 'MDE', {"year": 2023, "month": 10, "day": 14}).then((response) => {
      console.log("received response in SwipeUI (abbreviated): ", response.slice(0, 5));
      console.log("defaults to compare: ", destinationCards);
      destinationCards = response.slice(0, 10); //TODO: this is because of performance limitations. figure out how to load them 2 at a time or something to avoid this. also make sure to implement the suggestion to kill the card once its off the screen
      setLoading(false); //TODO: write a loading state
    });
  }, []);

  //const currentCard = destinationCards[cardIndex];

  const onSwipe = (direction) => {
    setCardIndex(cardIndex + 1); // TODO: figure out how to do this safely (rather than referencing current state like this)
    console.log('You swiped: ' + direction)
  }

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  const getTitleText = (destination) => {
    let titleText = destination.title;
    // if the city name including the country is too long, just show the city (not the country)
    if(titleText.length > 20){
      titleText = titleText.split(",")[0];
    } 

    // if it's still too long after removing the country, truncate the string and add an elipsis
    if(titleText.length > 20){
      titleText = titleText.substring(0,17) + '...';
    }

    return titleText;
  }

  //TODO: split the city name somewhere else
  return (
    <View style={Appstyles.container}>
      {!loading && destinationCards.map((destination, index) => (
        <TinderCard 
          key={getTitleText(destination)}
          onSwipe={onSwipe} 
          onCardLeftScreen={() => onCardLeftScreen('fooBar')} 
          preventSwipe={['down', 'up']}
        >
          <DestinationCard price={destination.price} title={getTitleText(destination)} imgURL={destination.imgURL || defaultImageURL} />
        </TinderCard>
      ))}
    </View>
  )
};