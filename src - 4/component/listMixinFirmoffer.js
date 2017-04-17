const objectAssign = require('object-assign');
import {Dropdown, Switch } from 'antd';
import {UtilTool} from './../libs/ui-core';
import {Tag as SuTag} from './../libs/ui-extend';
import BtnMobile from './extend/BtnMobile';
import FilterPanel from './extend/PanelFilter';
import MenuColorFlag from './extend/MenuColorFlag';
import PopDate from './extend/PopDate';
import fluxList from './flux/list';
import fluxDetail from './flux/detail';
import fluxSms from './flux/sms';
import {Router, Route, Link, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';
import Config from './config';
import Util from './util';
import "./list.less";

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

module.exports = function (flux, title) {
    return {
        getInitialState: function () {
            return {
                columns: [],
                managerTelephoneList: [],
                currentView: "default",
                defaultTags: [],
                params: {},
            }
        },
        //@小强要求的,batch的key变成customerId
        getRowKey(record, index){
            return record.customerId;
        },
        getColumns() {
            return this.state.columns ? this.state.columns : [];
        },
        getFilterPanel() {
            return <FilterPanel doFilter={this.onFilter} tags={this.state.defaultTags}
                                selectedRowKeys={this.state.selectedRowKeys}/>;
        },
        showAbovePagination() {
            return true;
        },
        getRowSelection() {
            let self = this;
            return {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: function (selectedRowKeys) {
                    self.setState({selectedRowKeys: selectedRowKeys});
                    flux.actions.rowSelectionChanged(selectedRowKeys);
                },
                getCheckboxProps: record => ({
                    // 锁定客户、影子客户 以及 分配客户经理中、待回访 不允许勾选 还有 flag=2，3的也不能编辑
                    disabled: record.isLock == "3" || record.isLock == "2" ||
                        ( window.prefix == "/sl" ? false : record.clientStatus == "5" ) ||
                        record.clientStatus == "6" || record.clientStatus == "7" ||
                        record.flag == "2" || record.flag == "3",
                }),
            };
        },
        getScroll() {
            return {x: false, y: false};
        },
        getPageSizeOptions(){
            return ["10", "20", "30", "40", "100", "200"];
        },

        setDefaultTags() {
            fluxList.actions.fetchTag({}, (result) => {
                this.setState({defaultTags: result});
            }, (error) => {
                UtilTool.error('Tag列表获取失败' + error);
            });
        },

        componentDidMount: function () {
            fluxList.register(this, "listView");

            this.setDefaultTags();

            fluxList.actions.fetchManagerTelephoneList({employeeId: window.userId}, (result) => {
                let managerTelephoneList = [];
                if (result && result.length > 0) {
                    managerTelephoneList.push(result[0].telephoneOne);
                    managerTelephoneList.push(result[0].telephoneTwo);
                    managerTelephoneList.push(result[0].telephoneThree);
                    managerTelephoneList.push(result[0].telephoneFour);
                }
                this.setState({managerTelephoneList: managerTelephoneList});
            }, (error) => {
                UtilTool.error('客户经理座机列表获取失败' + error);
            });

            this.refreshColumnsConfig();
        },

        componentWillUnmount: function () {
            fluxList.unregister("listView");
        },

        componentDidUpdate(){
            // this.resizeAntdTable();
        },

        onMarkShareFlagChange(record, checked) {
            let clientStatus = record.clientStatus;
            let flag = record.flag;
            let isLock = record.isLock;

            console.log(clientStatus, flag, isLock);
            if(clientStatus != "1" && clientStatus != "2" || flag == "2" || flag == "3" || isLock == "2" || isLock == "3") {
                UtilTool.success("此客户所处的状态不允许更改待共享标记");
                return;
            }

            fluxDetail.actions.markShared({customerId: record.customerId, clientStatus: checked ? "2" : "1"}, result => {
                UtilTool.success("已取消待共享")
                let data = this.state.data.map(it => {
                    if(it.customerId == record.customerId) 
                        it.clientStatus = 1;
                    return it;
                });
                this.setState({data: data});
            }, error => {
                UtilTool.error('更改待共享标记失败：' + error);
            });
        },        

        haneleColumnRender(columns){
            let self = this;

            for (var i in columns) {
                if (columns[i].render) {
                    switch (columns[i].render) {
                        case "siteUrl":
                            columns[i].render = function (text, record) {
                                return <span>{Util.replaceSiteUrl(text)}</span>;
                            }
                            break;
                        case "saleStage":
                            columns[i].render = function (text, record) {
                                let item = Config.saleStage.filter(it => it.value == text)[0];
                                return <span>{item?item.text:null}</span>;
                            }
                            break;
                        case "clientStatus":
                            columns[i].render = function (text, record) {
                                let item = Config.clientStatus.filter(it => it.value == text)[0];

                                let content = []
                                if(text == "1" && window.prefix == "/dr") {
                                    // content.push(<div>待共享<Switch defaultChecked={false} checkedChildren="是" unCheckedChildren="否"></Switch></div>)
                                } else if(text == "2" && window.prefix == "/dr") {
                                    content.push(<Switch checked={text == "2"} onChange={self.onMarkShareFlagChange.bind(this, record)} checkedChildren="是" unCheckedChildren="否"></Switch>)
                                }

                                return <div>
                                    {item?item.text:null}
                                    {content}
                                </div>;
                            }
                            break;
                        case "inUsingClientName":
                            columns[i].render = function (text, record) {
                                let customerIds = self.state.data.map(it => it.customerId);

                                const colorFlags = (<MenuColorFlag
                                    onClick={self.handleColorFlagClick.bind(this, record)}></MenuColorFlag>);
                                var num = parseInt(record.colorFlag);
                                if (num > 5) {
                                    num = 0;
                                }
                                // return (<Link to={"/detail/" + record.customerId} query={{cids: customerIds.join(",")}}>{text}</Link>);
                                return <div>
                                    <Dropdown overlay={colorFlags}><a href="#"><b
                                        className={"ico-color-flag ico-color-flag-" + num}></b></a></Dropdown>
                                    &nbsp;&nbsp;
                                    <a href={window.location.href + "detail/" + record.customerId + "?cids=" + customerIds.join(",")}
                                       target="_blank">{text}</a>
                                    {record.assignedManagerName ? <div>负责人[{record.assignedManagerName}]</div> : ""}
                                </div>
                            }
                            break;
                        case "inUsingMobile":
                            columns[i].render = function (text, record) {
                                return <div style={{textAlign: 'center'}}>
                                    <BtnMobile to={text} fromList={self.state.managerTelephoneList}
                                               cid={record.customerId}
                                               okCallback={self.handleCallOk.bind(this, record)}></BtnMobile>
                                    <span>{record.inUsingMobileArea}</span>
                                </div>;
                            }
                            break;
                        case "colorFlag":
                            columns[i].render = function (text, record) {
                                const colorFlags = (<MenuColorFlag
                                    onClick={self.handleColorFlagClick.bind(this, record)}></MenuColorFlag>);
                                var num = parseInt(record.colorFlag);
                                if (num > 5) {
                                    num = 0;
                                }
                                return (
                                    <Dropdown overlay={colorFlags}><a href="#"><b
                                        className={"ico-color-flag ico-color-flag-" + num}></b></a></Dropdown>
                                );
                            }
                            break;
                        case "tag":
                            columns[i].render = function (text, record) {
                                return (<SuTag value={text} options={self.state.defaultTags}
                                               okCallback={self.handleTagsChange.bind(this, record)} width="150"
                                               onComponentDidUpdate={self.onTagDidUpdate.bind(this, record)}/>);
                            }
                            break;
                        case "spAccount":
                            columns[i].render = function (text, record) {
                                return <div>
                                    {record.metalSpAccount ? <div>津:{record.metalSpAccount}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                                        ￥{record.metalFunding ? record.metalFunding : 0}</div> : ""}
                                    {record.qiluSpAccount ? <div>齐:{record.qiluSpAccount}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                                        ￥{record.qiluFunding ? record.qiluFunding : 0}</div> : ""}
                                    {record.qilu159SpAccount ? <div>齐:{record.qilu159SpAccount}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                                            ￥{record.qilu159Funding ? record.qilu159Funding : 0}</div> : ""}
                                    {record.ydylSpAccount ? <div>一:{record.ydylSpAccount}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                                            ￥{record.ydylFunding ? record.ydylFunding : 0}</div> : ""}
                                </div>;
                            }
                            break;
                        case "metalFunding":
                            columns[i].render = function (text, record) {
                                return <div>{record.metalFunding ? record.metalFunding : 0}</div>;
                            }
                            break;
                        case "qiluFunding":
                            columns[i].render = function (text, record) {
                                return <div>{record.qiluFunding ? record.qiluFunding : 0}</div>;
                            }
                            break;
                        case "qilu159Funding":
                            columns[i].render = function (text, record) {
                                return <div>{record.qilu159Funding ? record.qilu159Funding : 0}</div>;
                            }
                            break;
                        case "ydylFunding":
                            columns[i].render = function (text, record) {
                                return <div>{record.ydylFunding ? record.ydylFunding : 0}</div>;
                            }
                            break;
                        case "lastOutgoingTime":
                            columns[i].render = function (text, record) {
                                let t = text ? text.split(" ") : ["", ""];
                                return <div>{t[0]} <br/> {t[1]} </div>;
                            }
                            break;
                        case "plannedRevisitTime":
                            columns[i].render = function (text, record) {
                                let t = text ? text.split(" ") : ["", ""];
                                return <div>
                                    {t[0]} <br/> {t[1]}
                                    {window.ssm ? "" :
                                        [<br/>, <PopDate okCallback={self.handleVisitDate.bind(this, record)}/>] }
                                </div>;
                            }
                            break;
                        default:
                            columns[i].render = function (text, record) {
                                return <span>{text}</span>;
                            }
                            break;
                    }
                }
            }
            return columns;
        },
        refreshColumnsConfig(){
            let result = [
                {title: '客户姓名', dataIndex: 'inUsingClientName', sorter: true, width: 100, render: "inUsingClientName"},
                {title: '手机号码', dataIndex: 'inUsingMobile', sorter: true, width: 150, render: "inUsingMobile"},
                {title: '实盘帐号', dataIndex: 'spAccount', sorter: false, width: 135, render: "spAccount"},
                {title: '最近回访内容', dataIndex: 'lastRevisitContent', sorter: true, width: 180, render: true},
                {title: '客户标签', dataIndex: 'tag', width: 150, render: "tag"},
                {title: '最近联系时间', dataIndex: 'lastOutgoingTime', sorter: true, width: 100, render: "lastOutgoingTime"},
                {
                    title: '计划回访时间',
                    dataIndex: 'plannedRevisitTime',
                    sorter: true,
                    width: 100,
                    render: "plannedRevisitTime"
                },
                {title: '客户状态', dataIndex: 'clientStatus', sorter: true, width: 80, render: "clientStatus"},
                {title: '信息来源', dataIndex: 'siteUrl', sorter: true, width: 80, render: "siteUrl"},
                {title: '销售进程', dataIndex: 'saleStage', sorter: true, width: 80, render: "saleStage"},
                {title: '贵金属资金', dataIndex: 'metalFunding', sorter: true, width: 70, render: "metalFunding"},
                {title: '齐鲁119资金', dataIndex: 'qiluFunding', sorter: true, width: 70, render: "qiluFunding"},
                {title: '齐鲁159资金', dataIndex: 'qilu159Funding', sorter: true, width: 70, render: "qilu159Funding"},
                {title: '一带一路资金', dataIndex: 'ydylFunding', sorter: true, width: 70, render: "ydylFunding"},
            ];
            this.setState({"columns": this.haneleColumnRender(result)});
        },
        onFilter(params){
            let totalParams = objectAssign({}, this.state.params, params);

            Object.keys(params).forEach(it => {
                if (!params[it]) delete totalParams[it];
            })

            this.setState({params: totalParams});
            this.filterHandler(totalParams);

            // 设置 DialogSms 的参数
            fluxSms.execute("setParams", "sms", totalParams);
        },
        handleColorFlagClick (record, ekey) {
            fluxDetail.actions.saveColorFlag(record.customerId, {colorFlagNew: ekey}, (result) => {
                UtilTool.success("保存成功~");
                this.refreshRowColorFlag(record.customerId, ekey);
            }, (error) => {
                UtilTool.error(error);
            });
        },
        refreshRowColorFlag(rowId, colorFlag) {
            let rows = this.state.data.filter(row => row.customerId == rowId);
            if (rows[0]) rows[0].colorFlag = colorFlag;
            this.setState({data: this.state.data});
        },
        refreshRowColorFlagBatch(rowIds, colorFlag) {
            this.state.data.forEach(row => {
                if (rowIds.indexOf(row.customerId) > -1)
                    row.colorFlag = colorFlag;
            });
            this.setState({data: this.state.data});
        },
        handleVisitDate(record, dateString){
            fluxList.actions.saveRevisitTime(record.customerId, dateString ? {plannedRevisitTime: dateString} : {}, (result) => {
                UtilTool.success('设置回访时间[' + dateString + ']成功~');
                this.refreshRowRevisitTime(record.customerId, dateString);
            }, (error) => {
                UtilTool.error('设置回访时间失败~' + error);
            });
        },
        refreshRowRevisitTime(rowId, dateString) {
            let rows = this.state.data.filter(row => row.customerId == rowId);
            if (rows[0]) rows[0].plannedRevisitTime = dateString;
            this.setState({data: this.state.data});
        },
        handleTagsChange(record, value){
            value = value.join(",");
            let data = {"tag": value};
            fluxDetail.actions.save(record.customerId, data, (result) => {
                UtilTool.success('用户标签保存数据成功~');
                // 用户标签更改后，默认标签更新
                this.setDefaultTags();
                this.refreshRowTag(record.customerId, value);
            }, (error) => {
                UtilTool.error('用户标签保存失败~');
            });
        },
        handleCallOk(record, mobile){
            // appHistory.pushState(null, "/detail/" + record.customerId);
        },
        refreshRowTag(rowId, tag) {
            let rows = this.state.data.filter(row => row.customerId == rowId);
            if (rows[0]) rows[0].tag = tag;
            this.setState({data: this.state.data});
        },
        onTagDidUpdate(record){
            // let rowId = record.id;
            // let target_i = -1;
            // this.state.data.filter(function (row, i) {
            //     if (row.id == rowId) {
            //         target_i = i;
            //         return;
            //     }
            // }, this);
            // if (target_i >= 0) {
            //     if (typeof this.resizeBodyTrHeight == "function") {
            //         this.resizeBodyTrHeight(target_i);
            //     }
            // }
        }
    }
};
