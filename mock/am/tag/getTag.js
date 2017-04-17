module.exports = function () {
    this.set("Content-Type", "application/json");
    var f = Math.round(Math.random()*100) % 2;

    var data = {};
    data["tag"] = f ? "多金1,有戏2," + this.request.query.customerId : "";
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
