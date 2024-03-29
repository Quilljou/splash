import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { ScrollView, View } from '@tarojs/components'
import { LOADING_STATUS } from '../../common/constants'
import './index.styl'
import PhotoItem from '../PhotoItem'
import Loader from '../Loader'

const LOADING_TEXT = '载入中...'

class PhotoList extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    onScroll: _ => _,
    loadingStatus: LOADING_STATUS.LOADING,
    list: []
  }

  static propTypes = {
    list: PropTypes.array,
    height: PropTypes.string,
    loadingStatus: PropTypes.oneOf(Object.values(LOADING_STATUS)),
    className: PropTypes.string,
    onReachBottom: PropTypes.func,
    onReachTop: PropTypes.func,
    onRetry: PropTypes.func,
    onSwipe: PropTypes.func,
    onScroll: PropTypes.func,
    showTopLoading: PropTypes.bool,
    showMainLoading: PropTypes.bool
  }

  static options = {
    addGlobalClass: true
  }


  render() {
    let { externalClass, onReachTop, onReachBottom, onScroll, showMainLoading, loadingStatus, list, onRetry } = this.props
    return (
      <ScrollView
        enableBackToTop
        scrollWithAnimation
        scrollY
        scrollTop='0'
        className={classnames([externalClass, 'photo-list'])}
        lowerThreshold='60'
        upperThreshold='20'
        onScrolltoupper={onReachTop}
        onScrollToLower={onReachBottom}
        onScroll={onScroll}
      >
        {
          list.length ? list.map(photo => <PhotoItem photo={photo} key={photo.id}  />) : null
        }
        {
          showMainLoading ? <Loader /> :
          <View className='loading-status'>
            {
              loadingStatus === LOADING_STATUS.LOADING  ? LOADING_TEXT : null
            }
            {
              loadingStatus === LOADING_STATUS.FAILED  ? <View onClick={onRetry}> 加载失败, 点击重试 </View> : null
            }
            {
              loadingStatus === LOADING_STATUS.NOMORE || (loadingStatus === LOADING_STATUS.OK && list.length == 0) ? '没有更多了' : null
            }
          </View>
        }
      </ScrollView>
    )
  }
}

export default PhotoList
