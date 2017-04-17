module.exports = function () {
    this.set("Content-Type", "application/json");
    var result = {
        success: 1,
        value: "FE664337B8A846A69C3ACAA6379219CE",
    };
    console.log(this.request.files)
    this.response.body = JSON.stringify(result);
}
