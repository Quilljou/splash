import Taro, { Component } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'

@inject('photoStore')
@observer
export default class Index extends Component {

  render() {
      console.log('render,', this.state)
      return null
  }
}
