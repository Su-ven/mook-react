module.exports = function () {
    this.set("Content-Type", "application/json");
    var f = Math.round(Math.random() * 100) % 2;
    var result = f ? {success: 1, value: "915097673814"} : {"errCode":10166,"message":"该手机号码的手机归属地为空，轻填写！","success":0};
    this.response.body = JSON.stringify(result);
}