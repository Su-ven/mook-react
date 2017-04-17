module.exports = function () {
    this.set("Content-Type", "application/json");

    var value = [
        {employeeId: 1001, telephoneOne:"0001", telephoneTwo:"0002", telephoneThree: "0003", telephoneFour: "0004"},
        {employeeId: 1002, telephoneOne:"0011", telephoneTwo:"0002", telephoneThree: "0003", telephoneFour: "0004"},
        {employeeId: 1003, telephoneOne:"0021", telephoneTwo:"0002", telephoneThree: "0003", telephoneFour: "0004"},
    ];

    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}