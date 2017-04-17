module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            metalEmployeeName: "132456" + i,
            startTime: "2016-01-01 10:10:10",
            endTime: "2016-01-01 10:10:10",
            operator: "operator" + i,
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}