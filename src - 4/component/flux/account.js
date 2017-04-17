import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});
flux.actions = {
    fileDelete(params = {}, successHandler, errorHandler, completeHandler){
        reqwest({
            url: '/fileuploader/del',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendSetup(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/open/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendActive(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/active/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendBigcontract(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/big-contract/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendClose(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/close/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendUnFreeze(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/thaw/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendReset(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/reset-pw/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendChangeSign(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-operation/form/force-change/add',
            method: 'post',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    sendBinding(params, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/customer-platform/re-sync/bind-account',
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
