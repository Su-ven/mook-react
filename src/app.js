/**
 * 
 * @authors Suven
 * @date    2017-03-29 16:11:46
 */

/**
 * 
 * @authors Suven
 * @date    2017-03-28 15:50:45
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import {Router, Route, hashHistory} from 'react-router';
import 'antd/dist/antd.css';
import PCIndex from './js/pc_index';
import PCNewsDetails from './js/compontents/pc_news_details';
import MobileNewsDetails from './js/compontents/mobile_news_details';
import MobileIndex from './js/mobile_index';
import PCUserCenter from './js/compontents/pc_usercenter';
import MobileUserCenter from './js/compontents/mobile_usercenter';
import MediaQuery from 'react-responsive';

class App extends React.Component{
	render(){
		return(
			<div>
				<MediaQuery query='(min-device-width: 1224px)'>
					<Router history={hashHistory}>
						<Route path="/" component={PCIndex}></Route>
						<Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
						<Route path="/usercenter" component={PCUserCenter}></Route>
					</Router>
				</MediaQuery>
				<MediaQuery query='(max-device-width: 1224px)'>
					<Router history={hashHistory}>
						<Route path="/" component={MobileIndex}></Route>
						<Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
						<Route path="/usercenter" component={MobileUserCenter}></Route>
					</Router>
				</MediaQuery>
			</div>
		)
	}
}

ReactDOM.render( <App /> , document.getElementById( 'root' ) );
