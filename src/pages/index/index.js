import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'
import { inject, observer }  from '@tarojs/mobx'
import './index.styl'
import { LOADING_STATUS } from '../../common/constants'
import PhotoList from '../../components/PhotoList';
import tabs from '../../common/tabs'

@inject('photoStore')
@observer
export default class Index extends Component {
   constructor(props) {
      super(props)
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
    const { photoStore } = this.props
    const { currentPhotoList, photos } = photoStore
    const selectedPhotos = photos[currentPhotoList]
    let {
      loadingStatus,
      page
    } = selectedPhotos
    if(loadingStatus !== LOADING_STATUS.OK) return;
    const nextList = {
      [currentPhotoList]: {
        ...selectedPhotos,
        ...{
          page: ++page
        }
      }
    }

    photoStore.photos = {
      ...photos,
      ...nextList
    }
    photoStore.loadPhotos()
  }

  handleRetry() {
    const { photoStore } = this.props
    photoStore.loadPhotos()
  }

  changeTab({ value }) {
    const { photoStore } = this.props
    photoStore.changeTab(value)
  }

  get currentPhotoListIndex() {
    const { photoStore: { currentPhotoList } } = this.props
    return tabs.findIndex(t => t.value === currentPhotoList)
  }

  onSwipeChange(e) {
    const { photoStore } = this.props
    const index = e.detail.current
    photoStore.changeTab(tabs[index].value)
  }

  render () {
    const { photoStore: { photos, currentPhotoList } } = this.props
    const currentPhotoListIndex = this.currentPhotoListIndex
    const scrollIntoView = currentPhotoListIndex < 3 ? tabs[0].value : tabs[currentPhotoListIndex - 2].value
    console.log(scrollIntoView)
    return (
      <View className='index'>
        <ScrollView
          scroll-x
          className='tabs'
          scrollIntoView={`ID${scrollIntoView}`}
          scrollWithAnimation
        >
          {tabs.map(tab => {
            return (
              <View key={
                tab.value
              }
                id={`ID${tab.value}`}
                className={classnames('tabs-item',{'tabs-item_selected': currentPhotoList === tab.value})}
                onClick={this.changeTab.bind(this, tab)}
              > {
                tab.name
              } </View>
            )
          })}
        </ScrollView>
        <Swiper current={currentPhotoListIndex} onChange={this.onSwipeChange} className='photos-swiper'>
          {tabs.map(tab => {
            let { loadingStatus, list, page } = photos[tab.value]
            return (
            <SwiperItem key={tab.value}>
              <PhotoList
                list={list.slice()}
                skipHiddenItemLayout
                externalClass='photos'
                loadingStatus={loadingStatus}
                onReachBottom={this.onReachBottom}
                onRetry={this.handleRetry}
                showMainLoading={loadingStatus === LOADING_STATUS.LOADING && page === 1}
              />
            </SwiperItem>
          )})}
        </Swiper>
      </View>
    )
  }
}

