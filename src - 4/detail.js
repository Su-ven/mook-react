import Detail from './component/detail';
import {message, Row} from 'antd';
const URL = require('url');

window.prefix = "";
window.userId = "";

window._init_ = function (data, roles) {
    window.prefix = "/am";
    window.userId = data.userInfo.id;

    var params = URL.parse(window.location.href, true); 
    
    if(params.query.cid) {
    	ReactDOM.render(<div style={{margin: "20px"}}>
    		<Detail location={{query:{}}} params={{customerId: params.query.cid}}/>
    	</div>, document.getElementById('content'));
    } else {
    	message.error("缺少cid参数");
    }
    
}
