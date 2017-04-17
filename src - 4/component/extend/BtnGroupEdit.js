import {Row, Col, Button, Icon, Menu, Dropdown, Select, message, Modal, Input, Form, Switch, Tag} from 'antd';
import {Router, Route, Link, useRouterHistory} from "react-router";
import {createHashHistory} from 'history'
import fluxBatch from '../flux/batch';
import fluxList from '../flux/list';
import fluxDetail from '../flux/detail';
import DialogModifyManager from './DialogModifyManager';
import DialogShare from './DialogShare';
import DialogSms from './DialogSms';
import MenuColorFlag from './MenuColorFlag';
import {UtilTool} from './../../libs/ui-core';
import './MenuColorFlag.less';
import './BtnGroupEdit.less';

const ButtonGroup = Button.Group;
const DropdownButton = Dropdown.Button;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

var form = React.createClass({
    getInitialState() {
        return {
            visibleModifyManager: false,
            visibleSms: false,
            visibleShare: false,
            colorFlag: "",
            clientStatus: "",
            flag: "",
            isLock: "",
            clientName: "",
            lockedCustomerInfo: [],
            cids: [],
        }
    },

    componentDidMount: function() {
        if(!this.props.batchFlag) {
            this.fetchColorAndShareFlag();
        }

        fluxDetail.register(this, "btnGroup");
    },

    componentWillUnmount() {
        fluxDetail.unregister("btnGroup");
    },

    fetchBasicInfo(basicInfo, cids) {
        this.setState({
            clientName: basicInfo ? basicInfo.inUsingClientName : null,
            flag: basicInfo.flag,
            isLock: basicInfo.isLock,
            lockedCustomerInfo: basicInfo.lockedCustomerInfo ? basicInfo.lockedCustomerInfo : [],
            cids: cids ? cids : [],
        });
    },

    fetchColorAndShareFlag(cid){
        fluxDetail.actions.fetchColorFlag({customerId: cid ? cid : this.props.customerIds[0]}, result => {
            this.setState({colorFlag: result.colorFlag, clientStatus: result.clientStatus});
        }, error => {
            UtilTool.error('客户信息拉取失败：' + error);
        });        
    },

    componentWillReceiveProps(nextProps) {
        if(!this.props.batchFlag && (this.props.customerIds[0] != nextProps.customerIds[0])) {
            this.fetchColorAndShareFlag(nextProps.customerIds[0]);
        }
    },

    showModifyManagerForm(){
        this.setState({visibleModifyManager: true});
    },

    showSmsForm(){
        this.setState({visibleSms: true});
    },

    showShareForm(){
        this.setState({visibleShare: true});
    },

    hideModifyManagerForm(){
        this.setState({visibleModifyManager: false});
    },

    hideSmsForm(){
        this.setState({visibleSms: false});
    },

    hideShareForm(){
        this.setState({visibleShare: false});
    },

    showConfirm() {
      let self = this;

      confirm({
        title: '您是否确认要将所选客户删除?',
        onOk() {
            fluxBatch.actions.batchRemove(self.props.customerIds, (result) => {
                if(result) {
                    let successNum = self.props.customerIds.length - result.length;
                    UtilTool.success(successNum + "个客户成功删除,失败" + result.length +"个");
                } else {
                    UtilTool.success(self.props.customerIds.length + "个客户成功删除,失败0个");
                }
                fluxList.refreshTable();
            }, (error) => {
                UtilTool.error("删除失败" + error);
            });          
        },
        onCancel() {},
      });
    }, 

    handleMenuClick(e) {
        if(e.key == "m2") {
            this.showConfirm();
        } else if (e.key === 'm3') {
            this.showModifyManagerForm();
        } else if (e.key === 'm4') {
            this.showSmsForm();
        } else if (e.key === 'm5') {
            this.showShareForm();
        } else if (e.key === '0' || e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5') {
            this.handleColorFlagsMenuClick(e.key);
        }
    },

    handleColorFlagsMenuClick(e){
        var self = this;
        fluxBatch.actions.batchUpdateColor(self.props.customerIds, {colorFlagNew: e}, (result) => {
            if(result) {
                let successNum = self.props.customerIds.length - result.length;
                UtilTool.success(successNum + "个客户成功设置旗帜,失败" + result.length +"个");
            } else {
                UtilTool.success(self.props.customerIds.length + "个客户成功设置旗帜,失败0个");
            }

            this.setState({colorFlag: e});
            fluxList.refreshRowFlag(self.props.customerIds, e);
        }, (error) => {
            UtilTool.error("保存失败! " + error);
        });
    },

    onMarkShareFlagChange(checked) {
        let clientStatus = this.state.clientStatus;
        let flag = this.state.flag;
        let isLock = this.state.isLock;

        if(clientStatus != "1" && clientStatus != "2" || flag == "2" || flag == "3" || isLock == "2" || isLock == "3") {
            message.info("此客户所处的状态不允许更改待共享标记");
            return;
        } 

        fluxDetail.actions.markShared({customerId: this.props.customerIds[0], clientStatus: checked ? "2" : "1"}, result => {
            this.setState({clientStatus: checked ? "2" : "1"});
        }, error => {
            UtilTool.error('更改待共享标记失败：' + error);
        });
    },

    handleConvert2Main(e) {
        fluxBatch.actions.convert2Main({customerId: this.props.customerIds[0]}, (result) => {
            location.reload();
        }, (error) => {
            UtilTool.error("转换失败! " + error);
        });
    },

    render() {
        const hasSelected = (this.props.customerIds) && (this.props.customerIds.length > 0);

        let canBeOperated = [];
        let singleCanBeOperated = [];

        if(window.prefix == "/sm" || window.prefix == "/op" || window.prefix == "/sl") {
            canBeOperated.push(<Menu.Item key="m2" disabled={!hasSelected}>批量删除</Menu.Item>);
            canBeOperated.push(<Menu.Item key="m3" disabled={!hasSelected}>批量修改客户经理</Menu.Item>);
            if(!window.ssm) {
                canBeOperated.push(<Menu.Item key="m5" disabled={!hasSelected}>批量放入共享池</Menu.Item>);
                canBeOperated.push(<Menu.Item key="m4" disabled={!hasSelected} >批量发送短信</Menu.Item>);
                singleCanBeOperated.push(<Button type="primary" onClick={this.showSmsForm} className="gx-btn">发送短信<Icon
                            type="mobile"/></Button>);
                singleCanBeOperated.push(<Button type="primary" onClick={this.showShareForm} className="gx-btn">放入共享池<Icon
                            type="team"/></Button>);                        
            }
        } else if(window.prefix == "/am") {
            canBeOperated.push(<Menu.Item key="m5" disabled={!hasSelected}>批量标记待共享</Menu.Item>);
            singleCanBeOperated.push(<ButtonGroup className="gx-btn">
                标记待共享：<Switch checked={this.state.clientStatus == "2"} onChange={this.onMarkShareFlagChange} checkedChildren="是" unCheckedChildren="否"/>
            </ButtonGroup>)
        } else if(window.prefix == "/dr") {
            let shareText = window.clientType === 3 ? "标记待共享" : "放入共享池";
            
            canBeOperated.push(<Menu.Item key="m3" disabled={!hasSelected}>批量修改客户经理</Menu.Item>);
            canBeOperated.push(<Menu.Item key="m5" disabled={!hasSelected}>批量{shareText}</Menu.Item>);
            canBeOperated.push(<Menu.Item key="m4" disabled={!hasSelected} >批量发送短信</Menu.Item>);
            singleCanBeOperated.push(<Button type="primary" onClick={this.showSmsForm} className="gx-btn">发送短信<Icon
                        type="mobile"/></Button>);
            singleCanBeOperated.push(<Button type="primary" onClick={this.showShareForm} className="gx-btn">{shareText}<Icon
                        type="team"/></Button>);
        }
        const batchMenu = (
            <Menu onClick={this.handleMenuClick}>
                {canBeOperated}
                <Menu.SubMenu title="批量标记旗帜&nbsp;&nbsp;&nbsp;&nbsp;" className={hasSelected ? null : "subMenuColor"}>
                    <Menu.Item key="0" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-0"></b>&nbsp;&nbsp;
                        白旗</Menu.Item>
                    <Menu.Item key="1" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-1"></b>&nbsp;&nbsp;
                        红旗</Menu.Item>
                    <Menu.Item key="2" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-2"></b>&nbsp;&nbsp;
                        绿旗</Menu.Item>
                    <Menu.Item key="3" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-3"></b>&nbsp;&nbsp;
                        黄旗</Menu.Item>
                    <Menu.Item key="4" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-4"></b>&nbsp;&nbsp;
                        蓝旗</Menu.Item>
                    <Menu.Item key="5" disabled={!hasSelected}><b
                        className="ico-color-flag ico-color-flag-5"></b>&nbsp;&nbsp;
                        紫旗</Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );

        const batchArea = <DropdownButton overlay={batchMenu} type="primary">批量操作</DropdownButton>;

        let customerType = "";
        let otherCustomers = this.state.lockedCustomerInfo
            .filter(it => {
                let isSelf = it.customerId == this.props.customerIds[0];
                if(isSelf) {
                    switch(it.isLock) {
                        case 3: customerType = "（影子客户）";
                            break;
                        case 4: customerType = "（主客户）";
                            break;
                    }
                }
                // return !isSelf;
                return true;
            }).map((it, idx) => {
                let isSelf = it.customerId == this.props.customerIds[0];

                if(isSelf) {
                    return <Tag color="blue">
                        <Link to={"/detail/" + it.customerId} style={it.isLock == 4 ? {color: "red", fontSize : '0.85em'} : {color: "white", fontSize : '0.85em'}} 
                            query={{cids: this.state.cids}}>{it.clientName} </Link>
                    </Tag>;
                } else {
                    return <Link to={"/detail/" + it.customerId} style={it.isLock == 4 ? {color: "red", fontSize : '0.85em'} : {fontSize : '0.85em'}}
                                query={{cids: this.state.cids}}>{it.clientName} </Link>;                    
                }
            });

        const singleArea = (<Row>
                <Col span="24">
                    <DropdownButton type="primary" overlay={<MenuColorFlag onClick={this.handleColorFlagsMenuClick}></MenuColorFlag>} className="gx-btn">
                        <b className={"ico-color-flag ico-color-flag-" + this.state.colorFlag}></b> 设置旗帜
                    </DropdownButton>
                    {singleCanBeOperated}
                    <ButtonGroup className="gx-btn">
                    {otherCustomers} {customerType}
                    </ButtonGroup>
                </Col>
            </Row>
        );

        const btnArea = (this.props.batchFlag) ? batchArea : singleArea;

        return <div className={"btnEditContainer_batch_" + this.props.batchFlag}>
            {btnArea}
            <DialogSms customerIds={this.props.customerIds} visible={this.state.visibleSms} onHide={this.hideSmsForm}/>
            <DialogModifyManager customerIds={this.props.customerIds} visible={this.state.visibleModifyManager}
                         onHide={this.hideModifyManagerForm} batchFlag={this.props.batchFlag} doFilter={this.props.doFilter}/> 
            <DialogShare customerIds={this.props.customerIds} visible={this.state.visibleShare}
                         onHide={this.hideShareForm} batchFlag={this.props.batchFlag} doFilter={this.props.doFilter}/>
        </div>;
    }
});
export default form;
