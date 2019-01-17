import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'
import { inject, observer }  from '@tarojs/mobx'
import './index.styl'
import api from '../../apis'
import { RES_STATUS, LOADING_STATUS } from '../../common/constants'
import PhotoList from '../../components/PhotoList';
import tabs from '../../common/tabs'

@inject('photoStore')
@observer
export default class Index extends Component {
   constructor(props) {
      super(props)
      const defaultPhotos = this.initDefaultPhotos()
      this.state = {
        photos: defaultPhotos,
        currentPhotoList: tabs[0].value
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
    const { currentPhotoList, photos } = this.state
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
    this.setState({
      photos: {
        ...photos,
        ...nextList
      }
    }, this.loadPhotos)
  }

  // handleRetry() {
  //   this.loadPhotos()
  // }

  changeTab({ value }) {
    const { photoStore } = this.props
    photoStore.changeTab(value)
  }

  // async loadPhotos() {
  //   const { photoStore } = this.props
  //   const { photos, currentPhotoList } = photoStore
  //   let nextList = {
  //     [currentPhotoList]: {
  //       ...photos[currentPhotoList],
  //       loadingStatus: LOADING_STATUS.LOADING
  //     }
  //   }

  //   // this.setState({
  //   //   photos: {
  //   //     ...photos,
  //   //     ...nextList
  //   //   }
  //   // }, () => console.log(this.state))
  //   await photoStore.mergeNewPhtoList(nextList)

  //   const { page, perPage, list } = nextList[currentPhotoList]
  //   const query = {
  //     page,
  //     perPage,
  //   }
  //   let func;
  //   if (currentPhotoList === 'latest') {
  //     func = 'listPhotos'
  //   } else if (currentPhotoList === 'curated') {
  //     func = 'listCuratedPhotos'
  //   } else {
  //     func = 'collectionPhotos'
  //     query.id = currentPhotoList
  //   }

  //   const {
  //     statusCode,
  //     data
  //   } = await api[func](query)
  //   // console.log(statusCode)

  //   let payload
  //   if (statusCode === RES_STATUS.SUCCESS) {
  //      payload = {
  //       loadingStatus: LOADING_STATUS.OK,
  //       list: list.concat(data)
  //     }
  //   } else {
  //     payload ={
  //       loadingStatus: LOADING_STATUS.FAILED,
  //     }
  //   }
  //   nextList[currentPhotoList] = {
  //     ...nextList[currentPhotoList],
  //     ...payload
  //   }
  //   // this.setState({
  //   //   photos: {
  //   //     ...this.state.photos,
  //   //     ...nextList
  //   //   }
  //   // })
  //   await photoStore.mergeNewPhtoList(nextList)
  // }

  get currentPhotoListIndex() {
    const { photoStore: { currentPhotoList } } = this.props
    return tabs.findIndex(t => t.value === currentPhotoList)
  }

  // onSwipeChange(e) {
  //   const index = e.detail.current
  //   this.setState({
  //     currentPhotoList: tabs[index].value
  //   }, this.loadPhotos)
  // }

  render () {
    const { photoStore: { photos, currentPhotoList } } = this.props
    const currentPhotoListIndex = this.currentPhotoListIndex
    return (
      <View className='index'>
        <View className='tabs'>
          {tabs.map(tab => {
            return (
              <View key={
                tab.value
              }
                className={classnames('tabs-item',{'tabs-item_selected': currentPhotoList === tab.value})}
                onClick={
                this.changeTab.bind(this, tab)
              }
              > {
                tab.name
              } </View>
            )
          })}
        </View>
        <Swiper current={currentPhotoListIndex} onChange={this.onSwipeChange} className='photos-swiper'>
          {tabs.map(tab => {
            let { loadingStatus, list } = photos[tab.value]
            if(loadingStatus === 'OK') {
              console.log('list',list)
            }
            return (
            <SwiperItem key={tab.value}>
              <PhotoList
                list={list.slice()}
                skipHiddenItemLayout
                externalClass='photos'
                loadingStatus={loadingStatus}
                onReachBottom={this.onReachBottom}
                onRetry={this.handleRetry}
              />
            </SwiperItem>
          )})}
        </Swiper>
      </View>
    )
  }
}

