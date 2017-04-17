module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            zhibojian: "播间组合" + i + this.request.query.customerId,
            guwen: "播间主播小耗子" + i,
            time: "2016-01-01 10:10:10",
            status: '过期啦',
            lastTime: i + "月",
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}