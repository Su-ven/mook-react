/**
 * 
 * @authors Suven
 * @date    2017-04-05 10:19:08
 */

import React from 'react';
import ReactDOM from 'react-dom';
import MobileHeader from './compontents/mobile_header';
import MobileFooter from './compontents/mobile_footer';
import MobileList from './compontents/mobile_list';
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

import carousel1 from '../images/carousel_1.jpg';
import carousel2 from '../images/carousel_2.jpg';
import carousel3 from '../images/carousel_3.jpg';
import carousel4 from '../images/carousel_4.jpg';

const TabPane = Tabs.TabPane;

class MobileIndex extends React.Component{
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
				<MobileHeader />
				<Tabs>
					<TabPane tab="头条" key="1">
						<div className="carousel">
							<Carousel {...settings}>
								<div><img src={carousel1}/></div>
								<div><img src={carousel2}/></div>
								<div><img src={carousel3}/></div>
								<div><img src={carousel4}/></div>
							</Carousel>
						</div>
						<MobileList count={20} type="top" width="100%" bordered="false"/>
					</TabPane>
					<TabPane tab="社会" key="2">
						<MobileList count={20} type="shehui" width="100%" bordered="false"/>
					</TabPane>
					<TabPane tab="国内" key="3">
						<MobileList count={20} type="guonei" width="100%" bordered="false"/>
					</TabPane>
					<TabPane tab="国际" key="4">
						<MobileList count={20} type="guoji" width="100%" bordered="false"/>
					</TabPane>
					<TabPane tab="娱乐" key="5">
						<MobileList count={20} type="yule" width="100%" bordered="false"/>
					</TabPane>
				</Tabs>
				<MobileFooter />
			</div>
		)
	}
}

export default MobileIndex;