import {Router, Route, IndexRoute, Link, useRouterHistory} from 'react-router'

import InfiniteTableMixin from './libs/InfiniteTableMixin';
import {TableMixin as UtilTableMixin} from './libs/ui-extend';
import ListMixin from './component/listMixinPotential';
import flux from './component/flux/listPotential';

import {createHashHistory} from 'history'
import Detail from './component/detail';
import {Layout} from './libs/ui-core';
import SideSearch from './component/extend/SideSearch';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

window.prefix = "";
window.userId = "";

window._init_ = function (data, roles, ifOnDuty, config, portal) {
    window.portal = portal;
    window.prefix = "/sm";
    window.userId = data.userInfo.id;
    window.ssm = true;
    window.siteUrlConfig = config;
    window.clientType = 1; // 潜在

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
            <IndexRoute component={
                React.createClass({
                    mixins: [InfiniteTableMixin(flux), UtilTableMixin(), ListMixin(flux, "潜在客户")],
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
