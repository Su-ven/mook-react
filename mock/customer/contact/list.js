module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            name: "姓名" + i + this.request.query.customerId,
            way: "方式" + i,
            content: "内容" + i,
            time: "2015-01-01 10:10:10",
        };
        var l2 = Math.round(Math.random() * 10);
        if (l2 % 2 == 0) {
            item["audio"] = "/customer/mobile/record?id=" + l2;
            item["audioSeconds"] = 12 * l2;
        }
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}