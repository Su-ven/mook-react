import {
    Row,
    Col,
    Form,
    Card,
    Input,
    Select,
    DatePicker,
    Icon,
    Button, Modal
} from 'antd';
import objectAssign from 'object-assign';
import {UtilTool} from './../../libs/ui-core';
import "./DialogFilter.less";
import Config from "./../config";
import fluxDetail from "./../flux/detail";

const RangePicker = DatePicker.RangePicker;
const createForm = Form.create;
const FormItem = Form.Item;
let UserForm = React.createClass({
    getInitialState: function () {
        return {
            filterVisible: false,
            plannedRevisitTime: ["", ""],
            lastAutoAssignTime: ["", ""],
            lastOutgoingTime: ["", ""],
            createTime: ["", ""],
            activeTime: ["", ""],
            managers: [],
        }
    },
    handleReset(e) {
        e.preventDefault();
        // 清除TimePicker组件
        let state = {};
        state["plannedRevisitTime"] = ["", ""];
        state["lastAutoAssignTime"] = ["", ""];
        state["lastOutgoingTime"] = ["", ""];
        state["createTime"] = ["", ""];
        state["activeTime"] = ["", ""];
        this.setState(state);
        // 清除form
        this.props.form.resetFields();

        let fieldsValue = this.props.form.getFieldsValue();
        this.doFilter(fieldsValue);
    },
    showFilterModal(e) {
        fluxDetail.actions.fetchManagers({employeeId: window.userId}, (result) => {
            let managers = result ? result.map(it => ({value: it.employeeId ? it.employeeId : it.id, text: it.employeeId ? it.employeeName : it.name})) : [];
            this.setState({managers: managers});
        }, (error) => {
            UtilTool.error('客户经理列表获取失败' + error);
        });

        this.setState({filterVisible: true});
    },
    handleFilterModalCancel(e) {
        this.setState({filterVisible: false});
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                UtilTool.error('请先按错误提示修改数据后再过滤!');
                return;
            }
            var fieldsValue = this.props.form.getFieldsValue();

            this.doFilter(fieldsValue);
            this.setState({filterVisible: false});
        });
    },
    doFilter(params) {
        this.props.doFilter(params);
    },
    onDateRangeChange: function (fieldId, value, dateString) {
        if (fieldId) {
            var fromFieldId = fieldId + 'From';
            var toFieldId = fieldId + 'To';
            var data = {};
            data[fromFieldId] = dateString[0];
            data[toFieldId] = dateString[1];
            var data2 = {};
            data2[fieldId] = dateString;
            this.setState(data2);
            this.props.form.setFieldsValue(data);
        }
    },
    render() {
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const {getFieldProps} = this.props.form;
        const field = {
            clientName: getFieldProps('clientName'),
            siteUrl: getFieldProps('siteUrl'),
            inUsingMobileArea: getFieldProps('inUsingMobileArea'),
            assignedManager: getFieldProps('assignedManager'),
            saleStage: getFieldProps('saleStage'),
            lastOutgoingStatus: getFieldProps('lastOutgoingStatus'),
            platformId: getFieldProps('platformId'),
            SpAccount: getFieldProps('SpAccount'),
            spAccountStatus: getFieldProps('spAccountStatus'),
            simulateAccount: getFieldProps('simulateAccount'),
            plannedRevisitTimeFrom: getFieldProps('plannedRevisitTimeFrom'),
            plannedRevisitTimeTo: getFieldProps('plannedRevisitTimeTo'),
            lastAutoAssignTimeFrom: getFieldProps('lastAutoAssignTimeFrom'),
            lastAutoAssignTimeTo: getFieldProps('lastAutoAssignTimeTo'),
            lastOutgoingTimeFrom: getFieldProps('lastOutgoingTimeFrom'),
            lastOutgoingTimeTo: getFieldProps('lastOutgoingTimeTo'),
            createTimeFrom: getFieldProps('createTimeFrom'),
            createTimeTo: getFieldProps('createTimeTo'),
            activeTimeFrom: getFieldProps('activeTimeFrom'),
            activeTimeTo: getFieldProps('activeTimeTo'),
        };
        const renderPlatOption = plats => plats.map((item)=> {
            return (
                <Option value={item.code}>{item.name}</Option>
            );
        });
        return <div className="pull-left" style={{"margin-right": "5px"}}>
            <Button type="primary" ref="btn" onClick={this.showFilterModal}>
                高级过滤<Icon type="bars"/>
            </Button>
            <Modal ref="modal"
                   visible={this.state.filterVisible}
                   width="700"
                   title="数据过滤器" onCancel={this.handleFilterModalCancel}
                   footer={[]}>
                <Form form={this.props.form}>
                    <Row>
                        <Col span="12">
                            <Card title="客户信息" className="su-filter-card ull-left">
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="客户姓名:">
                                            <Input {...field["clientName"]} placeholder="请输入客户姓名"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="信息来源:">
                                            <Input {...field["siteUrl"]} placeholder="请输入信息来源"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="手机归属地:">
                                            <Input {...field["inUsingMobileArea"]} placeholder="请输入归属地信息"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Card title="销售信息" className="su-filter-card pull-right">
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="负责人:">
                                            <Select {...field["assignedManager"]} placeholder="请选择负责人" showSearch="true">
                                                {this.state.managers.map(it => <Option value={it.text}>{it.text}</Option>)}
                                            </Select>                                            
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="销售进程:">
                                            <Select {...field["saleStage"]} placeholder="请选择销售进程" showSearch="true" optionFilterProp="children">
                                                {Config.saleStage.map(it => <Option value={it.value}>{it.text}</Option>)}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="最近电话状态:">
                                            <Select {...field["lastOutgoingStatus"]} placeholder="请选择电话状态" showSearch="true" optionFilterProp="children">
                                                {Config.lastOutgoingStatus.map(it => <Option value={it.value}>{it.text}</Option>)}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <Card title="账户信息" className="su-filter-card pull-left">
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="所属平台:">
                                            <Select {...field["platformId"]} placeholder="请选择平台" showSearch="true" optionFilterProp="children">
                                                {renderPlatOption(Config.plats)}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="实盘号码:">
                                            <Input {...field["SpAccount"]} placeholder="请输入实盘号码"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="账户状态:">
                                            <Select {...field["spAccountStatus"]} placeholder="请选择实盘开立状态" showSearch="true" optionFilterProp="children">
                                                {Config.accountStatus.map(it => <Option value={it.value}>{it.text}</Option>)}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="模拟号码:">
                                            <Input {...field["simulateAccount"]} placeholder="请输入模拟号码"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Card title="时间信息" className="su-filter-card pull-right">
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="计划回访:">
                                            <RangePicker value={this.state.plannedRevisitTime}
                                                         onChange={this.onDateRangeChange.bind(this,"plannedRevisitTime")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="最后分配:">
                                            <RangePicker value={this.state.lastAutoAssignTime}
                                                         onChange={this.onDateRangeChange.bind(this,"lastAutoAssignTime")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="最后联系:">
                                            <RangePicker value={this.state.lastOutgoingTime}
                                                         onChange={this.onDateRangeChange.bind(this,"lastOutgoingTime")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="创建时间:">
                                            <RangePicker value={this.state.createTime}
                                                         onChange={this.onDateRangeChange.bind(this,"createTime")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem
                                            {...formItemLayout}
                                            label="激活时间:">
                                            <RangePicker value={this.state.activeTime}
                                                         onChange={this.onDateRangeChange.bind(this,"activeTime")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="12" style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={this.handleSubmit}>过滤</Button>
                            &nbsp;
                            <Button onClick={this.handleReset}>清除条件</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>;
    }
});
UserForm = createForm()(UserForm);
export default UserForm;
