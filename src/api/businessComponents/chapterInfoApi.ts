import { DOMAIN_OXT } from '../../global/global'
import createRequest from '../createRequest'

// example 请求
const EXAMPLE_API = `${DOMAIN_OXT}/example`;
export const requestExample = createRequest(EXAMPLE_API)

// listCompany 请求
const listCompanyApi = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/cs/listCompany`
export const requestCompanyList = createRequest(listCompanyApi)

// listInfoByCsIdDetail 请求
const listInfoByCsIdDetailApi = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/listInfoByCsIdDetail`
export const requestChapterInfo = createRequest(listInfoByCsIdDetailApi, {
    headers: {
        'Content-Type': 'application/json'
    }
})

// 根据公司查看章证照保管人信息
export const listCompanyWithCs = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/cs/listCompanyWithCs`