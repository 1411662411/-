import create from '../createActionCreator'

// saga example 请求与响应
export const GET_EXAMPLE = 'get_example'
export const RECEIVE_EXAMPLE = 'receive_example'
export const getExample = create(GET_EXAMPLE)
export const receiveExample = create(RECEIVE_EXAMPLE)

// saga company list 请求与响应
export const GET_COMPANY_LIST = 'get_company_list'
export const RECEIVE_COMPANY_LIST = 'receive_company_list'
export const getCompanyList = create(GET_COMPANY_LIST)
export const receiveCompanyList = create(RECEIVE_COMPANY_LIST)

// listInfoByCsIdDetail
export const GET_DETAIL = 'get_detail'
export const RECEIVE_DETAIL = 'receive_detail'
export const getDetail = create(GET_DETAIL)
export const receiveDetail = create(RECEIVE_DETAIL)