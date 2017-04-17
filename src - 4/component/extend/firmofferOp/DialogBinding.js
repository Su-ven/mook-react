const objectAssign = require("object-assign");
import {Modal, Form, Row, Col, Button, Icon, Input, Select, Upload, Radio, message, Tooltip } from 'antd';
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
            mobile: getFieldValue("inUsingMobile"),
        };
        this.props.form.setFieldsValue(values);
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

            if(!!!params.mobile) {
                UtilTool.error('请先填写常用手机号!');
                return;                
            }

            fluxAccount.actions.sendBinding(params, (result) => {
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
            idNumber: getFieldProps('idNumber', {
                rules: [
                    {required: true, message: '请填写身份证号'},
                    {validator: ValidResult.ynIdCard},
                ]
            }), 
            mobile: getFieldProps('mobile'),  
        };

        let width = parseInt(this.props.width ? this.props.width : 400);
        let explain = <Tooltip title={<div>
                            <p>一、功能说明</p>
                            <p>
                                将无用户对应的实盘账号与系统中已经存在的用户绑定。<br/>
                                如：线下开户的用户或其他交易所转入的客户。
                            </p>
                            <p>二、绑定要求</p>
                            <p>
                                以下要求必须同时满足：<br/>
                                1.该实盘账号在系统中无对应用户；<br/>
                                2.该账号对应的身份证号在系统中无对应用户；<br/>
                                3.被绑定的用户无该交易所的账号；<br/>
                                4.假如被绑定的用户有身份证号，必须与录入身份证号相同。<br/>
                            </p> 
                            <p>三、绑定流程</p>
                            <p>
                                录入信息后，如果系统信息完全正确，实盘账户将直接绑定到用户中。
                            </p>                            
                        </div>}>
                           <Icon type="question-circle-o" />
                      </Tooltip>
        let title = <div>申请绑定【{this.props.plat.name}】实盘账号 {explain}</div>;
        return <Modal visible={this.state.visible} width={width} title={title} 
                onOk={this.handleSend} onCancel={this.handleCancel}>
            <Form form={this.props.form}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="实盘账号">
                            <Input placeholder="请填写实盘账号" utoComplete="off" {...fieldProps["accountNumber"]}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout}
                            label="身份证号：">
                            <Input placeholder="请填写身份证号码" autoComplete="off" {...fieldProps["idNumber"]} />
                        </FormItem>
                    </Col>                    
                </Row>
            </Form>
        </Modal>;
    }
});
export default createForm()(form);
