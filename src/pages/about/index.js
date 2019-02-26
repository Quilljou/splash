import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.styl'
import LargeTitle from '../../components/LargeTitle'
import NavBar from '../../components/Navbar'
import logo from '../../assets/images/logo.jpeg'
import pkg from '../../../package.json'

const mail = 'quillzhou@gmail.com'

class Index extends Component {

  handleCopyMail() {
    Taro.setClipboardData({
      data: mail
    })
  }
  render() {
    return (
      <View className='page-detail'>
        <NavBar />
        <LargeTitle title='关于'></LargeTitle>
        <View className='desc'>
          <Image
            className='logo'
            mode='widthFix'
            src={logo}
          />
          <View className='bio'>
            <Text>
              『 漫图 Splash 』 提供来自 Unsplash 社区高质量的作品展示平台。受限于 Unsplash 官方数据源，每小时暂时只提供 50 次接口调用，若出现界面错误，请谅解。
            </Text>
          </View>
        </View>
        <View className='list'>
            <View className='list-item'>
              <Text>当前版本</Text>
              <Text className='light'>{pkg.version}</Text>
            </View>
            <View className='list-item' onClick={this.handleCopyMail}>
              <Text>联系我</Text>
              <Text className='light'>
                {mail}
              </Text>
            </View>
        </View>

      </View>
    )
  }
}

export default Index
