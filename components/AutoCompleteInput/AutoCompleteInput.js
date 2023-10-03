// originally from https://www.npmjs.com/package/react-native-autocomplete-input
// copied here to fork


import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Pressable, Platform, TouchableOpacity,StyleSheet, Text, TextInput, View, Keyboard } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import AutoCompleteStyle from './AutoCompleteInput.scss';

function defaultKeyExtractor(_, index) {
    return `key-${index}`;
}
function DefaultResultList(props) {
    return <FlatList {...props}/>;
}
function DefaultTextInput(props) {
    return <TextInput {...props}/>;
}
function AutocompleteInputComponent(props, ref) {
    const { data, containerStyle, labelExtractor, hideResults, onItemSelected, placeholder, onTextInputFocus, onTextInputBlur, inputContainerStyle, listContainerStyle, onShowResults, onStartShouldSetResponderCapture = () => false, } = props;
    const isOpen = data.length > 0 && !hideResults;        
    const textInputStyle = isOpen ? AutoCompleteStyle.textInputOpen : AutoCompleteStyle.textInputClosed;
    const defaultRenderItems = ({ item }) => {
        //console.log("in defaultRenderItems. item: ", item);
        let label = item;
        if(labelExtractor){
            label = labelExtractor(item);
        }
        //console.log("label: ", label);
        return (
            <Text 
                style={[AutoCompleteStyle.defaultListItem]}
                onPress={() => {
                    console.log("in onPress. item: ", item);
                    onItemSelected(item);
                    Keyboard.dismiss(); //TODO: make it so it blurs if you tap outside too
                }}
                //onPress={() => this._onPress(item)}
            >
                {String(label)}
            </Text>
        );
    };
    function renderResultList() {
        const { data, renderResultList: renderFunction = DefaultResultList, flatListProps } = props;
        const listProps = {
            data,
            renderItem: defaultRenderItems,
            keyExtractor: defaultKeyExtractor,
            onPress: () => {
                console.log("flatlist pressed");
            },
            keyboardShouldPersistTaps: 'always',
            ...flatListProps,
            removeClippedSubviews: false,
            style: [styles.list, flatListProps?.style],
        };
        return renderFunction(listProps);
    }
    function renderTextInput() {
        const { renderTextInput: renderFunction = DefaultTextInput, style } = props;
        const textProps = {
            ...props,
            onFocus: onTextInputFocus,
            onBlur: onTextInputBlur,
            placeholder: placeholder,
            clearTextOnFocus: true,
            style: [styles.input, style, textInputStyle, AutoCompleteStyle.textInput],
            ref,
        };
        return renderFunction?.(textProps);
    }
    const showResults = data.length > 0;
    onShowResults && onShowResults(showResults);
    const defaultContainerStyle = isOpen ? AutoCompleteStyle.containerOpen : AutoCompleteStyle.containerClosed;
    //TODO: consider a different solution for textInputStyle in case we want to distinguish between the item and its container
    return (<View style={[styles.container, containerStyle, defaultContainerStyle]} onPress={() => {console.log("autocomplete container pressed")}}>
      <View style={[styles.inputContainer, inputContainerStyle, textInputStyle]}>{renderTextInput()}</View>
      {!hideResults && (<View style={listContainerStyle} onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>
          {showResults && renderResultList()}
        </View>)}
    </View>);
}
const border = {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1,
};
const androidStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        paddingLeft: 3,
    },
    inputContainer: {
        ...border,
        marginBottom: 0,
    },
    list: {
        ...border,
        backgroundColor: 'white',
        borderTopWidth: 0,
        margin: 10,
        marginTop: 0,
    },
});
const iosStyles = StyleSheet.create({
    container: {
        zIndex: 1,
    },
    inputContainer: {
        ...border,
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        paddingLeft: 3,
    },
    list: {
        ...border,
        backgroundColor: 'white',
        borderTopWidth: 0,
        left: 0,
        position: 'absolute',
        right: 0,
    },
});
const styles = StyleSheet.create({
    ...Platform.select({
        android: androidStyles,
        ios: iosStyles,
        default: iosStyles,
    }),
});
export const AutocompleteInput = React.forwardRef(AutocompleteInputComponent);
export default AutocompleteInput;
AutocompleteInput.propTypes = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...TextInput.propTypes,
    /**
     * These styles will be applied to the container which
     * surrounds the autocomplete component.
     */
    containerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
    /**
     * Assign an array of data objects which should be
     * rendered in respect to the entered text.
     */
    data: PropTypes.array,
    /**
     * Props which can be applied to result `FlatList`.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    flatListProps: FlatList.propTypes || PropTypes.object,
    /**
     * Set to `true` to hide the suggestion list.
     */
    hideResults: PropTypes.bool,
    /**
     * These styles will be applied to the container which surrounds
     * the textInput component.
     */
    inputContainerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
    /**
     * These style will be applied to the result list.
     */
    listContainerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
    /**
     * `onShowResults` will be called when list is going to
     * show/hide results.
     */
    onShowResults: PropTypes.func,
    /**
     * `onShowResults` will be called when list is going to
     * show/hide results.
     */
    onStartShouldSetResponderCapture: PropTypes.func,
    /**
     * renders custom TextInput. All props passed to this function.
     */
    renderTextInput: PropTypes.func,
    /**
     * renders custom result list. Can be used to replace FlatList.
     * All props passed to this function.
     */
    renderResultList: PropTypes.func,
};