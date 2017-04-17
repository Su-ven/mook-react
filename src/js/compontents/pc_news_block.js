/**
 * 
 * @authors Suven
 * @date    2017-04-10 14:57:07
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {
	Card,
	Row,
	Col
} from 'antd';
import {
	Router,
	Route,
	Link,
	browserHistory
} from 'react-router';
import {
	Form,
	Menu,
	Icon,
	Tabs,
	message,
	Input,
	Button,
	CheckBox,
	Modal
} from 'antd';

class PCNewsBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			news: ''
		}
	}

	componentWillMount() {
		var myFetchOptions = {
			method: 'GET'
		};

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=" + this.props.type + "&count=" + this.props.count, myFetchOptions)
			.then(response => response.json())
			.then(json => this.setState({
				news: json
			}));
	}

	render() {

		const {
			news
		} = this.state;
		const newsList = news.length ?
			news.map((newsItem, index) => (
				<li key={index}>
				<Link to={`details/${newsItem.uniquekey}`} target="_blank">{newsItem.title}</Link>
			</li>
			)) :
			"没有加载任何新闻";

		return (
			<div className="topNewsList">
				<Card>
					<ul>
						{newsList}
					</ul>
				</Card>
			</div>
		)
	}
}

export default PCNewsBlock;