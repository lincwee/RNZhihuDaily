/**
 * Created by lincwee on 16/5/12.
 */
import React from 'react';
import Dimensions from 'Dimensions';
import{
    ScrollView,
    View,
    Image,
    Text

} from 'react-native';

export default class ZHHeaderScollView extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            width: this.props.width,
            height: this.props.height,
            imageDataSource: this.props.imageDataSource
        };
    }

    _createItemHeaderView(item, i) {
        return (
            <Image key={i}
                   style={{width: Dimensions.get('window').width, height: this.state.height}}
                source={{uri: item.image}}>
                <View style={{flex: 1, backgroundColor: '#00000030', justifyContent:'flex-end'}}>
                    <Text style={{fontSize: 20, backgroundColor:'#00000000', color:'#ffffff', alignSelf:'center', marginLeft: 15, marginRight:15, paddingBottom: 30}}>{item.title}</Text>
                </View>
            </Image>

        )
    }

    render() {
        var imageListView = (
            this.state.imageDataSource.map((item, i) => this._createItemHeaderView(item, i))
        );
        return (
            //<View style={{flex: 1}}>
                <ScrollView pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{width: Dimensions.get('window').width, flex: 1}}>
                        {imageListView}
                </ScrollView>
            //</View>
        )
    }
}