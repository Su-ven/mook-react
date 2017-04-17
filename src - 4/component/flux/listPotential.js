import objectAssign from 'object-assign';
import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});
flux.actions = {
    refreshTable() {
        flux.execute("refresh");
    },

    refreshTableRow(rowId, colorFlag) {
        flux.execute("refreshRow", flux.name, rowId, colorFlag);
    },

    rowSelectionChanged(selectedIds) {
        flux.execute("rowSelectionChanged", null, selectedIds);
    },

    list(params = {}, successHandler, errorHandler, completeHandler) {
        if(window.prefix == "/sl") {
            params["view"] = "view7"; // 分配中客户
        }

        params["clientType"] = 1; // 潜在客户
        if(params.plannedRevisitTime) { // 放在内部会被 getParams() 里的 encodeComponent()转意
            params.plannedRevisitTime = params.plannedRevisitTime + " 00:00:00";
        }

        let pagePath = window.ssm ? 'shared-full' : 'full';
        reqwest({
            url: window.prefix + '/base/' + pagePath,
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
