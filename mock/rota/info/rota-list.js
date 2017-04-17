module.exports = function() {
	this.set("Content-Type", "application/json");
	var value = [];

	value.push({id:1,rotaType:'2',beginTime:"2016-11-29 20:09:29",endTime:"2016-11-29 21:23:29"});
	value.push({id:2,rotaType:'2',beginTime:"2016-12-06 20:09:29",endTime:"2016-12-07 21:23:29"});
	value.push({id:3,rotaType:'1',beginTime:"2016-12-14 10:09:29",endTime:"2016-12-14 21:23:29"});
    value.push({id:29,rotaType:'2',beginTime:"2016-12-29 20:11:29",endTime:"2016-12-29 21:21:29"});
    value.push({id:31,rotaType:'1',beginTime:"2017-01-01 20:12:29",endTime:"2017-01-02 21:22:29"});

	var result = {success:1,value};
	this.response.body = JSON.stringify(result);
}