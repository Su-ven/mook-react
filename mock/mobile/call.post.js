module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = "ok";
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}