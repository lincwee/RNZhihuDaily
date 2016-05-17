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
        // 初始状态
        this.state = {
            navigatorColor: navigatorOriginColor + '00'
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


//============================================

export default class HomePageInit extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // 初始状态
        this.state = {
            listDataSource: dataSource.cloneWithRows(['row1', 'row2']),
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
        if (response) {
            this.setState({
                listDataSource: this.state.listDataSource.cloneWithRows(response.stories),
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
                    <Text style={{fontSize: 16, flex: 3, paddingLeft: 10, paddingTop: 10}}>
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
                width={300}
                height={200}
                imageDataSource={this.state.listTopStoriesSource}>
            </ZHHeaderScrollView>
        )
    }

    rowPressed(rowData) {
        this.props.navigator.push({
            component: ZHDetailPage,
            showBackButton: true,

            title: '',
            passProps: {
                rowID: rowData.id,
                naviBarColor :'#00000000'
            }
        })
    }

    handleScroll(event:Object) {
        var sxt = event.nativeEvent.contentOffset.y;
        var alpha = ('0' + parseInt((sxt / 300) * 255).toString(16)).slice(-2);
        if ((sxt / 300) >= 1) alpha = 'ff';
        if ((sxt / 300) <= 0) alpha = '00';
        var color = this.props.naviBarColor + alpha;
        //console.log(color);
        this.props.updateColor(color);
    }

    render() {
        var isLoadingFlagView = (!this.state.isLoading) ?
            (
                <ListView
                    onScroll={this.handleScroll.bind(this)}
                    dataSource={this.state.listDataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
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
