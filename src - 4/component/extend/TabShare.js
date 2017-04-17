import flux from './../flux/share';
import {Table as SuTable} from './../../libs/ui-extend';
import Config from './../config';

export default React.createClass({
    render()
    {
        let columns = [{
            title: '修改前状态',
            dataIndex: 'clientStatusOld',
            key: 'clientStatusOld',
            sorter: true,
            render: (text, record, index) => {
                return Config.clientStatus.filter(it => it.value == text).map(it => it.text);
            }
        }, {
            title: '修改后状态',
            dataIndex: 'clientStatusNew',
            key: 'clientStatusNew',
            sorter: true,
            render: (text, record, index) => {
                return Config.clientStatus.filter(it => it.value == text).map(it => it.text);
            }
        }, {
            title: '操作时间',
            dataIndex: 'actionTime',
            key: 'actionTime',
            sorter: true
        }, {
            title: '操作人',
            dataIndex: 'employeeId',
            key: 'employeeId',
            sorter: true
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId$": this.props.customerId}}/>;
    }
});