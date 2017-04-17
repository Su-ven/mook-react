module.exports = function () {
    this.set("Content-Type", "application/json");

    var value = {total : 1000 ,resultList : []};

    value.resultList = [
        {id:1, code: 1001, name:"sub1", department: 'dp1', departmentId: '2001'},
        {id:2, code: 1002, name:"sub2", department: 'dp2', departmentId: '2002'},
        {id:3, code: 1003, name:"sub3", department: 'dp3', departmentId: '2003'},
        {id:4, code: 1004, name:"sub4", department: 'dp4', departmentId: '2004'},
        {id:5, code: 1005, name:"sub5", department: 'dp4', departmentId: '2004'},
        {id:6, code: 1006, name:"sub6", department: 'dp4', departmentId: '2004'},
    ];

    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}