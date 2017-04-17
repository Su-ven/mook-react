import {Table as SuTable} from './../../libs/ui-extend';
import flux from './../flux/process';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '变动时间',
            dataIndex: 'time',
            key: 'time',
            sorter: true,
        }, {
            title: '变动负责人',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        }, {
            title: '变动的状态',
            dataIndex: 'content',
            key: 'content',
            sorter: true,
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId":this.props.customerId}}/>;
    }
});
