// currently using skyskanner
// https://developers.skyscanner.net/api/flights-live-pricing


//TODO refresh prices when necessary 

//TODO consider using indicative prices API instead https://developers.skyscanner.net/docs/flights-indicative-prices/overview#tag/FlightsService/operation/FlightsService_PollSearch


const createFlightRequest = async (origin, destination, date) => {
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create', {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799' //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
      },
      body: JSON.stringify({
        query: {
          market: 'US',
          locale: 'en-US',
          currency: 'USD',
          queryLegs: [
            {
              "originPlaceId": {
                "iata": origin, //TODO: 
                //"entityId": "string" //TODO: figure out what the heck this is
              },
              "destinationPlaceId": {
                "iata": destination,
                //"entityId": "string" //TODO: figure out what the heck this is
              },
              "date": date // format: {"year": 0, "month": 0, "day": 0}
            }
          ],
          adults: 1,
          cabinClass: "CABIN_CLASS_ECONOMY",
        }
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

const pollFlightRequest = async (sessionToken) => {
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/' + sessionToken, {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799' //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

const awaitFinalFlightResponse = async (sessionToken) => {
  const pollResponse = await pollFlightRequest(sessionToken);
  //console.log("got pollResponse: ", pollResponse);
  if(pollResponse.status && pollResponse.status == "RESULT_STATUS_COMPLETE"){
    return pollResponse;
  } else {
    return awaitFinalFlightResponse (sessionToken);
  }
}

// TODO switch to using this for live prices
export const getLowestLivePriceForRoute = async (origin, destination, date) => { //TODO: figure out how to make this round trip. Do I just add a second leg?
  const createResponse = await createFlightRequest(origin, destination, date);
  //console.log("createResponse: ", createResponse);
  const sessionToken = createResponse.sessionToken;
  //console.log("sessionToken: ", sessionToken);

  let finalFlightResponse;

  if(sessionToken){ 
    finalFlightResponse = await awaitFinalFlightResponse(sessionToken);
    //console.log("got finalFlightResponse: ", finalFlightResponse);
  } else {
    //console.log("session id was null so we're using createResponse instead of finalFlightResponse")
  }

  return finalFlightResponse || createResponse; //TODO: pull prices from json
}

//TODO actually pull the price from the response and make it round trip
export const getLowestIndicativePriceForRoute = async (origin, destination, date) => {
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/flights/indicative/search', {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799' //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
      },
      body: JSON.stringify({
        query: {
          market: 'US',
          locale: 'en-US',
          currency: 'USD',
          queryLegs: [
            {
              originPlace: {
                queryPlace: {
                  iata: origin
                }
              },
              destinationPlace: {
                queryPlace: {
                  iata: destination
                }
              },
              anytime: true
            }
          ],
          adults: 1,
          cabinClass: "CABIN_CLASS_ECONOMY",
        }
      }),
    });
    const json = await response.json();
    //console.log("got lowest indicative price response: ", json);
    return json;
  } catch (error) {
    console.error(error);
  }
};

async function getCityPricesFromAPIResponse(response){

  //null check deeply nested response
  if(
    !(response && response.content && response.content.groupingOptions 
      && response.content.groupingOptions.byRoute 
      && response.content.groupingOptions.byRoute.quotesGroups)
    || !(response && response.content && response.content.results
      && response.content.results.quotes)
  ){
    return {};
  }
  const quotesGroups = response.content.groupingOptions.byRoute.quotesGroups;
  const quotes = response.content.results.quotes;

  //console.log("quotesGroups: ", quotesGroups);
  //console.log("quotes: ", quotes);

  const citiesWithPrices = await Promise.all(quotesGroups.map(async (group) => {
    const quoteId = group.quoteIds[0]; //TODO null check this and also choose the cheapest in the rare case that theres more than one
    const quote = quotes[quoteId];
    let cityInfo = {};
    cityInfo.placeId = group.destinationPlaceId; //TODO convert this into a city name instead
    cityInfo.price = quote.minPrice.amount; //TODO null check this and also choose the cheapest in the rare case that theres more than one
    const airportCode = quoteId.match(/[A-Z]{3}/g)[1];
    //console.log("airportCode: ", airportCode);
    const cityName = await getCityNameByAirportCode(airportCode);
    cityInfo.title = cityName;
    const photoURI = await getGooglePhotoURIByCityName(cityName);
    cityInfo.imgURL = photoURI;

    return cityInfo;
  }));
  //console.log("citiesWithPrices: ", citiesWithPrices);
  return citiesWithPrices;
}

export const getDestinationsWithPrices = async (origin, date) => { //date ignored for now
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/flights/indicative/search', {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799' //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
      },
      body: JSON.stringify({
        query: {
          market: 'US',
          locale: 'en-US',
          currency: 'USD',
          queryLegs: [
            {
              originPlace: {
                queryPlace: {
                  iata: origin
                }
              },
              destinationPlace: {
                anywhere: true
              },
              anytime: true
            }, 
            { //this is an attempt to make it round trip. Figure out if this is right
              originPlace: {
                anywhere: true
              },
              destinationPlace: {
                queryPlace: {
                  iata: origin
                }
              },
              anytime: true
            }
          ],
          adults: 1,
          cabinClass: "CABIN_CLASS_ECONOMY",
        }
      }),
    });
    const json = await response.json();
    //console.log("got destination with price response: ", json);
    const cityPricesFromAPIResponse = await getCityPricesFromAPIResponse(json);
    return cityPricesFromAPIResponse;
  } catch (error) {
    console.error(error);
  }
};

const getCityNameByAirportCode = async (airportCode) => {
  const cityObj = await getCityByAirportCode(airportCode);
  const cityAndCountryName = cityObj.cityName + ", " + cityObj.countryName;
  return cityAndCountryName;
}

const getCityByAirportCode = async (airportCode) => {
  const suggestionArray = await getCitySuggestionsByAirportCode(airportCode);
  const suggestedCities = suggestionArray.places;
  let cityObj = {};
  suggestedCities.forEach((suggestedCity) => {
    if (suggestedCity.iataCode == airportCode) {
      cityObj = suggestedCity;
    }
  });
  //console.log("found matching city for ", airportCode, ": ", cityObj);
  return cityObj;
}

const getCitySuggestionsByAirportCode = async (airportCode) => { //date ignored for now
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights', {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799', //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          market: 'US',
          locale: 'en-US',
          currency: 'USD',
          includedEntityTypes: ["PLACE_TYPE_AIRPORT"],
          searchTerm: airportCode,
        }
      }),
    });
    const json = await response.json();
    //console.log("got response from autosuggest: ", json);
    return json;
  } catch (error) {
    console.error(error);
  }
};


export const getAutocompleteAirportSuggestions = async (searchTerm) => { //date ignored for now
  try {
    const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights', {
      method: 'POST',
      headers: {
        'x-api-key': 'sh428739766321522266746152871799', //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          market: 'US',
          locale: 'en-US',
          searchTerm: searchTerm,
          includedEntityTypes: ['PLACE_TYPE_AIRPORT'], //TODO: consider adding city as a place type. if so, change the dropdown to not expect iata codes and make sure this works as an input to the flight search
        },
        limit: 5,
      }),
    });
    const json = await response.json();
    return json.places; //TODO: null check
  } catch (error) {
    console.error(error);
  }
};


/*const getGooglePlaceByCityName = async (cityName) => { //date ignored for now
  try {
    const response = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      method: 'POST',
      headers: {
        'x-api-key': 'AIzaSyCtt9eMKTe8717V_vJyiAkqPLIUXdXUbF0', //TODO: replace with real API key, this is the public one https://developers.skyscanner.net/docs/getting-started/authentication
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: cityName,
        types: '(cities)',
        key: 'AIzaSyCtt9eMKTe8717V_vJyiAkqPLIUXdXUbF0',
      }),
    });
    const json = await response.json();
    console.log("got google places: ", json);
    return json;
  } catch (error) {
    console.error(error);
  }
};*/

const getGooglePlacePredictionByCityName = async (cityName) => { //date ignored for now
  try {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' 
      + cityName
      + '&types=(cities)&key='
      + 'AIzaSyCtt9eMKTe8717V_vJyiAkqPLIUXdXUbF0', {
      method: 'POST',
    });
    const json = await response.json();
    //console.log("got google place predictions: ", json);
    return json.predictions[0]; //TODO: for now, just assume the first one is right. it might not be. fix this
  } catch (error) {
    console.error(error);
  }
};

const getGooglePlaceById = async (placeId) => {
  try {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/details/json?place_id=' 
      + placeId
      + '&fields=photo&key='
      + 'AIzaSyCtt9eMKTe8717V_vJyiAkqPLIUXdXUbF0', {
      method: 'POST',
    });
    const json = await response.json();
    //console.log("got google place by id: ", json);
    return json; //TODO: for now, just assume the first one is right. it might not be. fix this
  } catch (error) {
    console.error(error);
  }
}

const constructGooglePhotoURI = (photoId) => {
  return (
    'https://maps.googleapis.com/maps/api/place/photo?maxheight=1599&photo_reference=' 
    + photoId
    + '&key='
    + 'AIzaSyCtt9eMKTe8717V_vJyiAkqPLIUXdXUbF0'
  );
}

const sortPhotoArrayBySize = (photoArray) => {
  return photoArray.sort((a, b) => {
    const heightA = a.height; // ignore upper and lowercase
    const heightB = b.height; // ignore upper and lowercase
    if (heightA > heightB) {
      return -1;
    }
    if (heightA < heightB) {
      return 1;
    }

    return 0;
  });
}

// for now just filter out photos that are too small
const filterPhotoArray = (photoArray) => {
  return photoArray.filter((photo) => {
    return photo.height > 1200;
  });
}

const getGooglePhotoURIByCityName = async (cityName) => {
  let photo = null;
  const predictedPlace = await getGooglePlacePredictionByCityName(cityName);
  //console.log("got predictedPlace for ", cityName, ": ", predictedPlace);
  if(predictedPlace && predictedPlace.place_id) {
    const googlePlaceObj = await getGooglePlaceById(predictedPlace.place_id);
    //console.log("got googlePlaceObj for ", cityName, ": ", googlePlaceObj);
    const filteredPhotoArray = filterPhotoArray(googlePlaceObj.result.photos);
    //console.log("filteredPhotoArray for ", cityName, ": ", filteredPhotoArray);
    //console.log("photoreference: ", filteredPhotoArray[0].photo_reference);
    if(googlePlaceObj && googlePlaceObj.result && googlePlaceObj.result.photos && googlePlaceObj.result.photos[0] && googlePlaceObj.result.photos[0].photo_reference){
      const photoURI = constructGooglePhotoURI(googlePlaceObj.result.photos[0].photo_reference);
      //console.log("constructed google photo URI for ", cityName, ": ", photoURI);
      return photoURI;
    }
  }

  return photo;
}







