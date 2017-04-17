import React, { Component, PropTypes, cloneElement } from 'react';
import classnames from 'classnames';
import TabNav from './TabNav';
import TabContent from './TabContent';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import CSSModules from 'react-css-modules';
import styles from '../css/style.scss';
import { Seq } from 'immutable';

@immutableRenderDecorator
@CSSModules(styles, { allowMultiple: true })
class Tabs extends Component{
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf( PropTypes.node ),
      PropTypes.node
    ])
  }

  constructor(props) {
    super(props);
    const currProps = this.props;

    this.handleTabClick = this.handleTabClick.bind( this );
    this.immChildren = Seq( currProps.children );

    let activeIndex;
    activeIndex = currProps.activeIndex;
    this.state = {
      activeIndex,
      prevIndex: activeIndex
    }
  }

  handleTabClick(activeIndex){
    if (this.state.activeIndex != activeIndex) {
      this.setState({
        activeIndex
      })
    }
  }

  renderTabNav(){
    return (
      <TabNav 
        key = "tabBar"
        onTabClick = {this.handleTabClick}
        panels = {this.immChildren}
        activeIndex = {this.state.activeIndex}
      />
    )
  }

  renderTabContent(){
    return (
      <TabContent 
          key="tabcontent"
          activeIndex = {this.state.activeIndex}
          panels={this.immChildren}
      />
    )
  }

  render(){
    const {className} = this.props;
    const cx = classnames(className, 'ui-tabs')

    return (
      <div className={cx}>
        {this.renderTabNav()}
        {this.renderTabContent()}
      </div>
    )
  }
}

export default Tabs;