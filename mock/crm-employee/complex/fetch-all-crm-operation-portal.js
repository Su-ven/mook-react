module.exports = function () {
    this.set("Content-Type", "application/json");

    var value = [
        {employeeId: 1001, employeeName:"all1"},
        {employeeId: 1002, employeeName:"all2"},
        {employeeId: 1003, employeeName:"all3"},
        {employeeId: 1004, employeeName:"all4"},
    ];

    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}