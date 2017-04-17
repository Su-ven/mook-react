module.exports = function () {
    this.set("Content-Type", "application/json");

    var value = [
        {id: "1001", name:"sub1"},
        {id: "1002", name:"sub2"},
        {id: "1003", name:"sub3"},
        {id: 1004, name:"sub4"},
    ];

    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}