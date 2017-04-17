import {
    Row,
    Col,
    Icon,
    Button,
    Form,
    Input,
    Select,
    Card,
} from 'antd';
import flux from '../flux/contact';
import {UtilTool} from './../../libs/ui-core';
import "./CardContactForm.less";
const createForm = Form.create;
const FormItem = Form.Item;
let UserForm = React.createClass({
    getInitialState: function () {
        return {
            customerId: "",
        }
    },
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var send_data = this.props.form.getFieldsValue();
            send_data.customerId = this.props.customerId;

            flux.actions.saveContact(send_data, (result) => {
                UtilTool.success("保存成功");
                this.props.form.resetFields();
                let okCallback = this.props.okCallback;
                if (typeof(okCallback) == "function") {
                    okCallback();
                }
            }, (message, code, value)=> {
                var msg = "保存失败,错误代码:" + code + ",错误描述:" + message;
                UtilTool.error(msg);
            });
        });
    },
    componentDidMount() {
        if (!this.props.customerId) {
            UtilTool.error("回访记录表单customerId丢失,请联系管理员");
            return;
        }
    },
    render() {
        const {getFieldProps} = this.props.form;
        const fieldProps = {
            contactType: getFieldProps('contactType', {
                initialValue: "1",
            }),
            messageContent: getFieldProps('messageContent', {
                rules: [
                    {required: true, message: '请认真填写回访内容'},
                ]
            }),
        };
        const formItemLayoutFull = {
            labelCol: {span: 0},
            wrapperCol: {span: 24},
        };
        return <Form horizontal form={this.props.form} className="su-contact-form">
            <Row>
                <Col span="24">
                    <FormItem {...formItemLayoutFull} >
                        <Select autoComplete="off" {...fieldProps["contactType"]}>
                            <Option value="1">电话</Option>
                            <Option value="2">53</Option>
                            <Option value="3">QQ</Option>
                            <Option value="4">邮件</Option>
                            <Option value="5">短信</Option>
                            <Option value="6">手机呼入</Option>
                            <Option value="7">手机呼出</Option>
                            <Option value="8">到访</Option>
                            <Option value="9">其他</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem {...formItemLayoutFull} >
                        <Input type="textarea" autoComplete="off" {...fieldProps["messageContent"]} rows={4}/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem className="centerButton">
                        <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.handleReset}>重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>;
    }
});
UserForm = createForm()(UserForm);
export default UserForm;
