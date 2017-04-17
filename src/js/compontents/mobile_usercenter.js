/**
 * 
 * @authors Suven
 * @date    2017-04-12 14:22:39
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Row, Col, BackTop} from 'antd';
import {Router, Route, Link, browserHistory} from 'react-router';
import {
	Form,
	Menu,
	Icon,
	Tabs,
	message,
	Input,
	Button,
	CheckBox,
	Modal,
	Carousel
} from 'antd';
import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';
import CommonComments from './common_comments';
const TabPane = Tabs.TabPane;

class MobileUserCenter extends React.Component{
	render() {
		return(
			<div>
				<MobileHeader/>
				<Row>
					<Col span={24}>
						<Tabs>
							<TabPane tab="我的收藏列表" key="1">
								
							</TabPane>
							<TabPane tab="我的评论列表" key="2">
								
							</TabPane>
							<TabPane tab="头像设置" key="3">

							</TabPane>
						</Tabs>
					</Col>
				</Row>
				<MobileFooter/>
			</div>
		);
	}	
}

export default MobileUserCenter;