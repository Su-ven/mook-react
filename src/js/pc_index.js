/**
 * 
 * @authors Suven
 * @date    2017-03-30 11:20:34
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PCHeader from './compontents/pc_header';
import PCFooter from './compontents/pc_footer';
import PCNewsContainer from './compontents/pc_news_container';

class PCIndex extends React.Component{
	render(){
		return(
			<div>
				<PCHeader />
				<PCNewsContainer />
				<PCFooter />
			</div>
		)
	}
}

export default PCIndex;
