import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.styl'
import NavBar from '../../components/Navbar'
import Auth from '../../components/Auth'
import api from '../../apis'
import { RES_STATUS, STORAGE_KEYS } from '../../common/constants';
import get from 'lodash.get'

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
  }

  async componentDidMount() {
    const scope = 'scope.userInfo'
    this.getRandomBg()
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

  render() {
    let { userInfo, showAuth, backgroundImage } = this.state
    userInfo = this.prettyUserInfo(userInfo)
    const { avatarUrl, nickName, country, city  } = userInfo
    return (
      <View className='full-page'>
        <NavBar showBack obviousBack />
        <View className='header' style={{backgroundImage: `url(${backgroundImage})`}} onClick={this.getRandomBg}></View>
        <View className='body'>
          <View className='userinfo'>
            <Image
              className='avatar'
              src={avatarUrl}
            />
            <View className='name'>{nickName}</View>
            <View className='location'>{ country } · { city }</View>
          </View>
          <View className='list'>
            <View>海报生成</View>
            <View>看广告</View>
          </View>
        </View>
        {
          showAuth && <Auth onGetUserInfo={this.handleGetUserInfo} />
        }
      </View>
    )
  }
}
