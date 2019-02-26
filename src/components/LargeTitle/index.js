import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.styl';


export default class LargeTitle extends Component {
	static defaultProps = {
		title: '',
		useChildren: false
	};

	componentWillMount() {}

	componentDidMount() {}

	componentWillUnmount() {}

	componentDidShow() {}

	componentDidHide() {}

	render() {
		const { title, useChildren } = this.props;
		if (!title) return null;
		return (
			<View className='largetitle-container'>
				<View className='largetitle-left'>{title}</View>
				{useChildren ? <View className='largetitle-right'>{this.props.children}</View> : null}
			</View>
		);
	}
}
