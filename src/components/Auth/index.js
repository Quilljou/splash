import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components';
import propTypes from 'prop-types';
import './index.styl'

const projectname = 'Splash'


export default class Auth extends Component {
  static propTyps = {
    onGetUserInfo: propTypes.func
  }

  render() {
    return (
      <View class='login_mask'>
        <View class='login_main'>
          <View class='login_main_header'>
            {/* <Image class='header_logo' src='https://img11.360buyimg.com/jdphoto/s132x132_jfs/t25390/109/1300628542/6570/4839ae2f/5badee37N6c10935d.png'></Image> */}
            <View class='header_text'>欢迎来到{projectname}</View>
          </View>
          <View class='login_main_content'>
            <View class='content_msg'>为提供优质的体验，{projectname}需要获取以下信息</View>
            <View class='content_list'>
              <View class='content_list_item'>
                · 你的公开信息（昵称、头像等）
              </View>
            </View>
          </View>
          <Button class='login_main_confirm' type='primary' openType='getUserInfo' lang='zh_CN' onGetUserInfo={this.props.onGetUserInfo}>确认授权</Button>
          <View class='login_main_reject'>
          </View>
        </View>
      </View>
    )
  }
}
