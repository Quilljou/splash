import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './index.styl'

// aperture: "1.8"
// exposure_time: "1/35"
// focal_length: "4.0"
// iso: 32
// make: "Apple"
// model: "iPhone 7 Plus"
const ITEMS = [
  {
    text: 'CAMERA MAKE',
    field: 'make'
  },
  {
    text: 'CAMERA MODEL',
    field: 'model'
  },
  {
    text: 'FOCAL LENGTH',
    field: 'focal_length',
    render(val){ return val + 'mm'}
  },
  {
    text: 'ISO',
    field: 'iso',
  },
  {
    text: 'APERTURE',
    field: 'aperture'
  },
  {
    text: 'SHUTTER',
    field: 'exposure_time',
    render(val){ return val + 'S'}
  }
]

class Exif extends Component {
  render() {
    const { exif } = this.props
    if(!exif || Object.keys(exif).length === 0) return null
    return (
      <View className='exif'>
        {
          ITEMS.map(item => {
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
