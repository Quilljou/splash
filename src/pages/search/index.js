import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import NavBar from '../../components/Navbar'

import './index.styl'


class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <NavBar showBack>
        </NavBar>

        search
      </View>
    )
  }
}

export default Index
