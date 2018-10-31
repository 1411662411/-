export const LOADING = 'CRM_WORKBENCH_CONFIG_LOADING';
export const WORKBENCH_CONFIG_SET_PROCLAMATION = 'WORKBENCH_CONFIG_SET_PROCLAMATION';
export const WORKBENCH_CONFIG_GET_PROCLAMATION = 'WORKBENCH_CONFIG_GET_PROCLAMATION';
export const WORKBENCH_CONFIG_GET_ALL = 'WORKBENCH_CONFIG_GET_ALL';
export const WORKBENCH_CONFIG_GET_ANNOUNCEMENT = 'WORKBENCH_CONFIG_GET_ANNOUNCEMENT';
export const WORKBENCH_CONFIG_SET_ANNOUNCEMENT = 'WORKBENCH_CONFIG_SET_ANNOUNCEMENT';
export const WORKBENCH_CONFIG_SET_ANNOUNCEMENT_EDIT = 'WORKBENCH_CONFIG_SET_ANNOUNCEMENT_EDIT';
export const WORKBENCH_CONFIG_UPDATE_ANNOUNCEMENT_API = 'WORKBENCH_CONFIG_UPDATE_ANNOUNCEMENT_API';
export const WORKBENCH_CONFIG_GET_WELCOME_CONTENT = 'WORKBENCH_CONFIG_GET_WELCOME_CONTENT';
export const WORKBENCH_CONFIG_SET_WELCOME_CONTENT = 'WORKBENCH_CONFIG_SET_WELCOME_CONTENT';
export const WORKBENCH_CONFIG_UPDATE_WELCOME_CONTENT = 'WORKBENCH_CONFIG_UPDATE_WELCOME_CONTENT';
export const WORKBENCH_CONFIG_GET_CONFIG_LIST = 'WORKBENCH_CONFIG_GET_CONFIG_LIST'; //获取工作台配置列表
export const WORKBENCH_CONFIG_SET_CONFIG_LIST = 'WORKBENCH_CONFIG_SET_CONFIG_LIST'; //设置本地工作台配置列表
export const WORKBENCH_CONFIG_SET_POSITION_LIST = 'WORKBENCH_CONFIG_SET_POSITION_LIST'; //设置本地所有职位列表
export const WORKBENCH_CONFIG_SET_POSITION_LOADING = 'WORKBENCH_CONFIG_SET_POSITION_LOADING'; //设置职位列表loading
export const WORKBENCH_CONFIG_GET_ICON_LIST_ACTION = 'WORKBENCH_CONFIG_GET_ICON_LIST_ACTION'; //获取图标库
export const WORKBENCH_CONFIG_SET_ICON_LIST_ACTION = 'WORKBENCH_CONFIG_SET_ICON_LIST_ACTION'; //获取图标库

export function loading(params){  //是否加载中
    return {
        type: LOADING,
        params,
    }
}



export function getProclamation(params={}) {  //获取公告列表
    return {
        type: WORKBENCH_CONFIG_GET_PROCLAMATION,
        params:{
            associateType:3,
            type:1,
            ...params,
        },
    }
}

export function getConfigList(params={}) {  //获取配置列表
    return {
        type: WORKBENCH_CONFIG_GET_CONFIG_LIST,
        params,
    }
}
export function setConfigList(params) {  //设置本地获取公告列表
    return {
        type: WORKBENCH_CONFIG_SET_CONFIG_LIST,
        params,
    }
}
export function setConfigLoading(params={}) {  //设置本地获取公告列表
    return {
        type: WORKBENCH_CONFIG_SET_POSITION_LOADING,
        params,
    }
}

export function setProclamation(params) {  //设置本地公告列表
    return {
        type: WORKBENCH_CONFIG_SET_PROCLAMATION,
        params,
    }
}
export function getAllList(params={}){  //当页所有请求
    return {
        type: WORKBENCH_CONFIG_GET_ALL,
        params:{
            proclamation:{associateType:3, type:1, start:0, length:10},
            config:{tableType:2, type:1, start:0, length:50},
            welCome:{}
        },
    }
}

export function getAnnouncement(params){  //获取公告详情
    return {
        type: WORKBENCH_CONFIG_GET_ANNOUNCEMENT,
        params,
    }
}
export function setAnnouncement(params){  
    return {
        type: WORKBENCH_CONFIG_SET_ANNOUNCEMENT,
        params,
    }
}
export function setAnnouncementEdit(params){
    return {
        type: WORKBENCH_CONFIG_SET_ANNOUNCEMENT_EDIT,
        params,
    }
}
export function updateAnnouncement(params){
    return {
        type: WORKBENCH_CONFIG_UPDATE_ANNOUNCEMENT_API,
        params,
    }
}
export function getWelcomeContent(params){
    return {
        type: WORKBENCH_CONFIG_GET_WELCOME_CONTENT,
        params,
    }
}
export function setWelcomeContent(params){
    return {
        type: WORKBENCH_CONFIG_SET_WELCOME_CONTENT,
        params,
    }
}
export function setPositionList(params){
    return {
        type: WORKBENCH_CONFIG_SET_POSITION_LIST,
        params,
    }
}
export function updateWelcomeContent(params){ //更新欢迎区
    return {
        type: WORKBENCH_CONFIG_UPDATE_WELCOME_CONTENT,
        params,
    }
}
export function getIconsList(params){ //更新欢迎区
    return {
        type: WORKBENCH_CONFIG_GET_ICON_LIST_ACTION,
        params,
    }
}
export function setIconsList(params){ //更新欢迎区
    return {
        type: WORKBENCH_CONFIG_SET_ICON_LIST_ACTION,
        params,
    }
}
