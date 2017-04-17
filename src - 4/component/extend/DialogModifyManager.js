const objectAssign = require("object-assign");
import {Form, Row, Col, Button, Icon, Dropdown, Modal, Input, Select, DatePicker, Radio} from 'antd';
import fluxBatch from '../flux/batch';
import fluxList from '../flux/list';
import {UtilTool} from './../../libs/ui-core';
const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
var form = React.createClass({
    getInitialState() {
        let visible = this.props.visible ? this.props.visible : false;
        return {
            visible: !!visible,
            managers: [],
            manager: undefined,
            planTime: undefined,
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    },

    componentDidMount: function(){
        if(this.props.batchFlag)
            fluxBatch.actions.fetchManagers( {employeeId: window.userId},
            (result) => {
                let managers = result ? result.map(it => ({employeeId: it.employeeId ? it.employeeId : it.id, employeeName: it.employeeId ? it.employeeName : it.name})) : [];
                this.setState({managers: managers});
            },  (error) => {
                UtilTool.error("获取客户经理列表失败" + error);
            });        
    },

    handleCancel(e){
        this.setState({visible: false, manager: undefined});
        if (typeof (this.props.onHide) == "function") {
            this.props.onHide();
        }
    },

    handleManagerChange(e){
       this.setState({manager: e});
    },

    handlePlanReturnVisitTime(date, dateString) {
        this.setState({planTime: dateString});
    },  

    handleSend(e){

        if(!this.state.manager) {
            UtilTool.error("请选择一个客户经理");
            return;
        }

        let managerNames = this.state.managers.filter(it => it.employeeId == this.state.manager);

        let defaultParams = {
            planTime: this.state.planTime,
            assignedManagersId: this.state.manager,
            assignedManagersName: managerNames[0].employeeName,
        };

        if(this.props.batchFlag) {
            var self = this;
            
            Modal.confirm({
                title: "修改客户经理",
                content: '您是否确认要将所选客户修改客户经理?',
                onOk() {
                    self.save(self.props.customerIds, defaultParams);
                },
                onCancel() {

                }
            });
        } else {
            this.save(this.props.customerIds, defaultParams);
        }

    },

    save(customerIds, params){
        fluxBatch.actions.batchModifyManagers(objectAssign(params, {customerIds: customerIds.join(",")}),
        (result) => {
            if(result) {
                let successNum = customerIds.length - result.length;
                UtilTool.success(successNum + "个客户成功修改客户经理,失败" + result.length +"个");
            } else {
                UtilTool.success(customerIds.length + "个客户成功修改客户经理,失败0个");
            }

            this.props.doFilter({});
            // fluxList.refreshTable();
        }, (error) => {
            UtilTool.error("修改客户经理失败" + error);
        }, () => {
            this.handleCancel();
        });
    },

    render() {
        let width = parseInt(this.props.width ? this.props.width : 500);
        let managerOptions = this.state.managers ? 
            this.state.managers.map(it => (<Option value={it.employeeId}>{it.employeeName}</Option>)) : null;


        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        }; 

        return <Modal visible={this.state.visible} width={width} title="修改客户经理" 
                 onOk={this.handleSend} onCancel={this.handleCancel}>
            <Row>
                <Col>
                    <FormItem {...formItemLayout} label="负责人">
                        <Select onChange={this.handleManagerChange}  showSearch={true} optionFilterProp="children" placeholder="请选择负责人"
                           value={this.state.manager} style={{ width: 200 }}>
                          {managerOptions}
                        </Select>                              
                    </FormItem>                   
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormItem {...formItemLayout} label="计划回访时间">
                        <Row>
                             <DatePicker onChange={this.handlePlanReturnVisitTime} 
                                format="yyyy-MM-dd HH:mm:ss" showTime={true}/>
                        </Row>
                        <Row>
                            （程序默会清空此字段，如需特定的变更请选择一个日期）
                        </Row>                        
                    </FormItem>                   
                </Col>
            </Row>
        </Modal>;
    }
});
export default createForm()(form);
