'use strict';

module.exports = function () {
    this.set("Content-Type", "application/json");
    var result = {
        menus: [{
            name: '客户管理',
            icon: 'appstore',
            children: [{
                name: '我的潜在客户',
                url: '/potentialAM.html',
            }, {
                name: '我的实盘客户',
                url: '/firmofferAM.html',
            },{
                name: '组内潜在客户',
                url: '/potentialDR.html',
            }, {
                name: '组内实盘客户',
                url: '/firmofferDR.html',
            },{
                name: '潜在客户管理',
                url: '/potentialSM.html',
            }, {
                name: '实盘客户管理',
                url: '/firmofferSM.html',
            },{
                name: '潜在客户维护',
                url: '/potentialOP.html',
            }, {
                name: '实盘客户维护',
                url: '/firmofferOP.html',
            },{
                name: '潜在客户回访',
                url: '/potentialOT.html',
            }, {
                name: '实盘客户回访',
                url: '/firmofferOT.html',
            }, {
                name: '潜在共享客户管理',
                url: '/potentialSSM.html',
            }, {
                name: '实盘共享客户管理',
                url: '/firmofferSSM.html',
            },  {
                name: '潜在分配中客户管理',
                url: '/potentialSL.html',
            },  {
                name: '实盘分配中客户管理',
                url: '/firmofferSL.html',
            },]
        }, {
            name: '基础配置与管理',
            icon: 'appstore',
            children: [{
                name: '53值班管理',
                url: '/dutyform.html',
            }, {
                name: '分配值班管理',
                url: '/dutyassign.html',
            }, {
                name: '业务参数配置',
                url: '/bparams-set.html',
            },]
        }],

        userInfo: {
            name: "测试帐号",
            id:"111"
        },

        sites: [
            {icon: "solution", name: "通讯录"},
            {icon: "team", name: "员工管理"},
            // {icon: "share-alt", name: "CRM"},
        ]
    };

    let config = [
        {
            "o1":"oooo1",
            "o2":"oooo2",
        },
        {"null":""},
        {
            a1:"test",
            a2:"test2",
        },
        {
            b1:"test3",
            b2:"test4",
        },
        {
            c1:"test5",
            c2:"test6",
        },
    ];

    this.response.body = "{_init_(" + JSON.stringify(result) + ",['am','op','ot'], true," + JSON.stringify(config)  + ",'crm-portal')}";
}
