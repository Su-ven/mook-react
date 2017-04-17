import React, { Component, PropTypes, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import Tabs from './js/Tabs';
import TabPane from './js/TabPane';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind( this );
    this.state = {
      activeIndex: 0
    };
  }

  handleChange( e ){
    this.setState({
      activeIndex: parseInt(e.target.value, 10)
    });
  }

  render(){
    return (
      <div>
        <div className="operator">
          <span>切换</span>
          <select name="" id="" value={this.state.activeIndex} onChange={this.handleChange}>
            <option value="0"> Tab1 </option>
            <option value="1"> Tab2 </option>
            <option value="2"> Tab3 </option>
          </select>
        </div>
        <Tabs activeIndex={this.state.activeIndex} className="tabs-bar">
          <TabPane order="0" tab={'Tab 1'}> 内容一 </TabPane>
          <TabPane order="1" tab={'Tab 2'}> 内容二 </TabPane>
          <TabPane order="2" tab={'Tab 3'}> 内容三 </TabPane>
        </Tabs>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById( 'root' ));