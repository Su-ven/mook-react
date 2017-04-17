module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = {view_0: "视图0", view_1:"视图1"}
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
