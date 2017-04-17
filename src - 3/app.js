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
import Index from './js/index';
import ComponentList from './js/compontents/ComponentList';
import ComponentDetail from './js/compontents/ComponentDetail';
import {Router, Route, hashHistory} from 'react-router';

class App extends React.Component{
	render(){
		return(
			<Router history = { hashHistory }>
				<Route component={Index} path = "/">
					<Route component={ComponentDetail} path="detail"></Route>
				</Route>
				<Route component={ComponentList} path = "list"></Route>
			</Router>
		)
	}
}

export default App;

ReactDOM.render( <App />, document.getElementById( 'root' ) );