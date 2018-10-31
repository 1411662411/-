import * as Immutable from 'immutable';

import {
    ROUTER_PERMISSION_DATA_RECEIVED,
} from '../action/routerPermissionAction';
import { routerNavJson } from '../routerNavJson';
import * as _ from 'lodash';




const initialState = Immutable.fromJS({
    permission: {
        permissionReady: false,
        routerJson: {},
        navJson: {},
        userInfo: {} as Any.UserInfo,
        leftNavJson:{},
    },
    messageCount: false,
});


/**
 * 创建带有权限的json
 * @param data {Object} 数据
 * @param permission {Object} 对比的权限
 * @returns {Immutable} 
 */
const getPermissionJson = (data, permission) => {

    /**
     * 开发环境开放权限
     */
    if(__DEV__ ) {
        return Immutable.fromJS(data);
    }

    if(! permission) {
        throw new Error('权限数据不存在');
    }
    

    let obj = {};
    for(let key in data) {
        const tempObj:any = data[key];
        const code = tempObj.code;

        // /**
        //  * 这里区别3个环境的id
        //  */
        // if(__ALPHA__ ) {
        //     id = tempObj['ids'] && tempObj['ids'][0];
        // }
        // if(__BETA__) {
        //     id = tempObj['ids'] && tempObj['ids'][1];
        // }
        // if(__PRODUCT__) {
        //     id = tempObj['ids'] && tempObj['ids'][2];
        // }

        /**
         * 如果权限存在对于的id，就加入权限的obj
         */
        if(Object.prototype.hasOwnProperty.call(permission, code) || code === -1) {
            obj[key] = data[key];
        }
    }
    return Immutable.fromJS(obj);
}



export const routerPermission = (state = initialState, action) => {
    switch (action.type) {
        case ROUTER_PERMISSION_DATA_RECEIVED:
            const { params } = action;
            const {data, messageCount} = params;
            if(! data || ! data.data ) {
                return state;
            }
            // debugger;
            // console.log(params)
            const {
                permission,
                // userInfo,
            } = params.old.data;
            const {userInfo, userRole} = data.data;
            /*let nnn:any[] = [];
            let parents:any[] = [];
            for(let item in routerNavJson){
                if(routerNavJson[item].code == -1 && routerNavJson[item].children){
                    parents.push(routerNavJson[item])
                }else if(){

                }
            }
		    console.log('22222', JSON.stringify(nnn));*/
            const permissionJson = getPermissionJson(routerNavJson, permission);
            // console.log('permission',permission,'userInfo',userInfo,'newData',data.data)
            const leftNavJson = Immutable.fromJS(userRole);

            // *重写userInfo
            const newUserInfo = {
                employeeNumber: userInfo.employee_number,
                name: userInfo.name,
                organizationId: userInfo.organization_id,
                positionId: userInfo.position_id,
                // positionString: userInfo.employee_number,
                userId: userInfo.id,
                userName: userInfo.user_name,
            }
            // console.log('set router', leftNavJson)
            return state.updateIn(['permission', 'routerJson'], () => {
                return permissionJson;
            }).updateIn(['permission', 'navJson'], () => {
                return permissionJson;
            }).updateIn(['permission', 'userInfo'], () => {
                return newUserInfo;
            }).updateIn(['permission', 'permissionReady'], () => {
                return true;
            }).updateIn(['permission', 'leftNavJson'], () => {
                return leftNavJson;
            }).update('messageCount', () => {
                return messageCount.data > 0 ? true : false;
            });
        default:
            return state;
    }
}