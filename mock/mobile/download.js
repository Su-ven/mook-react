var fs = require("fs");

module.exports = function () {
    this.set("Content-Disposition", "attachment");
    this.set("filename", "download.wav");
    this.response.body = fs.readFileSync("./mock/customer/mobile/record.wav");
}