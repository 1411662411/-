
export const INDEX_SIDE_TYPE = 'INDEX_SIDE_TYPE';
export const INDEX_DATA_JSON = 'INDEX_DATA_JSON';
export const INDEX_MENU_KEY = 'INDEX_MENU_KEY';
export const INDEX_MENU_OPEN_KEYS = 'INDEX_MENU_OPEN_KEYS';

// 获取side当前点击的类型
export function getSideType(params) {
    return {
        type: INDEX_SIDE_TYPE,
        params,
    }
}

// 获取side 3级菜单name
export function getSideData(params) {
    return {
        type: INDEX_DATA_JSON,
        params,
    }
}

// 转换当前的currentkey
export function setCurrentKey(currentKey) {
    return {
        type: INDEX_MENU_KEY,
        currentKey
    }
}

export const setOpenKeys = (openKeys, leftNavJson) => {
    return {
        type: INDEX_MENU_OPEN_KEYS,
        openKeys,
        leftNavJson,
    }
}

