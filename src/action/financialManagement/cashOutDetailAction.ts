/**
 * Created by caozheng on 2017/2/21.
 */
const CASH_OUT_DETAIL_SAGA = 'CASH_OUT_DETAIL_SAGA';

/**把详情的table 拆分成一个action */
export const CASH_OUT_DETAIL_TABLE_SAGA = 'CASH_OUT_DETAIL_TABLE_SAGA';
const CASH_OUT_DETAIL_TABLE_REDUCER = 'CASH_OUT_DETAIL_TABLE_REDUCER';

const CASH_OUT_AUDIT_FINANCE_SAGA = 'CASH_OUT_AUDIT_FINANCE_SAGA';
const CASH_OUT_EMIT_SUBMIT_SAGA = 'CASH_OUT_EMIT_SUBMIT_SAGA';
// detailData
const CASH_OUT_DETAIL_DATA = 'CASH_OUT_DETAIL_DATA';
// tableData
const CASH_OUT_TABLE_DATA = 'CASH_OUT_TABLE_DATA';
// visible
const CASH_OUT_MODAL_VISIBLE = 'CASH_OUT_MODAL_VISIBLE';
// button
const CASH_OUT_BUTTON_SHOW = 'CASH_OUT_BUTTON_SHOW';
// Loading
const CASH_OUT_LOADING_STATE = 'CASH_OUT_LOADING_STATE';
// radioState
const CASH_OUT_RADIO_STATE = 'CASH_OUT_RADIO_STATE';
// accountList
const CASH_OUT_ACCOUNT_LIST_SAGA = 'CASH_OUT_ACCOUNT_LIST_SAGA';
const CASH_OUT_ACCOUNT_LIST_DATA = 'CASH_OUT_ACCOUNT_LIST_DATA';
// selectBank
const CASH_OUT_SELECT_BANk_VALUE = 'CASH_OUT_SELECT_BANk_VALUE';
// selectTime
const CASH_OUT_SELECT_TIME = 'CASH_OUT_SELECT_TIME';

export const CASH_OUT_ADDPREPAYMENTS_SAGA = 'CASH_OUT_ADDPREPAYMENTS_SAGA';

export const triggerCashOutDetailSaga = (param) => {
    return {
        type: CASH_OUT_DETAIL_SAGA,
        param
    }
};
export const getCashOutDetailData = (detailData) => {
    return {
        type: CASH_OUT_DETAIL_DATA,
        detailData
    }
};


export const triggerCashOutDetailTableSaga = (param) => {
    return {
        type: CASH_OUT_DETAIL_TABLE_SAGA,
        param
    }
};
export const getCashOutDetailTableData = (param) => {
    return {
        type: CASH_OUT_DETAIL_TABLE_REDUCER,
        param
    }
};



export const triggerCashOutAuditSaga = (param) => {
    return {
        type: CASH_OUT_AUDIT_FINANCE_SAGA,
        param
    }
};

export const triggerCashOutEmitSubmitSaga = (param) => {
    return {
        type: CASH_OUT_EMIT_SUBMIT_SAGA,
        param
    }
};


export const getCashOutTableData = (params) => {
    return {
        type: CASH_OUT_TABLE_DATA,
        params
    }
};

export const setModalVisible = (visible, modalType) => {
    return {
        type: CASH_OUT_MODAL_VISIBLE,
        visible,
        modalType
    }
};

export const setCashOutButton = (buttonShow) => {
    return {
        type: CASH_OUT_BUTTON_SHOW,
        buttonShow
    }
};

export const setLoadingState = (loading) => {
    return {
        type: CASH_OUT_LOADING_STATE,
        loading
    }
};

export const setRadioState = (radioState) => {
    return {
        type: CASH_OUT_RADIO_STATE,
        radioState
    }
};

export const getAccountListSaga = () => {
    return {
        type: CASH_OUT_ACCOUNT_LIST_SAGA
    }
};

export const getAccountListData = (accountList) => {
    return {
        type: CASH_OUT_ACCOUNT_LIST_DATA,
        accountList
    }
};

export const setBankValue = (bankTransferValue, bankType) => {
    return {
        type: CASH_OUT_SELECT_BANk_VALUE,
        bankTransferValue,
        bankType
    }
};

export const setSelectTime = (time, timeType) => {
    return {
        type: CASH_OUT_SELECT_TIME,
        time,
        timeType
    }
}

/**
 * 生成支付请款单 Saga Action
 * @param params {Object} 参数
 */
export const addPrepayments = (params, callback) => ({
    type: CASH_OUT_ADDPREPAYMENTS_SAGA,
    params,
    callback,
});



