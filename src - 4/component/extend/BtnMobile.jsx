import {Popover, Button, Icon, message} from 'antd';
import {UtilTool} from './../../libs/ui-core';
import flux from "./../flux/helper";
import "./BtnMobile.less";
var susu = React.createClass({
    getInitialState() {
        let to = (this.props.to) ? this.props.to : "";
        let fromList = (this.props.fromList) ? this.props.fromList : "";
        let cid = (this.props.cid) ? this.props.cid : "";

        return {
            customerMobile: to,
            managerTelephone: fromList,
            cid: cid,
            called: false,
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.to) {
            this.setState({customerMobile: nextProps.to});
        }
        if (nextProps.fromList) {
            this.setState({managerTelephone: nextProps.fromList});
        }
        if (nextProps.cid) {
            this.setState({cid: nextProps.cid});
        }
    },

    call: function (me) {
        let self = this;

        if(!self.state.customerMobile) {
            UtilTool.error('拨打的号码为空');
            return;
        }

        let type = this.props.type? this.props.type : "im";
        
        flux.actions.getCallMobile({customerId: this.state.cid, type: type}, (result) => {
            //UtilTool.success("正在使用【" + (me ? me : "默认座机") + "】呼叫客户【" + self.state.customerMobile + "】");

            flux.actions.call(result, me, (res) => {
                UtilTool.success(res);

                // 如果不是详情页，跳转到详情页
                if(!this.props.hideText) {
                    this.setState({called: true});
                    this.refs.blank_detail.click();
                }     
                if (self.props.okCallback && typeof (self.props.okCallback) == "function") {
                    self.props.okCallback(self.state.customerMobile);
                }
            }, (err) => {
                UtilTool.error('电话拨打失败,' + err);
            });
        }, (error) => {
            UtilTool.error('获取拨打号失败,' + error);
        });
    },

    hideFourNumber(phoneNumber){
        // if( (window.prefix == "/am" | window.prefix == "/dr") && phoneNumber)
        //     return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        // else 
            return phoneNumber;
    },

    render() {
        let list_config = this.state.managerTelephone;

        let list_object = [];
        for (let i in list_config) {
            let me = list_config[i];
            list_object.push(<Button type="ghost" onClick={this.call.bind(this, me)} style={{"margin": "2px"}}>
                <Icon type="customerservice"/>{me}
            </Button>);
        }
        let width = (this.props.width) ? this.props.width : 0;
        let overlayStyle = (width > 0) ? {"width": width} : {};
        return (<Popover content={list_object} title="选择呼出号码" trigger="hover" overlayStyle={overlayStyle}
                         overlayClassName="su-mobile-pop">
            <div>            
                <a href={window.location.href + "detail/" + this.state.cid} ref="blank_detail" style={{display: "none"}} target="_blank">test</a>
                {this.props.hideText ? <Icon type="phone" onClick={this.call.bind(this, null)}/> : <Button onClick={this.call.bind(this, null)} style={this.state.called ? {color: '#f77979'}: {}}>
                    {this.hideFourNumber(this.state.customerMobile)} 
                    <Icon type="phone"/>
                </Button>}
            </div>
        </Popover>);
    }
});
export default susu;
