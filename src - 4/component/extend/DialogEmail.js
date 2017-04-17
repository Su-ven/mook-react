import {Form, Row, Col, Button, Icon, Dropdown, Modal, Input, Select} from 'antd';
import fluxBatch from '../flux/batch';
import {UtilTool} from './../../libs/ui-core';
const createForm = Form.create;
const FormItem = Form.Item;
var form = React.createClass({
    getInitialState() {
        let visible = this.props.visible ? this.props.visible : false;
        return {
            visible: !!visible,
            title: "",
            content: "",
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    },

    handleTitleChange(e){
        this.setState({title: e.target.value});
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
        if (this.state.title === "") {
            UtilTool.error("请输入邮件标题!");
            return;
        }
        if (this.state.content === "") {
            UtilTool.error("请输入邮件正文!");
            return;
        }
        var self = this;
        Modal.confirm({
            title: "发送邮件",
            content: '您是否确认要给所选客户发送邮件?',
            onOk() {
                fluxBatch.actions.batchEmail(self.props.customerIds, {
                    title: self.state.title,
                    content: self.state.content
                }, (result) => {
                    UtilTool.success("发送邮件成功");
                }, (error) => {
                    UtilTool.error("发送失败" + error);
                }, () => {
                    self.handleCancel(e);
                });
            },
            onCancel() {

            }
        });
    },

    render() {
        let width = parseInt(this.props.width ? this.props.width : 400);
        return <Modal
            visible={this.state.visible}
            width={width}
            title="发送邮件" onOk={this.handleSend} onCancel={this.handleCancel}>
            <Row>
                <Col>
                    <FormItem
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="标题："
                        required>
                        <Input placeholder="请输入标题" onChange={this.handleTitleChange}/>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col>
                    <FormItem
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="正文："
                        required>
                        <Input type="textarea" placeholder="请输入正文" rows="6"
                               onChange={this.handleContentChange}/>
                    </FormItem>
                </Col>
            </Row>
        </Modal>;
    }
});
export default createForm()(form);
