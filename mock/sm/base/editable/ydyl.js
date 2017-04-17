module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = [
        "spAccountStatus",
        "simulateAccount",
        "spAccount",
        "spAccountOpenStatus",
        "spActiveStatus",
        "spActiveTime",
        //"funding",
        "handfeeRatio",
        //"developer",
        "isCompliance",
    ];
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
