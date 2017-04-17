import {Row, Col, Form, Card, Modal, Tag} from "antd";
import {Router, Route, Link, useRouterHistory} from "react-router";
import {UtilTool, ValidResult} from "./../../libs/ui-core";
import InputMobile from "./InputMobile";
import {Input as SuInput, Select as SuSelect, DatePicker as SuDatePicker} from "./../../libs/ui-extend";
import fluxDetail from "../flux/detail";
import flux from "../flux/list";
import Config from '../config';
import Util from '../util';
import objectAssign from 'object-assign';

import "./Tab.less";
const FormItem = Form.Item;

const createForm = Form.create;
let UserForm = React.createClass({
    getInitialState: function () {
        return {
            customerId: this.props.customerId,
            editable: {},
            managers: [],
            managerTelephoneList: [],
        }
    },
    fetchInfo(){
        this.fetchBasic();
        if(!window.ssm)
            this.fetchEditable();
        this.fetchMobileRelated();
    },
    fetchMobileRelated(){
        fluxDetail.actions.fetchMobileRelated({"customerId": this.props.customerId}, (result) => {
            this.setState({managerTelephoneList: result.data,});
        }, (error) => {
            UtilTool.error('客户电话相关信息拉取失败。' + error);
        });
    },
    fetchBasic() {
        let params = {customerId: this.props.customerId};

        fluxDetail.actions.fetchBasic(params, (result) => {
            fluxDetail.refreshBasicInfo(result, this.props.cids);

            result.siteUrl = Util.replaceSiteUrl(result.siteUrl);
            result = UtilTool.normalize(result, false);
            this.props.form.resetFields();
            this.props.form.setFieldsValue(result);
        }, (error) => {
            UtilTool.error('客户线索摘要获取失败' + error);
        });
    },
    fetchEditable() {
        let params = {customerId: this.props.customerId, table: "basic", phoneCall: this.props.phoneCall};

        fluxDetail.actions.fetchEditable(params, (result) => {
            this.setState({editable: result});
        }, (error) => {
            UtilTool.error('字段权限获取失败' + error);
        });
    },
    componentDidMount() {
        fluxDetail.actions.fetchManagers({employeeId: window.userId}, (result) => {
            let managers = result ? result.map(it => ({value: it.employeeId ? it.employeeId : it.id, text: it.employeeId ? it.employeeName : it.name})) : [];
            this.setState({managers: managers});
        }, (error) => {
            UtilTool.error('客户经理列表获取失败' + error);
        });

        this.fetchInfo();

        fluxDetail.register(this, "tabBasic");
    },
    componentWillUnmount: function () {
        fluxDetail.unregister("tabBasic");
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
    okCallback(id, val_real, val_fake){
        var self = this;
        let data = {};
        if (id == "assignedManager") { //TODO:客户经理需要上传 Id Name 两项进行保存
            data[id + "Id"] = val_real;
            data[id + "Name"] = val_fake;
        } else {
            data[id] = val_real;
        }

        if(this.props.phoneCall == "true") {
            data["phoneCall"] = "true";
        }

        if(id == "plannedRevisitTime") { // plannedRevisitTime 需要单独保存到一个地址
            flux.actions.saveRevisitTime(this.props.customerId, data.plannedRevisitTime ? data : {}, (result) => {
                UtilTool.success('[' + id + ']保存数据成功~');
                fluxDetail.refreshCardTrack();
            }, (error, code, value) => {
                UtilTool.error('[' + id + ']保存数据错误:' + error);
            });
            return;
        }

        fluxDetail.actions.saveField(this.props.customerId, data, (result) => {
            UtilTool.success('[' + id + ']保存数据成功~');
            // 如果是常用时手机号, 更改后需要刷新当前页
            if(id == "inUsingMobile" || id == "inUsingMobileArea" || id == "inUsingClientName") this.fetchBasic();

            fluxDetail.refreshCardTrack();
        }, (error, code, value) => {
            if ((id == "mobile" || id == "inUsingMobile") && code == 10159 && !!value) {
                Modal.confirm({
                    title: "客户数据重复，需要合并客户信息吗？",
                    content: "您修改的手机号码与其他客户信息重复，如果继续则会合并这些客户信息，此操作将会冻结所有涉及到的客户，请谨慎操作",
                    onOk(){
                        value.push(self.props.customerId);
                        var postData = {
                            customerIds: value.join(","),
                            inUsingMobile: val_real,
                        };
                        fluxDetail.actions.freezeCustomers(postData, ()=> {
                            UtilTool.success("手机号码已经修改，相关客户信息已经冻结！");
                        }, (error) => {
                            UtilTool.error(error);
                        });
                    },
                    onCancel(){
                    },
                });
                return;
            }

            UtilTool.error('[' + id + ']保存数据错误:' + error);
        });
    },

    render() {
        const {getFieldProps, getFieldValue} = this.props.form;

        const suGetFieldProps = (label, field, ant_extend, su_extend)=> {
            if (ant_extend == undefined) {
                ant_extend = {};
            }
            if (su_extend == undefined) {
                su_extend = {};
            }
            let editable = false;
            try {
                editable = (this.state.editable.indexOf(field) >= 0) ? true : false;
            }
            catch (e) {

            }
            su_extend = objectAssign({
                label: label,
                editable: editable,
                okCallback: this.okCallback,
                form: this.props.form,
                //mode: "simple"
            }, su_extend);
            return objectAssign(getFieldProps(field, ant_extend), su_extend);
        };

        const fieldProps = {
            // ---------------------基本信息-----------------------
            clientType: suGetFieldProps('客户类型:', 'clientType', {}, {
                data: Config.clientType
            }),
            inUsingClientName: suGetFieldProps('客户姓名:', 'inUsingClientName', {
                rules: [
                    {required: true, min: 2, message: '常用客户姓名至少为2个字符'},
                ],
            }),
            inUsingMobile: suGetFieldProps('手机号码:', 'inUsingMobile', {
                rules: [
                    {required: true, message: '请填写手机号码'},
                    {validator: ValidResult.ynMobile},
                ]
            }),
            inUsingMobileArea: suGetFieldProps('手机号归属地:', 'inUsingMobileArea'),
            gender: suGetFieldProps('客户性别:', 'gender', {}, {
                data: Config.gender
            }),
            birthday: suGetFieldProps('客户生日:', 'birthday'),
            education: suGetFieldProps('客户学历:', 'education', {}, {
                data: Config.education
            }),
            profession: suGetFieldProps('客户职业:', 'profession'),
            email: suGetFieldProps('邮箱地址:', 'email', {
                rules: [
                    {required: true, message: '请填写邮箱地址'},
                    {validator: ValidResult.ynEmail},
                ]
            }),
            qqNumber: suGetFieldProps('QQ号码:', 'qqNumber'),
            certType: suGetFieldProps('证件类型:', 'certType', {}, {
                data: Config.certType
            }),
            certNumber: suGetFieldProps('证件号码:', 'certNumber'),
            postalcode: suGetFieldProps('邮政编码:', 'postalcode', {
                rules: [
                    {validator: ValidResult.ynPostalcode },
                ],
            }),
            birthplace: suGetFieldProps('籍贯归属地:', 'birthplace'),
            mailAddress: suGetFieldProps('邮寄地址:', 'mailAddress', {
                rules: [
                    {max: 50, message: '邮寄地址不大于50个字符'},
                ],
            }),
            updateTime: suGetFieldProps('更新时间:', 'updateTime'),
            lastSimulateTime: suGetFieldProps('模拟参赛时间', 'lastSimulateTime'),
            createTime: suGetFieldProps('创建时间', 'createTime'),

            // ---------------------注册信息-----------------------
            mobile: suGetFieldProps('手机号码:', 'mobile'),
            mobileArea: suGetFieldProps('手机号归属地:', 'mobileArea'),
            siteUrl: suGetFieldProps('注册来源:', 'siteUrl'),
            clientName: suGetFieldProps('注册姓名:', 'clientName'),
            regTime: suGetFieldProps('注册时间:', 'regTime'),
            lastLogonTime: suGetFieldProps('最近登陆时间:', 'lastLogonTime'),
            mobileIsValidated: suGetFieldProps('手机是否验证:', 'mobileIsValidated', {}, {
                data: Config.mobileIsValidated
            }),

            // ---------------------销售信息-----------------------
            assignedManager: suGetFieldProps('维护经理:', 'assignedManager', {}, {
                data: this.state.managers,
            }),
            lastOutgoingTime: suGetFieldProps('最近通话时间:', 'lastOutgoingTime', undefined, {showTime: true}),
            lastOutgoingStatus: suGetFieldProps('最近通话状态:', 'lastOutgoingStatus', {}, {
                data: Config.lastOutgoingStatus
            }),
            plannedRevisitTime: suGetFieldProps('计划回访时间:', 'plannedRevisitTime'),
            lastRevisitContent: suGetFieldProps('最近回访内容:', 'lastRevisitContent', {}, {
                type: "textarea"
            }),
            saleStage: suGetFieldProps('销售进程:', 'saleStage', {}, {
                data: Config.saleStage
            }),
            clientGrade: suGetFieldProps('客户星级:', 'clientGrade', {}, {
                data: Config.clientGrade
            }),

            // ---------------------分配信息-----------------------
            lastAutoAssignTime: suGetFieldProps('最近分配时间:', 'lastAutoAssignTime'),
            lastAutoAssignQueue: suGetFieldProps('最近分配队列:', 'lastAutoAssignQueue'),
            lastSharedTime: suGetFieldProps('最近共享时间:', 'lastSharedTime'),
            sharedTotal: suGetFieldProps('累计共享次数:', 'sharedTotal', {}, {
                type: 'number',
            }),
            assignTotal: suGetFieldProps('累计分配次数:', 'assignTotal', {}, {
                type: 'number',
            }),
            lastSharedMemo: suGetFieldProps('最近共享原因:', 'lastSharedMemo', {}, {
                type: 'textarea'
            }),

            // ---------------------安全信息-----------------------
            riskNoticeType: suGetFieldProps('风险率通知方式:', 'riskNoticeType', {}, {
                data: Config.riskNoticeType
            }),
            riskNoticeTime: suGetFieldProps('最近通知时间:', 'riskNoticeTime'),
            riskNoticeStatus: suGetFieldProps('最近通知状态:', 'riskNoticeStatus', {}, {
                data: Config.riskNoticeStatus
            }),
            isDangerous: suGetFieldProps('是否高危:', 'isDangerous', {}, {type: 'switch'}),
            isOvertradeTime: suGetFieldProps('过度交易时间:', 'isOvertradeTime'),

        };


        let clientStatus = getFieldValue("clientStatus");
        let flag = getFieldValue("flag");
        let isLock = getFieldValue("isLock");

        return <Form horizontal form={this.props.form}>
            <Card title={'基本信息'} extra="">
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['clientType']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['inUsingClientName']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <InputMobile extend={fieldProps['inUsingMobile']} cid={this.state.customerId}
                            teleList={this.state.managerTelephoneList} clearText={true}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['inUsingMobileArea']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuInput extend={fieldProps['qqNumber']}/>
                    </Col>                
                    <Col span='12'>
                        <SuInput extend={fieldProps['email']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuInput extend={fieldProps['certNumber']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['mailAddress']}/>
                    </Col>                    
                </Row>
                <Row>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['updateTime']}/>
                    </Col>
                    <Col span="12">
                        <SuDatePicker extend={fieldProps["lastSimulateTime"]}/>
                    </Col>                    
                </Row>
                <Row>
                    <Col span="12">
                        <SuDatePicker extend={fieldProps["createTime"]}/>
                    </Col>                
                    <Col span="12">
                        {
                            clientStatus >= 5 || flag == "2" || flag == "3" || isLock == "2" || isLock == "3" ? <FormItem label="状态" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                                {Config.clientStatus.filter(it => ( clientStatus == it.value && clientStatus >= 5) ).map(it => <Tag color="red">{it.text}</Tag>)}
                                {Config.flag.filter(it => ( flag == it.value && (flag == "2" || flag == "3")) ).map(it => <Tag color="red" >{it.text}</Tag>)}
                                {Config.isLock.filter(it => ( isLock == it.value && (isLock == "2" || isLock == "3")) ).map(it => <Tag color="red" >{it.text}</Tag>)}
                            </FormItem> : null
                        }
                    </Col>
                </Row>
            </Card>

            <Card title='销售信息'>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['assignedManager']} showSearch={true}/>
                    </Col>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['lastOutgoingTime']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['lastOutgoingStatus']}/>
                    </Col>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['plannedRevisitTime']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuInput extend={fieldProps['lastRevisitContent']}/>
                    </Col>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['saleStage']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['clientGrade']}/>
                    </Col>
                </Row>
            </Card>            

            <Card title='注册信息'>
                <Row>
                    <Col span='12'>
                        <InputMobile extend={fieldProps['mobile']} cid={this.state.customerId}
                            teleList={this.state.managerTelephoneList} clearText={true}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['mobileArea']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuInput extend={fieldProps['siteUrl']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['clientName']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['regTime']}/>
                    </Col>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['lastLogonTime']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['mobileIsValidated']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['birthplace']}/>
                    </Col>                         
                </Row>
            </Card>

            <Card title='分配信息'>
                <Row>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['lastAutoAssignTime']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['lastAutoAssignQueue']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['lastSharedTime']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['sharedTotal']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuInput extend={fieldProps['assignTotal']}/>
                    </Col>
                    <Col span='12'>
                        <SuInput extend={fieldProps['lastSharedMemo']}/>
                    </Col>
                </Row>
            </Card>

            <Card title='安全信息'>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['riskNoticeType']}/>
                    </Col>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['riskNoticeTime']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['riskNoticeStatus']}/>
                    </Col>
                    <Col span='12'>
                        <SuSelect extend={fieldProps['isDangerous']}/>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <SuDatePicker extend={fieldProps['isOvertradeTime']}/>
                    </Col>
                </Row>
            </Card>

        </Form>;
    }
});

UserForm = createForm()(UserForm);

export default UserForm;
