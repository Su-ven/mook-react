import {Row, Col, Card, Button, Form, Input, TimePicker, Select, message} from "antd";
import flux from "./flux";
const Option = Select.Option;

import "./index.less";

const createForm = Form.create;
const FormItem = Form.Item;

let index = React.createClass({

	getInitialState: function() {
		return {

		};
	},

	componentDidMount: function() {
		this.fetch();
	},

	fetch(){
		let {setFieldsValue, getFieldValue} = this.props.form;

		flux.actions.getCacheConfig(null, (result) => {
			result.holidays = result.holidays ? result.holidays.split(",") : undefined;
			result.weekdays = result.weekdays ? result.weekdays.split(",") : undefined;
			result.unAssignDays = result.unAssignDays ? result.unAssignDays.split(",") : undefined;
			setFieldsValue(result);
        }, (error) => {
            message.error(error);
        });		
	},

	handleReset(e) {
	    e.preventDefault();
	    this.props.form.resetFields();
	},

	handleSubmit(e) {
	    e.preventDefault();
	    this.props.form.validateFieldsAndScroll((errors, values) => {
		    if (!!errors) {
		        message.error("请修改错误后再提交");
		        return;
		    }

		    values.holidays = values.holidays ? values.holidays.join(",") : "";
		    values.weekdays = values.weekdays ? values.weekdays.join(",") : "";
		    values.unAssignDays = values.unAssignDays ? values.unAssignDays.join(",") : "";

	      	flux.actions.update(values, (result) => {
				message.success("修改成功");
	        }, (error) => {
	            message.error(error);
	        });
	    });
	},

	checkTime(rule, value, callback) {
	    if (!value) {
	      	callback(rule.message);
	    } else {
	    	callback();
	    }
	},	

	checkDaysString(rule, value, callback) {
	    if (value.length > 0) {
	      	callback();
	    } else {
	    	callback(rule.message);
	    }
	},

	checkSeconds(rule, value, callback) {
		let pattern = /^\d{1,6}$/;

	    if (!pattern.test(value)) {
	      	callback("请填写正确的秒数");
	    } else {
	    	callback();
	    }		
	},

	render: function() {
		const { getFieldProps, getFieldValue } = this.props.form;

	    const weekdayStartTime = getFieldProps('weekdayStartTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "工作日开始时间不能为空"},
	      ],
	    });
	    const weekdayEndTime = getFieldProps('weekdayEndTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "工作日结束时间不能为空"},
	      ],
	    });
	    const weekdayPauseTime = getFieldProps('weekdayPauseTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "工作日暂停时间不能为空"},
	      ],
	    });
	    const weekdayResumeTime = getFieldProps('weekdayResumeTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "工作日恢复时间不能为空"},
	      ],
	    });
	    const weekendStartTime = getFieldProps('weekendStartTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "周末开始时间不能为空"},
	      ],
	    });
	    const weekendEndTime = getFieldProps('weekendEndTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "周末结束时间不能为空"},
	      ],
	    });
	    const holidays = getFieldProps('holidays', {
	      rules: [
	        // { validator: this.checkDaysString, message: "工作日转休息日不能为空"},
	      ],
	    });
	    const weekdays = getFieldProps('weekdays', {
	      rules: [
	        // { validator: this.checkDaysString, message: "休息日转工作日不能为空"},
	      ],
	    });
	    const unAssignDays = getFieldProps('unAssignDays', {
	      rules: [
	        // { validator: this.checkDaysString, message: "休息日转工作日不能为空"},
	      ],
	    });
	    const dayRecoveryInterval = getFieldProps('dayRecoveryInterval', {
	      rules: [
	        { validator: this.checkSeconds},
	      ],
	    });
	    const nightRecoveryTime = getFieldProps('nightRecoveryTime', {
	      getValueFromEvent: (time, timeString) => timeString ,
	      rules: [
	        { validator: this.checkTime, message: "值班第二天回收时刻不能为空"},
	      ],
	    });
	    const newCustomerDelay = getFieldProps('newCustomerDelay', {
	      rules: [
	        { validator: this.checkSeconds},
	      ],
	    });
	    const notifyTimeout = getFieldProps('notifyTimeout', {
	      rules: [
	        { validator: this.checkSeconds},
	      ],
	    });
	    const startGreeting = getFieldProps('startGreeting', {
	      
	    });
	    const stopGreeting = getFieldProps('stopGreeting', {
	     
	    });
	    const pauseGreeting = getFieldProps('pauseGreeting', {
	      
	    });
	    const resumeGreeting = getFieldProps('resumeGreeting', {
	     
	    });
	    const companyFlag = getFieldProps('companyFlag', {
	    	initialValue: ''
	    });

	    const formItemLayout = {
	      labelCol: { span: 9 },
	      wrapperCol: { span: 12 },
	    };

	    let daysOptions = ["1","2","3","4","5","6","7","8","9","10",
	    	"11","12","13","14","15","16","17","18","19","20",
	    	"21","22","23","24","25","26","27","28","29","30","31"].map(day => 
		  	<Option value={day}>{day}号</Option>
	    );

		return (
			<div>
				<Form horizontal form={this.props.form}>
	                <Row className="gx-table-toolbar">
	                    <Col span="24">
	                        <h2>业务参数配置</h2>
	                    </Col>
	                </Row>	
                	<Row type="flex" justify="end" className="gx-table-toolbar">
            			<Button type="primary" onClick={this.handleSubmit}>确定</Button>
		          			&nbsp;&nbsp;&nbsp;
		          		<Button type="ghost" onClick={this.handleReset}>重置</Button>
		          	</Row>
					<Card title="分配器">
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="工作日开始时间"
						          hasFeedback required>
						          <TimePicker {...weekdayStartTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="工作日结束时间"
						          hasFeedback required>
						          <TimePicker {...weekdayEndTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="工作日暂停时间"
						          hasFeedback required>
						          <TimePicker {...weekdayPauseTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="工作日恢复时间"
						          hasFeedback required>
						          <TimePicker {...weekdayResumeTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="周末开始时间"
						          hasFeedback required>
						          <TimePicker {...weekendStartTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="周末结束时间"
						          hasFeedback required>
						          <TimePicker {...weekendEndTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="当月的工作日转休息日"
						           >
						          <Select {...holidays} multiple placeholder="请选择日期">
						          	{daysOptions}
						          </Select>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="当月的休息日转工作日"
						           >
						          <Select {...weekdays} multiple placeholder="请选择日期">
						          	{daysOptions}
						          </Select>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="当月停分日期"
						           >
						          <Select {...unAssignDays} multiple placeholder="请选择日期">
						          	{daysOptions}
						          </Select>
						        </FormItem>									
							</Col>						
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="允许分配的公司"
						          required
						          >
								    <Select {...companyFlag} style={{ width: 120 }}>
								      <Option value="">无</Option>
								      <Option value="ALL">全部</Option>
								      <Option value="GX">北京公司</Option>
								      <Option value="GXS">深圳公司</Option>
								    </Select>
						        </FormItem>									
							</Col>
						</Row>						
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="白天回收时隔"
						          hasFeedback required>
						          <Input {...dayRecoveryInterval} placeholder="请填写白天回收的时间间隔" addonAfter={<div>秒&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>}/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="值班第二天回收时刻"
						          hasFeedback required>
						          <TimePicker {...nightRecoveryTime} placeholder="请选择时间"/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="新用户延时分配时间"
						          hasFeedback required>
						          <Input {...newCustomerDelay} placeholder="请填写新用户延时分配时间" addonAfter={<div>秒&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>}/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="通知超时时间"
						          hasFeedback required>
						          <Input {...notifyTimeout} placeholder="请填写通知超时时间" addonAfter={<div>秒&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>}/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="分配器开始的招呼内容"
						          >
						          <Input {...startGreeting} placeholder="请填写分配器开始的招呼内容" type="textarea"/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="分配器结束的打招呼内容"
						          >
						          <Input {...stopGreeting} placeholder="请填写分配器结束的打招呼内容" type="textarea"/>
						        </FormItem>									
							</Col>
						</Row>
						<Row>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="分配器暂停的打招呼内容"
						          >
						          <Input {...pauseGreeting} placeholder="请填写分配器暂停的打招呼内容" type="textarea"/>
						        </FormItem>									
							</Col>
							<Col span={12}>
						        <FormItem
						          {...formItemLayout}
						          label="分配器恢复的打招呼内容"
						          >
						          <Input {...resumeGreeting} placeholder="请填写分配器恢复的打招呼内容" type="textarea"/>
						        </FormItem>									
							</Col>
						</Row>
					</Card> 
				</Form>          			
			</div>
		);
	}

});

index = createForm()(index);

module.exports = index;