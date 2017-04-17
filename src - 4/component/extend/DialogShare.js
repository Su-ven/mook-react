const objectAssign = require("object-assign");
import {Form, Row, Col, Button, Icon, Dropdown, Modal, Input, Select, DatePicker, Radio, message} from 'antd';
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
            shareReason: "",
            canbeSend: true,
            text: window.prefix == "/am" || (window.prefix == "/dr" && window.clientType === 3 ) ? "标记待共享" : "放入共享池",
            showReasonText: window.prefix == "/am" ? true : false,
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    },

    handleCancel(e){
        this.setState({visible: false, shareReason: ""});
        if (typeof (this.props.onHide) == "function") {
            this.props.onHide();
        }
    },

    handleSend(e){
        let self = this;

        if(this.state.showReasonText && !this.state.shareReason) {
            message.error("请填写" + this.state.text + "的原因");
            return;
        }

        let reason = this.state.shareReason ? {lastSharedMemo: this.state.shareReason} : {};

        this.setState({canbeSend: false});

        if(this.props.batchFlag) {
            fluxBatch.actions.batchShare(self.props.customerIds, reason,
            (result) => {
                if(result) {
                    let successNum = self.props.customerIds.length - result.length;
                    UtilTool.success(successNum + "个客户成功" + this.state.text + ",失败" + result.length +"个");
                } else {
                    UtilTool.success(self.props.customerIds.length + "个客户成功" + this.state.text + ",失败0个");
                }
                
                this.handleCancel();
                this.props.doFilter({})
            }, (error) => {
                UtilTool.error(this.state.text + "失败" + error);
            }, ()=> {
                this.setState({canbeSend: true});
            });
        } else {
            fluxBatch.actions.singleShare(self.props.customerIds[0], reason,
            (result) => {
                if(result && result.length > 0) {
                    UtilTool.success(this.state.text + "失败");
                } else {
                    UtilTool.success(this.state.text + "成功");
                    this.handleCancel();
                    fluxList.refreshTable();                    
                }
            }, (error) => {
                UtilTool.error(this.state.text + "失败" + error);
            }, ()=> {
                this.setState({canbeSend: true});
            });
        }
    },

    handleShareReasonChanged(e){
        this.setState({shareReason: e.target.value});
    },

    render() {
        let width = parseInt(this.props.width ? this.props.width : 500);

        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        }; 

        return <Modal visible={this.state.visible} width={width} title={this.state.text}
                 onOk={this.state.canbeSend ? this.handleSend : ()=> console.log("canNotBeSend")} onCancel={this.handleCancel}>
            <FormItem>您是否确认要将所选客户{this.state.text}?</FormItem>
            {this.state.showReasonText ?
            <FormItem>
                <Input placeholder={this.state.text + "的原因"} type="textarea"
                    value={this.state.shareReason} onChange={this.handleShareReasonChanged}/>
            </FormItem> : null}
        </Modal>;
    }
});
export default createForm()(form);
