module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    var pageSize = parseInt(this.request.query.pageSize);
    if (pageSize > 0) {
        l = pageSize;
    }
    var _now = new Date().toLocaleString();
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            operatorName: "姓名" + i + this.request.query.customerId,
            createTime: "2016-02-01 10:10:10",
            contents: i+"刘主管派小强说15097673714,内容不用组330621199003258958合了,要传递一个整体的了~我就那么的哈哈哈~~",
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}