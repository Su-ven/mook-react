/**
 * 
 * @authors Suven
 * @date    2017-03-29 08:24:38
 */

import React from 'react';
import ReactDom from 'react-dom';
import ComponentChild from './ComponentChild';

class ComponentContent extends React.Component{

	static defaultProps = {
		username: '未命名',
		age: '无穷大',
		id: 123456
	}

	constructor(props) {
		super(props);
		this.state = {
			username: 'Suven',
			age: 17
		};
		this.handleChildValueChange = this.handleChildValueChange.bind( this );
	}

	handleChildValueChange( event ){
		this.setState({
			age: event.target.value
		})
	}

	render(){
		return(
			<div>
				<p>{this.state.username}</p>	
				<p>{this.state.age}</p>	
				<p>{this.props.id}</p>	
				<ComponentChild handleChildValueChange = {this.handleChildValueChange}/>
			</div>
		) 
	}
}

export default ComponentContent;