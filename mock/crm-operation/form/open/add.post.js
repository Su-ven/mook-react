module.exports = function() {
    this.set("Content-Type", "application/json");
    var f = Math.round(Math.random()*100) % 2;
    var result = f ? {success:1} : {success : 0, errCode:100301, message:'保存失败!'};
    this.response.body = JSON.stringify(result);
}