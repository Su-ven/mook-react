import {Link} from 'react-router'
import {
    Row,
    Col,
    Button,
    DatePicker,
    Checkbox,
    Form,
    Table,
    Input,
    QueueAnim,
    Icon,
    message,
    Modal,
    Spin,
    Cascader,
    Card,
    Select
} from 'antd';
import './formMixin.less';
import flux from './flux';

const CheckboxGroup = Checkbox.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

export default {

    getInitialState() {
        return {
            ortaId: null,
            visible: false,
            data: [],
            employees:[],
            startDate: '',
            endDate: '',
            disableCommit: false,
            rotaType: 1, // 默认53值班
            disableDatePicker: false,
        }
    },

    onChange(value, dateString) {
        let nowTimeAll = new Date()
        let nowTimeYMD = new Date(nowTimeAll.getFullYear(), nowTimeAll.getMonth(), nowTimeAll.getDate());

        let selectedTime = new Date(dateString[0]);
        if (selectedTime.getTime() < nowTimeYMD.getTime()) {
            message.warn("开始时间不正确，不能小于当前日期");
        } else {
            this.setState({startDate: dateString[0], endDate: dateString[1]});
        }
    },

    componentDidMount(){
        flux.register(this, 'creatorForm');
    },

    componentWillUnmount: function () {
        flux.unregister("creatorForm");
    },

    showModal(rotaId, datetime) {
        flux.actions.list({}, (result)=> {
            this.setState({employees: result ? result : []});
        }, (error) => {
            message.error("获取客户经理数据错误：" + error);
        });

        if (!!rotaId) {
            flux.actions.fetch(rotaId, (result) => {
                this.setState({
                    data: result.children, disableDatePicker: true,
                    startDate: result.beginTime.substring(10, 0), endDate: result.endTime.substring(10, 0)
                });

                if (new Date(result.endTime) < new Date(new Date().getTime() - 86400000)) {
                    this.setState({disableCommit: true});
                }

            }, (error) => {
                message.error("获取数据错误：" + error);
            });
        } else {
            this.setState({
                startDate: datetime, endDate: datetime
            });            
        }

        this.setState({visible: true, rotaId: rotaId});
    },

    hideModal() {
        this.setState(this.getInitialState());
    },

    onCheckChangeHandle(wantToMoveIds) {
        // 过滤出当前添加的数据
        let wantToMoveData = [];
        this.state.employees.forEach(it => {
            if(wantToMoveIds.indexOf(it.id) > -1) {
                wantToMoveData.push(it);
            }
        });

        // 添加部门数据
        let departmentIds = [];
        let newData = wantToMoveData.map(it => {
            // 不要重复添加新部门
            if(departmentIds.indexOf(it.departmentId) == -1) {
                departmentIds.push(it.departmentId);
                return {key: it.departmentId, name: it.department , children: []};
            } else {
                return null;
            }
        });

        // 排除掉null的部门
        let allData = newData.filter(it => it != null );
        // 添加人员数据 到每个部门
        allData.forEach(it => {
            wantToMoveData.forEach(item => {
                if(it.key == item.departmentId) {
                    it.children.push({key: item.id, name: item.name})
                }
            })
        });

     this.setState({data: allData});
    },

    handleSubmit(e) {
        let self = this;

        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error('请先按错误提示修改数据后再保存!');
                return;
            }


            let storedDatas = this.state.data;
            var depValue = "";
            for (let i = 0; i < storedDatas.length; i++) {
                var empValue = "";
                for (let j = 0; j < storedDatas[i].children.length; j++) {
                    empValue += storedDatas[i].children[j].key + "_" + storedDatas[i].children[j].name + ",";
                }
                depValue += "" + storedDatas[i].key + "_" + storedDatas[i].name + ":" + empValue + "/"
            }

            if (!!!this.state.startDate) {
                message.error("请选择值班时间!");
                return;
            }

            let rotaType = this.state.rotaType;
            if (!!!rotaType) {
                message.error("请选择值班类型！");
                return;
            }

            if (depValue) {
                let startDate = new Date(this.state.startDate);
                let params = {"year": startDate.getFullYear(), "month": (startDate.getMonth() + 1)};

                if (!!this.state.rotaId) {
                    flux.actions.update(this.state.rotaId, depValue, this.state.startDate + " 10:00:00", this.state.endDate + " 09:59:00", rotaType, (result) => {
                        message.success('更新值班信息成功!');
                        self.hideModal();
                        self.props.callBack(params);
                    }, (error) => {
                        message.error(error);
                    });
                } else {
                    flux.actions.add(depValue, this.state.startDate + " 10:00:00", this.state.endDate + " 09:59:00", rotaType, (result) => {
                        message.success('添加值班信息成功!');
                        self.hideModal();
                        self.props.callBack(params);
                    }, (error) => {
                        message.error(error);
                    });
                }
            } else {
                message.warn("值班信息为空，请选择值班人信息或者返回！");
            }

        });
    },

    render() {
        let oneDimData = []
        // 将右侧列表数据中 所有已设置的客户经理拼接成数组
        this.state.data.forEach(it => {
            oneDimData = oneDimData.concat(it.children);
        });
        oneDimData = oneDimData.map(it => it.key);

        let checkboxOptions = this.state.employees.map(it => {return {label: it.name, value: it.id}});

        return (
            <Modal title="53值班表" visible={this.state.visible} width="600" onCancel={this.hideModal} footer={
                <div>
                    <Button type="primary" disabled={this.state.disableCommit} onClick={this.handleSubmit}>完成</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" onClick={this.hideModal}>返回</Button>      
                </div> 
            }>
                <Form horizontal form={this.props.form}>
                    <Row >
                        <FormItem >
                            <Col span="12">
                                <div style={{"padding-left": "20px"}}>
                                    <FormItem required>
                                        <RangePicker value={[this.state.startDate, this.state.endDate]}
                                                     format="yyyy-MM-dd" onChange={this.onChange} disabled={this.state.disableDatePicker}/>
                                    </FormItem>
                                </div>
                            </Col>
                        </FormItem>
                    </Row>
                    <Row style={{padding: '20px'}}>
                        <Card title="员工信息">
                            <CheckboxGroup options={checkboxOptions} value={oneDimData} onChange={this.onCheckChangeHandle} />
                        </Card>
                    </Row>
                </Form>
            </Modal> 
        );
    }
};
