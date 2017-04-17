var fs = require("fs");

module.exports = function() {
    this.set("Content-Disposition","attachment");
    this.set("filename","\"download.xls\"");
    this.response.body = fs.readFileSync("./mock/sample/test.xls");
}