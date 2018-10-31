import { takeLatest, put } from 'redux-saga/effects'
import { message } from 'antd'
import { GET_COMPANY_INFO, receiveCompanyInfo, ENTRY_SAGA, entryFetching, } from '../../action/businessComponents/chapterFinancialOneAction'
import { requestCompanyInfo } from '../../api/businessComponents/chapterFinancialApi'
import { entry } from '../../api/businessComponents/chapterFinancialOneApi';
// 请求数据模板Generator
function *template(request, receive, param){
    let result = yield request(param)
    if (result.status === 0) {
        yield put(receive(result.data))
    } else {
        message.error(result.errmsg)
    }
}

export default function *() {
    yield takeLatest([
        GET_COMPANY_INFO,
        ENTRY_SAGA,
    ], function *(action: any) {
        const { type, payload, extra, success, fail } = action
        switch (type) {
            case GET_COMPANY_INFO:
                yield template(requestCompanyInfo, receiveCompanyInfo, payload)
                break;
            case ENTRY_SAGA:
                const responeDate = yield entry(payload);
                if(responeDate.status === 0) {
                    message.success('编辑成功');
                    if(typeof success === 'function') {
                        success();
                    }
                }
                else {
                    if(typeof fail === 'function') {
                        fail();
                    }
                }
            default:
                break
        }

    })
}