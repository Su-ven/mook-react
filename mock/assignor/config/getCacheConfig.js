module.exports = function () {

    this.set("Content-Type", "application/json");


    var data = {
            "weekdayStartTime": "14:12:12",
            "weekdayEndTime": "14:13:00",
            "weekdayPauseTime": "14:14:00",
            "weekdayResumeTime": "14:15:00",
            "weekendStartTime": "14:16:00",
            "weekendEndTime": "14:17:00",
            "unAssignDays": "1,2,3",
            "dayRecoveryInterval": "1500",
            "nightRecoveryTime": "14:18:00",
            "newCustomerDelay": "1418",
            "notifyTimeout": "1400",
            "startGreeting": "test1",
            "stopGreeting": "test2",
            "pauseGreeting": "test3",
            "resumeGreeting": "test4",
            "companyFlag": "GX",
        };

    var result = {success: 1, value: data};

    this.response.body = JSON.stringify(result);

}
