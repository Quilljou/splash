import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'
import './index.styl'

class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      value: ''
    }
  }
  componentWillMount () { }

  componentWillReact () {}

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value) {

    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleBlur() {
    this.setState({
      focused: false
    })
  }

  handleFoucs() {
    this.setState({
      focused: true
    })
  }

  handleInput(e) {
    this.setState({
      value: e.detail.value
    })
  }

  handleSearch() {
    this.props.onSearch(this.state.value)
  }

  render () {
    const { focused } = this.state
    return (
      <View className={classnames(['search-bar', { 'search-bar_focus': focused }])}>
        <Input placeholder='搜索' focus
          className='search-bar-input'
          onFocus={this.handleFoucs}
          onBlur={this.handleBlur}
          onInput={this.handleInput}
        />
        <Text className='iconfont icon-sousuo5' onClick={this.handleSearch}></Text>
      </View>
    )
  }
}

export default Index
