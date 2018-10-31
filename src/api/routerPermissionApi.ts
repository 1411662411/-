
import * as _ from 'lodash';
import {DOMAIN_OXT} from "../global/global";
import { fetchFn } from '../util/fetch';
import { message } from 'antd';


const GET_MENUS_API = `${DOMAIN_OXT}/apiv2_/permission/v1/resources/getResourcesByUserId`; //type 0、1菜单链接 2按钮 3、9详情链接 
const GET_PERMISSION_API = `${DOMAIN_OXT}/apiv2_/permission/v1/resources/findUserResourcesSimple`;
const GET_MESSAGE_COUNT_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/message/count`;



export const getRouterPermission = (data) => {
    return fetchFn(GET_PERMISSION_API, data).then(data => data);
}
export const getRouterMenus = (data) => {
    return fetchFn(GET_MENUS_API, data).then(data => data);
}
export const getMessageCount = () => {
    return fetchFn(GET_MESSAGE_COUNT_API, {status:0}).then(data => data);
}