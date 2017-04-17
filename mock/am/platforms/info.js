module.exports = function (req, res) {
    this.set("Content-Type", "application/json");
    var _random = Math.round(Math.random() * 100);
    var _random_2 = Math.round(Math.random() * 1000);

    var data = null;
    if(this.request.query.customerId == "id0") {
     data = {
            "spAccount": "155112222233333",
            "spAccountStatus": "U",
            "signedBank": "光大银行",
            "presentEstate": "当前权益",
            "openAccountTime": "2015-12-12 14:12:22",
            "spActiveTime": "2016-02-03",
            updateTime: "2015-12-10 14:12:23",
            "handfeeRatio": "0.1",
            legalRevisitTime: "2015-12-10",
            legalRevisitStatus: "10",
            "simulateAccount": "1111111111",
            simulateParticipateTime: "2016-02-03",
            "developer": "义叔" + this.request.query.customerId,
            "funding": "200000",
            "isCompliance": "fdsafdsafdasf",
            flag: 1,
            isLock: 3,
            idNumber: "330621199003258958",
            inUsingMobile: "15097673714",
            clientName: "Magaoting",
            gender: 2,
            emailAddress: "magaoting@msn.com",
            nativePlace: "zhejiang",
            entityId: 1234,
            // attach:[{id:1, name:"name1"}]
            signedCard: 6228480371594211414,
            crmAccountHandFeeList: [
                {
                    product: "0",
                    productName: "产品1",
                    ratio: "1",
                },
                {
                    product: "1",
                    productName: "产品2",
                    ratio: "2",
                },
                {
                    product: "2",
                    productName: "产品3",
                    ratio: "3",
                },
            ],
        };
    } else {
     data = {
        };        
    }

    var data2 = {success: 1, value: data};
    this.response.body = JSON.stringify(data2);
}