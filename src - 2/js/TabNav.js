import React, { Component, PropTypes, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import CSSModules from 'react-css-modules';
import { Motion, spring } from 'react-motion';
import styles from '../css/style.scss';
import InkBar from './InkBar';

@immutableRenderDecorator
@CSSModules(styles, { allowMultiple: true })

class TabNav extends Component{
      static propTypes = {
        panels: PropTypes.object,
        activeIndex: PropTypes.number
      }

      constructor(props) {
        super(props);
        this.state = {
          inkBarLeft: 0,
          inkBarWidth: 0
        }
      }

      getTabs(){
        const { panels, activeIndex } = this.props;

        return panels.map(( child ) => {
          if ( !child ) { return; }       
          const order = parseInt(child.props.order, 10);

          let classes = classnames( {
            tab: true,
            tabActive: activeIndex == order,
            disabled: child.props.disabled
          } )

          let events = {};
          if ( !child.props.disabled ) {
            events = {
              onClick: this.props.onTabClick.bind(this, order)
            }
          }

          const ref = {};
          if ( activeIndex == order ) {
            ref.ref = 'activeTab'
          }

          return (
            <li
              role="tab"
              aria-disabled={child.props.disabled ? 'true' : 'false'}
              aria-selected={activeIndex === order? 'true' : 'false'}
              styleName = {classes}
              key = {order}
              {...ref}
              {...events}
            >
              {child.props.tab}
            </li>
          )

        })
      }

      render(){
        const {activeIndex} = this.props;
        const rootClasses = classnames({
          bar: true
        });
        const classes = classnames({
          nav:true
        })

        return(
          <div styleName={rootClasses} role="tablist">
            <Motion style={{ left: spring(this.state.inkBarLeft) }}>
              {({ left }) => <InkBar width={this.state.inkBarWidth} left={left} />}
            </Motion>
            <ul styleName={classes}>
              {this.getTabs()}
            </ul>
          </div>
        )
      }
}

export default TabNav;