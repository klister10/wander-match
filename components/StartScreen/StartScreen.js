import React, {useState, useEffect} from 'react';
import { Pressable, Text, View, ImageBackground } from 'react-native';
import Appstyles from '../../App.scss';
import StartScreenStyles from './StartScreen.scss';
import AutocompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import { getAutocompleteAirportSuggestions } from '../../services/flightsAPI';
import DateTimePicker from '@react-native-community/datetimepicker';

//const startScreenBackgroundImageURL = "https://static.vecteezy.com/system/resources/thumbnails/006/326/646/small/mountain-and-sunset-sky-landscape-vector.jpg";
//const startScreenBackgroundImageURL = "https://t4.ftcdn.net/jpg/00/96/27/31/360_F_96273179_a5q7KRBEv1hZvZ7IoUpfMnjMQOelOfJo.jpg";
//const startScreenBackgroundImageURL ="https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/sunrise-above-the-clouds-johan-swanepoel.jpg";
//const startScreenBackgroundImageURL = "https://t4.ftcdn.net/jpg/05/67/91/17/360_F_567911774_2P58O0b913j7zdXWaFiKpHAJNsFjbGFH.jpg";
const startScreenBackgroundImageURL = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e19eb6a0-3971-4a62-af97-f3647aabe061/ddfj2u5-5fd8e67a-98a2-43d0-866f-959657c26441.png/v1/fill/w_1024,h_1317,q_80,strp/pink_fluffy_clouds_by_kingoffatcats_ddfj2u5-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTMxNyIsInBhdGgiOiJcL2ZcL2UxOWViNmEwLTM5NzEtNGE2Mi1hZjk3LWYzNjQ3YWFiZTA2MVwvZGRmajJ1NS01ZmQ4ZTY3YS05OGEyLTQzZDAtODY2Zi05NTk2NTdjMjY0NDEucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.YXrhvQql0S-bf2U1WzRlD8-34sr0VRp_t91nAvssiZk";
//const startScreenBackgroundImageURL = "https://t4.ftcdn.net/jpg/05/68/83/55/360_F_568835552_vEedhaosz2dJvqLdvJCVOLGlYERkeHGF.jpg";
const getDefaultDepartureDate = () => { //TODO make this smarter -- aim for sat -> sun
  let date = new Date();
  date.setDate(date.getDate() + 28);
  return date;
}

const getDefaultReturnDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + 35);
  return date;
}

export default function StartScreen({navigation, route}) {
  const [query, setQuery] = useState('');
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [autoCompleteFocused, setAutoCompleteFocused] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(getDefaultDepartureDate());
  const [selectedReturnDate, setSelectedReturnDate] = useState(getDefaultReturnDate());

  console.log("start value for departure date: ", selectedDepartureDate);
  
  const getAirportNameFromItem = (item) => {
    return item.name + " (" + item.iataCode + ")";
  }

  const onQueryChange = async (newQuery) => {
    console.log("query changed: ", newQuery);
    setQuery(newQuery);
    const newData = await getAutocompleteAirportSuggestions(newQuery);
    console.log("got new data: ", newData);
    setAutoCompleteData(newData);
  }

  const onAutocompleteItemSelected = (item) => {
    console.log("in onAutocompleteItemSelected. item: ", item);
    setQuery(getAirportNameFromItem(item));
    setSelectedAirport(item);
  }

  const formatDateForApi = (dateObject) => {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; //add 1 because this is zero based
    const day = dateObject.getDate();
    return {year, month, day};
  }

  const onSubmit = () => {
    console.log("selectedDepartureDate in onSubmit: ", selectedDepartureDate);
    if(selectedAirport){
      navigation.navigate('SwipeUI', { 
        selectedAirport, 
        selectedDepartureDate: formatDateForApi(selectedDepartureDate),  
        selectedReturnDate: formatDateForApi(selectedReturnDate),
      });
    }
  }

  return (
    <ImageBackground 
      source={{uri: startScreenBackgroundImageURL}} 
      style={StartScreenStyles.backgroundImageStyle}
    >
      <View style={Appstyles.container}>
        <AutocompleteInput
          data={autoCompleteData}
          value={query}
          onChangeText={onQueryChange}
          containerStyle={StartScreenStyles.autoCompleteContainer}
          placeholder = "Launching Airport"
          onTextInputFocus = {() => {
            console.log("text input focused");
            setAutoCompleteFocused(true);
          }}
          onTextInputBlur = {() => {
            console.log("text input blurred");
            setAutoCompleteFocused(false);
          }}
          labelExtractor = { getAirportNameFromItem }
          onItemSelected = {onAutocompleteItemSelected}
          listContainerStyle={StartScreenStyles.autoCompleteListContainer}
          hideResults={!autoCompleteFocused}
          flatListProps={{
            //keyExtractor: (item) => item.id,
            //renderItem: ({ item }) => <Text>{item.title}</Text>,
            style: StartScreenStyles.autoCompleteFlatList,
          }}
        />
        <DateTimePicker //TODO: get this to close when a date is selected. consider replacing with date range picker
          onChange={(event, newDate) => {
            console.log("newDate: ", newDate);
            setSelectedDepartureDate(new Date(newDate));
          }}
          value={selectedDepartureDate}
          minimumDate={new Date()}
          style={StartScreenStyles.datePickerTop} //NOTE: this is IOS only
        />
        <Text> - TO - </Text>
        <DateTimePicker //TODO: get this to close when a date is selected. consider replacing with date range picker
          onChange={(event, newDate) => {
            console.log("newDate: ", newDate);
            setSelectedReturnDate(new Date(newDate));
          }}
          value={selectedReturnDate}
          minimumDate={new Date()}
          style={StartScreenStyles.datePickerBottom} //NOTE: this is IOS only
        />

        <Pressable 
          style={StartScreenStyles.startButton}  //TODO: make this a shared component to make all buttons look the same
          onPress={onSubmit}                      //TODO: style this as disabled when the airport code hasn't been filled in
        > 
          <Text style={StartScreenStyles.startButtonText}>{"Start Swiping!"}</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}