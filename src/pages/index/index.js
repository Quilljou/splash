import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
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
      const defaultPhotos = this.initDefaultPhotos()
      this.state = {
        photos: defaultPhotos,
        selectedTab: tabs[0].value
      }
   }

  config = {
    navigationBarTitleText: '首页',
  }

  initDefaultPhotos() {
    return tabs.reduce((prev, next) => {
        prev[next.value] = {
            tab: next,
            page: 1,
            perPage: 6,
            list: [],
            loadingStatus: LOADING_STATUS.LOADING
          }
        return prev;
    },{})
  }

  componentWillMount () { }

  componentDidMount () {
    this.changeTab(tabs[0])
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    const { selectedTab, photos } = this.state
    const selectedPhotos = photos[selectedTab]
    let {
      loadingStatus,
      page
    } = selectedPhotos
    if(loadingStatus !== LOADING_STATUS.OK) return;
    const nextList = {
      [selectedTab]: {
        ...selectedPhotos,
        ...{
          page: ++page
        }
      }
    }
    this.setState({
      photos: {
        ...photos,
        ...nextList
      }
    }, this.loadPhotos)
  }

  handleRetry() {
    this.loadPhotos()
  }

  async changeTab({ value }) {
    this.setState({
      selectedTab: value
    }, this.loadPhotos)
  }

  async loadPhotos() {
    const { selectedTab, photos } = this.state
    let nextList = {
      [selectedTab]: {
        ...photos[selectedTab],
        loadingStatus: LOADING_STATUS.LOADING
      }
    }
    this.setState({
      photos: {
        ...photos,
        ...nextList
      }
    }, () => console.log(this.state))
    const { page, perPage, list } = nextList[selectedTab]
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

    let payload
    if (statusCode === RES_STATUS.SUCCESS) {
       payload = {
        loadingStatus: LOADING_STATUS.OK,
        list: list.concat(data)
      }
    } else {
      payload ={
        loadingStatus: LOADING_STATUS.FAILED,
      }
    }
    nextList[selectedTab] = {
      ...nextList[selectedTab],
      ...payload
    }
    this.setState({
      photos: {
        ...this.state.photos,
        ...nextList
      }
    })

  }

  get selectedTabIndex() {
    const { selectedTab } = this.state
    return tabs.findIndex(t => t.value === selectedTab)
  }

  onSwipeChange(e) {
    const index = e.detail.current
    this.setState({
      selectedTab: tabs[index].value
    }, this.loadPhotos)
  }

  render () {
    // console.log('render', this.state)
    const { photos, selectedTab } = this.state;
    const selectedTabIndex = this.selectedTabIndex
    return (
      <View className='index'>
        <View className='tabs'>
          {tabs.map(tab => {
            return (
              <View key={
                tab.value
              }
                className={classnames('tabs-item',{'tabs-item_selected': selectedTab === tab.value})}
                onClick={
                this.changeTab.bind(this, tab)
              }
              > {
                tab.name
              } </View>
            )
          })}
        </View>
        <Swiper current={selectedTabIndex} onChange={this.onSwipeChange} className='photos-swiper'>
          {tabs.map(tab => {
            const { loadingStatus, list } = photos[tab.value]
            return (
            <SwiperItem key={tab.value}>
              <PhotoList
                list={list}
                skipHiddenItemLayout
                externalClass='photos'
                loadingStatus={loadingStatus}
                onReachBottom={this.onReachBottom}
                onRetry={this.handleRetry}
              />
            </SwiperItem>
          )})}
        </Swiper>
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

