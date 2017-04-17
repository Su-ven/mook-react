import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});

flux.actions = {
    fetchTag(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/tag/default',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    fetchManagerTelephoneList(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: 'crm-employee/complex/fetch-telephone-info',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    fetchViewList(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/view/' + (window.ssm ? 'list-shared' : 'list'),
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    saveRevisitTime(customerId, params = {}, successHandler, errorHandler, completeHandler) {
        params.customerId = customerId;
        reqwest({
            url: window.prefix + '/customer/update-planned-revisit-time',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    deleteTag(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: window.prefix + '/tag/del-tag',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
};

flux.refreshTable = function () {
    this.execute('refresh', 'listView');
};

flux.refreshRowFlag = function (customerIds, flag) {
    this.execute('refreshRowColorFlagBatch', 'listView', customerIds, flag);
};

export default flux;
