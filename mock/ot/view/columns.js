module.exports = function () {
    this.set("Content-Type", "application/json");
    var view = this.request.query.view;
    var columns = [];
    switch (view) {
        case "view_1":
            columns = [
                {title: '客户标签', dataIndex: 'tag', width: 220, render: "tag"},
                {title: '客户经理', dataIndex: 'assignedManager', sorter: true},
                {title: '信息来源', dataIndex: 'regInfoSrc', sorter: true, width: 150},
            ];
            break;
        case "view_2":
            columns = [
                {title: '贵金属实盘帐号', dataIndex: 'metalSpAccount  ', sorter: true, width: 180},
                {title: '齐鲁实盘帐号', dataIndex: 'qiluSpAccount', sorter: true},
            ];
            break;
        case "view_3":
            columns = [
                {title: '最近回访内容', dataIndex: 'lastRevisitContent', sorter: true, width: 200},
                {title: '销售进程', dataIndex: 'saleStage', sorter: true},
                {title: '来自区域', dataIndex: 'birthplace', sorter: true, width: 100},
            ];
            break;
        case "view_4":
            columns = [
                {title: '最近电话联系时间', dataIndex: 'lastOutgoingTime', sorter: true, width: 150},
                {title: '最后变更时间', dataIndex: 'updateTime', sorter: true},
            ];
            break;
        case "view_5":
            columns = [
                {title: '是否待共享客户', dataIndex: 'isWaitShared', sorter: true, width: 150},
                {title: '计划回访时间', dataIndex: 'plannedRevisitTime', sorter: true},
            ];
            break;
        default:
            columns = [
                {title: '默认自适应', dataIndex: 'default_1', sorter: true},
                {title: '默认定宽', dataIndex: 'default_2', sorter: true, width: 300},
            ];
            break;
    }
    var result = {success: 1, value: columns};
    this.response.body = JSON.stringify(result);
}