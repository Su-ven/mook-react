import reqwest from 'reqwest';
import objectAssign from 'object-assign';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});
flux.actions = {
    fetchManagers(params, successHandler, errorHandler, completeHandler) {
        // 销管或者营运访问所有客户经理接口
        reqwest({
            url: 'crm-employee/complex/'+ (window.prefix == "/sm" || window.prefix == "/op" || window.prefix == "/ot" || window.prefix == "/sl" ? 
                'fetch-all-crm-operation-portal' : 'fetch-sub-id-name'),
            method: 'get',
            type: 'json',
            data: params,
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    batchRemove(ids, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/batch/'+ (window.ssm ? 'del-shared' : 'del'),
            method: 'post',
            data: {customerIds: ids.join(",")},
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    batchUpdateColor(ids, values, successHandler, errorHandler, completeHandler) {
        var data = values;
        data.customerIds = ids.join(",");
        reqwest({
            url: window.prefix + '/batch/color-flag',
            method: 'post',
            data: data,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    batchShare(ids, values, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/batch/shared-customer',
            method: 'post',
            data: objectAssign({customerIds: ids.join(","), clientType: window.clientType}, values),
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    singleShare(id, values, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/batch/shared-customer',
            method: 'post',
            data: objectAssign({customerIds: id, clientType: window.clientType}, values),
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    convert2Main(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/base/shadow-convert-to-main',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    batchModifyManagers(params, successHandler, errorHandler, completeHandler) {
        params['clientType'] = window.location.href.indexOf("potential") > -1 ? 1 : 3;

        reqwest({
            url: window.prefix + '/batch/' + (window.ssm ? 'save-shared-account-managers' : 'save-account-managers') ,
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    assignSharedCustomers(params, successHandler, errorHandler, completeHandler) {
        params['clientType'] = window.location.href.indexOf("potential") > -1 ? 1 : 3;

        reqwest({
            url: window.prefix + '/batch/assign-shared-customers',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    batchSms(params, method, successHandler, errorHandler, completeHandler) {
        params['clientType'] = window.location.href.indexOf("potential") > -1 ? 1 : 3;
        //TODO:销管组长筛选出分配中的客户
        if(window.prefix == '/sl') {
            params['view'] = 'view7';
        }
        if(params.plannedRevisitTime) { // 放在内部会被 getParams() 里的 encodeComponent()转意
            params.plannedRevisitTime = params.plannedRevisitTime + " 00:00:00";
        }
        
        reqwest({
            url: window.prefix + '/sms/' + method,
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
};
export default flux;
