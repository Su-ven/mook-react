module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = ["", "有戏", "暴躁", "女性", "同行", "好客户"];
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
