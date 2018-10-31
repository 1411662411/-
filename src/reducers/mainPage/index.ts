
import {
    INDEX_SIDE_TYPE,
    INDEX_DATA_JSON,
    INDEX_MENU_KEY,
    INDEX_MENU_OPEN_KEYS,
} from "./../../action/mainPage";
import * as Immutable from 'immutable';
import { routerNavJson } from '../../routerNavJson';

const sessionInitalState = JSON.parse(sessionStorage.getItem('mainPage')!);
const initialState = Immutable.fromJS({
    collapsed: false,
    navNames: {
        names: '',
        currentKey: '',
        openKeys: ['']
    },
    ...sessionInitalState,
});

//是否被包含,是返回true,不是返回false
const isContained =(a, b)=>{
    if(!(a instanceof Array) || !(b instanceof Array)) return false;
    if(a.length < b.length) return false;
    var aStr = a.toString();
    for(var i = 0, len = b.length; i < len; i++){
      if(aStr.indexOf(b[i]) == -1) return false;
    }
    return true;
}

/**
 * 面包屑缓存
 */
let cacheBreadcrumb = {};
/* 返回菜单1-N级字符串 */
const getBreadcrumb = (arrNames) => {
    let arrNamesStringify = JSON.stringify(arrNames);
    if (Object.prototype.hasOwnProperty.call(cacheBreadcrumb, arrNamesStringify)) {
        return cacheBreadcrumb[arrNamesStringify];
    }
    let arr:Array<string> = [];
    for (let value of arrNames) {
        if (Object.prototype.hasOwnProperty.call(routerNavJson, value)) {

            // 产品把面包屑替换成固定标题
            if(routerNavJson[value]['title']){
                arr = [routerNavJson[value]['title']]
            }else{
                arr.push(routerNavJson[value].name);
            }
             

        }
    }
    return cacheBreadcrumb[arrNamesStringify] = arr;
}

/**
 * 返回菜单1-N级字符串
 */
// let newCacheBreadcrumb = {};
/* 返回菜单1-N级字符串 */
const newGetBreadcrumb = (arrNames, {navJson}) => {
    let code = arrNames[arrNames.length-1];
    let arr:Array<any> = [];
    const getName = (data) =>{
        data.map(item => {
            if(item.code == code){
                arr.push({
                    path:item.url,
                    breadcrumbName: `<span>${item.displayName}</span>`,
                    title: item.name,
                })
            }else if(item.children){
                getName(item.children)
            }
        })
    }
    getName(navJson);
    return arr.length == 0 ? [{path: '/newadmin/crm/workbench', breadcrumbName:'<span>销售管理平台</span>', title: '销售管理平台'}] : [arr[0]];
}

/**
 * 匹配url
 */
let cacheMatchPath = {};
const matchPath: (params) => { keyPath: Array<string>, currentKey: string, openKeys: Array<string> } = ({ navJson, location }) => {
    const pathName = location.pathname;
    // console.time('the time of matchPath');
    if (Object.prototype.hasOwnProperty.call(cacheMatchPath, pathName)) {
        console.timeEnd('the time of matchPath');
        return cacheMatchPath[pathName];
    }
    let keyPath:Array<string> = [];
    let openKeys:Array<string> = [];
    const findParents = (pathName) => {
        if (Object.prototype.hasOwnProperty.call(navJson, pathName)) {
            const pathObj = navJson[pathName];
            const {
				parents,
                hide,
			} = pathObj;
            openKeys.unshift(pathName);
            keyPath.unshift(pathName);
            if (parents && parents.length > 0) {
                findParents(parents[0]);
            }
        }
    }
    findParents(pathName);
    // console.timeEnd('the time of matchPath');
    const data = {
        currentKey: pathName,
        keyPath,
        openKeys,
    };
    cacheMatchPath[pathName] = data;
    return data;
}
/**
 * 高亮显示 2018 03 08
 */
let newCacheMatchPath = {};
let currentKeyWindow:any[] | null = [];//新增字段，用于保存已选中菜单项
let openKeysWindow:any[] | null = [];//新增字段，用于保存已展开的菜单项
let cacheDetailPath = new Map();
const newMatchPath: (params) => { keyPath: Array<string>, currentKey: string, openKeys: Array<string> } = ({ navJson, location }) => {
    const pathName = `/${location.pathname.split('/').slice(2,).join('/')}`;
    // console.log(pathName)
    // console.log('newCacheMatchPath',newCacheMatchPath)
    // console.time('the time of matchPath');
    if (Object.prototype.hasOwnProperty.call(newCacheMatchPath, pathName)) {
        // console.timeEnd('the time of matchPath');
        // console.log('缓存',newCacheMatchPath[pathName])
        sessionStorage.setItem('openKeys', JSON.stringify(newCacheMatchPath[pathName].openKeys))
        sessionStorage.setItem('currentKey', JSON.stringify(newCacheMatchPath[pathName].currentKey))
        return newCacheMatchPath[pathName];
    }
    let keyPath:Array<string> = [];
    let openKeys:Array<string> = [];
    let currentKey:Array<string> | null = null;
    let isDetail = false;
    const findParents = (data, pathName, getCurrentKey = false) => {
        if(getCurrentKey){
            data.map((item, index) => {
                if(item.code == pathName){
                    if(item.type !== 0 && item.type !== 1 && item.type !== 11){
                        findParents(navJson, item.parentCode, true);
                    }
                    openKeys.unshift(item.code);
                    keyPath.unshift(item.code);
                    // console.log('currentKey', currentKey, item.id)
                    if((item.type == 0 || item.type == 1 || item.type == 11) && isDetail ){ // 2018 04 27 修改直接进入详情页高亮显示问题
                        currentKey = [item.code];
                        return ;    // 2018 04 27 修改直接进入详情页高亮显示问题
                    }
                }else if(item.children){
                    // console.log('pathName', pathName)
                    findParents(item.children, pathName, true);
                }
            })
        }else{
            data.map(item => {
                // let isPage = item.children.filter(item => item.type == 1)
                if(item.url === pathName){
                    if(item.type != 0 && item.type != 1 && item.type != 11){
                        // console.log('**', item.parentCode, '**')
                        isDetail = true;
                        // return ;
                        if(!sessionStorage.getItem('openKeys')){
                            findParents(navJson, item.parentCode, true)
                        }
                    }
                    openKeys.unshift(item.code);
                    keyPath.unshift(item.code);
                    if(item.type == 0 || item.type == 1 || item.type == 11){
                        currentKey = [item.code];
                    }
                    if(item.parentId != 0){
                        findParents(navJson, item.parentCode, true)
                    }
                }else if(item.children){
                    findParents(item.children, pathName, false);
                } 
            })
        }
    }
    // console.log('openKeys',openKeys)
    findParents(navJson, pathName);
    // console.timeEnd('the time of matchPath');
    let sessionOpenKeys = sessionStorage.getItem('openKeys');
    let sessionCurrentKey = sessionStorage.getItem('currentKey');
    if((!sessionOpenKeys) && !isDetail){
        sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
    }
    if(!isDetail){
        sessionStorage.setItem('currentKey', JSON.stringify(currentKey))
    }
    // console.log(currentKey)
    const data = {
        currentKey: isDetail && sessionCurrentKey ? JSON.parse(sessionCurrentKey) : currentKey,
        keyPath: [...new Set(keyPath)],
        openKeys: isDetail && sessionOpenKeys ? JSON.parse(sessionOpenKeys) : [...new Set(openKeys)],
    };
    // console.log(isDetail,'2')
    currentKeyWindow = data.currentKey || currentKeyWindow;
    openKeysWindow = data.openKeys || openKeysWindow;
    if(isDetail && !isContained([...new Set(openKeys)], JSON.parse(sessionOpenKeys || "[]"))){
        // console.log('openKeys 不一样', [...new Set(openKeys)], JSON.parse(sessionOpenKeys || "[]"))
        if(!cacheDetailPath.get(pathName)){
            data.currentKey = currentKey;
            data.openKeys = [...new Set(openKeys)];
        }
        return cacheDetailPath.get(pathName) || data;
    }
    if(!isDetail){
        newCacheMatchPath[pathName] = data;
    }else{
        // console.log(data);
        cacheDetailPath.set(pathName, data);
    }
    // console.log(data);
    return data;
}

const findParentsCode = (leftNav, code) => { // 通过 code 获取新的 openkeys

    let arr:any[] = [];
    const findParent =  (data, code) => {
        if( typeof code == 'number'){
            data.map(item => {
                if(item.id == code){
                    arr.unshift(item.code);
                    if(item.parentId != 0){
                        findParent(data, item.parentId);
                    }
                }else if(item.children){
                    findParent(item.children, code)
                }
                return arr
            })
        }else{
            data.map(item => {
                if(item.code == code){
                    arr.unshift(item.code);
                    if(item.parentId != 0){
                        findParent(leftNav, item.parentId);
                    }
                }else if(item.children){
                    findParent(item.children, code)
                }
                return arr
            })
        }
        return arr.length == 0 ? null : arr;
    }
    return findParent(leftNav, code)
}


export const mainPage = (state = initialState, action) => {
    const params = action.params;
    switch (action.type) {
        case INDEX_SIDE_TYPE: {
            if(params){
                const {
                    currentKey,
                    keyPath,
                    openKeys,
                } = newMatchPath(action.params);
                return state.updateIn(['navNames', 'currentKey'], () => {
                    return currentKey;
                }).updateIn(['navNames', 'names'], () => {
                    return newGetBreadcrumb(keyPath, action.params);
                    // return getBreadcrumb(keyPath);
                }).updateIn(['navNames', 'openKeys'], () => {
                    return openKeys;
                }).update('collapsed', (value) => {
                    sessionStorage.setItem('mainPage', JSON.stringify({ collapsed: !value }));
                    return !value
                });
            }
            return state.updateIn(['navNames', 'openKeys'], () => {
                return [];
            }).update('collapsed', (value) => {
                sessionStorage.setItem('mainPage', JSON.stringify({ collapsed: !value }));
                return !value
            });
        }
        case INDEX_DATA_JSON: {
            let data;
            // console.log('reducer', params)
            if (params.currentKey && params.keyPath && params.openKeys) {
                data = params;
            }
            else {
                data = newMatchPath(action.params);
            }
            // console.log('reduces',data)
            const {
                currentKey,
                keyPath,
                openKeys,
            } = data;
            return state.updateIn(['navNames', 'currentKey'], () => {
                return currentKey;
            }).updateIn(['navNames', 'names'], () => {
                return newGetBreadcrumb(keyPath, action.params);
                // return getBreadcrumb(keyPath);
            }).updateIn(['navNames', 'openKeys'], () => {
                return openKeys;
            })
        }
        case INDEX_MENU_KEY: {
            return state.updateIn(['navNames', 'currentKey'], () => {
                return action.currentKey;
            })
        }
        case INDEX_MENU_OPEN_KEYS: {
            /**
             * 手风琴效果
             */
            return state.updateIn(['navNames', 'openKeys'], (openKeys) => {
                let openKey = action.openKeys.find(key => openKeys.indexOf(key) ===-1) 
                if(openKey){
                    // console.log('openKey*-*',openKey)
                    // console.log('999',findParentsCode(action.leftNavJson, openKey))
                    return findParentsCode(action.leftNavJson, openKey); // 通过 openKey 获取新的 openkeys
                }
                return action.openKeys;
            })
        }
        default: return state;
    }
}



