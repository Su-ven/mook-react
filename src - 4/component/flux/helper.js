import {UtilFlux, JsonResult} from './../../libs/ui-core';
import $ from "./../../../../../../../../guoxin-cloud-ui-component/src/plugins/jquery/jquery-1.12.4.min";

const flux = UtilFlux.createFlux({});

flux.actions = {
    call(to, from, successHandler, errorHandler, completeHandler) {
        let params = {
            mobile: to,
            display: from,
        };
        
         $.ajax({
             type: "get",
             timeout: 3000,
             url: "http://localhost:20050/rest/call",
             dataType: "jsonp",
             data: params,
             success: function(data){
                if(data.success) {
                    successHandler(data.message);
                } else {
                    errorHandler(data.message);
                }
             },
             error: function(){
                let ret = {success: false, errCode: 999999, message: "请确认助手是否启动~"};
                JsonResult.value(ret, successHandler, errorHandler);
             }
         });
    },

    getCallMobile(params, successHandler, errorHandler, completeHandler) {
        $.ajax({
            url: '/crm/customer/get-call-mobile',
            dataType: 'json',
            type: "post",
            data: params,
            success: function (data) {
                JsonResult.value(data, successHandler, errorHandler);
            },
            error: function (data) {
                JsonResult.value(data, successHandler, errorHandler);
            }
        });
    },

};

export default flux;
