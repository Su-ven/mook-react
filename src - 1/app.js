/**
 * Created by 51212 on 2017/3/9.
 */
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import Tabs from './js/Tabs';
import TabPane from './js/TabPane';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      activeIndex: 1,
    };
  }

  handleChange(e) {
    this.setState({
      activeIndex: parseInt(e.target.value, 10),
    });
  }

  render() {
    return (
      <div>
        <div className="operator">
          <span>切换 Tab：</span>
          <select value={this.state.activeIndex} onChange={this.handleChange}>
            <option value="0">Tab 1</option>
            <option value="1">Tab 2</option>
            <option value="2">Tab 3</option>
          </select>
        </div>
        <Tabs defaultActiveIndex={ this.state.activeIndex } className = "tabs-bar">
        	<TabPane order="0" tab={ 'Tab 1' }> 第一个Tab内容 </TabPane>
        	<TabPane order="1" tab={ 'Tab 2' }> 第二个Tab内容 </TabPane>
        	<TabPane order="2" tab={ 'Tab 3' }> 第三个Tab内容 </TabPane>
        </Tabs>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));