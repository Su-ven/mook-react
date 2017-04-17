import {Form, Row, Col, Button, Icon, Modal, Menu, Dropdown, DatePicker, Input, Select, message, Checkbox } from 'antd';
import {UtilTool} from './../../libs/ui-core';
import {Table as SuTable} from './../../libs/ui-extend';
import fluxBatch from '../flux/batch';
import fluxSms from '../flux/sms';
import objectAssign from 'object-assign';

const createForm = Form.create;
const FormItem = Form.Item;

var form = React.createClass({
    getInitialState() {
        let visible = this.props.visible ? this.props.visible : false;
        return {
            visible: !!visible,
            type: "selected",
            content: "",
            personalText: "",
            params: {},
        }
    },

    componentDidMount() {
        fluxSms.register(this, "sms");
    },

    componentWillUnmount() {
        fluxSms.unregister("sms");
    },

    setParams(params) {
        this.setState({params: params});
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    },

    handleContentChange(e){
        this.setState({content: e.target.value});
    },

    handleCancel(e){
        this.setState({visible: false});
        if (typeof (this.props.onHide) == "function") {
            this.props.onHide();
        }
    },

    handleSend(e){
        if (!!!this.state.content) {
            UtilTool.error("请输入短信正文", "message");
            return;
        }
        if (!!!this.state.type) {
            UtilTool.error("请选择发送类型", "message");
            return;
        }
        var self = this;
        Modal.confirm({
            title: "发送短信",
            content: '您是否确认要给所选客户发送短信?',
            onOk() {
                let method = self.state.type == "all" ? "send-all" : "send";
                let params = self.state.type == "all" ? objectAssign({}, self.state.params) : {customerIds: self.props.customerIds.join(",")};
                params = objectAssign(params, {message: self.state.content + self.state.personalText});

                fluxBatch.actions.batchSms(params, method, (result) => {
                    UtilTool.success("短消息已推送至发送队列");
                }, (error) => {
                    UtilTool.error("发送短信错误：" + error);
                }, () => {
                    self.handleCancel(e);
                });
            },
            onCancel() {

            }
        });
    },

    handleRowClick(record, index) {
        this.setState({content: record.message});
    },

    handleTypeChanged(v) {
        this.setState({type: v});
    },

    handleCheckChange(e) {
        if(e.target.checked) {
            this.setState({personalText: " 个人建议 仅供参考 "});
        } else {
            this.setState({personalText: ""});
        }
    },

    render() {
        let width = parseInt(this.props.width ? this.props.width : 800);

        let columns = [{
            title: '标题',
            dataIndex: 'title',
            sorter: true,
        }, {
            title: '描述',
            dataIndex: 'description',
            sorter: true,
        }, {
            title: '内容',
            dataIndex: 'message',
            sorter: false,
        }];

        return <Modal visible={this.state.visible} width={width} title="发送短信" onCancel={this.handleCancel} footer="">

            <Row>
                <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="发送类型：" required >
                    <Col span="20">
                      <Select onChange={this.handleTypeChanged} style={{ width: 200 }} value={this.state.type}>
                        <Option value="selected">选中的记录</Option>
                        <Option value="all">本视图所有记录</Option>
                      </Select>                               
                    </Col>
                    <Col span="4">
                        <Row type="flex" justify="end">
                            <Button type="primary" size="large" style={{marginBottom: "10px"}} onClick={this.handleSend}>确定</Button>
                        </Row>
                    </Col>
                </FormItem>
            </Row>
            <Row>
                <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="发送正文：" required >
                    <Input type="textarea" placeholder="请输入正文" rows="6" onChange={this.handleContentChange} 
                        value={this.state.content + this.state.personalText}/>
                </FormItem>
            </Row>
            <Row>
                <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="正文附加：" >
                    <Checkbox onChange={this.handleCheckChange} >个人建议 仅供参考</Checkbox>
                </FormItem>            
            </Row>
            <Row>
                <SuTable columns={columns} flux={fluxSms} handleRowClick={this.handleRowClick} params={{"type": 1}}/>
            </Row>
        </Modal>;
    }
});
export default createForm()(form);
