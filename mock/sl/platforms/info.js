module.exports = function (req, res) {
    this.set("Content-Type", "application/json");
    var _random = Math.round(Math.random() * 100);
    var _random_2 = Math.round(Math.random() * 1000);
    var data = {
            "spAccountStatus": "",
            "simulateAccount": "1111111111",
            "spAccount": "1222222222222",
            // "spAccountOpenStatus": (_random % 2 == 0) ? "1" : "0",
            // "spActiveStatus": (_random_2 % 2 == 0) ? "1" : "0",
            "spActiveTime": "2016-02-03",
            "spBank": "工商银行",
            "funding": "200000",
            "handfeeRatio": "0.1",
            "developer": "义叔2###" + this.request.query.customerId + "###" + this.request.query.platformId,
            "isCompliance": "fdsafdsafdasf",
        };
    var data2 = {success: 1, value: data};
    this.response.body = JSON.stringify(data2);
}