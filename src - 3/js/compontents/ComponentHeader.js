/**
 * 
 * @authors Suven
 * @date    2017-03-28 15:54:05
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Link} from 'react-router';

class ComponentHeader extends React.Component{
	render(){
		return (
			<header>
				<h1>header</h1>
				<a>跳轉</a>
				<ul>
					<li><Link to={`/`}>首页</Link></li>
					<li><Link to={`/list`}>列表</Link></li>
					<li><Link to={`/detail`}>详情页</Link></li>
				</ul>
			</header>
		)
	}
}

export default ComponentHeader;