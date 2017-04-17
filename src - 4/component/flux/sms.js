import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';

const flux = UtilFlux.createFlux({});

flux.actions = {

    list(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/template/sms-template/page',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

};

export default flux;
