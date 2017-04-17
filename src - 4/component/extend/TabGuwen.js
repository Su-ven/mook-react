import {Table as SuTable} from './../../libs/ui-extend';
import flux from '../flux/guwen';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '直播间',
            dataIndex: 'zhibojian',
            key: 'zhibojian',
            sorter: true,
        }, {
            title: '顾问',
            dataIndex: 'guwen',
            key: 'guwen',
            sorter: true,
        }, {
            title: '选择时间',
            dataIndex: 'time',
            key: 'time',
            sorter: true,
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
        }, {
            title: '选择时长',
            dataIndex: 'lastTime',
            key: 'lastTime',
            sorter: true,
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId": this.props.customerId}}/>;
    }
});