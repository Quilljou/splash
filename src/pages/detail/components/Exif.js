import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './index.styl'
import { EXIFS } from '../../../common/constants'

// aperture: "1.8"
// exposure_time: "1/35"
// focal_length: "4.0"
// iso: 32
// make: "Apple"
// model: "iPhone 7 Plus"

class Exif extends Component {
  render() {
    const { exif } = this.props
    if(!exif || Object.keys(exif).length === 0) return null
    return (
      <View className='exif'>
        {
          EXIFS.map(item => {
            const { field, text, render } = item
            const value = exif[field]
            return (
                <View className='exif-item' key={field}>
                  <Text className='label'>{text}</Text>
                  <Text className='value'>{value ? render ? render(value) : value : '--'}</Text>
                </View>
            )
          })
        }
      </View>
    )
  }
}


export default Exif
