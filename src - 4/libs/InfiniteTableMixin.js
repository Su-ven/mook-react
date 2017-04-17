import {Table, message, Row, Button, Icon, Select, Input} from "antd";
import objectAssign from "object-assign";

const Option = Select.Option;

module.exports = function (flux, name) {
    return {
        componentDidMount: function () {
            flux.register(this, name);
            let loadOnInit;
            if (!!this.loadOnInit) {
                loadOnInit = this.loadOnInit();
            } else if (this.props.loadOnInit != undefined) {
                loadOnInit = this.props.loadOnInit;
            }
            if (loadOnInit == undefined || !!loadOnInit) {
                const filter = this.getFilter ? this.getFilter() : null;
                this.refresh(filter);
            }
        },

        componentWillUnmount: function () {
            flux.unregister(name);
        },

        getInitialState() {
            return {
                data: [],
                pagination: {
                    pageSize:20,
                    current:1,
                    showSizeChanger: this.props.showSizeChanger == undefined ? true : !!this.props.showSizeChanger,
                    showTotal: (total)=>"共" + total + "条记录"
                },
                search: {},
                filters: {},
                sorter: {field: null, order: null},
                loading: false,
                selectedRowKeys: [],
                jumpPage: 1,
            };
        },

        handleTableChange(pagination, filters, sorter) {
            this.state.pagination = objectAssign({}, pagination);
            this.state.filters = filters
            this.state.sorter = sorter;
            this.list(pagination, filters, sorter, this.state.search);
        },

        getParams(pagination, filters, sorter, likes) {
            const params = {
                pageSize: pagination ? pagination.pageSize : "",
                currentPage: pagination ? pagination.current : "",
                sortField: sorter.field,
                sortOrder: sorter.order
            };
            for (let key in filters) {
                if (filters.hasOwnProperty(key) && filters[key] != undefined) {
                    params[key + "()"] = encodeURIComponent(filters[key].join(","));
                }
            }
            if (likes) {
                for (let key in likes) {
                    if (likes.hasOwnProperty(key)) {
                        params[key] = encodeURIComponent(likes[key]);
                    }
                }
            }
            return params;
        },

        filterHandler(params) {
            if (!!!params) {
                params = {};
            }
            //this.state.search = params;
            let pagination = this.state.pagination;
            pagination.current = 1;
            this.setState({"pagination": pagination, "search": params, "jumpPage": 1});
            this.list(this.state.pagination, this.state.filters, this.state.sorter, params);
        },

        refresh(params) {
            this.list(this.state.pagination, this.state.filters, this.state.sorter, params);
        },

        clear() {
            const pagination = this.state.pagination;
            pagination.total = 0;
            this.setState({
                loading: false,
                data: [],
                pagination,
                selectedRowKeys: []
            });
        },

        list(pagination, filters, sorter, likes) {
            const params = this.getParams(pagination, filters, sorter, likes);
            this.setState({loading: true});
            flux.actions.list(params, (result) => {
                this.setState({
                    loading: false,
                    data: result.resultList,
                    selectedRowKeys: []
                });
            }, (error) => {
                this.setState({loading: false});
                message.error("获取数据错误：" + error);
            });
        },

        handlePagesizeChange(e){
            this.setState({pagination: objectAssign(this.state.pagination, {pageSize: e})})
            this.filterHandler(this.state.params);
        },

        handleNextClick(){
            let pagination = this.state.pagination;

            let current = parseInt(pagination.current);
            if(isNaN(current)) {
                pagination.current = 1;
            } else {
                pagination.current += 1;
            }
            this.setState({pagination: pagination, jumpPage: pagination.current});
            this.refresh(this.state.params);
        },

        handlePrevClick(){  
            let pagination = this.state.pagination;

            let current = parseInt(pagination.current);
            if(isNaN(current)) {
                pagination.current = 1;
            } else if(current <= 1) {
                return;
            } else {
                pagination.current -= 1;
            }            
            this.setState({pagination: pagination, jumpPage: pagination.current});
            this.refresh(this.state.params);
        },

        handleJump(e){
            this.setState({jumpPage: e.target.value});
        },

        handleJumpPress(e){
            let current = parseInt(e.target.value);
            if(!/^([1-9]+)([0-9]*)$/.test(current) || current > 200000) current = 1;

            this.setState({pagination: objectAssign(this.state.pagination, {current: current}), jumpPage: current});

            this.refresh(this.state.params);
        },

        handleJumpBlur(){
            this.setState({jumpPage: this.state.pagination.current});
        },

        render() {
            const rowKey = this.getRowKey ? this.getRowKey : (record, index) => !record.id ? index : record.id;
            const columns = this.getColumns();
            const filterPanel = this.getFilterPanel ? this.getFilterPanel() : "";
            const rowSelection = this.getRowSelection ? this.getRowSelection() : null;
            const expandedRowRender = this.getExpandedRowRender ? this.getExpandedRowRender() : null;
            const size = this.getSize ? this.getSize() : "default";
            const scroll = this.getScroll ? this.getScroll() : "{ x: true }";
            const border = this.getBorder ? this.getBorder() : true;
            const onRowClick = this.onRowClick ? this.onRowClick : (e)=> {
                return false;
            };
            const getRowClassName = this.getRowClassName ? this.getRowClassName : undefined;
            const tabs = this.getTabs ? this.getTabs() : "";
            const footer = this.getListFooter ? this.getListFooter() : null;

            const pagination = <ul className="ant-pagination ant-table-pagination">
                        <li className={"ant-pagination-prev " + 
                            (this.state.pagination.current == 1 ? "ant-pagination-disabled" : "")} 
                            onClick={this.handlePrevClick}>
                            <a></a>
                        </li>
                        <li className="ant-pagination-next" onClick={this.handleNextClick}>
                            <a></a>
                        </li>
                        <Select defaultValue={this.state.pagination.pageSize + ""} onChange={this.handlePagesizeChange} value={this.state.pagination.pageSize + ""}
                            className="ant-pagination-options">
                          <Option value="10">10 条/页</Option>
                          <Option value="20">20 条/页</Option>
                          <Option value="30">30 条/页</Option>
                          <Option value="40">40 条/页</Option>
                          <Option value="100">100 条/页</Option>
                          <Option value="200">200 条/页</Option>
                        </Select> 
                        <li style={{marginLeft: 15, display: "inline-block"}}>
                            跳至&nbsp; <Input value={this.state.jumpPage} 
                                onPressEnter={this.handleJumpPress} 
                                onChange={this.handleJump}
                                onBlur={this.handleJumpBlur}
                                style={{width: 40}}/> &nbsp;页 
                        </li>
                    </ul>;

            return ( <div>
                    {tabs}
                    {filterPanel}
                    <Row>
                        {pagination}
                    </Row>
                    <Row>
                        <Table ref="table" columns={ columns } rowKey={rowKey} expandedRowRender={expandedRowRender}
                           dataSource={ this.state.data } rowSelection={rowSelection} size={size}
                           pagination={false} loading={ this.state.loading }
                           scroll={scroll} bordered={border} onRowClick={onRowClick} rowClassName={getRowClassName}
                           onChange={ this.handleTableChange}
                           footer={()=>footer}/>
                    </Row>                           
                    <Row>
                        {pagination}
                    </Row>
                </div>
            );
        },

    }
};
