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
import ComponentHeader from './compontents/ComponentHeader';
import ComponentContent from './compontents/ComponentContent';
import ComponentFooter from './compontents/ComponentFooter';

class Index extends React.Component{
	render(){
		return (
			<div>
				<ComponentHeader />
				<ComponentContent userid = "123456"/>
				<div>
					{this.props.children}
				</div>
				<ComponentFooter />
			</div>
		)
	}
}

export default Index;