import Taro, { Component } from '@tarojs/taro'
import { View, CoverView, Canvas } from '@tarojs/components'
// import memoize from 'lodash/memoize'
import './index.styl'
import { EXIFS } from '../../../../common/constants'
import { access } from '../../../../common/utils';

export default class Poster extends Component {
  constructor(props) {
    super(props)
    const { photo } = props
    const { urls, width, height, windowWidth } = photo
    if (!urls.regular) return null;
    const { height: pHeight, width: pWidth } = this.getPhotoRect(windowWidth, width, height)
    const realHeight = pHeight + 140;
    this.state = {
      pHeight,
      pWidth,
      realHeight,
      showExif: true
    }
  }

  static options = {
    addGlobalClass: true
  }

  config = {
    navigationBarTitleText: '首页'
  }

  static defaultProps = {
    photo: {
      urls: {}
    }
  }


  componentWillReceiveProps(nextProps) {
    console.log(arguments)
  }

  componentWillUnmount() {
    Taro.hideLoading()
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidUpdate(prevProps, prevState) {
    if(prevState.showExif !== this.props.showExif) {
      const url = access(this.props, 'photo.urls.regular')
      let { pHeight, pWidth, realHeight } = this.state
      if(!this.props.showExif) {
        realHeight = pHeight
      }
      this.renderPoster(url, pWidth, pHeight, realHeight);
    }
  }


  componentWillMount () {

  }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () {
    const url = access(this.props, 'photo.urls.regular')
    const {
          pHeight,
          pWidth,
          realHeight
        } = this.state
    if (url) {
      this.renderPoster(url, pWidth, pHeight, realHeight);
    }
  }

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

  async renderPoster(url, width, height, realHeight) {
    if (this.canvasContext) return;
    const context = this.canvasContext = Taro.createCanvasContext('poster', this.$scope)
    const { photo } = this.props
    const { exif } = photo

    const localPath = await this.loadImage(url);

    if(!localPath) {
      Taro.showToast('海报生成失败~')
      this.canvasContext = null;
    }

    const borderWidth = 10;
    context.setFillStyle('white')
    context.fillRect(0, 0, width, realHeight)
    context.setLineWidth(borderWidth)


    context.drawImage(localPath, borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2)

    if(this.state.showExif) {
      context.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      const x1 = borderWidth, y1 = height + 15
      const deltax = width / 2 - 10, deltay = 22
      for (let index = 0; index < EXIFS.length; index++) {
        const { text, render, field } = EXIFS[index];
        let value = (render ? render(exif[field]) : exif[field]) || '--'
        context.setFontSize(12)
        context.setFillStyle('#bbb')
        const x = !(index % 2) ? x1 : x1 + deltax
        const y = !(index % 2) ? y1 + index * deltay : y1 + (index - 1) * deltay
        context.fillText(text, x, y)
        context.setFontSize(20)
        value = this.getEllipseText(context, value, deltax)
        context.setFillStyle('black')
        context.fillText(value,x, y + 20)
      }
    }
    context.draw()
  }

  getEllipseText(context, value, maxWidth) {
    if(context.measureText(value).width > maxWidth) {
      while (context.measureText(value + '...').width > maxWidth) {
        value = value.substring(0, value.length - 1)
      }
      return value + '...'
    }
    return value
  }

  getPhotoRect(windowWidth, pw, ph) {
    const width = windowWidth * 0.9;
    const height = width / pw * ph
    return {
      width,
      height
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
    Taro.saveImageToPhotosAlbum({
      filePath
    })
  }

  toggleExif() {
    this.setState({
      showExif: !this.state.showExif
    })
  }


  async openActionSheet() {
    const { showExif } = this.state
    const { tapIndex } = await Taro.showActionSheet({
      itemList: ['保存', `${showExif ? '不' : ''}展示EXIF`, '关闭'],
    })
    if(tapIndex == 0) {
      this.handleSave()
    }else if(tapIndex === 1){
      this.toggleExif()
    } else if(tapIndex === 2) {
      this.props.onClose()
    }
  }

  render () {
    let { pWidth, realHeight, pHeight, showExif } = this.state
    if(!showExif) {
      realHeight = pHeight
    }
    return (
      <View className='poster'>
        {/* <View className='poster-modal' > */}
        <Canvas canvasId='poster' onLongPress={this.openActionSheet} className='poster-canvas' onError={this.logErrror}  style={{height: realHeight + 'px', width: pWidth + 'px'}}></Canvas>
        {/* </View> */}
        <CoverView className='poster-opreation' onClick={this.openActionSheet}>
          <CoverView className='icon'></CoverView>
          <CoverView className='icon'></CoverView>
          <CoverView className='icon'></CoverView>
        </CoverView>
      </View>
    )
  }
}

