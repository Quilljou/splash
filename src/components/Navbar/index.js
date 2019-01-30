import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './index.styl'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // navBarHeight: 0,
      statusBarHeight: 0,
      titleBarHeight: 0
    }

    this.initNavbarHeight()
  }

  static options = {
    addGlobalClass: true
  }

  goBack() {
    Taro.navigateBack()
  }


  async initNavbarHeight() {
    const { statusBarHeight, system } = await Taro.getSystemInfo()
    let titleBarHeight = 44

    if (system.indexOf('Android') !== -1) {
      titleBarHeight = 54
    }

    this.setState({
      // navBarHeight: titleBarHeight + statusBarHeight,
      statusBarHeight,
      titleBarHeight
    })
  }

  render() {
    console.log('navbar render')
    const { statusBarHeight, titleBarHeight } = this.state
    const { title, showBack, useChildren } = this.props

    const defaultContent = <View className='titlebar'>
      {showBack && <Text className='iconfont icon-fanhui' onClick={this.goBack}></Text>}
      {title && <Text className='titlebar-title'>{title}</Text>}
    </View>

    return (
      <View className='navbar'>
        <View style={{height: `${statusBarHeight}px`}}></View>
        <View className='titlebar-container' style={{height: `${titleBarHeight}px`}}>
        {
          useChildren ? this.props.children : defaultContent
        }
        </View>
      </View>
    )
  }
}


export default Navbar
