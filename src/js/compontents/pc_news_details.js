/**
 * 
 * @authors Suven
 * @date    2017-04-11 14:32:20
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Row, Col, BackTop} from 'antd';
import PCHeader from './pc_header';
import PCFooter from './pc_footer';
import CommonComments from './common_comments';
import PCNewsImagesBlock from './pc_news_images_block';

class PCNewsDetails extends React.Component{
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
		return(
			<div>
				<PCHeader />
				<Row>
					<Col span={2}></Col>
					<Col span={14} className="container">
						<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()}></div>

						<hr />

						<CommonComments uniquekey={this.props.params.uniquekey}/>
					</Col>
					<Col span={6}>
						<PCNewsImagesBlock count={12} type="top" width="100%" cartTitle="相关新闻" imageWidth="150px" />
					</Col>
					<Col span={2}></Col>
				</Row>
				<PCFooter />
				<BackTop />
			</div>
		)
	}
}
export default PCNewsDetails;