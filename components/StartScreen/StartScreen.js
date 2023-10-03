import React, {useState, useEffect} from 'react';
import { Button, Text, View } from 'react-native';
import Appstyles from '../../App.scss';
import StartScreenStyles from './StartScreen.scss';
import AutocompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import { getAutocompleteAirportSuggestions } from '../../services/flightsAPI';

export default function StartScreen({navigation, route}) {
  const [query, setQuery] = useState('');
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [autoCompleteFocused, setAutoCompleteFocused] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);

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

  return (
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
      <Button
        title="Start Swiping!"
        onPress={() => {
            if(selectedAirport){
              navigation.navigate('SwipeUI', { selectedAirport });
            }
          }
        }
      />
    </View>
  );
}