import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

const GET_BULLETINBOARD_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/announcementList`; // 获取公告栏列表 
const GET_CONFIG_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/listForWorkbench`; // 获取工作台模块显示列表 
const GET_ANNOUNCEMENT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/getAnnouncement`; // 公告详情
const UPDATE_ANNOUNCEMENT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/updateAnnouncement` //编辑公告
const ADD_ANNOUNCEMENT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/addAnnouncement` //新增公告
const GET_WELCOME_CONTENT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/getWelcomeContent` //获取欢迎区内容
const UPDATE_WELCOME_CONTENT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/update` //获取欢迎区内容
const GET_WORKBENCH_DEFINED_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/getWorkbenchDefined` //获取工作台显示配置
const GET_WORKBENCH_DEFINED_BY_ID_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/getById` //通过id获取工作台显示配置
const UPDATE_WORKBENCH_DEFINED_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/updateUserDefined` //更新工作台显示配置
const GRT_POSITION_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/list` //获取所有职位
const ADD_POSITION_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/userDefined/addUserDefined` //工作台配置新增职位
const GET_ICON_LIBRARY_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/iconLibraryList` //获取所有图标库

export const getBulletinBoard = (data) => {
    return fetchFn(GET_BULLETINBOARD_API, data).then(data => data);
}
export const getConfigList = (data) => {
    return fetchFn(GET_CONFIG_API, data).then(data => data);
}
export const getAnnouncement = (data) => {
    return fetchFn(GET_ANNOUNCEMENT_API, data).then(data => data);
}
export const updateAnnouncement = (data) => { //编辑公告
    return fetchFn(UPDATE_ANNOUNCEMENT_API, data).then(data => data);
}
export const addAnnouncement = (data) => { //新增公告
    return fetchFn(ADD_ANNOUNCEMENT_API, data).then(data => data);
}
export const getWelcomeContent = (data) => {
    return fetchFn(GET_WELCOME_CONTENT_API, data).then(data => data);
}
export const updateWelcomeContentApi = (data) => { //编辑欢迎区
    return fetchFn(UPDATE_WELCOME_CONTENT_API, {associateType:4,...data}).then(data => data);
}
export const getWorkbenchDefined = (data) => { //获取工作台显示配置
    return fetchFn(GET_WORKBENCH_DEFINED_API, data).then(data => data);
}
export const getWorkbenchDefinedById = (data) => { //通过id获取工作台显示配置
    return fetchFn(GET_WORKBENCH_DEFINED_BY_ID_API, data).then(data => data);
}
export const updateWorkbenchDefined = (data) => { //更新工作台显示配置
    return fetchFn(UPDATE_WORKBENCH_DEFINED_API, data).then(data => data);
}
export const getPositionListApi = (data) => { //获取所有职位
    return fetchFn(GRT_POSITION_LIST_API, data).then(data => data);
}
export const addPositionApi = (data) => { //添加职位
    return fetchFn(ADD_POSITION_API, data).then(data => data);
}
export const getIconLibraryListApi = (data) => { //分页获取图标库
    return fetchFn(GET_ICON_LIBRARY_LIST_API, data).then(data => data);
}