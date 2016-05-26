/**
 *
 * Created by lincwee on 16/5/25.
 */
'use strict';

import React from 'react';
import Dimensions from 'Dimensions';
import {
    Component,
    Text,
    View,
    TextInput
} from 'react-native';

export default class TextInputPage extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: 'default text',
            textHeight: 60
        };
    }

    _otherContainerTouched() {
        this.refs.textInput.blur();

    }

    render() {

        return (
            <View
                onStartShouldSetResponder={this._otherContainerTouched.bind(this)}
                style={{top: 0, left: 0, justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff', position: 'absolute', height: Dimensions.get('window').height ,width: Dimensions.get('window').width}}>
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text
                        style={{color: '#000000', height: this.state.textHeight, width: 250, alignSelf:'center', fontSize:16}}
                        allowFontScaling={true}
                        onLayout={event => {
                          console.log(event.nativeEvent.layout.height);
                               this.setState({textHeight: event.nativeEvent.layout.height});
                          }}>
                        {this.state.text}
                    </Text>
                </View>
                <View style={{flex: 1, marginTop:20, alignItems:'center'}}>
                    <TextInput
                        ref='textInput'
                        style={{height:40, width: 250, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                </View>
                <View style={{flex:1}}>

                </View>
            </View>
        );
    }
                    }