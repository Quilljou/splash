import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import get from 'lodash.get'

import './index.styl'
import NavBar from '../../components/Navbar'
import Auth from '../../components/Auth'
import api from '../../apis'
import { RES_STATUS, STORAGE_KEYS } from '../../common/constants';
import { debounce } from '../../common/utils'

export default class Index extends Component {
  constructor(props) {
    super(props)

    // get bg from the last cache
    let backgroundImage = ''
    try {
      backgroundImage = Taro.getStorageSync(STORAGE_KEYS.CENTER_BG)
    } catch (error) {
      console.error(error)
    }

    Taro.getStorageInfoSync()

    this.state = {
      backgroundImage,
      showAuth: false,
      userInfo: {
        avatarUrl: '',
        nickName: '',
        country: '',
        city: ''
      }
    }

    this.debouncedRandomBg = debounce(this.getRandomBg)
  }

  async componentDidMount() {
    const scope = 'scope.userInfo'
    setTimeout(this.getRandomBg.bind(this),1000)
    const { authSetting } = await Taro.getSetting()
    if (!authSetting[scope]) {
      return this.showAuthPopup()
    }
    const { userInfo } = await Taro.getUserInfo({
      lang: 'zh_CN'
    })
    this.setState({
      userInfo
    })
  }

  showAuthPopup() {
    this.setState({
      showAuth: true
    })
  }

  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo
    if(!userInfo) return
    this.setState({
      userInfo,
      showAuth: false
    })
  }

  async getRandomBg() {
    const { statusCode, data } = await api.getRandomPhoto()
    if(statusCode === RES_STATUS.SUCCESS) {
      const bg = get(data, 'urls.regular', '')
      if(!bg) return
      this.setState({
        backgroundImage: bg
      })
      Taro.setStorage({
        key: STORAGE_KEYS.CENTER_BG,
        data: bg
      })
    }
  }

  prettyUserInfo(userInfo) {
    return Object.keys(userInfo).reduce((prev, next) => {
      const value = userInfo[next]
      // TODO: 容灾头像
      prev[next] = value ? value : next === 'avatarUrl' ? '' : '--'
      return prev
    }, {})
  }

  goAd(){
    Taro.showModal({
      content: '分享给更多好友就能看广告了'
    })
  }

  goPoster() {

  }

  goDetail() {

  }

  render() {
    let { userInfo, showAuth, backgroundImage } = this.state
    userInfo = this.prettyUserInfo(userInfo)
    const { avatarUrl, nickName, country, city  } = userInfo
    return (
      <View className='full-page'>
        <NavBar showBack obviousBack />
        <View className='header'
          style={{backgroundImage: `url(${backgroundImage})`}}
          onClick={this.debouncedRandomBg}
          onLongPress={this.goDetail}
        >
          <View className='header-mask'></View>
        </View>
        <View className='body'>
          <View className='userinfo'>
            <View className='drop-shadow'></View>
            <Image
              className='avatar'
              src={avatarUrl}
            />
            <View className='name'>{nickName}</View>
            <View className='location'>{ country }{` · `}{ city }</View>
          </View>
          <View className='list'>
            {/* <View className='list-item' onClick={this.goPoster}>海报生成</View> */}
            <View className='list-item' onClick={this.goAd}>看广告</View>
            {/* <View className='list-item' onClick={this.goAd}>设置</View> */}
            <View className='list-item' onClick={this.goFeedback}>
              <Button openType='feedback' className='btn-feedback'>您的建议</Button>
            </View>
          </View>
        </View>
        {
          showAuth && <Auth onGetUserInfo={this.handleGetUserInfo} />
        }
      </View>
    )
  }
}
