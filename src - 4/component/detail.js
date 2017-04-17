import {
    Tabs,
    Row,
    Col,
    Switch,
    Modal,
} from 'antd';
import {Router, Route, Link, useRouterHistory} from 'react-router';
import RightSide from './extend/RightSide';
import TabBasic from './extend/TabBasic';
import TabPme from './extend/TabPme';
import TabContact from './extend/TabContact';
import TabTrack from './extend/TabTrack';
import TabSaler from './extend/TabSaler';
import TabShare from './extend/TabShare';
import BtnGroupEdit from './extend/BtnGroupEdit';
import Config from './config';
import fluxDetail from "./flux/detail";
import fluxContact from "./flux/contact";
import fluxTrack from "./flux/track";
import fluxSaler from "./flux/saler";
import fluxShare from "./flux/share";
import "./detail.less";

const TabPane = Tabs.TabPane;


export default React.createClass({

    getDefaultProps : function () {
        return {
          rightDisplay : true,
        };
    },

    getInitialState: function () {
        return {
            span_left: this.props.rightDisplay ? 16 : 24,
            span_right: this.props.rightDisplay ? 8 : 0,
            right_visible: this.props.rightDisplay ? true : false,
        }
    },

    handleTagChange (e) {
        switch(e) {
            case "1" :
                fluxDetail.execute('fetchInfo', 'tabBasic');
                break;
            case ("pme_" + Config.plats[0].code) :
                fluxDetail.execute('fetchInfo', "tabPme_" + Config.plats[0].code);
                break;
            case ("pme_" + Config.plats[1].code) :
                fluxDetail.execute('fetchInfo', "tabPme_" + Config.plats[1].code);
                break;
            case ("pme_" + Config.plats[2].code) :
                fluxDetail.execute('fetchInfo', "tabPme_" + Config.plats[2].code);
                break;
            case ("pme_" + Config.plats[3].code) :
                fluxDetail.execute('fetchInfo', "tabPme_" + Config.plats[3].code);
                break;
            case ("pme_" + Config.plats[4].code) :
                fluxDetail.execute('fetchInfo', "tabPme_" + Config.plats[4].code);
                break;
            case "5" :
                fluxContact.actions.refreshTable();
                break;
            case "6" :
                fluxTrack.actions.refreshTable();
                break;
            case "7" :
                fluxSaler.actions.refreshTable();
                break;
            case "8" :
                fluxShare.actions.refreshTable();
                break;
        }
    },

    render() {

        let cids = this.props.location.query.cids ? this.props.location.query.cids.split(",") : [];
        let customerId = this.props.params.customerId;
        let phoneCall = this.props.location.query.phoneCall ? "true" : "false";

        let currentIdIndex = cids.indexOf(customerId);
        let nextId = currentIdIndex == -1 || currentIdIndex == (cids.length - 1) ? null : cids[currentIdIndex + 1];
        let previousId = currentIdIndex <= 0 ? null : cids[currentIdIndex - 1];

        if (!customerId) {
            Modal.error({
                title: '参数丢失',
                content: '客户id参数丢失,请联系管理员~',
                onOk() {
                    window.location.href = "/";
                },
            });
            return;
        }
        const renderTabPanel = plats => plats.filter(item => item.portal == window.portal).map((item)=> {
            let _tab_title = item.name + "账户";
            let _tab_key = "pme_" + item.code;
            return (
                <TabPane tab={_tab_title} key={_tab_key}>
                    <TabPme customerId={customerId} plat={item}/>
                </TabPane>
            );
        });
        return (
            <div>
                <Row className="gx-table-toolbar">
                    <Col span="16">
                        <BtnGroupEdit customerIds={[customerId]}></BtnGroupEdit>
                    </Col>
                    <Col span="8" className="ant-row" style={{padding: '5px 0px'}}>
                        <Row type="flex" justify="end">
                            <Link to={"/detail/" + previousId} className={"ant-btn ant-btn-primary"} 
                                style={{margin: '5px 10px 5px 0px'}} disabled={previousId ? false : true} 
                                query={{cids: this.props.location.query.cids}}>上一个客户</Link>
                            <Link to={"/detail/" + nextId} className={"ant-btn ant-btn-primary"} 
                                style={{margin: '5px 10px 5px 0px'}} disabled={nextId ? false : true} 
                                query={{cids: this.props.location.query.cids}}>下一个客户</Link>                            
                        </Row>
                     </Col>
                </Row>
                <Row>
                    <Col span={this.state.span_left}>
                        <Tabs defaultActiveKey="1" tabPosition="left" onChange={this.handleTagChange}>
                            <TabPane tab="线索摘要" key="1">
                                <TabBasic customerId={customerId} cids={this.props.location.query.cids} phoneCall={phoneCall}/>
                            </TabPane>
                            {renderTabPanel(Config.plats)}
                            <TabPane tab="回访记录" key="5">
                                <TabContact customerId={customerId}/>
                            </TabPane>
                            <TabPane tab="更新记录" key="6">
                                <TabTrack customerId={customerId}/>
                            </TabPane>
                            <TabPane tab="负责人变动" key="7">
                                <TabSaler customerId={customerId}/>
                            </TabPane>
                            <TabPane tab="共享记录" key="8">
                                <TabShare customerId={customerId}/>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={this.state.span_right} visible={this.state.right_visible}>
                        <RightSide customerId={customerId}/>
                    </Col>
                </Row>
            </div>
        );
    }
});