/**
 * 获取table数据
 */
export const FILIALE_ENTRY_SAGA = 'FILIALE_ENTRY_SAGA';
export const DATA_RECEIVED = 'FILIALEENTRY_DATA_RECEIVED' 

/**
 * 新增table数据
 */
export const INPUT_CHANGE = 'FILIALE_ENTRY_INPUT_CHANGE';
export const ADD_TABLE_DATA = 'FILIALE_ENTRY_ADD_TABLE_DATA';
export const ADD_ISFETCHING = 'FILIALE_ENTRY_ADD_ISFETCHING';
/**
 * 编辑table数据
 */
export const EDIT_TABLE_DATA = 'FILIALE_ENTRY_EDIT_TABLE_DATA';
export const SAVE_TABLE_DATA = 'FILIALE_ENTRY_SAVE_TABLE_DATA';
export const CANCEL_EDIT_TABLE_DATA = 'FILIALE_ENTRY_CANCEL_EDIT_TABLE_DATA';


/**
 * 停用
 */
export const START_STOP_TABLE_DATA = 'FILIALE_ENTRY_START_STOP_TABLE_DATA';
/**
 * 删除
 */
export const DELETE_TABLE_DATA = 'FILIALE_ENTRY_DELETE_TABLE_DATA';

/**
 * 分页器默认分页
 */
export const PAGE_SIZE_CHANGE = 'FILIALE_ENTRY_PAGE_SIZE_CHANGE';

/**
 * loading
 */
export const ISFETCHING = 'FILIALE_ENTRY_FILIALE_ENTRY_ISFETCHING';

export const inputChange = (params) => ({
    type: INPUT_CHANGE,
    params,
})

// export const editTableDataCancel = (params) => ({
//     type: EDIT_TABLE_DATA,
//     params,
// });
