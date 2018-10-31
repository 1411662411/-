import { takeLatest, put } from 'redux-saga/effects'
import { message } from 'antd'
import { GET_BANK_INFO, receiveBankInfo, ENABLE_SWITCH, enableSwitchSet, enableSwitchFetching } from '../../action/businessComponents/chapterFinancialTwoAction'
import { requestBankInfo } from '../../api/businessComponents/chapterFinancialApi';
import { enableSwitch } from '../../api/businessComponents/chapterFinancialTwoApi';

// 请求数据模板Generator
function* template(request, receive, param) {
    let result = yield request(param)
    if (result.status === 0) {
        yield put(receive(result.data))
    } else {
        message.error(result.errmsg)
    }
}

export default function* () {
    yield takeLatest([
        GET_BANK_INFO,
        ENABLE_SWITCH,
    ], function* (action: any) {
        const { type, payload, extra } = action
        switch (type) {
            case GET_BANK_INFO:
                yield template(requestBankInfo, receiveBankInfo, payload)
                break
            case ENABLE_SWITCH:
                yield put(enableSwitchFetching({ index: payload.index, enableSwitchFetching: true }) as any);
                const responeData = yield enableSwitch(payload);
                if (responeData.status === 0) {
                    yield put(enableSwitchSet(payload) as any)
                }
                yield put(enableSwitchFetching({ index: payload.index, enableSwitchFetching: false }) as any)
                break;
            default:
                break
        }

    })
}