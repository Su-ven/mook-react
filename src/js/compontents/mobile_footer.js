/**
 * 
 * @authors Suven
 * @date    2017-04-05 14:35:30
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import {Menu, Icon} from 'antd';
import { Button } from 'antd';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';
import 'antd/dist/antd.css';
import MobileStyle from '../../css/mobile.css';
import LogoImg from '../../images/logo.png'

class MobileFooter extends React.Component{
	render(){
		return (
			<footer className="footer">
				<Row>
					<Col span={2}></Col>
					<Col span={20}>
						&copy; &nbsp; 2016 ReactNews. All Right Reserved.
					</Col>
				</Row>
			</footer>
		)
	}
}

export default MobileFooter;