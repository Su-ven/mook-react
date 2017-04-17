import {Router, Route, IndexRoute, Link, useRouterHistory} from 'react-router'
import {createHashHistory} from 'history'

import {TableMixin} from './libs/ui-core';
import {TableMixin as UtilTableMixin} from './libs/ui-extend';
import ListMixin from './component/listMixinFirmoffer';
import flux from './component/flux/listFirmOffer';

import Detail from './component/detail';
import {Layout} from './libs/ui-core';
import SideSearch from './component/extend/SideSearch';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false})

window.prefix = "";
window.userId = "";

window._init_ = function (data, roles, ifOnDuty, config, portal) {
    window.portal = portal;
    window.prefix = "/sl";
    window.userId = data.userInfo.id;
    window.siteUrlConfig = config;
    window.clientType = 3; // 实盘

    var menus = data.menus;
    var userInfo = data.userInfo;
    var sites = data.sites;
    var addon = (<SideSearch roles={roles}></SideSearch>);
    
    ReactDOM.render(
    <Router history={appHistory}>
        <Route path="/" component={
            React.createClass({
                render: function() { return (
                    <Layout currentMenu="menu_0_0" menus={menus} userInfo={userInfo} sites={sites} addonSide={addon}>{this.props.children}</Layout>
                );}
            }) 
        }>
            <IndexRoute  component={
                React.createClass({
                    mixins: [TableMixin(flux), UtilTableMixin(), ListMixin(flux, "实盘客户")],
                })
            } ignoreScrollBehavior/>
        </Route>
        <Route path="/detail/:customerId" component={     
            React.createClass({
                render: function() { return (
                    <div style={{margin: "20px"}}>{this.props.children}</div>
                );}
            })
        }>
            <IndexRoute component={Detail}/>
        </Route>
    </Router>, document.getElementById('content'));
}
