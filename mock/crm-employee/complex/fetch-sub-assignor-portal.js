module.exports = function () {
    this.set("Content-Type", "application/json");

    var value = {total : 1000 ,resultList : []};

    value.resultList = [
        {id:1, code: 1001, name:"sub1", department: 'dp1', departmentId: '2001'},
        {id:2, code: 1002, name:"sub2", department: 'dp2', departmentId: '2001'},
        {id:3, code: 1003, name:"sub3", department: 'dp3', departmentId: '2003'},
        {id:4, code: 1004, name:"sub4", department: 'dp4', departmentId: '2004'},
    ];

    var result = {success: 1, value: value.resultList};
    this.response.body = JSON.stringify(result);
}