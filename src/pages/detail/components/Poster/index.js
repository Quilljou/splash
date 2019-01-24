import Taro, { Component } from '@tarojs/taro'
import { View, Canvas, Button } from '@tarojs/components'
import memoize from 'lodash/memoize'
import './index.styl'
import { EXIFS } from '../../../../common/constants'
import { access } from '../../../../common/utils';

export default class Poster extends Component {
  constructor() {
    // this.getSavaedTempPath = memoize(this.getSavaedTempPath)
  }

  static canvasContext = null
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

  async loadImage(src) {
    Taro.showLoading({
      title: '制作中...'
    })
    try {
        const { path } =  await Taro.getImageInfo({src})
        return path
    } catch (error) {
      console.log(error)
    } finally {
      Taro.hideLoading()
    }
  }

  async renderPoster(url, width, height) {
    if (this.canvasContext) return;
    const context = this.canvasContext = Taro.createCanvasContext('poster', this.$scope)
    console.log(this.canvasContext)
    const exif = {
      aperture: "2.8",
      exposure_time: "1/800",
      focal_length: "56.0",
      iso: 100,
      make: "Canon",
      model: "Canon EOS 6D"
    }
    const localPath = await this.loadImage(url);
    if(!localPath) Taro.showToast('分享生成失败~')

    const borderWidth = 10;
    context.setFillStyle('white')
    context.fillRect(0, 0, width, height + 120)
    context.setLineWidth(borderWidth)


    context.drawImage(localPath, borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2)
    context.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    const x1 = borderWidth, y1 = height + 15
    const deltax = width / 2, deltay = 22
    for (let index = 0; index < EXIFS.length; index++) {
      const { text, render, field } = EXIFS[index];
      const value = render ? render(exif[field]) : exif[field]
      context.setFontSize(12)
      context.setFillStyle('#bbb')
      const x = !(index % 2) ? x1 : x1 + deltax
      const y = !(index % 2) ? y1 + index * deltay : y1 + (index - 1) * deltay
      context.fillText(text, x, y)
      context.setFontSize(20)
      context.setFillStyle('black')
      context.fillText(value,x, y + 20)
    }
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

  handleShare() {
    const filePath = this.getSavaedTempPath();
  }

  async getSavaedTempPath() {
    const { tempFilePath } = await Taro.canvasToTempFilePath({
      canvasId: 'poster',
      quality: 1
    }, this.$scope)
    console.log(tempFilePath)
    return tempFilePath
  }

  async handleSave() {
    const scope = 'scope.writePhotosAlbum';
    const {
      authSetting
    } = await Taro.getSetting()
    if (!authSetting[scope]) {
      try {
        await Taro.authorize({
          scope
        })
      } catch (error) {
        console.error(error)
        return;
      }
    }

    const filePath = await this.getSavaedTempPath();
    console.log(filePath)
    Taro.saveImageToPhotosAlbum({
      filePath
    })
  }

  componentWillUnmount () {
    Taro.hideLoading()
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { photo } = this.props
    const { urls, width, height, windowWidth } = photo
    if (!urls.regular) return null;
    const { cHeight, cWidth } = this.getCanvasModalRect(windowWidth, width, height)
    const realHeight = cHeight + 40 + 100;

    this.canvasStyle = {
      width: cWidth,
      height: realHeight
    }

    const url = access(this.props, 'photo.urls.regular')
    if (url) {
      this.renderPoster(url, cWidth, cHeight, realHeight);
    }

    return (
      <View className='poster'>
        <View className='poster-modal'>
          <View className='canvas-container' style={{height: realHeight + 'px', width: cWidth + 'px'}}>
            <Canvas canvasId='poster' className='poster-canvas' onError={this.logErrror}></Canvas>
          </View>
          <View className='poster-opreation'>
            <Button>不展示 EXIF</Button>
            <Button onClick={this.handleShare} openType='share'>分享</Button>
            <Button onClick={this.handleSave}>保存</Button>
          </View>
        </View>
      </View>
    )
  }
}

