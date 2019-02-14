import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import get from 'lodash.get'

import NavBar from '../../components/Navbar'
import SearchBar from './components/Searchbar'
import api from '../../apis'
import './index.styl'
import { RES_STATUS, LOADING_STATUS } from '../../common/constants';
import PhotoList from '../../components/PhotoList'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
      page: 1,
      perPage: 10,
      loadingStatus: LOADING_STATUS.LOADING,
      dirty: false
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentWillUpdate(nextProps) {
    if(nextProps.dirty === this.props.dirty) {
      return false
    }
  }

  resetSearch() {
    this.setState({
      page: 1,
      results: []
    })
  }

  async handleSearch(query) {
    const cnRegex = /[\u4e00-\u9fa5]/
    query = query.trim()
    if (!query) return
    this.resetSearch()
    this.setState({
      dirty: true
    })
    if(cnRegex.test(query)) {
      try {
        const { statusCode, data } = await api.translate(query)
        if(statusCode === RES_STATUS.SUCCESS) {
          const result = get(data,'0.0.0')
          result && (query = result)
        }
      } catch (error) {
        console.error(error)
      }
    }
    this.setState({
      query
    }, this.searchPhotos)
  }

  async searchPhotos() {
    const { page, perPage, results, query } = this.state
    this.setState({
      loadingStatus: LOADING_STATUS.LOADING
    })
    try {
      const { statusCode, data} = await api.searchPhotos(query, '', page, perPage)
      if (statusCode === RES_STATUS.SUCCESS){
        this.setState({
          loadingStatus: data.length ? LOADING_STATUS.OK : LOADING_STATUS.NOMORE,
          results: results.concat(data)
        })
      }else {
        this.setState({
          loadingStatus: LOADING_STATUS.FAILED
        })
        throw new Error('')
      }
    } catch (error) {
      Taro.showToast({
        title: '查询失败',
        icon: 'none'
      })
    }
  }

  handleRetry() {
    this.searchPhotos()
  }

  handleReachBottom() {
    let { page, loadingStatus } = this.state
    if (loadingStatus !== LOADING_STATUS.OK) return;
    this.setState({
      page: ++page
    }, this.searchPhotos)
  }

  render () {
    const { query, results, loadingStatus, page, dirty } = this.state
    return (
      <View className='page-search full-page'>
        <NavBar
          showBack
          title='搜索'
        >
        </NavBar>
        <SearchBar
          value={query}
          onSearch={this.handleSearch}
        />
        {
          dirty &&
          <View className='flex-1'>
            <PhotoList
              list={results}
              externalClass='full-height'
              loadingStatus={loadingStatus}
              onReachBottom={this.handleReachBottom}
              onRetry={this.handleRetry}
              showMainLoading={loadingStatus === LOADING_STATUS.LOADING && page === 1}
            />
          </View>
        }
      </View>
    )
  }
}

export default Index
