module.exports = function () {
    this.set("Content-Type", "application/json");
    var value = {total: 1000, resultList: []};
    var l = Math.round(Math.random() * 10);
    var _now = new Date().toLocaleTimeString();
    for (var i = 0; i < l; i++) {
        var item = {
            customerId: "id" + i,
            colorFlag: i,
            clientType: 3,
            clientName: "潜在姓名" + i,
            inUsingClientName: "常用姓名" + i,
            assignedManagerId: "11" + i,
            regInfoSrc: "来源I" + i,
            registerSource: "来源S" + i,
            assignedManagerName: "负责人" + i,
            mobile: "1380013800" + i,
            metalSpAccount: "贵金属帐号" + i,
            qiluSpAccount: "齐鲁帐号" + i,
            ydylSpAccount: "一带一路账号" + i,
            qilu159SpAccount: "齐鲁159帐号" + i,
            lastRevisitContent: "回访内容" + i,
            saleStage: i%4 + 1,
            mobileArea: "手机归属地" + i,
            lastOutgoingTime: "16:34:0" + i,
            updateTime: "15:33:0" + i,
            clientStatus: i%6 + 1,
            plannedRevisitTime: "12:40:0" + i,
            tag: "tag",
            inUsingMobile: "1509767371" + i,
            inUsingMobileArea: "归属地" + i,
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