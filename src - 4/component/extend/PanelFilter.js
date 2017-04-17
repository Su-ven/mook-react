import {Form, Row, Col, Button, Icon, Modal, Menu, Dropdown, DatePicker, Input, Select} from 'antd';
import BtnGroupEdit from './BtnGroupEdit';
import FormFilter from './DialogFilter';
import DialogAssignSharedCustomer from './DialogAssignSharedCustomer';
import TopSearch from './TopSearch';
import MenuColorFlag from './MenuColorFlag';
import flux from '../flux/list';
import {UtilTool} from './../../libs/ui-core';
import Config from './../config';
import './PanelFilter.less';
const DropdownButton = Dropdown.Button;
const Option = Select.Option;
const confirm = Modal.confirm;

var susu = React.createClass({
    getInitialState() {
        return {
            views: [],
            tags: [],
            color: null,
            tag: null,
            grade: null,
        }
    },

    handleColorFlagMenuClick(ekey) {
        this.props.doFilter({colorFlag: ekey == "cancle" ? null : ekey});
        this.setState({color: ekey});
    },

    handleCustomViewChange(value) {
        this.props.doFilter({view: value == "default" ? null : value});
    },

    handleGradeClick: function (e) {
        this.props.doFilter({clientGrade: e.key == "cancle" ? null : e.key});

        let selected = Config.clientGrade.filter(it => it.value == e.key);
        this.setState({grade: selected[0] ? selected[0].text : null});
    },

    handleTagClick: function (tag, e) {
        this.props.doFilter({tag: tag ? tag : null});
        this.setState({tag: tag});
    },

    handleTagDelete(tag, e) {
        let self = this;

        e.stopPropagation();
        confirm({
            title: '您是否确认要删除这个标签',
            onOk() {
                flux.actions.deleteTag({tag: tag}, (result) => {
                    UtilTool.success("已删除");

                    flux.execute("setDefaultTags", "listView");
                    flux.refreshTable();
                }, (error) => {
                    UtilTool.error('删除失败：' + error);
                });
            },
            onCancel() {},
        });
    },

    handleDateFilter: function (date, dateString) {
        this.props.doFilter({plannedRevisitTime: dateString ? dateString : null});
    },

    componentDidMount: function () {
        flux.actions.fetchViewList({}, (result) => {
            this.setState({views: result});
        }, (error) => {
            UtilTool.error('视图列表拉取失败' + error);
        });
        // 上层组件拉取过一次tag
        // flux.actions.fetchTag({}, (result) => {
        //     this.setState({tags: result});
        // }, (error) => {
        //     UtilTool.error('标签列表拉取失败' + error);
        // });
    },

    componentWillReceiveProps: function(nextProps){
        // 上层组件拉取过一次tag
        if(nextProps.tags != undefined){
            this.setState({tags: nextProps.tags});
        }
    },
    render() {
        //旗帜
        const flagOver = (<MenuColorFlag onClick={this.handleColorFlagMenuClick} showCancle={true}></MenuColorFlag>);
        //标签
        let tagChildren = [];
        let tagColors = ["blue", "green", "red", "yellow"];
        for (let i in this.state.tags) {
            let item = this.state.tags[i];
            let color = tagColors[i % 4];
            tagChildren.push(<div className={"ant-tag ant-tag-" + color} onClick={this.handleTagClick.bind(this, item)}>
                <span className="ant-tag-text">{item}</span>
                <i className="anticon anticon-cross" onClick={this.handleTagDelete.bind(this, item)} ></i>
            </div>);
        }
        const menuTag = <div className="su-dropdown-container">{tagChildren}
                <div className={"ant-tag ant-tag-0"} onClick={this.handleTagClick.bind(null, null)}>
                    <span className="ant-tag-text">清空</span>
                </div>
            </div>;

        const menuGrade = <Menu onClick={this.handleGradeClick} >
            <Menu.Item key="cancle">&nbsp;&nbsp;清空&nbsp;&nbsp;</Menu.Item>
            {Config.clientGrade.map(it => {
                return <Menu.Item key={it.value}>&nbsp;&nbsp;{it.text}&nbsp;&nbsp;</Menu.Item>;
            })}
        </Menu>;
        
        //视图
        let viewOptions = [];
        Object.keys(this.state.views).forEach((prop) => viewOptions.push(<Option key={prop}>{this.state.views[prop]}</Option>));

        return <div>
            <Row className="gx-table-toolbar">
                <Col span="24">
                    <h2>{this.props.title}</h2>
                </Col>
            </Row>
            <Row className="gx-table-toolbar">
                <Col span="24">
                    <BtnGroupEdit customerIds={this.props.selectedRowKeys} batchFlag={true} doFilter={this.props.doFilter}></BtnGroupEdit>
                    <div className="pull-left" style={{"margin-right": "5px"}}>
                        <DropdownButton overlay={flagOver} type="primary">
                            <b className={"ico-color-flag ico-color-flag-" + this.state.color}></b> 旗帜过滤
                        </DropdownButton>
                    </div>
                    <div className="pull-left" style={{"margin-right": "5px"}}>
                        <DropdownButton overlay={menuGrade} type="primary">{this.state.grade ? this.state.grade : "星级过滤"}</DropdownButton>
                    </div>                    
                    <div className="pull-left" style={{"margin-right": "5px"}}>
                        <DropdownButton overlay={menuTag} type="primary">{this.state.tag ? this.state.tag : "标签过滤"}</DropdownButton>
                    </div>

                    <FormFilter doFilter={this.props.doFilter}/>
                    {window.ssm ? <DialogAssignSharedCustomer/> : undefined}
                    {window.prefix == "/sl" ? undefined : <div className="pull-right">
                            <Select style={{width: 150}} onChange={this.handleCustomViewChange}
                                    showSearch
                                    placeholder="请输入或选择视图"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到">
                                <Option key="default">默认视图</Option>
                                {viewOptions}
                            </Select>
                        </div>
                    }
                    <div className="pull-right">
                        <DatePicker style={{"margin": "0px 10px 0px 5px"}} placeholder="按回访时间过滤"
                                    onChange={this.handleDateFilter}/>
                    </div>
                    <div className="pull-right">
                        <TopSearch doFilter={this.props.doFilter} width="180"></TopSearch>
                    </div>
                </Col>
            </Row>
        </div>;
    }
});
export default susu;
