/**
 * 
 * @authors Suven
 * @date    2017-03-29 10:43:19
 */

import React from 'react';
import ReactDom from 'react-dom';

class ComponentChild extends React.Component{
	render(){
		return (
			<div>
				<p>子页面输入 ： <input type="text" onChange={this.props.handleChildValueChange}/> </p>
			</div>
		)
	}
}

export default ComponentChild;