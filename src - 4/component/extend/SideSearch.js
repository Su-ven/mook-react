import {Input, Button, Modal, Icon, Menu, Dropdown} from 'antd';
import {Router, Route, Link, useRouterHistory} from 'react-router';
import {UtilTool} from './../../libs/ui-core';
import {Table as SuTable} from './../../libs/ui-extend';
import {createHashHistory} from 'history';
import flux from '../flux/sidesearch';
import Config from '../config';
import Util from '../util';

import './SideSearch.less';

const InputGroup = Input.Group;
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

export default React.createClass({

    getInitialState() {
        return {
            visible: false,
            keyword: "",
            role: "",
            managers: [],
        };
    },

    handleKeywordChange(e) {
        this.setState({keyword: e.target.value.trim()});
    },

    handleKeydown(e) {
        if (e.keyCode == 13) {
            e.stopPropagation();
            this.doSearch();
        }
    },

    handleRowClick(record, index, e){
        // 点击行跳跃暂时取消
        // if (!(e.target.nodeName == "A" || e.target.nodeName == "BUTTON" || e.target.nodeName == "SPAN" || e.target.nodeName == "I")) {
        //     var id = record["customerId"];
        //     let _path = window.location.pathname;

        //     if(this.state.role == "" || this.state.role == "no"){
        //         return;
        //     }

        //     window.open(_path + "#/detail/" + id);
        //     this.handleCancel();
        // }
    },

    handleCancel() {
        this.setState({visible: false, keyword: ''});
    },

    doSearch() {
        if (this.state.keyword == null || this.state.keyword == "") {
            UtilTool.error("请输入关键字");
            return;
        }
        this.setState({
            visible: true
        });

        if(window.prefix == "/dr") {
            flux.actions.fetchManagers({employeeId: window.userId}, (result) => {
                let managers = result ? result.map(it => it.id) : [];
                this.setState({managers: managers});
            }, (error) => {
                UtilTool.error('客户经理列表获取失败' + error);
            });
        } else if(window.prefix == "/am") {
            this.setState({managers: [window.userId]});
        }        
    },

    componentDidMount() {
        this.setState({role: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0] : "no"});
    },

    handleMenuClick(record, e) {
        if (e.key != "no")
            window.open("/potential" + e.key.toUpperCase() + ".html#/detail/" + record.customerId);
    },

    handleRoleClick(record) {
        if (this.state.role != "no")
            window.open("/potential" + this.state.role.toUpperCase() + ".html#/detail/" + record.customerId);
    },

    render() {
        let params = this.state.keyword ? {"keyword": this.state.keyword} : null;

        const allRoles = {"am": "客户经理", "dr": "经理主管", "sm": "销售主管", "op": "营运主管", "ot": "合规主管", "no": "无对应角色"};
        const roles = this.props.roles && this.props.roles.length > 0 ? this.props.roles : ["no"];

        const menu = (record, index) => {
            return (
                <Menu onClick={this.handleMenuClick.bind(this, record)}>
                    {
                        (Object.keys(allRoles)
                            .filter(it => roles.indexOf(it) > -1)
                            .map(it => (<Menu.Item key={it}>{"以" + allRoles[it] + "身份查看"}</Menu.Item>)))
                    }
                </Menu>
            )
        };

        const columns = [
            {title: '客户姓名', dataIndex: 'inUsingClientName', sorter: false},
            {
                title: '客户类型', dataIndex: 'clientType', sorter: false, render: (text, record) => {
                return Config.clientType.filter(it => it.value == text).map(it => it.text);
            }},
            {title: '信息来源', dataIndex: 'siteUrl', sorter: false, render: (text, record, index) =>{
                return Util.replaceSiteUrl(text);
            }},
            {title: '负责人', dataIndex: 'assignedManagerName', sorter: false},
            {title: '贵金属实盘号', dataIndex: 'metalSpAccount', sorter: false},
            {title: '齐鲁实盘号', dataIndex: 'qiluSpAccount', sorter: false},
            {title: '齐鲁159实盘号', dataIndex: 'qilu159SpAccount', sorter: false},
            {title: '一带一路实盘号', dataIndex: 'ydylSpAccount', sorter: false},
            {title: '点击查看', width: 180, render: (text, record, index) => {
                let customerManager = record.assignedManagerId;

                if( window.prefix == "/sm" || window.prefix == "/op" || window.prefix == "/ot" || window.prefix == "/sl" || this.state.managers.indexOf(customerManager) > -1 ) {
                    return <div>
                            <Dropdown.Button overlay={menu(record, index)} type="ghost"
                                onClick={this.handleRoleClick.bind(this, record)}>
                              {"以" + allRoles[this.state.role] + "身份查看"}
                            </Dropdown.Button>
                         </div>;
                } else {
                    return "";
                }
            }},
        ];
        return ( <div>
                <InputGroup style={{margin: "10px 5px 10px 5px"}} className="searchGroup">
                    <Input placeholder='潜在或实盘关键字' value={this.state.keyword} onKeyDown={this.handleKeydown}
                           onChange={this.handleKeywordChange}/>
                    <div className="ant-input-group-wrap">
                        <Button shape="circle" onClick={this.doSearch}
                                style={{borderRadius: 0, borderLeftWidth: 0}}><Icon type="search"/></Button>
                    </div>
                </InputGroup>
                <Modal ref="modal"
                       width="800"
                       visible={this.state.visible}
                       title="搜索结果" onCancel={this.handleCancel}
                       footer={[]}>
                    <SuTable className="gx-side-search-table" columns={columns} flux={flux}
                             handleRowClick={this.handleRowClick} params={params}/>
                </Modal>
            </div>
        );
    }
});
