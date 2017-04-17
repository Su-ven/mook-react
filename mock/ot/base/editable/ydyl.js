module.exports = function () {
    this.set("Content-Type", "application/json");
    var data = [
        "spAccountStatus",
        "simulateAccount",
        "spAccount",
        "spAccountOpenStatus",
        "spActiveStatus",
        "presentEstate",
        "openAccountTime",
        "updateTime",
        "legalRvisitTime",
        "legalRvisitStatus",
        "simulateParticipateTime",
        "spActiveTime",
        "signedBank",
        "funding",
        "handfeeRatio",
        "developer",
        "isCompliance",
        "developer",
        "product-0",
        "product-1",
        "ratio-",
    ];
    var result = {success: 1, value: data};
    this.response.body = JSON.stringify(result);
}
