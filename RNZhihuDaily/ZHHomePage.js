/**
 * Created by lincwee on 16/5/11.
 */

'use strict';
import React from 'react';
import ZHHeaderScrollView from './View/ZHHeaderScollView';
import Dimensions from 'Dimensions';
import {
    Component,
    AppRegistry,
    ListView,
    Text,
    View,
    ActivityIndicatorIOS,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

var styles = StyleSheet.create({});

export default class ZHHomePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // 初始状态
        this.state = {
            listDataSource: dataSource.cloneWithRows(['row1', 'row2']),
            listTopStoriesSource: [],
            isLoading: true,
        };

    }

    componentDidMount() {
        this._executeQuery("http://news-at.zhihu.com/api/4/news/latest");
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
                listDataSource: this.state.listDataSource.cloneWithRows(response.stories),
                listTopStoriesSource: response.top_stories,
                isLoading: false
            });
        }
        console.log('11');
    }

    renderRow(rowData, sectionID, rowID) {

        return (
            <TouchableHighlight >
                <View
                    style={{height:80, backgroundColor:'#ffffff', borderBottomColor:'#333333', borderBottomWidth:0.3}}>
                    <Text>
                        {rowData.title}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    renderHeader() {
        return (
            <ZHHeaderScrollView
                width={300}
                height={200}
                imageDataSource={this.state.listTopStoriesSource}>
            </ZHHeaderScrollView>
        )
    }

    rowPressed(rowID) {

    }

    render() {
        var isLoadingFlagView = (!this.state.isLoading) ?
            (
                <ListView
                          dataSource={this.state.listDataSource}
                          renderRow={this.renderRow.bind(this)}
                          renderHeader={this.renderHeader.bind(this)}
                />
            )
            :
            ( <ActivityIndicatorIOS style={{flex:1, justifyContent:'center', alignItems:'center'}}
                                    hidden='true' size='large'/>);
        return (
            <View style={{width: Dimensions.get('window').width ,flex:1 ,justifyContent:'center', alignItems:'center'}}>
                {isLoadingFlagView}
            </View>
        );
    }
}

AppRegistry.registerComponent('ZHHomePage', () => ZHHomePage);
