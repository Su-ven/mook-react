import {Router, Route, Link, useRouterHistory} from 'react-router';
import {Row, Col, Calendar, Button, Icon, message, Popconfirm, Modal} from 'antd';
import {createHashHistory} from 'history';
import Creator from './creator';
import flux from './flux';
import {DateTime} from '../util';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false})

const CreatorLink = React.createClass({
    render(){
        return (
            <ul className="events">
                <li>
                    <div>
                        <Link to="/creator" query={{datetime: this.props.datetime}} >
                            <Icon style={{
                                'color': '#20D620',
                                'float': 'right',
                                'padding-right': '5px',
                                'padding-top': '5px'
                            }} type="plus-circle"/>
                        </Link>
                    </div>
                </li>
            </ul>
        );
    }
});

const EmptyLink = React.createClass({
    render(){
        return (
            <ul className="events">
                <li></li>
            </ul>
        );
    }
});

const Main = React.createClass({

    getInitialState() {
        return {
            year: "",
            month: "",
            dutyValues: [],
            dayValue: "",
        };
    },

    getListData(value, temdata) {
        const cellDay = value.getDayOfMonth();
        const cellMonth = value.getMonth();
        const cellYear = value.getYear();

        const listData = [];
        for (let i = 0; i < temdata.length; i++) {
            let beginDayTime = new Date(temdata[i].beginTime);
            let endDayTime = new Date(temdata[i].endTime);

            let sday = beginDayTime.getDate();
            let eday = endDayTime.getDate();
            let smonth = beginDayTime.getMonth();
            let emonth = endDayTime.getMonth();
            let syear = beginDayTime.getFullYear();
            let eyear = endDayTime.getFullYear();

            let star = new DateTime(beginDayTime);
            let end = new DateTime(endDayTime);

            if (smonth == cellMonth && sday == cellDay && emonth == cellMonth && eday == cellDay && syear == cellYear && eyear == cellYear) { //当月当日 开始结束均只显示 时:秒
                listData.push({
                    id: temdata[i].id,
                    rotaType: temdata[i].rotaType,
                    star: star.hhmm(),
                    end: end.hhmm(),
                    startTime: temdata[i].beginTime
                });
            }
            // else if (smonth == cellMonth && sday == cellDay && syear == cellYear) { // 开始月日符合 开始时间显示 时:秒 结束时间显示 月-日 时:秒
            //     listData.push({
            //         id: temdata[i].id,
            //         rotaType: temdata[i].rotaType,
            //         star: star.hhmm(),
            //         end: end.mmddhhmm(),
            //         startTime: temdata[i].beginTime
            //     });
            // }
            // else if (emonth == cellMonth && eday == cellDay && eyear == cellYear) { // 结束月日符合 开始时间显示 月-日 时:秒 结束时间显示 时:秒
            //     listData.push({
            //         id: temdata[i].id,
            //         rotaType: temdata[i].rotaType,
            //         star: star.mmddhhmm(),
            //         end: end.hhmm(),
            //         startTime: temdata[i].beginTime
            //     });
            // }
        }
        return listData;
    },

    executeDelete(record) {
        let self = this;

        let startTime = new Date(record.startTime);
        if (startTime > new Date()) {
            flux.actions.remove(record.id, (result) => {
                    message.info("删除值班信息成功");

                    const params = {"year": startTime.getFullYear(), "month": (startTime.getMonth() + 1)};
                    this.fetchData(params);

                }, (error) => {
                    message.error("删除值班信息失败!");
                    return;
                }
            );
        } else {
            message.warn("值班已经开始，不能删除！");
            return;
        }
    },

    datetimeToDesc(data) {
        let yymmddDay = new DateTime(data.startTime).yymmdd();
        let start = new Date(yymmddDay + " " + data.star);
        let end = new Date(yymmddDay + " " + data.end);

        let standardTime = new Date(yymmddDay + " 11:00:00")

        if(standardTime > start && standardTime < end) {
            return "日间值班";
        } else {
            return "晚间值班";
        }
    },

    dateCellRender(value) {
        let self = this;

        let now = new Date();
        let year = this.state.year;
        let month = this.state.month;

        let nowYMDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let cellYMDay = new Date(value.getYear(), value.getMonth(), value.getDayOfMonth());
        let cellYMDayStr = new DateTime(cellYMDay).yymmdd();

        // 当前页 非当月的日 不显示
        if (value.getMonth() != month - 1) return;

        const temdata = this.state.dutyValues;

        if (!temdata || temdata.length == 0) { // 当页 没有数据获得时 比今天小的日不显示 比今天大的日显示新建
            if (cellYMDay.getTime() < nowYMDay.getTime()) {
                return <EmptyLink/>;
            } else {
                return <CreatorLink datetime={cellYMDayStr}/>;
            }
        } else { // 当页 有数据
            let listData = this.getListData(value, temdata);

            if (listData.length == 0) { // 这种情况可能不存在 因为 temdata 已经判断了不为空，（抄自@雪琴暂时保留）
                if (cellYMDay.getTime() < nowYMDay.getTime()) {
                    return <EmptyLink/>;
                } else {
                    return <CreatorLink datetime={cellYMDayStr}/>;
                }
            } else {
                if (cellYMDay.getTime() < nowYMDay.getTime()) {
                    return (
                        <ul className="events">
                            {
                                listData.map((item, index) =>
                                    <li key={index}>
                                        <Link to={"/edit/" + item.id}
                                              style={{'color': 'gray'}}>{self.datetimeToDesc(item)}</Link>
                                    </li>
                                )
                            }
                        </ul>
                    );
                } else {
                    return (<div>
                        <ul className="events">
                            { listData.length > 1 ? null : <CreatorLink datetime={cellYMDayStr}/> }
                            {
                                listData.map((item, index) =>
                                    <li key={index}>
                                        <Popconfirm title={"确定要删除此值班信息吗？"}
                                                    onConfirm={this.executeDelete.bind(this, item)}>
                                            <a href="#"><Icon style={{'color': 'red'}} type="cross-circle"/></a>
                                        </Popconfirm>&nbsp;&nbsp;
                                        <Link to={"/edit/" + item.id}
                                              style={{'color': 'blue'}}>{self.datetimeToDesc(item)}</Link>
                                    </li>
                                )
                            }
                        </ul>
                    </div>);
                }
            }
        }
    },

    componentWillMount(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;

        this.setState({dayValue: now, year: year, month: month});

        const value = {year: year, month: month};
        this.fetchData(value);

    },

    fetchData(params){
        flux.actions.dutyData(params, (result) => {
            this.setState({dutyValues: result});
        }, (error) => {
            message.error("查询值班信息失败：" + error);
        });
    },

    monthCellRender(value) {
        return <div>请按月查询</div>;
    },

    onPanelChange(date){
        let year = date.fields[1];
        let month = date.fields[2] + 1;

        this.setState({year: year, month: month, dayValue: new Date(year, date.fields[2], 10)});

        const value = {year: year, month: month};
        this.fetchData(value);
    },

    render() {
        return <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender}
                         onPanelChange={this.onPanelChange} value={this.state.dayValue}/>;
    }
});

export default React.createClass({
    render() {
        return <Router history={appHistory}>
            <Route path="/" component={Main} ignoreScrollBehavior/>
            <Route path="/creator" component={Creator}/>
            <Route path="/edit/:id" component={Creator}/>
        </Router>;

    }
});
