module.exports = function (req, res) {
    this.set("Content-Type", "application/json");

    var data2 = {success: 1, value: {colorFlag: 1, clientStatus: 1}};
    this.response.body = JSON.stringify(data2);
}