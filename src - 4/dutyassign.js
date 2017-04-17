import {Layout} from './libs/ui-core';

import DutyFormManager from './component/DutyAssignManager';

window._init_ = function (data) {
    var menus = data.menus;
    var userInfo = data.userInfo;
    var sites = data.sites;

    ReactDOM.render(<Layout menus={menus} userInfo={userInfo} sites={sites}>
        <DutyFormManager/>
    </Layout>, document.getElementById('content'));
}

