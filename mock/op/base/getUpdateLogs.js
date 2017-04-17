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
            //group: i + "组",
            name: "姓名" + i + this.request.query.customerId,
            time: "2016-01-01 10:10:10",
            /*
             content: [
             {
             field: "字段1" + i,
             before: _now,
             after: "后来内容1" + i,
             },
             {
             field: "字段2" + i,
             before: "原内容2" + i,
             after: "后来内容2" + i,
             },
             {
             field: "字段3" + i,
             before: "原内容3" + i,
             after: "后来内容3" + i,
             },
             ]
             */
            content: i+"刘主管派小强说,内容不用组合了,要传递一个整体的了~我就那么的哈哈哈~~",
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}