/**
 * Created by lincwee on 16/5/13.
 */
import React from 'react';
import Dimensions from 'Dimensions';
import {
    Component,
    AppRegistry,
    ListView,
    Text,
    View,
    ActivityIndicatorIOS,
    TouchableHighlight,
    StyleSheet,
    Image,
    NavigatorIOS
} from 'react-native';

export default class ZHDetailPage extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            newsDetail:'',
            isLoading:true,
            id:this.props.rowID,
        };
      }

    render() {
        var isLoadingFlagView = (!this.state.isLoading) ?
            (
                <View style={{backgroundColor:'#ffffff', flex: 1}}>
                    <Image
                        //style={{width: Dimensions.get('window').width, height: 10}}
                        style={{resizeMode:'contain', width: Dimensions.get('window').width, height: this.state.height / this.state.width * Dimensions.get('window').width}}
                        source={{uri: this.state.newsDetail.image}}/>
                </View>
            )
            :
            ( <ActivityIndicatorIOS style={{flex:1, justifyContent:'center', alignItems:'center'}}
                                    hidden='true' size='large'/>);
        return (
            <View style={{top: 0, left: 0, position: 'absolute', height: Dimensions.get('window').height ,width: Dimensions.get('window').width ,
            justifyContent:'center', alignItems:'center'}}>
                {isLoadingFlagView}
            </View>
        );
    }

    componentDidMount() {
        var url = "http://news-at.zhihu.com/api/4/news/" + this.state.id;
        this._executeQuery(url);

    }

    _executeQuery(query) {
        console.log(query);
        this.setState({isLoading: true});
        fetch(query)
            .then(response => response.json())
            .then(json => {
                this._handleResponse(json);
                console.log(json);
            })
            .catch(error =>
                this.setState({
                    isLoading: false,
                    message: 'bed response' + error
                }));
    }

    _handleResponse(response) {
        if (response) {
            this.setState({
                newsDetail:response,
                isLoading: false
            });
            Image.getSize(response.image, (width, height) => {
                this.setState({width, height});
            });
        }
        console.log('11');
    }
}