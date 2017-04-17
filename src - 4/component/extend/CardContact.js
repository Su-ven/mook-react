import {Timeline,Card,Tooltip} from 'antd';
import {UtilTool} from './../../libs/ui-core';
import {BtnMusic} from './../../libs/ui-extend';
import SideForm from './CardContactForm';
import fluxDetail from '../flux/detail';

let contactTypeObj = {"1": "电话", "2": "53", "3": "QQ", "4": "邮件", "5": "短信", 
    "6": "手机呼入", "7": "手机呼出", "8": "到访", "9": "其他"};

let RightSide = React.createClass({
    getInitialState: function () {
        return {
            customerId: this.props.customerId,
            data: [],
        }
    },
    fetchInfo(){
        let params = {"customerId$": this.props.customerId};
        fluxDetail.actions.fetchContactRecord(params, (result) => {
            this.setState({"data": result.resultList});
        }, (error) => {
            UtilTool.error("获取回访记录信息,数据错误：" + error);
        });
    },
    componentDidMount() {
        this.fetchInfo();
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.customerId) {
            if (this.state.customerId != nextProps.customerId) {
                this.setState({"customerId": nextProps.customerId}, function () {
                    this.fetchInfo();
                });
            }
        }
    },
    render() {
        const renderTimeline1 = data => data.map((item)=> {

            let useTime = (item.messageType == 1 && !!item.linkStartTime) ? item.linkStartTime : item.createTime;

            let timeObj = useTime;
            item.timeAlias=UtilTool.getDateDiff(useTime);
            if (item.timeAlias) {
                timeObj = <Tooltip placement="top" title={useTime}><a>{item.timeAlias}</a></Tooltip>;
            }

            let audioObj = "";
            if (item.messageType == "1") {
                audioObj = (<BtnMusic src={item.filePath} seconds={item.lenTalk}></BtnMusic>);
            }

            return <Timeline.Item color="green">
                <b></b>{timeObj}, {useTime}<br/>
                <p>{item.employeeName}"{contactTypeObj[item.contactType]}"联系了客户</p>
                <p>{item.messageContent}</p>
                <p>{audioObj}</p>
            </Timeline.Item>;
        });
        let extra = this.props.extra ? this.props.extra : "";
        return <Card title="回访记录" className="side_card" extra={extra}>
            { window.ssm ? undefined : <SideForm customerId={this.props.customerId} okCallback={this.fetchInfo}/> }
            <Timeline>
                {renderTimeline1(this.state.data)}
            </Timeline>
        </Card>;
    }
});
export default RightSide;
