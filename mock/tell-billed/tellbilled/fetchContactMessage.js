module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            name: "姓名" + i + this.request.query.customerId,
            contactType: "1",
            messageContent: "内容" + i,
            createTime: "2015-01-01 10:10:10",
            linkStartTime: "2016-12-05 10:10:10",
            messageType: '1',
            filePath: 'http://192.168.200.25/REC_D/20170109/ch045/C103011.wav',
            employeeName: "tesName",
            lenTalk: 34,
        };
        value.resultList.push(item);
    }
    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}