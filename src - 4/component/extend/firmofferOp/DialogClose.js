const objectAssign = require("object-assign");
import {Modal, Form, Row, Col, Button, Icon, Input, Select, Upload, Radio, message} from 'antd';
import {UtilTool,ValidResult} from './../../../libs/ui-core';
import fluxAccount from '../../flux/account';
import Config from '../../config';
import "./DialogActive.less";
const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
var form = React.createClass({
    getInitialState() {
        let visible = this.props.visible ? this.props.visible : false;
        return {
            visible: !!visible,
            fileList: [],
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.visible) {
            if(!this.state.visible) this.fetchInfo();
            this.setState({visible: nextProps.visible});
        }
    },

    handleCancel(e){
        this.setState({visible: false});
        if (typeof (this.props.onHide) == "function") {
            this.props.onHide();
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

        // let fileList = getFieldValue("attach").map((it, idx) => {
        //     return {uid: -1, id: it.id, name: it.name};
        // });
        // self.setState({"fileList": fileList});
    },

    componentDidMount() {
    },

    handleSend(e){
        let self = this;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                UtilTool.error('请先按错误提示修改错误!');
                return;
            }
            var params = self.props.form.getFieldsValue();
            params.attachment = self.state.fileList.length > 0 ? self.state.fileList[0].id : null;
            params.platformId = self.props.plat.idCode;
            params.customerId = self.props.customerId;

            fluxAccount.actions.sendClose(params, (result) => {
                UtilTool.success("提交成功");
                self.handleCancel();
            }, (error) => {
                UtilTool.error("提交错误：" + error);
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
            customerName: getFieldProps('customerName', {
                rules: [
                    {required: true, min: 2, message: '姓名至少为2个字符'},
                ],
            }),
            emailAddress: getFieldProps('emailAddress', {
                rules: [
                    {required: true, message: '请填写邮箱地址'},
                    {validator: ValidResult.ynEmail},
                ]
            }),
            remark: getFieldProps('remark'),
        };

        let self = this;
        const attachAttrs = {
            action: 'fileuploader/upload',
            data: {serviceName: "crm-portal"},
            fileList: this.state.fileList,
            multiple: false,
            onChange(info){
                let fileList = info.fileList;

                fileList = fileList.filter((file) => {
                    if (file.response) {
                        return file.response.success;
                    }
                    return true;
                });
                
                fileList = fileList.slice(-1);
                fileList = fileList.map((file) => {
                    if (file.response) {
                        file.id = file.response.value;
                    }
                    return file;
                });

                self.setState({fileList: fileList});                
            },
            onPreview(file){
                 window.location.href = "/fileuploader/files/" + file.id;
            }, 
            beforeUpload(file){
                if (self.state.fileList.length > 0) {
                    message.error("请先删除已经上传的附件, 只能保留一个附件");
                    return false;
                }
            },    
            onRemove(info){
                Modal.confirm({
                    title: "删除确认",
                    content: "此文件删除后将无法恢复, 请做好文件备份",
                    onOk(){
                        fluxAccount.actions.fileDelete({id: info.id}, function (value) {
                            let curList = self.state.fileList;
                            let fileList = curList.filter(item => {
                                return item.id != info.id;
                            });

                            self.setState({fileList: fileList});
                        }, function (msg) {
                            message.error(msg);
                        });
                    },
                    onCancel(){},
                });
            },                    
        };

        let width = parseInt(this.props.width ? this.props.width : 400);
        let title = "申请销户【" + this.props.plat.name + "】实盘账号";
        return <Modal
            visible={this.state.visible}
            width={width}
            title={title} onOk={this.handleSend} onCancel={this.handleCancel}>
            <Form form={this.props.form}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="实盘账号：">
                            <Input placeholder="请填写实盘账号" utoComplete="off" {...fieldProps["accountNumber"]}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="客户姓名：">
                            <Input placeholder="请填写客户姓名" autoComplete="off" {...fieldProps["customerName"]} disabled/>
                        </FormItem>
                    </Col>                    
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="邮箱地址：">
                            <Input placeholder="请填写客户邮箱" autoComplete="off" {...fieldProps["emailAddress"]} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem labelCol={{span: 4}} wrapperCol={{span: 19}}
                            label="备注：">
                            <Input type="textarea" placeholder="请填写备注信息"
                                   autoComplete="off" {...fieldProps["remark"]} />
                        </FormItem>
                    </Col>                
                </Row>
                <Row>
                    <Col span="24" className="su-active-upload">
                        <FormItem labelCol={{span: 4}} wrapperCol={{span: 19}}
                            label="附件：">
                            <Upload {...attachAttrs} >
                                <Button type="ghost">
                                    <Icon type="upload"/> 点击上传
                                </Button>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>;
    }
});
export default createForm()(form);
