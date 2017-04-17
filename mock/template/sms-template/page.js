module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            title: "姓名" + i + this.request.query.customerId,
            description: "1",
            message: "内容" + i,
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}