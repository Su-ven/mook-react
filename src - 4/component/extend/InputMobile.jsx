import {
    Row,
    Col,
    Form,
    Input,
    Icon,
    Button,
    Popover,
    InputNumber,
    message,
} from 'antd';
import {FormMixin} from './../../libs/ui-extend';
import BtnMobile from './BtnMobile';
const createForm = Form.create;
const FormItem = Form.Item;

let resetTimeout = null;

let UserForm = React.createClass({
    mixins: [FormMixin()],
    componentWillReceiveProps: function (nextProps) {
        const form = this.getForm();
        if (this.props.extend.id && form) {
            const {getFieldValue} = form;

            var val = getFieldValue(this.props.extend.id);
            this.setState({"text": val});
        }
    },
    getInputType: function () {
        var extend = this.getExtend();
        let inputType = (this.props.type) ? this.props.type : ((extend["type"]) ? extend["type"] : "text");
        return inputType;
    },
    getInitialState: function () {
        const extend = this.getExtend();
        const value = (this.props.value) ? this.props.value : ((extend["value"]) ? extend["value"] : "");
        return {
            "textDisplay": "block",
            "inputDisplay": "none",
            "text": value,
            "textInit": value,
            "visible": false,
        }
    },
    handleClick(e){
        const editable = this.getEditable();
        if (!editable) {
            return;
        }
        var self = this;
        this.setState({"textInit": this.state.text, "textDisplay": "none", "inputDisplay": "block",}, function () {
            var input_real = this.refs.theInput.refs.input;

            input_real.onfocus = function () {
                self.setState({"visible": true}, function () {
                    const {setFieldsValue} = self.getForm();
                    let obj={};
                    obj[self.props.extend.id] = this.props.clearText ? "" : self.state.text;
                    setFieldsValue(obj);
                });
            }
            input_real.focus();
        });
    },
    hasError(){
        const form = this.getForm();
        const {getFieldError} = form;

        if (form && getFieldError(this.props.extend.id)) {
            message.error(getFieldError(this.props.extend.id));
            return true;
        }
        return false;
    },
    isQualifiedNumber(num){
        // 为兼容已使用该组件的number模式,但未设置number校验规则的
        if(this.getInputType() == "number") {
            return /^([1-9])([0-9]*)(.[0-9]+)?$/.test(num)
        }
        return true;
    },
    handleBtnClick(e){
        const {getFieldValue, validateFields} = this.getForm();  
        var val = getFieldValue(this.props.extend.id);

        if(!this.isQualifiedNumber(val)) {
            message.error("请填写数字");
            return;
        }
        
        validateFields();
        if (this.hasError()) {
            return;
        }
        if (resetTimeout > 0) {
            clearTimeout(resetTimeout);
        }
        this.handleSave(val);
    },
    handleBlur(e){
        let {validateFields} = this.getForm();

        // 重置input的值
        if (resetTimeout > 0) {
            clearTimeout(resetTimeout);
        }
        let self = this;
        resetTimeout = setTimeout(function () {
            let oldValue = self.state.textInit ? self.state.textInit : "";
            self.setState({"text": oldValue});
        }, 500);

        this.setState({"textDisplay": "block", "inputDisplay": "none", "visible": false});
    },
    handleSave(val){
        let okCallback = this.getCallback();
        if (typeof(okCallback) == "function" && val != this.state.textInit) {
            okCallback(this.props.extend.id, val);
        }
        this.setState({"text": val});
    },
    handleVisibleChange(visible) {
        this.setState({visible: true});
    },
    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.outer).onmouseleave = function () {
            //console.log("leave");
        }
        ReactDOM.findDOMNode(this.refs.outer).onmouseout = function () {
            //console.log("out");
        }
        ReactDOM.findDOMNode(this.refs.outer).onmouseenter = function () {
            //console.log("enter");
        }
    },
    render() {
        const extend = this.getExtend();
        const label = (this.props.label) ? this.props.label : ((extend["label"]) ? extend["label"] : "默认标签:");
        let hasFeedback = (this.props.hasFeedback) ? this.props.hasFeedback : ((extend["hasFeedback"]) ? extend["hasFeedback"] : false);
        hasFeedback = (hasFeedback == "true" || hasFeedback == true) ? true : false;
        const labelCol = (this.props.labelCol) ? this.props.labelCol : ((extend["labelCol"]) ? extend["labelCol"] : {span: 10});
        const wrapperCol = (this.props.wrapperCol) ? this.props.wrapperCol : ((extend["wrapperCol"]) ? extend["wrapperCol"] : {span: 12});
        let inputType = this.getInputType() == "number" ? "text" : this.getInputType();

        let inputObj = (<Input {...extend} ref="theInput" type={inputType} placeholder="" autoComplete="off"
                                          onBlur={this.handleBlur}
                                          style={{"display":this.state.inputDisplay}}/>);

        let btnObj = <div><Button className="su-input-ok" onClick={this.handleBtnClick}>OK</Button></div>;
        let popObj = (<Popover placement="right" title="" content={btnObj} trigger="click" visible={this.state.visible}
                     overlayClassName="su-input-pop"
                     onVisibleChange={this.handleVisibleChange} ref="pop">
                <Button ref="fake" className="su-input-okok" style={{display: this.state.inputDisplay}}></Button>
            </Popover>);
        return <FormItem label={label} hasFeedback={hasFeedback} labelCol={labelCol} wrapperCol={wrapperCol}
                         ref="outer">
            <Row style={{"display":this.state.textDisplay}}>
                <Col span={23}>
                    <div onClick={this.handleClick} className={this.getTextClass()} >{this.state.text}
                    </div>
                </Col>
                {this.state.text ? <Col span={1}>
                    <BtnMobile to={this.state.text} fromList={this.props.teleList} 
                        cid={this.props.cid} hideText={true} type={this.props.extend.id}></BtnMobile>
                </Col> : null}
            </Row>
            {inputObj}{popObj}
        </FormItem>;
    }
})
UserForm = createForm()(UserForm);
export default UserForm;