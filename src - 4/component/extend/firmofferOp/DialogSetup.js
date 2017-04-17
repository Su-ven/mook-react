import {Modal, Form, Row, Col, Button, Icon, Input, Select} from 'antd';
import {UtilTool,ValidResult} from './../../../libs/ui-core';
import fluxAccount from '../../flux/account';
import objectAssign from 'object-assign';
import Config from '../../config';

const createForm = Form.create;
const FormItem = Form.Item;

var form = React.createClass({
    getInitialState() {
        let visible = this.props.visible ? this.props.visible : false;
        return {
            visible: !!visible,
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.visible) {
            if(!this.state.visible) this.fetchInfo();
            this.setState({visible: nextProps.visible});
        }
    },

    fetchInfo(){
        let { getFieldValue } = this.props.extendForm;

        let values = {
            accountNumber: getFieldValue("spAccount"),
            idNumber: getFieldValue("idNumber"),
            customerName: getFieldValue("clientName"),
            gender: getFieldValue("gender"),
            emailAddress: getFieldValue("emailAddress"),
            nativePlace: getFieldValue("nativePlace"),
        };
        this.props.form.setFieldsValue(values);
    },

    componentDidMount() {
    },

    handleCancel(e){
        this.setState({visible: false});
        if (typeof (this.props.onHide) == "function") {
            this.props.onHide();
        }
    },

    handleSend(e){
        var self = this;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                UtilTool.error('请先按错误提示修改错误!');
                return;
            }
            var params = self.props.form.getFieldsValue();
            params.platformId = self.props.plat.idCode;
            params.customerId = self.props.customerId;

            fluxAccount.actions.sendSetup(params, (result) => {
                UtilTool.success("提交成功");
            }, (error) => {
                UtilTool.error("提交错误：" + error);
            }, () => {
                self.handleCancel(e);
            });
        });
    },



    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14},
        };
        const {getFieldProps} = this.props.form;
        const fieldProps = {
            accountNumber: getFieldProps('accountNumber', {
                rules: [
                    {required: true, message: '请填写实盘账号'},
                    {validator: Config.ynSpNumLocal.bind(this.props.plat)},
                ],
            }),
            idNumber: getFieldProps('idNumber', {
                rules: [
                    {required: true, message: '请填写身份证号'},
                    {validator: ValidResult.ynIdCard},
                ]
            }),            
            customerName: getFieldProps('customerName', {
                rules: [
                    {required: true, min: 2, message: '姓名至少为2个字符'},
                ],
            }),
            gender: getFieldProps('gender', {
                rules: [
                    {required: true, message: '请选择性别'},
                ],
            }),
            emailAddress: getFieldProps('emailAddress', {
                rules: [
                    {required: true, message: '请填写邮箱地址'},
                    {validator: ValidResult.ynEmail},
                ]
            }),
            nativePlace: getFieldProps('nativePlace', {
                rules: [
                    {required: true, message: '请填写籍贯地址'},
                ]
            }),
            remark: getFieldProps('remark'),
        };
        let width = parseInt(this.props.width ? this.props.width : 400);
        let title = "申请开立【" + this.props.plat.name + "】实盘账号";
        return <Modal
            visible={this.state.visible}
            width={width}
            title={title} onOk={this.handleSend} onCancel={this.handleCancel}>
            <Form form={this.props.form}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="实盘账号：">
                            <Input placeholder="请填写实盘账号" utoComplete="off" {...fieldProps["accountNumber"]} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="身份证：">
                            <Input placeholder="请填写身份证号码" autoComplete="off" {...fieldProps["idNumber"]} />
                        </FormItem>
                    </Col>                    
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="客户姓名：">
                            <Input placeholder="请填写客户姓名" autoComplete="off" {...fieldProps["customerName"]} disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="性别：">
                            <Select placeholder="请选择客户性别" autoComplete="off" {...fieldProps["gender"]} >
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="Email：">
                            <Input placeholder="请填写客户邮箱" autoComplete="off" {...fieldProps["emailAddress"]} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="客户籍贯地址：">
                            <Input placeholder="请填写客户籍贯地址" autoComplete="off" {...fieldProps["nativePlace"]} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem labelCol={{span: 4}} wrapperCol={{span: 19}}
                            label="备注信息：">
                            <Input type="textarea" placeholder="请填写备注信息" autoComplete="off" {...fieldProps["remark"]} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>;
    }
});

export default createForm()(form);
