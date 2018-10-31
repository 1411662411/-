import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    ROUTER_PATH,
} from '../../global/global';
import {
    message,
    Modal,
} from 'antd';
import {
    browserHistory,
} from 'react-router'
import {
    RECIPIENTSELECTSOURCE_SAGA,
    recipientsourceloading,
    setRecipientSelectSource,
    CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA,
    setPaymentschedule,
    setPaymentbill,
    setAdvancedetails,
    CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA,
    CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA,
    GET_APPROVED_SAGA,
    setApproved,
    SUBMIT_APPROVE,
    DELETE_UPLOAD_RECORD_SAGA,
    getPaymentschedule as getPaymentscheduleCreateAction,
    getAdvancedetails as getAdvancedetailsCreateAction,
    getPaymentbill as getPaymentbillCreateAction,
    submitfetching,
    exceptionModal,
    paymentbillFetching,
    advancedetailsFetching,
    paymentscheduleFetching,
    INIT_PAYMENT,
    updateCasPaymentId, //更新请款单id
    setPaymentList, //更新出款单列表
} from '../../action/businessComponents/cashoutApproveSubmitAction';
import {
    getRecipientSelectsource,
    getPaymentschedule,
    getAdvancedetails,
    getPaymentbill,
    getApproved,
    submitApprove,
    deleteUploadRecord,
    getPersonInfo,
    initPaymentApi, //初始化请款单
    getPaymentListOfRequest,    //获取收款方信息中出款单列表
    savePaymentOfRequest,    //保存收款方信息中出款单列表
} from '../../api/businessComponents/cashoutApproveSubmitApi';

import {fetchFn} from '../../util/fetch';

/**
 * 截取最后的total
 * @param data {Array} 数据
 */
const sliceTotal = (data) => {
    const tempData = data || [];
    let dataObj = {};
    if (tempData.length >= 2) {
        dataObj = {
            dataSource: tempData.slice(0, tempData.length - 1),
            total: tempData[tempData.length - 1],
        }
    }
    else {
        dataObj = {
            dataSource: tempData.slice(0, tempData.length - 1),
            total: { total: 0 },
        }
    }
    return dataObj;
}


function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case RECIPIENTSELECTSOURCE_SAGA: {
            const {
                recipientSelectType,
            } = params;
            yield put(recipientsourceloading(true));
            const data = yield getRecipientSelectsource(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                let source;
                if (recipientSelectType === 'two') {
                    source = data.data.records.map(({ branchName, code, depositAccount, depositName }) => ({
                        name: branchName,
                        value: code,
                        bank: depositName,
                        account: depositAccount,
                       
                    }));
                }
                else {
                    source = data.data.map(({ serviceProvider, code, openingBank, bankAccount, bankType, cityName }) => ({
                        name: serviceProvider,
                        value: code,
                        bank: openingBank,
                        account: bankAccount,
                        bankType: bankType,
                        cityName: cityName
                    }));
                }
                yield put(setRecipientSelectSource({ key: recipientSelectType, value: source }));
            }
            yield put(recipientsourceloading(false));
            break;
        }
        case CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA: {
            yield put(advancedetailsFetching(true));
            const data = yield getAdvancedetails(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setAdvancedetails(sliceTotal(data.data)));
            }
            yield put(advancedetailsFetching(false));
            break;
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA: {
            yield put(paymentscheduleFetching(true));
            const data = yield getPaymentschedule(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentschedule(sliceTotal(data.data)));
            }
            yield put(paymentscheduleFetching(false));
            break;
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA: {
            yield put(paymentbillFetching(true));
            const data = yield getPaymentbill(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentbill(sliceTotal(data.data)));
            }
            yield put(paymentbillFetching(false));
            break;
        }
        case GET_APPROVED_SAGA: {
            const data = yield getApproved(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setApproved(data.data));
            }
            break;
        }
        case SUBMIT_APPROVE: {
            yield put(submitfetching(true));
            console.log(params);
            const {submit, paymentJSON} = params;
            const [data, list] = yield Promise.all([
                submitApprove(submit),
                savePaymentOfRequest({paymentJSON}),
            ]);
            console.log(list);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                const newData = data.data;

                /**
                 * 已经提交
                 */
                if (newData && newData.status === '172014') {
                    yield put(exceptionModal({
                        visible: true,
                        message: '该订单已经重新提交',
                        redirectUrl: `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
                    }));
                }
                /**
                 * 已经取消
                 */
                else if (newData && newData.status === '172015') {
                    yield put(exceptionModal({
                        visible: true,
                        message: '该请款单已经取消',
                        redirectUrl: `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
                    }));
                }
                else {
                    message.success('提交成功', 3, () => {
                        //put(submitfetching(false));
                        if (data.code) {
                            browserHistory.push(`${ROUTER_PATH}/newadmin/social/cashout/approve/list`);
                            // browserHistory.goBack()
                        }
                        else {
                            location.reload();
                        }
                    });
                }

            }else{
                yield put(submitfetching(false));
            }
            break;
        }
        case DELETE_UPLOAD_RECORD_SAGA: {
            const data = yield deleteUploadRecord(params);
            const {
                type,
                requestId,
            } = params;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                switch (type) {
                    case 1:
                        yield put(getPaymentscheduleCreateAction({ requestId}));
                        break;
                    case 2:
                        yield put(getAdvancedetailsCreateAction({ requestId }));
                        break;
                    case 3:
                        yield put(getPaymentbillCreateAction({ requestId }));
                        break;
                    default:
                        throw new Error('no "index" param at deleteUploadRecord Function');
                }
                message.success('清除成功');
            }

            break;
        }

        case INIT_PAYMENT: {
            yield put(paymentbillFetching(true));
            yield put(paymentscheduleFetching(true));
            
            const data = yield initPaymentApi(params);
            const requestInfoId = data.data.id;
            yield put(updateCasPaymentId(data.data.id));
            const [paymentschedule, paymentbill, paymentList] = yield Promise.all([
                getPaymentschedule({
                    requestId: requestInfoId,
                }),
                getPaymentbill({
                    requestId: requestInfoId,
                }),
                getPaymentListOfRequest({
                    ...params,
                    requestInfoId,
                }),
            ]);
            if (Number(paymentbill.error) === 0 || Number(paymentbill.status) === 0) {
                yield put(setPaymentbill(sliceTotal(paymentbill.data)));
            }
            if (Number(paymentschedule.error) === 0 || Number(paymentschedule.status) === 0) {
                yield put(setPaymentschedule(sliceTotal(paymentschedule.data)));
            }
            if (Number(paymentList.error) === 0 || Number(paymentList.status) === 0) {
                yield put(setPaymentList(paymentList.data));
            }
            yield put(paymentbillFetching(false));
            yield put(paymentscheduleFetching(false));
            // console.log(paymentbill, paymentschedule);
            break;
        }

    }
}

export default function* watchCashoutApproveSubmit() {
    yield takeEvery([
        RECIPIENTSELECTSOURCE_SAGA,
        CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA,
        CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA,
        CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA,
        GET_APPROVED_SAGA,
        SUBMIT_APPROVE,
        DELETE_UPLOAD_RECORD_SAGA,
        INIT_PAYMENT,
    ], incrementAsync);
}

