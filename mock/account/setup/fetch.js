module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = {
        accountNumber: "155987654321333333",
        customerName: '付小义' + this.request.query.customerId + this.request.query.plat,
        gender: "1",
        idNumber: "330621199003258958",
        emailAddress: "123@456.com",
        nativePlace: "中国",
        remark: "备注",
        entityId: "0",
    };
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}