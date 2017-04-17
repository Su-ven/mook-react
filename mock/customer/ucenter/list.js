module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            field: "email" + i,
            name: "姓名" + i + this.request.query.customerId,
            time: "2016-01-01 10:10:10",
            message: "email:fdas" + i + "到afdsa" + (i + 1),
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}