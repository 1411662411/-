import { takeEvery, take, put, select } from 'redux-saga/lib/effects'
import { message } from 'antd'
import {requestChapterInfo, requestCompanyList} from '../../api/businessComponents/chapterInfoApi'
import { GET_EXAMPLE, receiveExample, GET_COMPANY_LIST, receiveCompanyList, GET_DETAIL, receiveDetail } from '../../action/businessComponents/chapterInfoAction'

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
    yield takeEvery([
        GET_EXAMPLE, GET_COMPANY_LIST, GET_DETAIL
    ], function *(action) {
        const { type, payload, extra } = action
        switch (type) {
            case GET_EXAMPLE:
                yield put(receiveExample('new value'))
                break
            case GET_COMPANY_LIST:
                yield template(requestCompanyList, receiveCompanyList, payload)
                break
            case GET_DETAIL:
                yield template(requestChapterInfo, receiveDetail, payload)
                break
            default:
                break
        }
    })
}