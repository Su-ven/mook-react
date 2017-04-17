module.exports = function () {
    this.set("Content-Type", "application/json");
    var result = {
        success: 1
    };
    this.response.body = JSON.stringify(result);
}