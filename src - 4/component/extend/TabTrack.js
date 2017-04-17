import {Table as SuTable} from './../../libs/ui-extend';
import flux from './../flux/track';
import Config from './../config';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '姓名',
            dataIndex: 'operatorName',
            key: 'operatorName',
            sorter: true,
        }, {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
        }, {
            title: '内容',
            dataIndex: 'contents',
            key: 'contents',
            sorter: false,
        }];
        return <SuTable columns={columns} flux={flux} params={{"targetId$": this.props.customerId}}/>;
    }
});