export const WORKBENCH_SET_PROCLAMATION = 'WORKBENCH_CONFIG_SET_PROCLAMATION';
export const WORKBENCH_GET_PROCLAMATION = 'WORKBENCH_CONFIG_GET_PROCLAMATION';
//销售简报
export const WORKBENCH_GET_SALEKIT = 'WORKBENCH_GET_SALEKIT';
export const WORKBENCH_SET_SALEKIT = 'WORKBENCH_SET_SALEKIT';
//今日代办本周代办
export const WORKBENCH_GET_TODAY_TODO_LIST = 'WORKBENCH_GET_TODAY_TODO_LIST';
export const WORKBENCH_GET_WEEK_TODO_LIST = 'WORKBENCH_GET_WEEK_TODO_LIST';
export const WORKBENCH_SET_TODAY_TODO_LIST = 'WORKBENCH_SET_TODAY_TODO_LIST';
export const WORKBENCH_SET_WEEK_TODO_LIST = 'WORKBENCH_SET_WEEK_TODO_LIST';
//审批中心
export const WORKBENCH_GET_WILL_AUDIT_LIST = 'WORKBENCH_GET_WILL_AUDIT_LIST';
export const WORKBENCH_GET_DID_AUDIT_LIST = 'WORKBENCH_GET_DID_AUDIT_LIST';
export const WORKBENCH_SET_WILL_AUDIT_LIST = 'WORKBENCH_SET_WILL_AUDIT_LIST';
export const WORKBENCH_SET_DID_AUDIT_LIST = 'WORKBENCH_SET_DID_AUDIT_LIST';

//销售简报
export function getSaleKit(params) {
    return {
        type: WORKBENCH_GET_SALEKIT,
        params,
    }
}
export function setSaleKit(params) {
    return {
        type: WORKBENCH_SET_SALEKIT,
        params,
    }
}

//今日代办本周代办
export function getSalesTodayTodoList(params) {
    return {
        type: WORKBENCH_GET_TODAY_TODO_LIST,
        params,
    }
}
export function getSalesWeekTodoList(params) {
    return {
        type: WORKBENCH_GET_WEEK_TODO_LIST,
        params,
    }
}
export function setSalesTodayTodoList(params) {
    return {
        type: WORKBENCH_SET_TODAY_TODO_LIST,
        params,
    }
}
export function setSalesWeekTodoList(params) {
    return {
        type: WORKBENCH_SET_WEEK_TODO_LIST,
        params,
    }
}

//审批中心
export function getWillAuditList(params) {
    return {
        type: WORKBENCH_GET_WILL_AUDIT_LIST,
        params,
    }
}
export function getDidAuditList(params) {
    return {
        type: WORKBENCH_GET_DID_AUDIT_LIST,
        params,
    }
}
export function setWillAuditList(params) {
    return {
        type: WORKBENCH_SET_WILL_AUDIT_LIST,
        params,
    }
}
export function setDidAuditList(params) {
    return {
        type: WORKBENCH_SET_DID_AUDIT_LIST,
        params,
    }
}

export function getProclamation(params) {
    return {
        type: WORKBENCH_GET_PROCLAMATION,
        params,
    }
}
export function setProclamation(params) {
    return {
        type: WORKBENCH_SET_PROCLAMATION,
        params,
    }
}