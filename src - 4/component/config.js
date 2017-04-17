let config = {};

config.ynSpNumLocal = function(rule, value, callback) {
    let length = this.len;

    let pattern = new RegExp("^\\d{"+ length +"}$")
    if(pattern.test(value)) {
        callback();
    } else {
        callback("实盘账号长度为"+ length +"位数字");
    }
};

config.verify = {
    idCard: {
        pattern18: /(\d{6})\d{8}(\d{3}[0-9xX])/g,
        template18: "$1********$2",
        pattern15: /(\d{6})\d{6}(\d{3})/g,
        template15: "$1******$2",
    },
    mobile: {
        pattern: /(1{1}\d{2})\d{4}(\d{4})/g,
        template: "$1****$2",
    }
};

config.plats = [
    {"code": "tjpme", "name": "津贵所", "pre": "155", "len": "15", idCode: "1", portal: "crm-portal"},
    {"code": "qilu", "name": "齐鲁119", "pre": "119", "len": "15", idCode: "3", portal: "crm-portal"},
    {"code": "qilu159", "name": "齐鲁159", "pre": "159", "len": "15", idCode: "5", portal: "crm-portal"},
    {"code": "ydyl", "name": "一带一路", "pre": "105", "len": "15", idCode: "7", portal: "crm-portal"},
    {"code": "td", "name": "上海TD", "pre": "000", "len": "10", idCode: "11", portal: "td-crm-portal"},
];

config.banks = [
	{"value": "农业银行", "text": "农业银行"},
	{"value": "交通银行", "text": "交通银行"},
	{"value": "光大银行", "text": "光大银行"},
	{"value": "工商银行", "text": "工商银行"},
	{"value": "中信银行", "text": "中信银行"},
	{"value": "建设银行", "text": "建设银行"},
	{"value": "华夏银行", "text": "华夏银行"},
	{"value": "招商银行", "text": "招商银行"},
	{"value": "浦发银行", "text": "浦发银行"},
];

config.accountStatus = [
 	{"value": "1", "text": "未开户"}, 
	{"value": "C", "text": "已开户"}, 
	{"value": "U", "text": "已签约"},
	{"value": "N", "text": "正常"},
	{"value": "F", "text": "已冻结"},
    {"value": "D", "text": "已销户"},
	{"value": "O", "text": "非正常状态"},
];

config.clientType = [
    {'value': '1', 'text': '潜在客户'},
    {'value': '2', 'text': '未激活客户'},
    {'value': '3', 'text': '实盘客户'},
]

config.gender = [
    {'value': '0', 'text': '保密'}, 
	{'value': '1', 'text': '男'}, 
	{'value': '2', 'text': '女'}
]

config.certType = [
    {'value': '1', 'text': '身份证'},
    {'value': '2', 'text': '军官证'},
    {'value': '3', 'text': '其它'}
];

config.lastOutgoingStatus = [
    {'value': '1', 'text': '正常'},
    {'value': '2', 'text': '接通未通话'},
    {'value': '3', 'text': '未接通'}
];

config.saleStage = [
    {'value': '1', 'text': '取得联系'},
    {'value': '2', 'text': '确认意向'},
    {'value': '3', 'text': '开户办理'},
    {'value': '4', 'text': '无意向'},
    {'value': '5', 'text': '未接通'},
];

config.clientGrade = [
    {'value': '1', 'text': '一星'},
    {'value': '2', 'text': '二星'},
    {'value': '3', 'text': '三星'},
    {'value': '4', 'text': '四星'},
    {'value': '5', 'text': '五星'}
];

config.riskNoticeType = [
    {'value': '1', 'text': '电话与短信'},
    {'value': '2', 'text': '电话'},
    {'value': '3', 'text': '短信'},
    {'value': '4', 'text': '不通知'}
];

config.riskNoticeStatus = [
    {'value': '1', 'text': '已通知'},
    {'value': '2', 'text': '未通知'},
];

config.legalRevisitStatus = [
    {'value': '1', 'text': '成功'},
    {'value': '2', 'text': '无人接听'},
    {'value': '3', 'text': '占线'},
    {'value': '4', 'text': '关机'},
    {'value': '5', 'text': '停机'},
    {'value': '6', 'text': '无法接通'},
    {'value': '7', 'text': '线路故障'},
    {'value': '8', 'text': '非本人'},
    {'value': '9', 'text': '解约或者销户'},
    {'value': '10', 'text': '客户经理自行通知', disabled: true},
    {'value': '11', 'text': '挂断'},
    {'value': '12', 'text': '空号'},
    {'value': '13', 'text': '客户经理协助联系', disabled: true},
    {'value': '14', 'text': '非本人成功', disabled: true},
    {'value': '15', 'text': '一带一路激活后回访成功'},
];

config.education = [
    {'value': '1', 'text': '小学'},
    {'value': '2', 'text': '初中'},
    {'value': '3', 'text': '高中'},
    {'value': '4', 'text': '中专'},
    {'value': '5', 'text': '高职'},
    {'value': '6', 'text': '专科'},
    {'value': '7', 'text': '本科'},
    {'value': '8', 'text': '硕士'},
    {'value': '9', 'text': '博士'},
];

config.mobileIsValidated = [
    {'value': '0', 'text': '未验证'},
    {'value': '1', 'text': '已验证'},
    {'value': '2', 'text': '失效'},
];

config.flag = [
    {'value': '1', 'text': '在用'},
    {'value': '2', 'text': '黑洞'},
    {'value': '3', 'text': '锁定状态'},
];

config.isLock = [
    {'value': '1', 'text': '正常'},
    {'value': '2', 'text': '冻结'},
    {'value': '3', 'text': '影子客户'},
    {'value': '4', 'text': '主客户'},
];

config.clientStatus = [
    {'value': '1', 'text': '正常'},
    {'value': '2', 'text': '待共享'},
    {'value': '3', 'text': '共享'},
    {'value': '4', 'text': '待分配'},
    {'value': '5', 'text': '分配中'},
    {'value': '6', 'text': '待回访'},
    {'value': '7', 'text': '市场活动'},
];

export default config;