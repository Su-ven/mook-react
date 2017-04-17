import {Card} from 'antd';
import {UtilTool} from './../../libs/ui-core';
import {Tag as SuTag} from './../../libs/ui-extend';
import fluxDetail from '../flux/detail';
import fluxList from '../flux/list';

let RightSide = React.createClass({
    getInitialState: function () {
        return {
            customerId: "",
            defaultTags: [],
            tag: "",
        }
    },

    setDefaultTags() {
        // TODO:最好一次获得 defaultTags 和 tags 目前后边无这个服务
        fluxList.actions.fetchTag({"customerId": this.props.customerId}, (result) => {
            this.setState({"defaultTags": result ? result : []});
        }, (error) => {
            UtilTool.error('客户默认tag信息拉取失败' + error);
        });        
    },

    fetchInfo(){
        this.setDefaultTags();

        fluxDetail.actions.fetchTagRelated({"customerId": this.props.customerId}, (result) => {
            this.setState({"tag": result ? result.tag : ""});
        }, (error) => {
            UtilTool.error('客户tag信息拉取失败' + error);
        });
    },

    componentDidMount() {
        this.fetchInfo();
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.customerId) {
            if (this.state.customerId != nextProps.customerId) {
                this.setState({"customerId": nextProps.customerId}, function () {
                    this.fetchInfo();
                });
            }
        }
    },

    handleTagsChange(value) {
        fluxDetail.actions.save(this.props.customerId, {"tag": value.join(",")}, (result) => {
            UtilTool.success('用户标签保存数据成功~');

            this.setState({"tag": result ? result.tag : ""});
            this.setDefaultTags();
            
        }, (error) => {
            UtilTool.error('用户标签保存失败~' + error);
        });
    },

    render() {
        let extra = this.props.extra ? this.props.extra : "";
        
        return <Card title="客户标签" className="side_card" extra={extra}>
            <SuTag value={this.state.tag} options={this.state.defaultTags} width="333"
                             okCallback={this.handleTagsChange}/>
        </Card>;
    }
});
export default RightSide;
