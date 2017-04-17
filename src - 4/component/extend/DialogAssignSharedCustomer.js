import {Form, Row, Col, Button, Modal, Input, Select, DatePicker, InputNumber} from 'antd';
import fluxBatch from '../flux/batch';
import fluxList from '../flux/list';
import {UtilTool} from './../../libs/ui-core';

const objectAssign = require("object-assign");
const createForm = Form.create;
const FormItem = Form.Item;

var form = React.createClass({
    getInitialState() {
        return {
            visible: false,
            managers: [],
            manager: undefined,
            planTime: undefined,
            peopleNumber: undefined,
        }
    },

    showModal(){
        this.setState({visible: true});

        fluxBatch.actions.fetchManagers( {employeeId: window.userId},
        (result) => {
            this.setState({managers: result});
        },  (error) => {
            UtilTool.error("获取客户经理列表失败" + error);
        });           
    },

    handleCancel(e){
        this.setState(this.getInitialState());
    },

    handleManagerChange(value){
       this.setState({manager: value});
    },

    handlePlanTimeChange(date, dateString) {
        this.setState({planTime: dateString});
    },  

    handlePeopleNumberChange(value){
        this.setState({peopleNumber: value});
    },

    handleSend(e){

        if(!this.state.manager) {
            UtilTool.error("请选择一个客户经理");
            return;
        }
        if(!this.state.peopleNumber) {
            UtilTool.error("请输入将要分配的客户数");
            return;    
        }

        let managerNames = this.state.managers.filter(it => it.employeeId == this.state.manager);

        let defaultParams = {
            planTime: this.state.planTime,
            assignedManagersId: this.state.manager,
            assignedManagersName: managerNames[0].employeeName,
            peopleNumber: this.state.peopleNumber,
        };

        var self = this;
        Modal.confirm({
            title: "分配共享客户",
            content: '您是否确认此次操作?',
            onOk() {
                self.save(defaultParams);
            },
            onCancel() {
            }
        });

    },

    save(params){
        fluxBatch.actions.assignSharedCustomers(params, (result) => {
            UtilTool.success(result + "个客户被成功分配");
            fluxList.refreshTable();
        }, (error) => {
            UtilTool.error("分配共享客户失败" + error);
        }, () => this.handleCancel());
    },

    render() {
        let managerOptions = this.state.managers ? 
            this.state.managers.map(it => (<Option value={it.employeeId}>{it.employeeName}</Option>)) : null;


        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        }; 

        return <div className="pull-left" style={{"margin-right": "5px"}}>
            <Button type="primary" ref="btn" onClick={this.showModal}>
                共享客户分配
            </Button>

            <Modal visible={this.state.visible} width="500" title="分配共享客户" 
                     onOk={this.handleSend} onCancel={this.handleCancel}>
                <Row>
                    <Col>
                        <FormItem {...formItemLayout} label="负责人">
                            <Select showSearch={true} optionFilterProp="children" placeholder="请选择负责人" style={{ width: 200 }}
                                value={this.state.manager} onChange={this.handleManagerChange} >
                                    {managerOptions}
                            </Select>                              
                        </FormItem>                   
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem {...formItemLayout} label="分配人数">
                            <InputNumber min={1} onChange={this.handlePeopleNumberChange} value={this.state.peopleNumber} />
                        </FormItem>                   
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem {...formItemLayout} label="计划回访时间">
                            <Row>
                                 <DatePicker format="yyyy-MM-dd HH:mm:ss" showTime={true}
                                    value={this.state.planTime} onChange={this.handlePlanTimeChange} />      
                            </Row>
                            <Row>
                                （程序默会清空此字段，如需特定的变更请选择一个日期）
                            </Row>                        
                        </FormItem>                   
                    </Col>
                </Row>
            </Modal>
        </div>;
    }
});
export default createForm()(form);
