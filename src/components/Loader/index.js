import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import './index.styl'

class Loader extends Component {
  render() {
    return (
      <View className='container'>
        <View className='span'></View>
        <View className='span'></View>
        <View className='span'></View>
      </View>
    )
  }
}


export default Loader
