import React, {Component} from 'react'
import {Image,View,TouchableOpacity,Text,Button} from 'react-native'
import AnnouncementList from './AnnouncementList'
import {pxToDp} from "../../util";

export default class extends Component{
	static navigationOptions = ({navigation}) => ({
		headerTitle: '公告列表',
		headerRight:
			<View style={{paddingRight:pxToDp(10)}}>
				<TouchableOpacity onPress={navigation.state.params?navigation.state.params.navigatePress:null}>
					<Image
						style={{width: pxToDp(40),height: pxToDp(40)}}
						source={require('../../resource/add.png')}/>
				</TouchableOpacity>
			</View>,
	});
	constructor(props){
		super(props)
	}
	componentDidMount(){
		let {setParams,navigate} = this.props.navigation;
		setParams({
			navigatePress:()=>navigate('AnnouncementInfoPage',{})
		})
	}
	
	render(){
		let {navigate, back, state} = this.props.navigation;
		return(
			<AnnouncementList
				navigate={(page, param) => navigate(page, param)}
				back={()=>back()}
				// isInViewMode={state.params.isInViewMode}
			/>
		)
	}
}