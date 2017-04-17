module.exports = function() {
	this.set("Content-Type", "application/json");

	var data={
	 id:23,
		rotaType:'2',
	 beginTime:"2016-11-22 10:22:00",
	 endTime:"2016-12-29 22:22:00",
	 children:[{id:1111, key : 11, name: '部门A', children:[{key:"0",name:"test1"},{key:1,name:"test2"}]},
               {id:2222, key : 22, name: '部门B', children:[{key:"2",name:"test1"},{key:3,name:"test2"}]}
	]
}
	var result = {success:1, value:data};
	this.response.body = JSON.stringify(result);
}