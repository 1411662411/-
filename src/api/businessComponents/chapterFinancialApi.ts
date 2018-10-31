import { DOMAIN_OXT } from '../../global/global'
import createRequest from '../createRequest'

// listCompany 请求
const listCompanyInfoApi = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/listCompanyInfo`
export const requestCompanyInfo = createRequest(listCompanyInfoApi, {
    headers: {
        'Content-Type': 'application/json'
    }
})

// listBank 请求
const listBankInfoApi = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/listBankInfo`
export const requestBankInfo = createRequest(listBankInfoApi, {
    headers: {
        'Content-Type': 'application/json'
    }
})

// listBankType请求
export const listBankTypeApi = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/list?key=YHLX`

// 独立银行信息录入接口
export const addOrUpdateBankInfo = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/addOrUpdateBankInfo`

// 上传附件接口
export const uploadApi = `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`