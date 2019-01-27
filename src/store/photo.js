import { observable } from 'mobx'
import tabs from '../common/tabs'
import {  LOADING_STATUS, RES_STATUS } from '../common/constants'
import api from '../apis'

function initDefaultPhotos() {
  return tabs.reduce((prev, next) => {
    prev[next.value] = {
      tab: next,
      page: 1,
      perPage: 6,
      list: [],
      loadingStatus: LOADING_STATUS.LOADING
    }
    return prev;
  }, {})
}

const photoStore = observable({
  photos: initDefaultPhotos(),
  currentPhotoList: tabs[0].value,

  async loadPhotos() {
    const { photos, currentPhotoList } = this

    let nextList = {
      [currentPhotoList]: {
        ...photos[currentPhotoList],
        loadingStatus: LOADING_STATUS.LOADING
      }
    }

    this.photos = {
      ...photos,
      ...nextList
    }
    // this.setState({
    //   photos: {
    //     ...photos,
    //     ...nextList
    //   }
    // }, () => console.log(this.state))
    // await photoStore.mergeNewPhtoList(nextList)

    const { page, perPage, list } = nextList[currentPhotoList]
    const query = {
      page,
      perPage,
    }
    let func;
    if (currentPhotoList === 'latest') {
      func = 'listPhotos'
    } else if (currentPhotoList === 'curated') {
      func = 'listCuratedPhotos'
    } else {
      func = 'collectionPhotos'
      query.id = currentPhotoList
    }

    const {
      statusCode,
      data
    } = await api[func](query)
    // console.log(statusCode)

    let payload
    if (statusCode === RES_STATUS.SUCCESS) {
       payload = {
        loadingStatus: LOADING_STATUS.OK,
        list: list.concat(data)
      }
    } else {
      payload = {
        loadingStatus: LOADING_STATUS.FAILED,
      }
    }
    nextList[currentPhotoList] = {
      ...nextList[currentPhotoList],
      ...payload
    }
    this.photos = {
      ...this.photos,
      ...nextList
    }
  },


  changeTab(value) {
    this.currentPhotoList = value
    if(this.photos[value].list.length > 0) return
    this.loadPhotos()
  }

})
export default photoStore
