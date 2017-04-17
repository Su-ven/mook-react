/**
 * 
 * @authors Suven
 * @date    2017-04-10 14:56:41
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
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

const TabPane = Tabs.TabPane;

import PCNewsBlock from './pc_news_block';
import PCNewsImagesBlock from './pc_news_images_block';

import carousel1 from '../../images/carousel_1.jpg';
import carousel2 from '../../images/carousel_2.jpg';
import carousel3 from '../../images/carousel_3.jpg';
import carousel4 from '../../images/carousel_4.jpg';

class PCNewsContainer extends React.Component{
	render(){
		const settings = {
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			autoplay: true
		}
		return(
			<div>
				<Row>
					<Col span={2}></Col>
					<Col span={20} className="container">
						<div className="leftContainer">
							<div className="carousel">
								<Carousel {...settings}>
									<div><img src={carousel1}/></div>
									<div><img src={carousel2}/></div>
									<div><img src={carousel3}/></div>
									<div><img src={carousel4}/></div>
								</Carousel>
							</div>
						<PCNewsImagesBlock count={6} type="guoji" width="400px" cartTitle="国际头条" imageWidth="112px" />
						</div>
						<Tabs className="tabs_news">
							<TabPane tab="新闻" key="1">
								<PCNewsBlock count={21} type="top" width="100%" bordered="false"/>
							</TabPane>
							<TabPane tab="国际头条" key="2">
								<PCNewsBlock count={21} type="guoji" width="100%" bordered="false"/>
							</TabPane>
							<TabPane tab="国内新闻" key="3">
								<PCNewsBlock count={21} type="guoji" width="100%" bordered="false"/>
							</TabPane>
							<TabPane tab="娱乐新闻" key="4">
								<PCNewsBlock count={21} type="yule" width="100%" bordered="false"/>
							</TabPane>
						</Tabs>
						<div>
							<PCNewsImagesBlock count={11} type="guonei" width="100%" cartTitle="国内新闻" imageWidth="131px" />
							<PCNewsImagesBlock count={22} type="yule" width="100%" cartTitle="娱乐新闻" imageWidth="131px" />
						</div>
					</Col>
					<Col span={2}></Col>
				</Row>
			</div>
		)
	}
}

export default PCNewsContainer;