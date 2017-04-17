import flux from './../flux/saler';
import {Table as SuTable} from './../../libs/ui-extend';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '客户经理',
            dataIndex: 'metalEmployeeName',
            key: 'metalEmployeeName',
            sorter: true
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            sorter: true
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            sorter: true
        }, {
            title: '操作人',
            dataIndex: 'operator',
            key: 'operator',
            sorter: true
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId$":this.props.customerId}}/>;
    }
});