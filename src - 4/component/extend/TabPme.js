import objectAssign from "object-assign";
import {Row,Col,Form,Card,Button} from 'antd';
import {UtilTool} from './../../libs/ui-core';
import {Input as SuInput,Select as SuSelect,DatePicker as SuDatePicker} from './../../libs/ui-extend';
import fluxDetail from '../flux/detail';
import DialogSetup from './firmofferOp/DialogSetup';
import DialogBigcontract from './firmofferOp/DialogBigcontract';
import DialogActive from './firmofferOp/DialogActive';
import DialogClose from './firmofferOp/DialogClose';
import DialogUnFreeze from './firmofferOp/DialogUnFreeze';
import DialogReset from './firmofferOp/DialogReset';
import DialogChangeSign from './firmofferOp/DialogChangeSign';
import DialogBinding from './firmofferOp/DialogBinding';
import Config from "../config";
import "./Tab.less";

const createForm = Form.create;
const FormItem = Form.Item;

const ratioPrefix = 'ratio-';

let UserForm = React.createClass({

    getInitialState: function () {
        return {
            customerId: this.props.customerId,
            editable: {},
            accountStatus: "0", // 默认0防止无状态“”时 闪现开立按钮 "1"为未开立状态
            spAccountExist: false,
            setupVisible: false,
            activeVisible: false,
            bigcontractVisible: false,
            closeVisible: false,
            unFreezeVisible: false,
            resetVisible: false,
            changeSignVisible: false,
            bindingVisible: false,
            managers: [],
            canOperate: false,
            accountHandFees:[],
        }
    },

    fetchInfo(){
        let params = {};
        params["customerId"] = this.props.customerId;
        params["platformId"] = this.props.plat.code;
        this.fetchPme(params);
        if(!window.ssm)
            this.fetchEditable(params);
    },

    fetchEditable(params) {
        fluxDetail.actions.fetchEditable(params, (result) => {
            this.setState({editable: result});
        }, (error) => {
            UtilTool.error('字段权限获取失败' + error);
        });
    },

    fetchPme(params){
        fluxDetail.actions.fetchPme(params, (result) => {
            result = result ? result : {};
            
            let accountStatus = result.spAccountStatus ? result.spAccountStatus : "1";
            // 费率列表
            let accountHandFees = result.crmAccountHandFeeList ? result.crmAccountHandFeeList : [];
            // 费率值需要设置到form控制域
            let productValues = {};
            accountHandFees.forEach(it => productValues[ratioPrefix + it.product] = it.ratio);

            this.props.form.resetFields();
            this.props.form.setFieldsValue(UtilTool.normalize(objectAssign(result, {spAccountStatus: accountStatus}, productValues), false));

            // 如果是客户经理 只有 flag == 1 并且 isLock != 2 的时候才允许实盘的各种操作
            let canOperate =  window.prefix == "/sm" || window.prefix == "/op" || (result.flag == "1" && result.isLock != "2") ? true : false
            this.setState({accountStatus: accountStatus, spAccountExist: result.spAccount ? true : false, canOperate: canOperate, accountHandFees: accountHandFees});

        }, (error) => {
            UtilTool.error('PME信息获取失败' + error);
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
        
        fluxDetail.register(this, "tabPme_" + this.props.plat.code);
    },

    componentWillUnmount: function () {
        fluxDetail.unregister("tabPme_" + this.props.plat.code);
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
        const {getFieldValue} = this.props.form;

        let data = {};
        if (id == "developer") { 
            //TODO:客户经理需要上传 Id Name 两项进行保存
            data[id + "Id"] = val_real;
            data[id + "Name"] = val_fake;
        } else if(id.indexOf(ratioPrefix) > -1) {
            data[id] = val_real;

            //单独操作费率
            let product = id.split(ratioPrefix)[1];

            fluxDetail.actions.saveRatio({ratio:val_real, product: product, spAccount: getFieldValue("spAccount") }, (result) => {
                UtilTool.success('[' + id + ']保存数据成功');

                this.props.form.setFieldsValue(data);
            }, (error) => {
                UtilTool.error('[' + id + ']保存数据错误:' + error);
            });
            
            return;
        } else {
            if(id == "legalRevisitTime" && val_real == ""){
                return;
            }
            data[id] = val_real;
        } 

        fluxDetail.actions.savePlatform(this.props.customerId,this.props.plat.code, data, (result) => {
            UtilTool.success('[' + id + ']保存数据成功');

            this.props.form.setFieldsValue(data);

            fluxDetail.refreshCardTrack();
            // TODO: 如果账户状态是可以修改的,那么此处还要处理修改后 button 按钮的显隐
        }, (error) => {
            UtilTool.error('[' + id + ']保存数据错误:' + error);
        });
    },

    render() {
        let self = this;

        const {getFieldProps} = this.props.form;

        const suGetFieldProps = (label, field, ant_extend, su_extend)=> {
            if (ant_extend == undefined) {
                ant_extend = {};
            }
            if (su_extend == undefined) {
                su_extend = {};
            }
            let editable = false;
            try {
                editable = ( this.state.editable.indexOf(field) > -1 || 
                    (field.indexOf(ratioPrefix) > -1 && this.state.editable.indexOf(ratioPrefix) > -1) ) ? true : false;
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
            spAccount: suGetFieldProps('实盘账号：', 'spAccount'),
            spAccountStatus: suGetFieldProps('账户状态：', 'spAccountStatus', {}, {
                data: Config.accountStatus
            }),
            spBank: suGetFieldProps('签约银行', 'spBank', {}, {
                data: Config.banks
            }),
            funding: suGetFieldProps('当前权益', 'funding', {}, {
                type: 'number',
            }),
            openAccountTime: suGetFieldProps('开户时间', 'openAccountTime'),
            spActiveTime: suGetFieldProps("激活时间：", 'spActiveTime'),
            updateTime: suGetFieldProps('更新时间', 'updateTime'),
            // handfeeRatio: suGetFieldProps('手续费系数：', 'handfeeRatio', {}, {
            //     type: "number",
            // }),            
            legalRevisitTime: suGetFieldProps('合规回访时间', 'legalRevisitTime'),
            legalRevisitStatus: suGetFieldProps('合规回访状态', 'legalRevisitStatus', {}, {
                data: Config.legalRevisitStatus
            }),
            simulateAccount: suGetFieldProps('模拟账号：', 'simulateAccount'),
            // simulateParticipateTime: suGetFieldProps('模拟参赛时间', 'simulateParticipateTime'),
            developer: suGetFieldProps('开发经理：', 'developer', {}, {
                data: this.state.managers,
            }),            

        };

        // 供子组件使用
        getFieldProps('idNumber');
        getFieldProps('inUsingMobile');
        getFieldProps('clientName');
        getFieldProps('gender');
        getFieldProps('emailAddress');
        getFieldProps('nativePlace');

        // 将得到的费率分组，以便按row遍历
        let accountHandFees = [];
        let row = [];
        this.state.accountHandFees.forEach((it, idx) => {
            row.push(it)
            if(row.length > 1) {
                accountHandFees.push(row);
                row = [];
            }
            // 不满2个时，追后一个也需要push进去
            if(self.state.accountHandFees.length == (idx + 1) && row.length == 1) {
                accountHandFees.push(row);
            }
        })

        const belongToText = (this.props.plat.name) ? this.props.plat.name : "未定义平台";

        let setupDialog =[
                <Button type="primary" className={"pull-right gx-button-margin"} size="small"
                        onClick={e => this.setState({"setupVisible": true})}>实盘开户</Button>,
                <DialogSetup visible={this.state.setupVisible}
                             customerId={this.props.customerId}
                             extendForm={this.props.form}
                             width="600"
                             onHide={e => this.setState({"setupVisible": false})}
                             plat={this.props.plat}></DialogSetup>
                ];
        let activeDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"activeVisible": true})}>实盘激活</Button>,
                <DialogActive visible={this.state.activeVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"activeVisible": false})}
                              plat={this.props.plat}></DialogActive>
                ];
        let closeDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"closeVisible": true})}>实盘销户</Button>,
                <DialogClose visible={this.state.closeVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"closeVisible": false})}
                              plat={this.props.plat}></DialogClose>
                ];
        let unFreezeDialog = [
               <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"unFreezeVisible": true})}>实盘解冻</Button>,
                <DialogUnFreeze visible={this.state.unFreezeVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"unFreezeVisible": false})}
                              plat={this.props.plat}></DialogUnFreeze>
               ];
        let resetDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"resetVisible": true})}>密码重置</Button>,
                <DialogReset visible={this.state.resetVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"resetVisible": false})}
                              plat={this.props.plat}></DialogReset>
                ];
        let changeSignDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"changeSignVisible": true})}>强制变更</Button>,
                <DialogChangeSign visible={this.state.changeSignVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"changeSignVisible": false})}
                              plat={this.props.plat}></DialogChangeSign>
                ];
        let bindingDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"bindingVisible": true})}>实盘绑定</Button>,
                <DialogBinding visible={this.state.bindingVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"bindingVisible": false})}
                              plat={this.props.plat}></DialogBinding>
                ];
        let bigcontractDialog = [
                <Button type="primary" className={"pull-right gx-button-margin "} size="small"
                        onClick={e => this.setState({"bigcontractVisible": true})}>开通大合约</Button>,
                <DialogBigcontract visible={this.state.bigcontractVisible}
                              customerId={this.props.customerId}
                              extendForm={this.props.form}
                              width="600"
                              onHide={e => this.setState({"bigcontractVisible": false})}
                              plat={this.props.plat}></DialogBigcontract>
                ];                

        let spAccountExist = this.state.spAccountExist;
        let cardExtend = [];
        if(spAccountExist) { 
            cardExtend.push(resetDialog, unFreezeDialog, closeDialog, activeDialog, changeSignDialog);
            if(this.props.plat.code == 'ydyl') {
                cardExtend.push(bigcontractDialog);
            }
        } else {
            cardExtend.push(setupDialog, bindingDialog);
        }
        if(spAccountExist && this.state.accountStatus == "D") { // 如果有账号，并且是销户的用户，需要显示
            cardExtend.push(setupDialog, bindingDialog);
        }

        
        return <div>
            <Form horizontal form={this.props.form}>
                <Card title={belongToText+"基本信息"} extra={this.state.canOperate ? cardExtend : ""}>
                    <Row>
                       <Col span="12">
                            <SuInput extend={fieldProps["spAccount"]}/>
                        </Col>                    
                        <Col span="12">
                            <SuSelect extend={fieldProps["spAccountStatus"]}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <SuSelect extend={fieldProps["spBank"]}/>
                        </Col>
                        <Col span="12">
                            <SuInput extend={fieldProps["funding"]}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <SuDatePicker extend={fieldProps["openAccountTime"]}/>
                        </Col>
                       <Col span="12">
                            <SuDatePicker extend={fieldProps["spActiveTime"]}/>
                        </Col>                          
                    </Row>
                    <Row>
                        <Col span="12">
                            <SuDatePicker extend={fieldProps["legalRevisitTime"]}/>
                        </Col>   
                        <Col span="12">
                            <SuSelect extend={fieldProps["legalRevisitStatus"]}/>
                        </Col>
                    </Row>    
                    <Row>
                        <Col span="12">
                            <SuInput extend={fieldProps["simulateAccount"]}/>
                        </Col>        
                        <Col span='12'>
                            <SuSelect extend={fieldProps['developer']} showSearch={true}/>
                        </Col>                                    
                    </Row>  
                    <Row>
                        <Col span="12">
                            <SuDatePicker extend={fieldProps["updateTime"]}/>
                        </Col>   
                        { ( this.props.plat.code == "qilu" || this.props.plat.code == "qilu159") && spAccountExist ?  <Col span="12">
                            <FormItem label="实盘开户问卷详情" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                                <a href={"/questionary.html?" + this.props.customerId} target="_blank">查阅</a>
                            </FormItem>
                        </Col> : null}
                    </Row>  
                    {accountHandFees.map(it => {
                            let col0 = [];
                            let col1 = [];
                            if(it[0]) {
                                col0 = <Col span="12">
                                        <SuInput extend={suGetFieldProps(it[0].productName, ratioPrefix + it[0].product, {}, {type: 'number'})} />
                                    </Col>;
                            }
                            if(it[1]) {
                                col1 = <Col span="12">
                                        <SuInput extend={suGetFieldProps(it[1].productName, ratioPrefix + it[1].product, {}, {type: 'number'})} />
                                    </Col>;
                            }
                            return (  
                                <Row>
                                    {col0}
                                    {col1}                            
                                </Row>  
                            );
                        })
                    }
                </Card>
            </Form>
        </div>;
    }
});

export default createForm()(UserForm);
