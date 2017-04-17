import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});
flux.actions = {
    refreshTable() {
        flux.execute("refresh");
    },

    list(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: 'crm/base/list-crm-shared-his',
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
