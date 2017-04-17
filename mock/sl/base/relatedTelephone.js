module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = {};
    data["data"] = ["123456", "234567", "345678", "987654"];
    data["ok"] = "123456";
    data["mobile"] = "13800000000";
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
