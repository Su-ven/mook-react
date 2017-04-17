module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = {};
    data["tag"] = "多金1,有戏2," + this.request.query.customerId;
    data["defaultTags"] = "多金,有戏,美女,大款";
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
