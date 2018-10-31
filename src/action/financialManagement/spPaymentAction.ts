export const GET_SP_TABLE_DATA = 'GET_SP_TABLE_DATA'; // 获取 SP请款付款 table 数据
export const RECEIVE_SP_TABLE_DATA = 'RECEIVE_SP_TABLE_DATA'; // 接收 SP请款付款 table 数据

export const GET_OUT_TABLE_DATA = 'GET_OUT_TABLE_DATA'; // 获取 导出付款清单 table 数据
export const RECEIVE_OUT_TABLE_DATA = 'RECEIVE_OUT_TABLE_DATA'; // 接收 导出付款清单 table 数据


export const getSpTableData = (params) => {
    return{
        type: GET_SP_TABLE_DATA,
        params
    }
}
export const getOutTableData = (params) => {
    return{
        type: GET_OUT_TABLE_DATA,
        params
    }
}

export const receiveSpTableData = (params) => {
    return{
        type: RECEIVE_SP_TABLE_DATA,
        params
    }
}
export const receiveOutTableData = (params) => {
    return{
        type: RECEIVE_OUT_TABLE_DATA,
        params
    }
}