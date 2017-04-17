import {Icon, Menu, Dropdown} from 'antd';
import './MenuColorFlag.less';
var MenuColorFlag = React.createClass({
    getDefaultProps(){
        return {showCancle: false}
    },

    getInitialState() {
        return {}
    },

    handleClick(e){
        e.domEvent.stopPropagation();
        if (typeof (this.props.onClick) == "function") {
            this.props.onClick(e.key);
        }
    },

    render() {
        let menus = [];

        if(this.props.showCancle)
            menus.push(<Menu.Item key="cancle"><b className="ico-color-flag"></b> <span className="su-icon-text">清空</span> </Menu.Item>);

        menus.push([
            <Menu.Item key="0"><b className="ico-color-flag ico-color-flag-0"></b> <span className="su-icon-text">白旗</span> </Menu.Item>,
            <Menu.Item key="1"><b className="ico-color-flag ico-color-flag-1"></b> <span className="su-icon-text">红旗</span></Menu.Item>,
            <Menu.Item key="2"><b className="ico-color-flag ico-color-flag-2"></b> <span className="su-icon-text">绿旗</span></Menu.Item>,
            <Menu.Item key="3"><b className="ico-color-flag ico-color-flag-3"></b> <span className="su-icon-text">黄旗</span></Menu.Item>,
            <Menu.Item key="4"><b className="ico-color-flag ico-color-flag-4"></b> <span className="su-icon-text">蓝旗</span></Menu.Item>,
            <Menu.Item key="5"><b className="ico-color-flag ico-color-flag-5"></b> <span className="su-icon-text">紫旗</span></Menu.Item>
        ]);

        return (<Menu onClick={this.handleClick} className="su-menu-color-flag">
            {menus}
        </Menu>);
    }
});
export default MenuColorFlag;