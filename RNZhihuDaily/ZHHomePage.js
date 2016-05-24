/**
 * Created by lincwee on 16/5/11.
 */

'use strict';
import React from 'react';
import ZHHeaderScrollView from './View/ZHHeaderScollView';
import ZHDetailPage from './ZHDetailPage';
import ZHDynamicNavigator from './View/ZHDynamicNavigator'
import Dimensions from 'Dimensions';
import {
    Component,
    AppRegistry,
    ListView,
    Text,
    View,
    ActivityIndicatorIOS,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Image,
    NavigatorIOS,
    Navigator,
    Navibar,
} from 'react-native';

var styles = StyleSheet.create({});
var navigatorOriginColor = '#2fc1fd'

export default class ZHHomePage extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状
        this.state = {
            navigatorColor: navigatorOriginColor + '00',
            listViewMetrics: ''
        };
    }

    _updateColor(color) {
        //console.log('updateLog')
        this.setState({
            navigatorColor: color
        });
    }


    _renderScene(router, navigator) {
        var Component = router.component;

        var defaultNaviColor = router.passProps.naviBarColor ? router.passProps.naviBarColor : '#ffffff';
        var ScrollChangeColor = router.isScrollChangeColor ? this.state.navigatorColor : defaultNaviColor;

        var backButton;
        if (router.showBackButton) {
            backButton = (
                <TouchableOpacity onPress={navigator.pop} style={{width:80, height:40, position: 'absolute', left: 10,
                top: 25}}>
                    <Text style={{paddingLeft: 10, fontSize:14, fontWeight:'bold', color: '#ffffff'}}>{'返回'}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View
                style={{position: 'absolute', height: Dimensions.get('window').height ,width: Dimensions.get('window').width}}>
                <Component style={{}} navigator={navigator} {...router.passProps} />
                <View
                    style={{ height: 64, backgroundColor:ScrollChangeColor, justifyContent:'center', flexDirection:'row'}}>
                    {backButton}
                    <View style={{alignSelf:'center'}}>
                        <Text
                            style={{alignSelf:'center', fontSize:16, color:'#ffffff', fontWeight:'bold'}}>{router.title}</Text>
                    </View>
                </View>
            </View>
        );

    }

    render() {

        return (
            <Navigator
                initialRoute={{
                    component:HomePageInit,
                    showBackButton: false,
                    isScrollChangeColor:true,
                    title:'今日热闻',
                    passProps: {
                    updateColor: this._updateColor.bind(this),
                    demo:'123',
                    naviBarColor:navigatorOriginColor,
            }
            }}
                configureScene={(route, routeStack) => Navigator.SceneConfigs.PushFromRight}
                renderScene={this._renderScene.bind(this)}
            />
        );
    }
}


//=========================================================================================
//
//=========================================================================================

export default class HomePageInit extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.listViewHeight = 0;
        this.flag = 0;
        this.mapData = {};
        this.isLoadingMore = false;
        this.latestLoadMoreDate = '';

        // 初始状态
        this.state = {
            listDataSource: dataSource.cloneWithRowsAndSections([['row1', 'row2']]),
            listData: [],
            listTopStoriesSource: [],
            isLoading: true,
            navigator: this.props.navigator,
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
        this.mapData[0] = response.stories;

        //this.mapData = [{response.date : response.stories}];
        this.latestLoadMoreDate = response.date;
        if (response) {
            this.setState({
                listDataSource: this.state.listDataSource.cloneWithRowsAndSections(this.mapData),
                listData: [response],
                listTopStoriesSource: response.top_stories,
                isLoading: false
            });
        }
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight underlayColor='#dddddd' onPress={() => this.rowPressed(rowData)}>
                <View
                    style={{width: Dimensions.get('window').width ,flexDirection:'row' ,height:90, backgroundColor:'#ffffff', borderBottomColor:'#d3d3d3', borderBottomWidth:0.3}}>
                    <Text style={{fontSize: 14, flex: 3, paddingLeft: 10, paddingTop: 10}}>
                        {rowData.title}
                    </Text>
                    <View style={{flex: 1, justifyContent:'center'}}>
                        <Image
                            style={{height: 70 ,resizeMode: Image.resizeMode.contain}}
                            source={{uri: rowData.images[0]}}
                        />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    renderHeader() {

        return (
            <ZHHeaderScrollView
                ref='MyHeaderScrollView'
                width={300}
                height={200}
                imageDataSource={this.state.listTopStoriesSource}>
            </ZHHeaderScrollView>
        )
    }

    renderSectionHeader(sectionData, keyTitle) {
        return(
            <View style={{backgroundColor: navigatorOriginColor, flex: 1, height: 30, justifyContent: 'center'}}>
                <Text style={{color: '#ffffff', fontWeight: 'bold', textAlign: 'center', alignSelf:'center'}}>{this.state.listData[keyTitle].date}</Text>
            </View>
        )
    }

    rowPressed(rowData) {
        this.props.navigator.push({
            component: ZHDetailPage,
            showBackButton: true,

            title: '',
            passProps: {
                rowID: rowData.id,
                naviBarColor: '#00000000'
            }
        })
    }

    handleScroll(event:Object) {
        var sxt = event.nativeEvent.contentOffset.y;
        //navibar color change
        var alpha = '';
        if (sxt >= 0 && sxt <= 300) {
            alpha = ('0' + parseInt((sxt / 300) * 255).toString(16)).slice(-2);
            if ((sxt / 300) >= 1) alpha = 'ff';
            if ((sxt / 300) <= 0) alpha = '00';
            var color = this.props.naviBarColor + alpha;
            this.props.updateColor(color);
        }
        else if(sxt > 300) {
            if(alpha != 'ff') {
                alpha = 'ff'
                var color = this.props.naviBarColor + alpha;
                //console.log(color);
                this.props.updateColor(color);
            }
        }
        else if (sxt < 0) {
            if(alpha != '00') {
                alpha = '00'
                var color = this.props.naviBarColor + alpha;
                //console.log(color);
                this.props.updateColor(color);
            }
        }

        var scrollProperties = this.refs.MyListView.getMetrics();

        //这才是scroll判断的高度
        var scrollViewHeight = scrollProperties.contentLength - this.listViewHeight;
        if (sxt >= scrollViewHeight + 40 && !this.isLoadingMore) {
            console.log('can load more!');
            this.isLoadingMore = true;

            this._loadMore('http://news.at.zhihu.com/api/4/news/before/' + this.latestLoadMoreDate);
        }
    }

    _loadMore(url) {
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(json => {
                this._handleLoadMoreData(json);
                this.isLoadingMore = false;
            })
            .catch(error => {
                console.log('error loadMore request!');
            });
    }

    _handleLoadMoreData(data) {
        if (data) {
            var listData = this.state.listData;
            //listData = listData.concat(data.stories);

            this.flag ++;
            this.mapData[this.flag] = data.stories;
            this.latestLoadMoreDate = data.date;
            //this.mapData.reverse();
            this.setState({
                listData:listData.concat(data),
                listDataSource: this.state.listDataSource.cloneWithRowsAndSections(this.mapData),
            })
        }
    }

    _getYesturDayDate(todayDate) {
        if(todayDate.length != 8) {
            //如果不是8位.则不符合要求
            return '';
        }
        var year = todayDate.substring(0, 4);
        var month = todayDate.substring(4, 6);
        var day = todayDate.substring(6, 8);

        var todayFormatDate = year+'-'+ month +'-' + day;
        var resultDate = new Date(todayFormatDate);
        resultDate.setDate(resultDate.getDate() - 1);

        var resultStrDate = resultDate.getFullYear().toString()+ '' + ('0' + (resultDate.getMonth() + 1)).toString().slice(-2) + '' + ('0' + resultDate.getDate()).toString().slice(-2);
        return resultStrDate;
    }

    render() {
        var isLoadingFlagView = (!this.state.isLoading) ?
            (
                <ListView
                    ref='MyListView'
                    onScroll={this.handleScroll.bind(this)}
                    dataSource={this.state.listDataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                    onLayout={event => {
                    this.listViewHeight = event.nativeEvent.layout.height}
                    }
                />
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
}

AppRegistry.registerComponent('ZHHomePage', () => ZHHomePage);
