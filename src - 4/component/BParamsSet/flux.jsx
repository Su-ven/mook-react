import reqwest from "reqwest";
import {UtilFlux, JsonResult} from './../../libs/ui-core';

const flux = UtilFlux.createFlux({});

flux.actions = {

    getCacheConfig(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/assignor/config/getCacheConfig',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

    update(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/assignor/config/update',
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