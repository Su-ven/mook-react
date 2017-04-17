import {message} from "antd";
import $ from "./../../../../../../guoxin-cloud-ui-component/src/plugins/jquery/jquery-1.12.4.min";

var CommentBox = React.createClass({
    loadCommentsFromServer: function () {
        let guid = window.location.search.replace("?","").replace(/-/g,"").substr(-32);

        $.ajax({
            url: 'http://external.91guoxin.com/api/get-qilu-question?customerId=' + guid,
            dataType: 'jsonp',
            cache: false,
            success: function (data) {
                if(data.success == "0") {
                    message.error(data.message);
                } else {
                    this.setState({
                        uname: data.uname,
                        mobile: data.mobile,
                        uidno: data.uidno,
                        qutime: data.qutime,
                        ip: data.ip,
                        result1: data.result1,
                        allfraction: data.allfraction,
                        list: data.list,
                        objective:data.objective,
                        experience:data.experience,
                    });                    
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function () {
        return {
            uname: '',
            mobile: '',
            uidno: '',
            qutime: '',
            ip: '',
            result1: '',
            allfraction: '',
            list: [],
            objective:[],
            experience:[],
        };
    },

    componentDidMount: function () {
        this.loadCommentsFromServer();
    },

    render: function () {
        return (
                <div className="container bs-docs-container">

                    <div className="bs-example" data-example-id="hoverable-table">
                        <table className="table table-hover" id={this.state.status}>
                            <thead>
                                <tr>
                                    <th>齐鲁实盘开户问卷详情</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">姓名：{this.state.uname}</th>
                                </tr>
                                <tr>
                                    <th scope="row">手机号：{this.state.mobile}</th>
                                </tr>
                                <tr>
                                    <th scope="row">身份证：{this.state.uidno}</th>
                                </tr>
                                <tr>
                                    <th scope="row">提交答题时间：{this.state.qutime}</th>
                                </tr>
                                <tr>
                                    <th scope="row">提交答题的ip地址：{this.state.ip}</th>
                                </tr>
                                <tr>
                                    <th scope="row">答题结果：（{this.state.result1}，总分：{this.state.allfraction}）</th>
                                </tr>
                                {this.state.list.map(function (l) {
                                    return (

                                            <tr>
                                                <th scope="row">
                                                    <div>{l.title}</div>
                                                    <div>{l.answer}</div>
                                                </th>
                                            </tr>

                                    )
                                })}
                                <tr>
                                    <th scope="row">投资经验：</th>
                                </tr>
                                {this.state.experience.map(function (ex) {
                                    return (

                                            <tr>
                                                <th scope="row">
                                                    <div className="ex">{ex.excontent}</div>
                                                </th>
                                            </tr>

                                    )
                                })}
                                <tr>
                                    <th scope="row">投资目的：</th>
                                </tr>
                                {this.state.objective.map(function (ob) {
                                    return (

                                            <tr>
                                                <th scope="row">
                                                    <div className="ex">{ob.obcontent}</div>
                                                </th>
                                            </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
        );
    }
});

ReactDOM.render(<CommentBox />, document.getElementById('content'))
