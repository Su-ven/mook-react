/**
 * 
 * @authors Suven
 * @date    2017-04-11 14:32:20
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Row, Col, BackTop} from 'antd';
import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';
import CommonComments from './common_comments';

class MobileNewsDetails extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			newsItem: ''
		}
	}

	componentDidMount() {
		var myFetchOptions = {
			method: 'GET'
		}

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=" + this.props.params.uniquekey, myFetchOptions)
		.then(response => response.json())
		.then(json => {
			this.setState({newsItem: json});
			document.title = this.state.newsItem.title + ' - React News | React 新闻平台';
		});
	}

	createMarkup(){
		return {__html: this.state.newsItem.pagecontent}
	}

	render(){
		console.log(this.props);

		return(
			<div id="mobileDetailsContainer">
				<MobileHeader />
				<div className="ucmobileList">
					<Row>
						<Col span={24} className="container">
							<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()}></div>
							<hr />
							<CommonComments uniquekey={this.props.params.uniquekey}/>
						</Col>
					</Row>
				</div>
				<MobileFooter />
				<BackTop />
			</div>
		)
	}
}
export default MobileNewsDetails;