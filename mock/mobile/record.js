var fs = require("fs");

module.exports = function() {
    this.set("Content-Type", "audio/wav");
    this.response.body = fs.readFileSync("./mock/customer/mobile/record.wav");
}