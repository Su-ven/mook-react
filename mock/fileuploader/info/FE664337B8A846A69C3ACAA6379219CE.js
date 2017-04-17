module.exports = function () {
    this.set("Content-Type", "application/json");
    var result = {
        success: 1,
        value: {
            "createTime": "2016-08-04 13:42:37",
            "fileExt": "zip",
            "filePath": "crm-operation-protal/20160804/",
            "fileSize": 1024,
            "id": "FE664337B8A846A69C3ACAA6379219CE",
            "newFileName": "FE664337B8A846A69C3ACAA6379219CE.zip",
            "oldFileName": "文件名称.zip",
            "serviceName": "crm-operation-protal"
        }
    };
    this.response.body = JSON.stringify(result);
}