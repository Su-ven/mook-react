module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = {
        accountNumber: "155987654321333333",
        customerName: '付小义' + this.request.query.customerId + this.request.query.plat,
        signBank: "农业银行",
        signCard: "6228480371594211414",
        emailAddress: "123@456.com",
        nativePlace: "中国",
        remark: "备注",
        entityId: "0",
        attach: [
            {name: '123.zip', url: 'http://www.baidu.com/xxx.zip', id:"efsdfssdfsd"},
            // {name: '456.png', url: 'http://www.baidu.com/xxx.png'},
        ],
        resetType: "2",
    };
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}