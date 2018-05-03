import React,{Component} from 'react'
import {
	ScrollView,
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
	Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';
import pxToDp from "../../util/pxToDp";
import {formatDate, formatDateAndTime, formatTime} from "../../util/formatTime";
import {wrapComponent} from "react-eflow/lib/eflow";
import OAStore from "../../store";
import {findUserBy} from '../../request/userRequest'
import {host} from "../../config";


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class DailyReportList extends Component{
	constructor(props){
		super(props)
		this.state = {
			// colleague: []
		}
	}
	getDepartmentUser(search) { //{key,value}  // return []
		return new Promise((resolve, reject) => {
			fetch(host + '/api/user/findBy',{
				method: 'POST',
				headers: {
					"Content-type":"application/json",
					"Authorization":`Bearer ${token}`
				},
				body: JSON.stringify(search)
			})
				.then((res)=>res.json())
				.then(res=>{
					// console.log(res);
					// debugger
					resolve(res.result)
				})
				.catch(err=>{
					reject(err)
				})
		})
	}
	
	componentWillMount(){
		OAStore.userList();
		this.getDepartmentUser({key:'departmentId', value: this.props.userCompletedInfo.departmentId})
			.then(res=>{
				let ums = [];
				res.forEach(user=>ums.push(user.um));
				// debugger
				OAStore.groupDailyReportList(ums)
			})
			.catch(err=>console.error(err))
	}
	um2Name(um){
		let name;
		this.props.userList.forEach((user,i)=>{
			if(user.um === um) name = user.name;
		})
		return name;
	}
	render(){
		// console.log(this.props.groupDailyReportList); // 时间倒序
		let {groupDailyReportList} = this.props;
		// debugger;
		let data = {};
		groupDailyReportList.forEach((report,i)=>{
			if(!data.hasOwnProperty(report.date)) {
				data[report.date] = [];
			}
			data[report.date].push(report)
		});
		// console.log(data);
		
		let listView = Object
			.keys(data)
			.sort((a,b)=>a-b)
			.map((dateKey,i)=>{
				let reports = data[dateKey];
				this.days = i;
				return (
					<View style={{flex:1,width: WIDTH}} key={Math.random()}>
						<ScrollView style={styles.slide}>
							{reports.map(report=>{
								return (
									<View style={styles.report} key={Math.random()}>
										<View style={styles.reportTitle}>
											<Text style={styles.reportTitleText}>{this.um2Name(report.employeeUm)}</Text>
										</View>
										<View style={styles.reportContent}>
											<View style={styles.reportItem}>
												<Text style={styles.key}>完成工作:</Text>
												<Text style={styles.value}>{report.finished}</Text>
											</View>
											<View style={styles.reportItem}>
												<Text style={styles.key}>遗留工作:</Text>
												<Text style={styles.value}>{report.unfinished}</Text>
											</View>
											<View style={styles.reportItem}>
												<Text style={styles.key}>工时:</Text>
												<Text style={styles.value}>{report.workHours}</Text>
											</View>
										</View>
									</View>
								)
							})}
						</ScrollView>
						<View style={styles.absolute}>
							<Text style={styles.text}>{formatDate(reports[0].date)}</Text>
						</View>
					</View>
				)
		});
		return (
			<View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
				<ScrollView
					horizontal={true}
					ref={(scrollView) => { this._scrollView = scrollView;}}
					pagingEnabled={true}
					showsHorizontalScrollIndicator={false}
					onContentSizeChange={()=>{this._scrollView && this._scrollView.scrollToEnd({animated: false})}}
				>
					{listView}
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		// width: WIDTH * 0.9,
		// height: HEIGHT * 0.9,
		// backgroundColor: '#ccc',
	},
	absolute:{
		position:'absolute',
		width:WIDTH,
		height:pxToDp(90),
		top: pxToDp(0),
		justifyContent:'center',
		alignItems:'center',
		backgroundColor: '#f0f0f0',
		
		// borderBottomWidth:pxToDp(1),
		// borderBottomColor:'#ccc'
	},
	slide: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: '#f0f0f0',
		marginTop:pxToDp(90),
	},
	text: {
		color: '#333',
		fontSize: 16,
		fontWeight: 'bold',
	},
	report:{
		// height: pxToDp(300),
		marginHorizontal: pxToDp(50),
		marginBottom: pxToDp(50),
		backgroundColor: '#FFDC64',
		// backgroundColor:'#FFEC8B',
		borderRadius:pxToDp(30),
		overflow:'hidden'
		// justifyContent:'center',
		// alignItems:'center',
	},
	reportTitle: {
		height: pxToDp(80),
		paddingLeft: pxToDp(48),
		justifyContent:'center',
		borderBottomColor:'#ccc',
		borderBottomWidth:pxToDp(1)
	},
	reportTitleText: {
		fontSize: pxToDp(52),
		color: '#8A8A8F'
	},
	reportContent: {
		flex:1,
		// marginLeft: pxToDp(48),
		marginVertical: pxToDp(20)
	},
	reportItem:{
		flex:1,
		flexDirection:'row',
		marginTop:pxToDp(10),
		// borderColor:'#ccc',
		// borderWidth:1,
		alignItems:'flex-start',
		marginVertical: pxToDp(10)
		
	},
	key:{
		width:pxToDp(150),
		color:'#333',
		fontSize:14,
		fontWeight:'bold',
		marginLeft:pxToDp(30),
	},
	value:{
		flex:1,
		fontSize:12,
		color:'#555555',
		marginLeft:pxToDp(20),
	}
})

export default wrapComponent(DailyReportList,[OAStore.userCompletedInfo,OAStore.groupDailyReportList,OAStore.userList])