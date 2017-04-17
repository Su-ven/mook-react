/**
 * Created by jeffwon on 16/5/19.
 */
module.exports = function() {
    this.set("Content-Type", "application/json");
    var f = Math.round(Math.random()*100) % 2;

    var result = f ? {success:1, value:[{clientName: "name1"},{clientName: "name2"}]} : {success : 0, errCode:100301, message:'保存发生异常!'};

    this.response.body = JSON.stringify(result);
}