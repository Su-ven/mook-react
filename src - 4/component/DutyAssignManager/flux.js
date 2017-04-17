import objectAssign from 'object-assign';
import reqwest from 'reqwest';
import {UtilFlux, JsonResult} from './../../libs/ui-core';

const flux = UtilFlux.createFlux({});

flux.actions = {
    refreshTable() {
        flux.execute("refresh");
    },

    /*获取对应部门的员工信息*/
    list(params = {}, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/crm-employee/complex/list-rota-emp',
            method: 'get',
            data: params,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    /*添加值班信息*/
    add(value, startDate, endDate, rotaType, successHandler, errorHandler, completeHandler) {
        var data = {dates: value, startDate: startDate, endDate: endDate, rotaType};
        reqwest({
            url: '/rota/info/add',
            method: 'post',
            data: data,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    /*按月查询值班信息*/
    dutyData(value, successHandler, errorHandler, completeHandler) {
        value['type'] = 2; // 默认53值班

        reqwest({
            url: '/rota/info/rota-list',
            method: 'get',
            data: value,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    /*按时间段查询值班信息*/
    fetch(value, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/rota/info/fetch',
            method: 'get',
            data: {value},
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    /*更新值班信息*/
    update(id, value, startDate, endDate, rotaType, successHandler, errorHandler, completeHandler) {
        var data = {id: id, dates: value, startDate: startDate, endDate: endDate, rotaType: rotaType};
        reqwest({
            url: '/rota/info/update',
            method: 'post',
            data: data,
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
    /*移除值班信息*/
    remove(id, successHandler, errorHandler, completeHandler) {
        reqwest({
            url: '/rota/info/delete',
            method: 'post',
            data: {id},
            type: 'json',
            success: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            error: (resp) => JsonResult.value(resp, successHandler, errorHandler),
            complete: completeHandler,
        });
    },
};
export default flux;