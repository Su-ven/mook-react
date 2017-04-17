import {Table as SuTable} from './../../libs/ui-extend';
import flux from '../flux/ucenter';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '日期',
            dataIndex: 'time',
            key: 'time',
            sorter: true,
        }, {
            title: '客户',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        }, {
            title: '变动字段',
            dataIndex: 'field',
            key: 'field',
            sorter: true,
        }, {
            title: '消息',
            dataIndex: 'message',
            key: 'message',
            sorter: true,
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId":this.props.customerId}}/>;
    }
});