import {Timeline, Card, Tooltip, Row, Col, } from 'antd';
import fluxDetail from '../flux/detail';
import {UtilTool} from './../../libs/ui-core';
import Config from './../config';

let RightSide = React.createClass({
    getInitialState: function () {
        return {
            customerId: this.props.customerId,
            data: [],
        }
    },
    fetchInfo(){
        fluxDetail.actions.fetchTrackRecord({"targetId$": this.props.customerId}, (result) => {
            let data = result.resultList;
            this.setState({"data": data});
        }, (error) => {
            UtilTool.error("获取更新记录信息,数据错误：" + error);
        });
    },
    componentDidMount() {
        this.fetchInfo();

        fluxDetail.register(this, "cardTrack");
    },
    componentWillUnmount() {
        fluxDetail.unregister("cardTrack");
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
        const renderTimeline = data => data.map((item)=> {
            let timeObj = item.createTime;
            item.timeAlias = UtilTool.getDateDiff(item.createTime);
            if (item.timeAlias) {
                timeObj = <Tooltip placement="top" title={item.createTime}><a href="#">{item.timeAlias}</a></Tooltip>;
            }
            let who = item.operatorName;
            // TODO: 这种文本替换太重 后期整改
            return <Timeline.Item color="green">
                {timeObj}, {item.createTime}<br/>
                <p>{who}</p>
                <p>{item.contents}</p>
            </Timeline.Item>;
        });
        let extra = this.props.extra ? this.props.extra : "";
        return <Card title="更新记录" className="side_card" extra={extra}>
            <Timeline>
                {renderTimeline(this.state.data)}
            </Timeline>
        </Card>;
    }
});
export default RightSide;