import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components';
import { stringify } from 'querystring';
import './PhotoItem.styl'
import { getPaddingBottom } from '../../common/common'

class PhotoItem extends Component {
  static defaultProps = {
    photo: {
      urls: {}
    }
  }

  navToDetail(query) {
    Taro.navigateTo({
      url: `/pages/detail/detail?${stringify(query)}`
    })
  }

  render() {
    const { width, height, urls: { small, regular }, color, user, id } = this.props.photo;
    if(!width) return null;
    const paddingBottom = getPaddingBottom(height, width)
    return (
      <View
        className='photos-item'
        onTouch
        onClick={this.navToDetail.bind(this, {width, height, id, color, regular })}
      >
        <Image style={
          {
            'background-color': color
          }
        }
          lazyLoad
          className='photos-item-image'
          mode='widthFix'
          src={small}
        />
        <View style={{ 'padding-bottom': paddingBottom }}
          className='photos-item-holder'
        />
        <View className='photos-item-meta'>
            <View>Photo by <Text className='author'>{user.name}</Text></View>
            {user.location ? <View>{`@ ${user.location}`}</View> : null}
        </View>
      </View>
    )
  }
}

export default PhotoItem;
