import {Input, Button, Modal, Icon} from 'antd';
import {UtilTool} from './../../libs/ui-core';
const InputGroup = Input.Group;
export default React.createClass({

    getInitialState() {
        return {
            keyword: "",
        };
    },

    handleKeywordChange(e) {
        this.setState({keyword: e.target.value.trim()});
    },

    handleKeydown(e) {
        if (e.keyCode == 13) {
            e.stopPropagation();
            this.doSearch();
        }
    },

    doSearch() {
        this.props.doFilter({"keyword": this.state.keyword ? this.state.keyword : null});
    },

    render() {
        const className = this.props.className ? this.props.className : "";
        const width = this.props.width ? this.props.width : 200;
        return (
            <InputGroup style={{"width":width,"margin":"0px 5px"}} className={className}>
                <Input placeholder='姓名/手机/身份证/实盘号' value={this.state.keyword} onKeyDown={this.handleKeydown}
                       onChange={this.handleKeywordChange}/>
                <div className="ant-input-group-wrap">
                    <Button shape="circle" onClick={this.doSearch}
                            style={{borderRadius : 0, borderLeftWidth:0}}><Icon type="search"/></Button>
                </div>
            </InputGroup>
        );
    }
});
