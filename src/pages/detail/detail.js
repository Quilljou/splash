import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components';
import get from 'lodash.get'

import './index.styl'
import { getPaddingBottom } from '../../common/common'
import { formatDate, abbreviateNumber } from '../../common/utils'
import apis from '../../apis';
import { RES_STATUS } from '../../common/constants'
import Exif from './components/Exif'
import Poster from './components/Poster'
import NavBar from '../../components/Navbar'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '',
      navigationBarBackgroundColor: '#111',
      navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      photo: {},
      showMeta: true,
      showOptional: false,
      isActionSheetOpened: false,
      showPoster: false
    }
  }

  componentWillMount() {
    const photo = this.$router.params
    const { height, width, id } = photo;
    const paddingBottom = getPaddingBottom(height, width)
    photo.paddingBottom = paddingBottom
    this.setState({
      photo
    })
    Taro.getSystemInfo().then(({windowHeight, windowWidth, statusBarHeight}) => {
      const imageHeight = parseFloat(paddingBottom) / 100 * windowWidth
      const marginTop = (windowHeight - imageHeight - statusBarHeight) / 2 + 'px'
      this.setState({
        photo: {
          ...this.state.photo,
          ...photo,
          marginTop,
          windowWidth,
          windowHeight
        }
      })
    })
    this.loadDetail(id);
  }

  async loadDetail(id) {
    const { data, statusCode } = await apis.getPhoto({ id })
    if(statusCode !== RES_STATUS.SUCCESS) return;
    this.setState({
      photo: {
        ...data,
        ...this.state.photo
      }
    },() => console.log(this.state.photo))
  }

  showMoreDetail() {
    this.setState({
      showOptional: !this.state.showOptional
    })
  }

  toggleMeta() {
    this.setState({
      showMeta: !this.state.showMeta
    })
  }

  formatDate(str) {
    return formatDate(new Date(str), 'YYYY·MM·DD')
  }

  async openActionSheet(e) {
    e.stopPropagation && e.stopPropagation()
    const { tapIndex }  = await Taro.showActionSheet({
      itemList: ['生成海报','原图下载']
    })
    if(tapIndex === 0) {
      this.handleShare()
    }else if(tapIndex === 1) {
      this.handlePreview()
    }
  }

  closePoster() {
    this.setState({
      showPoster: false
    })
  }

  async downloadPhoto() {
    const { photo } = this.state
    try {
      Taro.showLoading({
        title: '下载中',
      })
      const { statusCode, data: { url }} = await apis.getDownLoadUrl(photo)
      if(statusCode !== RES_STATUS.SUCCESS || !url) throw new Error('获取下载链接失败')
      const file = await apis.downloadPhoto(url)
      console.log(file)
      if(file.statusCode !== RES_STATUS.SUCCESS || !file.tempFilePath) throw new Error('下载失败')
      await Taro.saveImageToPhotosAlbum({
        filePath: file.tempFilePath
      })
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
      console.error(error)
      Taro.showToast({
        title: '下载失败',
        icon: 'none'
      })
    }
  }

  handlePreview() {
    const current = get(this.state.photo,'urls.full', undefined)
    if(!current) {
      return Taro.showToast({title: '预览失败'})
    }
    Taro.previewImage({
      current,
      urls: [current]
    })
  }

  handlePhotoLoad(e) {
    console.log(e)
  }

  handleShare() {
    this.setState({
      showPoster: true
    })
  }

  render() {
    console.log('render,', this.state)
    const { showMeta,showOptional, photo, showPoster } = this.state;
    const { regular, paddingBottom, marginTop = '0px', user = {}, updated_at, views, likes, exif } = photo
    return (
      <View className='page-detail'>
        <NavBar showBack></NavBar>
        <View style={{paddingTop: marginTop}}>
          <View
            style={{ 'padding-bottom': paddingBottom }}
            className='photos-item'
            onClick={this.toggleMeta}
            onLongPress={this.openActionSheet}
          >
            <Image
              className='photos-item-image'
              mode='widthFix'
              src={regular}
              onLoad={this.handlePhotoLoad}
            />
          </View>
          {
            showMeta && exif &&
            <View className='meta' onClick={this.showMoreDetail}>

              <View className='reuired'>
                <View className='social'>
                  <View className='social-left'>
                    <Text className='iconfont icon-yueduliang'></Text>
                    <Text className='count'>{abbreviateNumber(views)}</Text>
                    <Text className='iconfont icon-dianzan'></Text>
                    <Text className='count'>{abbreviateNumber(likes)}</Text>
                  </View>
                  <View className='social-right'>
                    <Text className='iconfont icon-gengduo' onClick={this.openActionSheet}></Text>
                  </View>
                </View>

                <View className='author'>
                  <View>
                    <View>
                      By<Text className='author-name'>{ ` ${user.name}` }</Text>
                    </View>
                    <View className='local-time'>
                      { user.location ? <Text>{ `@ ${user.location} ` }</Text> : null}
                      <Text>{ this.formatDate(updated_at) }</Text>
                    </View>
                  </View>
                  <Image src={user.profile_image.medium} className='author-avatar' />
                </View>
              </View>

              {
                showOptional &&
                  <View className='optional'>
                    <Exif exif={exif}></Exif>
                  </View>
              }
            </View>
          }
          {
            showPoster &&  <Poster onClose={this.closePoster} photo={photo}></Poster>
          }
        </View>
      </View>
    )
  }
}
