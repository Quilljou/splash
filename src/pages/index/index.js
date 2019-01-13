import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import './index.styl'
import api from '../../apis'
import { RES_STATUS } from '../../common/constants'
import PhotoList from '../../components/PhotoList';

const collections = {
  wallpapers: 1065976,
  nature: 3330448,
  events: 3356631,
  architecture: 3348849,
  animals: 3330452,
  travel: 3356570,
  fasion: 3356576,
  food: 3330455,
  arts_culture: 3330461
}

const tabs = [{
  name: '最新',
  value: 'latest',
}, {
  name: '精选',
  value: 'curated',
}, {
  name: '壁纸',
  value: collections.wallpapers,
}, {
  name: '自然',
  value: collections.nature,
}, {
  name: '热点',
  value: collections.events,
}, {
  name: '动物',
  value: collections.animals,
}, {
  name: '旅行',
  value: collections.travel,
}, {
  name: '时尚',
  value: collections.fasion,
}, {
  name: '文艺',
  value: collections.arts_culture,
}]


const LOADING_STATUS = {
  LOADING: 'LOADING',
  OK: 'OK',
  FAILED: 'FAILED',
  NOMORE: 'NOMORE'
};

export default class Index extends Component {
   constructor(props) {
     super(props)
     this.state = {
       tabs,
       page: 1,
       perPage: 10,
       photos: [],
       selectedTab: tabs[0].value,
       loadingStatus: LOADING_STATUS.LOADING
     }
   }

  config = {
    navigationBarTitleText: '首页',
  }

  componentWillMount () { }

  componentDidMount () {
    this.changeTab(this.state.tabs[0])
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    console.log('reached bottom')
    let {
      loadingStatus,
      page
    } = this.state
    if(loadingStatus !== LOADING_STATUS.OK) return;
    this.setState({
      page: ++page
    }, this.loadPhotos)
  }

  resetPagination() {
    this.setState({
      page: 1,
      perPage: 10,
      photos: []
    })
  }

  handleRetry() {
    this.loadPhotos()
  }

  async changeTab({ value }) {
    this.resetPagination()
    this.setState({
      selectedTab: value
    }, this.loadPhotos)
  }

  async loadPhotos() {
    this.setState({
      loadingStatus: LOADING_STATUS.LOADING
    })
    const {
      page,
      perPage,
      selectedTab
    } = this.state
    const query = {
      page,
      perPage,
    }
    let func;
    if (selectedTab === 'latest') {
      func = 'listPhotos'
    } else if (selectedTab === 'curated') {
      func = 'listCuratedPhotos'
    } else {
      func = 'collectionPhotos'
      query.id = selectedTab
    }

    const {
      statusCode,
      data
    } = await api[func](query)
    console.log(statusCode)
    if (statusCode === RES_STATUS.SUCCESS) {
      this.setState({
        loadingStatus: LOADING_STATUS.OK,
        photos: this.state.photos.concat(data)
      })
    } else {
      this.setState({
        loadingStatus: LOADING_STATUS.FAILED,
        photos: this.state.photos.concat(data)
      })
    }
  }

  render () {
    console.log('render', this.state)
    const { loadingStatus, photos } = this.state;
    return (
      <View className='index'>
        <View className='tabs'>
          {this.state.tabs.map(tab => {
            return (
              <View key={
                tab.value
              }
                className={classnames('tabs-item',{'tabs-item_selected': this.state.selectedTab === tab.value})}
                onClick={
                this.changeTab.bind(this, tab)
              }
              > {
                tab.name
              } </View>
            )
          })}
        </View>
        <PhotoList
          list={photos}
          externalClass='photos'
          loadingStatus={loadingStatus}
          onReachBottom={this.onReachBottom}
          onRetry={this.handleRetry}
        />
        {/* <View className='photos'>
          {
            photos.length ? this.state.photos.map(photo => <PhotoItem photo={photo} key={photo.id}  />) : null
          }
          <View className='loading-status'>
            {
              loadingStatus === LOADING_STATUS.LOADING ? '载入中...' : loadingStatus === LOADING_STATUS.FAILED ? ( <View onClick={this.handleRetry}> 加载失败, 点击重试 </View>) : null
            }
          </View>
        </View> */}
      </View>
    )
  }
}

