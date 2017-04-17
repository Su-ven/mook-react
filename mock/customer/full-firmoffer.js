module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    var _now = new Date().toLocaleTimeString();
    for (var i = 0; i < l; i++) {
        var item = {
            id: "id" + i,
            colorFlag: i,
            clientName: "实盘姓名" + i + "##" + _now,
            regInfoSrc: "来源" + i,
            registerSource: "来源" + i,
            assignedManager: "负责人" + i,
            mobile: "1380013800" + i,
            metalSpAccount: "贵金属帐号" + i,
            qiluSpAccount: "齐鲁帐号" + i,
            lastRevisitContent: "回访内容" + i,
            saleStage: "进程" + i,
            birthplace: "区域" + i,
            lastOutgoingTime: "联系时间" + i,
            updateTime: "变更时间" + i,
            isWaitShared: "共享" + i,
            plannedRevisitTime: "计划时间" + i,
            tag: "tag"
        };
        var l2 = Math.round(Math.random() * 100) % 3;
        switch (l2) {
            case 0:
                item["tag"] = "多金,大款,tag" + i;
                break;
            case 1:
                item["tag"] = "tag" + i;
                break;
            case 2:
                item["tag"] = "外国人,懂汉语,在美国,tag" + i;
                break;
        }
        var l3 = Math.round(Math.random() * 100) % 6;
        switch (l3) {
            case 0:
                item["managerTelephoneDefault"] = "123456";
                break;
            case 1:
                item["managerTelephoneDefault"] = "234567";
                break;
            case 2:
                item["managerTelephoneDefault"] = "345678";
                break;
            default:
                item["managerTelephoneDefault"] = "";
        }
        value.resultList.push(item);
    }

    var result = {success: 1, value};
    this.response.body = JSON.stringify(result);
}