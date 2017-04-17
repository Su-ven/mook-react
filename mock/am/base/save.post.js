module.exports = function () {
    this.set("Content-Type", "application/json");
    var resultList = [
        {success: 1},
        {success: 0, errCode: 10163, message: '要修改的手机号码存在客户,且客户正处于在分配客户经理中或者客户已经被冻结'},
        {success: 0, errCode: 10159, message: '该手机号码已经被使用,如果选择继续,则将会将这些客户冻结!!', value: ['customerId-A']},
    ];
    var result = resultList[Math.round(Math.random() * 100) % resultList.length];
    this.response.body = JSON.stringify(result);
}