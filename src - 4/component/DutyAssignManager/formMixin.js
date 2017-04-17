import {Link} from 'react-router'
import {
    Row,
    Col,
    Button,
    DatePicker,
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

const createForm = Form.create;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

let dayTimeStart = " 09:10:00";
let dayTimeEnd = " 17:30:00";
let nightTimeStart = " 18:00:00";
let nightTimeEnd = " 22:00:00";

export default {

    getInitialState() {
        return {
            wantToMoveData: [],
            data: [],
            employees: [],
            add: true,
            startDate: '',
            endDate: '',
            rotaid: "",
            dutyType: "",
            disableCommit: false,
            disableDutyType: false,
            expendDep: [],
            rotaType: 2, // 默认分配值班
        }
    },

    componentDidMount(){
        if (typeof this.props.params.id !== 'undefined') {
            /*查看指定时间段的值班信息*/
            this.setState({rotaid: this.props.params.id, disableDutyType: true});
            flux.actions.fetch(this.props.params.id, (result) => {
                let nowDay = result.beginTime.substring(10, 0);

                this.setState({data: result.children, startDate: nowDay, endDate: nowDay, expendDep: result.children.map(it => it.key)});

                let startDayTime = nowDay + dayTimeStart;
                let endDayTime = nowDay + dayTimeEnd;

                let realStartTime = new Date(result.beginTime);
                let realEndTime = new Date(result.endTime)
                if(new Date(startDayTime) >= realStartTime &&  new Date(endDayTime) >= realEndTime) {
                    this.setState({dutyType: "1"});
                } else {
                    this.setState({dutyType: "2"});
                }

                /*判断是否可以修改*/
                if (realEndTime < new Date()) {
                    this.setState({disableCommit: true});
                }
            }, (error) => {
                message.error("获取数据错误：" + error);
                this.context.router.push("/");
            });
        } else {
        }

        flux.actions.list({}, (result) => {
            this.setState({employees: result});
        }, (error) => {
            message.error("获取数据错误：" + error);
        });
    },

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error('请先按错误提示修改数据后再保存!');
                return;
            }
            const allData = this.state.data;
            var depValue = "";
            for (let i = 0; i < allData.length; i++) {
                var empValue = "";
                for (let j = 0; j < allData[i].children.length; j++) {
                    empValue += allData[i].children[j].key + "_" + allData[i].children[j].name + ",";
                }
                depValue += "" + allData[i].key + "_" + allData[i].name + ":" + empValue + "/"
            }

            if (!!!this.state.dutyType) {
                message.error("请选择值班类型!");
                return;
            }

            if (depValue) {

                let timeSuffixStart = this.state.dutyType == "1" ?  dayTimeStart : nightTimeStart;
                let timeSuffixEnd = this.state.dutyType == "1" ?  dayTimeEnd : nightTimeEnd;

                if (!!this.state.rotaid) {
                    flux.actions.update(this.state.rotaid, depValue, this.state.startDate + timeSuffixStart, this.state.endDate + timeSuffixEnd, this.state.rotaType, (result) => {
                        message.success('更新值班信息成功!');
                        window.location.hash = "#/";
                    }, (error) => {
                        message.error(error);
                    });
                } else {
                    flux.actions.add(depValue, this.state.startDate + timeSuffixStart, this.state.endDate + timeSuffixEnd, this.state.rotaType, (result) => {
                        message.success('添加值班信息成功!');
                        window.location.hash = "#/";
                    }, (error) => {
                        message.error(error);
                    });
                }

            } else {
                message.warn("值班信息为空，请选择值班人信息或者返回！");
            }

        });
    },

    onMoveup(record, text){
        const allData = this.state.data;
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].key == record.key) {
                if (i == 0) {
                    message.warn("已经是第一个啦");
                    this.setState({data: allData});
                    break;
                } else {
                    const temp = allData[i - 1];
                    allData[i - 1] = allData[i];
                    allData[i] = temp;
                    this.setState({data: allData});
                    break;
                }
            } else {
                for (let j = 0; j < allData[i].children.length; j++) {
                    if (record.key == allData[i].children[j].key) {
                        if (j == 0) {
                            message.warn("已经是第一个啦");
                            this.setState({data: allData});
                            break;
                        } else {
                            const temp = allData[i].children[j - 1];
                            allData[i].children[j - 1] = allData[i].children[j];
                            allData[i].children[j] = temp;
                            this.setState({data: allData});
                            break;
                        }
                    }
                }
            }
        }
    },

    onMovedown(record, text){
        const allData = this.state.data;
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].key == record.key) {
                if (i == allData.length - 1) {
                    message.warn("已经是最后一个啦");
                    this.setState({data: allData});
                    break;
                } else {
                    const temp = allData[i + 1];
                    allData[i + 1] = allData[i];
                    allData[i] = temp;
                    this.setState({data: allData});
                    break;
                }
            } else {
                for (let j = 0; j < allData[i].children.length; j++) {
                    if (record.key == allData[i].children[j].key) {
                        if (j == allData[i].children.length - 1) {
                            message.warn("已经是最后一个啦");
                            this.setState({data: allData});
                            break;
                        } else {
                            const temp = allData[i].children[j + 1];
                            allData[i].children[j + 1] = allData[i].children[j];
                            allData[i].children[j] = temp;
                            this.setState({data: allData});
                            break;
                        }
                    }
                }
            }
        }
    },

    onDelete(record, text){
        const allData = this.state.data;
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].key == record.key) {
                allData.splice(i, 1);
                this.setState({data: allData});
                break;
            } else {
                for (let j = 0; j < allData[i].children.length; j++) {
                    if (record.key == allData[i].children[j].key) {
                        allData[i].children.splice(j, 1);
                        if (allData[i].children.length == 0) {
                            allData.splice(i, 1);
                        }
                        this.setState({data: allData});
                        break;
                    }
                }
            }
        }
    },

    handleChange(e){
        this.setState({dutyType: e});
    },

    handleSelectChange(wantToMoveIds) {
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
                return {key: it.departmentId, name: it.departmentName , children: []};
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

        this.setState({data: allData, expendDep: allData.map(it => it.key)});
    },

    render() {
        const columns = [{
            title: '部门及值班员工',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        }, {
            title: '排班顺序',
            key: 'order',
            render: (text, record) => (
                <span>
                    <Icon type="caret-up" onClick={this.onMoveup.bind(this, record)}/>
                        <span className="ant-divider"></span>
                    <Icon type="caret-down" onClick={this.onMovedown.bind(this, record)}/>
                </span>
            ),
            width: '30%',
        }, {
            title: '操作',
            dataIndex: '',
            key: 'operate',
            render: (text, record) => <a href="javascript: void(0)" onClick={this.onDelete.bind(this, record)}>删除</a>,
            width: '30%',
        }];


        // 当前存在于 可值班人员 中的员工
        let dutyAbleEmployees = []; 
        let children = this.state.employees.map(it => {
            // 可值班的人员ID收集
            dutyAbleEmployees = [it.id];
            return <Option key={it.id}>{it.name}</Option>
        })

        let selected = []
        // 将右侧列表数据中 所有已设置的客户经理拼接成数组
        this.state.data.forEach(it => {
            selected = selected.concat(it.children);
        });
        // 将客户经理数组 转换成 纯Id数组
        selected = selected.map(it => {
            if(dutyAbleEmployees.indexOf(it.key) == -1) {
                children.push(<Option key={it.key}>{it.name}</Option>);
            }

            return it.key;
        });

        const data = this.state.data;
        return (
            <Form horizontal form={this.props.form}>
                <Row >
                    <FormItem >
                        <Col span="7">
                            <div style={{"padding-left": "20px"}}>
                                <FormItem required>
                                    <DatePicker value={this.state.startDate} format="yyyy-MM-dd" disabled="true"/>
                                </FormItem>
                            </div>
                        </Col>
                        <Col span="4">
                            <FormItem  required>
                                <Select value={this.state.dutyType ? this.state.dutyType : "请选择值班类型"} style={{ width: 140 }} 
                                    onChange={this.handleChange} disabled={this.state.disableDutyType}>
                                    <Option value="1">日间值班</Option>
                                    <Option value="2">晚间值班</Option>
                                </Select>
                            </FormItem>
                        </Col>

                        <Col span="8" offset="1">
                            <FormItem  >
                                <Button type="primary" disabled={this.state.disableCommit} onClick={this.handleSubmit}>完成</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Link to="/"><Button type="ghost">返回</Button> </Link>
                            </FormItem>
                        </Col>
                    </FormItem>
                </Row>
                <Row style={{padding: '20px'}}>
                    <Col span="13">
                        <Card title="部门员工信息">
                            <Row>
                                <Col span="24">
                                    <Select
                                        multiple
                                        style={{ width: '100%' }}
                                        placeholder="请选择值班员工"
                                        onChange={this.handleSelectChange}
                                        optionFilterProp="children"
                                        value={selected}
                                      >
                                        {children}
                                    </Select>                                    
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span="9">
                        <Card title="值班员工信息">
                            <Row>
                                <Col span="24">
                                    <Table columns={columns} dataSource={data.length > 0 ? data : null} size="middle" expandedRowKeys={this.state.expendDep}
                                           pagination={false}/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Form>

        );
    }
};
