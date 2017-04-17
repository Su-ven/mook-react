module.exports = function() {
	this.set("Content-Type", "application/json");

	var data={
	 id:23,
		rotaType:'2',
	 beginTime:"2016-12-20 10:00:00",
	 endTime:"2016-12-20 09:59:00",
	 children:[{id:1111, key : 2001, name: '部门A', children:[{key:1,name:"test1"},{key:4,name:"test2"}]},
               {id:2222, key : 22, name: '部门B', children:[{key:2,name:"test1"},{key:3,name:"test2"}]}
	]
}
	var result = {success:1, value:data};
	this.response.body = JSON.stringify(result);
}