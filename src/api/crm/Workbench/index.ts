import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

const GET_SALEKIT_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/contract/salesKit`; // 获取销售简报列表
const GET_SALES_TODO_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/deskToDoList`; // 获取今日代办本周代办数据
const GET_AUDIT_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerTransferExamine/queryListForExamineCenter`; // 获取审批中心数据
const WORKBENCH_GET_USER_DEFINED = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/getUserDefined`; // 获取工作台显示配置
const RESET_WORKBENCH_DEFINED = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/resetWorkbenchDefined`; //重置工作台默认显示
const GET_SALES_HELPER_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/getCustomerDataForSalesAssistant`; //销售助手获取数据接口
const GET_SALES_HELPER_TABLE_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/customerListForSalesAssistant`; //销售助手分别获取哥哥弹窗列表数据接口


export const getSaleKit = (data) => {
    return fetchFn(GET_SALEKIT_LIST_API, data).then(data => data);
}

export const getSalesTodoList = (data) => {
    return fetchFn(GET_SALES_TODO_LIST_API, data).then(data => data);
}

export const getAuditList = (data) => {
    return fetchFn(GET_AUDIT_LIST_API, data).then(data => data);
}

export const getUserDefined = () => {  //获取工作台显示配置
    return fetchFn(WORKBENCH_GET_USER_DEFINED, {tableType:2, type:2}).then(data => data);
}
export const resetWorkbenchDefined = () => {  //重置工作台默认显示
    return fetchFn(RESET_WORKBENCH_DEFINED, {}).then(data => data);
}
export const getSalesHelperApi = () => {  //销售助手获取数据接口
    return fetchFn(GET_SALES_HELPER_API,{}).then(data => data);
}
export const getSalesHelperTableApi = (data) => {  //销售助手分别获取哥哥弹窗列表数据接口
    return fetchFn(GET_SALES_HELPER_TABLE_API,data).then(data => data);
}
