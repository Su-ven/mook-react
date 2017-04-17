/**
 * 
 * @authors Suven
 * @date    2017-04-12 10:20:39
 */


import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import {Router, Route, Link, browserHistory} from 'react-router';
import {
	Form,
	Menu,
	Icon,
	Tabs,
	message,
	Input,
	Button,
	CheckBox,
	Modal,
	Card,
	notification 
} from 'antd';
const FormItem = Form.Item;

class CommonComments extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			comments: "" 
		};
	}

	componentDidMount() {
		var myFetchOptions = {
			method: 'GET'
		}

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey=" + this.props.uniquekey, myFetchOptions)
		.then(response => response.json())
		.then(json => {
			this.setState({comments: json});
		});
	}

	handleSubmit(e){
		e.preventDefault();
		var myFetchOptions = {
			method: 'GET'
		}

		var formdata = this.props.form.getFieldsValue();

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=comment&userid=" + localStorage.userid + "&uniquekey=" + this.props.uniquekey + "&commnet=" + formdata.remark, myFetchOptions)
		.then(response => response.json())
		.then(json => {
			this.componentDidMount();
		});
	}

	render(){
		let {getFieldDecorator} = this.props.form;
		const {comments} = this.state;
		const commentList = comments.length
		?
			comments.map((comment, index) => (
				<Card key={index} title={comment.UserName} extra={<a href="#"> 发布于{comment.datetime} </a>}>
					<p>{comment.Comments}</p>
				</Card>
			))
		:
			"还没有任何评论";

		return(
			<div className="comment">
				<Row>
					<Col span={24}>
						{commentList}
						<Form onSubmit={this.handleSubmit.bind(this)}>
							<FormItem label="你的评论">
								{getFieldDecorator('remark')(<Input type="textarea" placeholder="随便写" />)}
							</FormItem>
							<Button type="primary" htmlType="submit">提交评论</Button>
						</Form>
					</Col>
				</Row>
			</div>
		)
	}
}

CommonComments = Form.create({})(CommonComments);

export default CommonComments;