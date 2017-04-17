import reqwest from "reqwest";
import {UtilFlux, JsonResult} from "./../../libs/ui-core";
const flux = UtilFlux.createFlux({});
flux.actions = {

    markShared(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url:  window.prefix + '/base/markShared',
            method: 'post',
            type: 'json',
            data: params,
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    fetchColorFlag(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: 'crm/base/fetchBtnGroupInfo',
            method: 'get',
            type: 'json',
            data: params,
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    fetchManagers(params, successHandler, errorHandler, completeHandler) {
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

    fetchEditable(params, successHandler, errorHandler, completeHandler) {
        let table = (params["platformId"]) ? params["platformId"] : params["table"];
        reqwest({
            url: window.prefix + '/base/editable/' + table,
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    fetchContactRecord(params, successHandler, errorHandler, completeHandler){
        params["pageSize"] = 3;
        params["currentPage"] = 1;
        reqwest({
            url: '/tell-billed/tellbilled/fetchContactMessage',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    fetchTrackRecord(params, successHandler, errorHandler, completeHandler){
        params["pageSize"] = 3;
        params["currentPage"] = 1;
        reqwest({
            url: '/trends/trends/page',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    fetchMobileRelated(params, successHandler, errorHandler, completeHandler){
        reqwest({
            url: window.prefix + '/base/relatedTelephone',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    saveField(customerId, params = {}, successHandler, errorHandler, completeHandler) {
        params.customerId = customerId;
        reqwest({
            url: window.prefix + '/base/save',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    saveColorFlag(customerId, params = {}, successHandler, errorHandler, completeHandler) {
        params.customerIds = customerId;
        reqwest({
            url: window.prefix + '/batch/color-flag',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    freezeCustomers(params, successHandler, errorHandler, completeHandler){
        reqwest({
            url: window.prefix + '/customer/freeze',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    // add  by zsq start

    save(customerId, params = {}, successHandler, errorHandler, completeHandler) {
        params.customerId = customerId;
        reqwest({
            url: window.prefix + '/tag/save',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    savePlatform(customerId, platformId, params = {}, successHandler, errorHandler, completeHandler) {
        params.customerId = customerId;
        params.platformId = platformId;
        reqwest({
            url: window.prefix + '/platforms/save',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    saveRatio(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/crm-account-hand-fee/save-ratio',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    // add  by zsq end


    fetchBasic(params, successHandler, errorHandler, completeHandler){
        reqwest({
            url: window.prefix + '/base/' + (window.ssm ? 'query-customer-shared-info' : 'query-customer-info'),
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    fetchPme(params, successHandler, errorHandler, completeHandler){
        //let table = params["table"];
        reqwest({
            url: window.prefix + '/platforms/info',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    fetchTagRelated(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/tag/getTag',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
};

flux.refreshCardTrack = function() {
    flux.execute("fetchInfo", "cardTrack");
};

flux.refreshBasicInfo = function(basicInfo, cids) {
    flux.execute("fetchBasicInfo", "btnGroup", basicInfo, cids);
};

export default flux;
