import Taro, { Component } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'

import './index.styl'
import { EXIFS } from '../../../../common/constants'
import { access } from '../../../../common/utils';

export default class Poster extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  static defaultProps = {
    photo: {
      urls: {}
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () {}

  renderPoster(url, width, height) {
    const context = Taro.createCanvasContext('poster', this.$scope)
    console.log(context)
    const exif = {
      aperture: "2.8",
      exposure_time: "1/800",
      focal_length: "56.0",
      iso: 100,
      make: "Canon",
      model: "Canon EOS 6D"
    }
    context.drawImage(url, 0, 0, width, height)
    for (let index = 0; index < EXIFS.length; index++) {
      const { text, render, field } = EXIFS[index];
      const value = render ? render(exif[field]) : exif[field]
      const x1 = 10, y1 = 320
      const deltax = 140, deltay = 20
      context.setFontSize(12)
      const x = !(index % 2) ? x1 : x1 + deltax
      const y = !(index % 2) ? y1 + index * deltay : y1 + (index - 1) * deltay
      context.fillText(text, x, y)
      context.setFontSize(20)
      context.fillText(value,x, y + 20)
    }
    context.fill()
    context.draw()
  }

  getCanvasModalRect(windowWidth, pw, ph) {
    const cWidth = windowWidth * 0.9;
    const cHeight = cWidth / pw * ph
    return {
      cWidth,
      cHeight
    }
  }
  logErrror(e) {
    console.log(e)
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { photo } = this.props
    const { urls, width, height, windowWidth } = photo
    if (!urls.regular) return null;
    const { cHeight, cWidth } = this.getCanvasModalRect(windowWidth, width, height)
    console.log(cHeight, cWidth)
    const realHeight = cHeight + 40 + 100;
    const url = access(this.props, 'photo.urls.regular')
    if (url) {
      this.renderPoster(url, cWidth, cHeight);
    }

    return (
      <View className='poster' onClick={this.props.onClose}>
        <View className='poster-modal' style={{height: realHeight + 'px', width: cWidth + 'px'}}>
          <Canvas canvas-id='poster' className='poster-canvas' onError={this.logErrror}></Canvas>
        </View>
      </View>
    )
  }
}

