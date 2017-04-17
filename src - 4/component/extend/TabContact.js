import flux from '../flux/contact';
import {Table as SuTable,BtnMusic} from './../../libs/ui-extend';

let contactTypeObj = {"1": "电话", "2": "53", "3": "QQ", "4": "邮件", "5": "短信", 
    "6": "手机呼入", "7": "手机呼出", "8": "到访", "9": "其他"};

export default React.createClass({
    render()
    {
        let columns = [{
            title: '回访人',
            dataIndex: 'employeeName',
            sorter: true,
        }, {
            title: '方式',
            dataIndex: 'contactType',
            sorter: true,
            render: (text, record, index) => {
                return contactTypeObj[text];
            }
        }, {
            title: '时间',
            dataIndex: 'createTime',
            sorter: true,
            render: (text, record) => {
                let useTime = (record.messageType == 1 && !!record.linkStartTime) ? record.linkStartTime : record.createTime;

                return useTime;
            }
        }, {
            title: '内容',
            dataIndex: 'messageContent',
            sorter: false,
        }, {
            title: '录音',
            dataIndex: 'audio',
            render(text, record){
                if (record.messageType == "1") {
                    return (<BtnMusic src={record.filePath} seconds={record.lenTalk}></BtnMusic>);
                }
                else {
                    return ("");
                }
            }
        }];
        return <SuTable columns={columns} flux={flux} params={{"customerId$":this.props.customerId}}/>;
    }
});