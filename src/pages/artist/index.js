import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import get from 'lodash.get'
import classnames from 'classnames'

import Loader from '../../components/Loader'
import PhotoList from '../../components/PhotoList'

import api from '../../apis'
import './index.styl'
import { RES_STATUS, LOADING_STATUS } from '../../common/constants';

let countsItem = [ {
  field: 'total_photos',
  text: '作品',
  func: 'userPhotos'
}, {
  field: 'total_likes',
  text: '喜欢',
  func: 'userLikes'
}
// , {
//   field: 'total_collections',
//   text: '相册',
//   func: 'userCollections'
// }
]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCount: countsItem[0].field,
      user: {
        username: ''
      },
      perPage: 10,
      page: 1,
      currentList: [],
      loadingStatus: LOADING_STATUS.LOADING
    }
  }

  componentWillMount() {
    const user = this.$router.params
    this.setState({
      user: {
        ...this.state.user,
        ...user
      }
    }, () => this.loadCount(this.state.currentCount))
    this.getUserInfo(user.username)
  }

  onShareAppMessage() {
    const user = this.$router.params
    const { profile_image = {}, name = ''} = this.state.user
    return {
      title: `这是我喜欢的摄影师${name}`,
      imageUrl: profile_image.large
    }
  }


  async getUserInfo(username) {
    const { statusCode, data } = await api.userProfile(username)
    // TODO:
    if(statusCode !== RES_STATUS.SUCCESS) return
    this.setState({
      user: {
        ...this.state.user,
        ...data
      }
    })
  }

  async loadCount() {
    this.setState({
      loadingStatus: LOADING_STATUS.LOADING
    })
    let { page, perPage, user, currentList } = this.state
    const query = {
      page,
      perPage,
      username: user.username
    }
    const field = this.state.currentCount
    const funcName = countsItem.find(item => item.field === field).func
    const { statusCode, data } = await api[funcName](query)
    let loadingStatus;

    if (statusCode === RES_STATUS.SUCCESS) {
      loadingStatus = data.length ? LOADING_STATUS.OK : LOADING_STATUS.NOMORE,
      currentList = currentList.concat(data)
    } else {
      loadingStatus = LOADING_STATUS.FAILED
    }

    this.setState({
      loadingStatus,
      currentList
    })
  }

  reset() {
    this.setState({
      page: 1,
      perPage: 10,
      currentList: []
    })
  }

  changeCount({ value, field}) {
    if(!value) return
    this.reset()
    console.log(value, field)
    this.setState({
      currentCount: field
    }, this.loadCount)
  }

  handleReachBottom() {
    let { page, loadingStatus } = this.state
    console.log('reachbottom')
    if (loadingStatus !== LOADING_STATUS.OK) return;
    this.setState({
      page: ++page
    }, this.loadCount)
  }

  handleRetry() {
    this.loadCount()
  }

  handleClickBio(bio, name) {
    if(!bio) return
    Taro.showModal({
      title: `关于${name}`,
      content: bio,
      showCancel: false,
      confirmText: '了解'
    })
  }

  render() {
    const { user, loadingStatus, currentList, page, currentCount } = this.state
    let {
      name,
      profile_image = {},
      bio,
    } = user
    name = decodeURIComponent(name)

    countsItem.map(item => {
      const value = user[item.field]
      item.value = value ? value : 0
      return item
    })

    return (
      <View className='full-page page-artist'>
        {/* <NavBar /> */}
        <View className='profile padding'>
          <Image src={profile_image.large} className='avatar'></Image>
          <View className='meta'>
            <View className='name'>
              {name}
            </View>
            <View className='bio' onClick={this.handleClickBio.bind(this, bio, name)}>
              {bio ? bio : null}
            </View>
          </View>
        </View>
        <View className='counts padding'>
          {
            countsItem.map(item => {
              return(
                <View
                  key={item.field}
                  className={classnames(['counts-item', {selected: currentCount === item.field }])}
                  onClick={this.changeCount.bind(this,item)}
                >
                  <Text className='counts-value'>{item.value}</Text>
                  <Text className='counts-text'>{item.text}</Text>
                </View>
              )
            })
          }
        </View>

        <View className='list padding flex-1'>
          <PhotoList
            list={currentList}
            externalClass='full-height'
            loadingStatus={loadingStatus}
            onReachBottom={this.handleReachBottom}
            onRetry={this.handleRetry}
            showMainLoading={loadingStatus === LOADING_STATUS.LOADING && page === 1}
          />
        </View>
      </View>
    )
  }
}

export default Index
