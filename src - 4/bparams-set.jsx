import {Router, Route, Link, useRouterHistory} from "react-router";
import {createHashHistory} from "history";
import BusinessParams from "./component/BParamsSet/index";
import {Layout} from './libs/ui-core';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

window._init_ = function (data, roles) {
    var menus = data.menus;
    var userInfo = data.userInfo;
    var sites = data.sites;

    ReactDOM.render(<Layout currentMenu="menu_0_0" menus={menus} userInfo={userInfo} sites={sites}>
        <Router history={appHistory}>
            <Route path="/" component={
                React.createClass({
                    render(){
                        return <BusinessParams/>;
                    }
                })
            } ignoreScrollBehavior/>
        </Router>
    </Layout>, document.getElementById('content'));
}