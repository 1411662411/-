/**
 * Created by caozheng on 2017/2/22.
 */

const initialState = {
    detailData : {},
    tableData: [],
    visible: false,
    modalType: 'reject',
    buttonShow: '2',
    loading: true,
    radioState: 1, // 选项卡
    accountList: {bankTransfer: [], checkBank: []},
    bankTransferValue: "0",
    checkBankValue: "0",
    // 时间选择
    remitTime: '',
    checkTime: '',
    businessType: '', /* 14: 五险一金 , 15: 五险, 16: 一金 */
};

const cashOutDetailReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'CASH_OUT_DETAIL_DATA': {
            return {...state, detailData: action.detailData, radioState: Number(action.detailData.payType)||1,total:action.recordsTotal}
        }
        case 'CASH_OUT_TABLE_DATA': {
            const total = action.params.tableData.data.total || 0;
            return {...state, ...action.params,total}
        }
        case 'CASH_OUT_MODAL_VISIBLE': {
            return {...state, visible: action.visible, modalType: action.modalType}
        }
        case 'CASH_OUT_BUTTON_SHOW': {
            return {...state, buttonShow: action.buttonShow}
        }
        case 'CASH_OUT_LOADING_STATE': {
            return {...state, loading: action.loading}
        }
        case 'CASH_OUT_RADIO_STATE': {
            return {...state, radioState: action.radioState}
        }
        case 'CASH_OUT_ACCOUNT_LIST_DATA': {
            return {...state, accountList: action.accountList}
        }
        case 'CASH_OUT_SELECT_BANk_VALUE': {
            if(action.bankType == 'bankTransfer') {
                return {...state, bankTransferValue: action.bankTransferValue}
            }
            return {...state, checkBankValue: action.bankTransferValue}
        }
        case 'CASH_OUT_SELECT_TIME': {
            if(action.timeType == 'remit') {
                return {...state, remitTime: action.time}
            }
            return {...state, checkTime: action.time}
        }
        default:
            return state
    }
};

export {cashOutDetailReducer}