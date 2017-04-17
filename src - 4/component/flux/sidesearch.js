import reqwest from 'reqwest';
import {UtilFlux,JsonResult} from './../../libs/ui-core';
const flux = UtilFlux.createFlux({});
flux.actions = {
    fetchManagers(params, successHandler, errorHandler, completeHandler) {
        // 销管或者营运直接出现所有角色，不必通过名下客户经理判断 SideSearch.js 里面
        reqwest({
            url: 'crm-employee/complex/fetch-sub-id-name',
            method: 'get',
            type: 'json',
            data: params,
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },

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
        reqwest({
            url: window.prefix + '/base/full-all',
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
