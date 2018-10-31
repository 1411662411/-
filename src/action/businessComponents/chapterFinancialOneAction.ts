import create from '../createActionCreator'

// saga data 请求与响应
export const GET_COMPANY_INFO = 'get_company_info'
export const RECEIVE_COMPANY_INFO = 'receive_company_info'
export const getCompanyInfo = create(GET_COMPANY_INFO)
export const receiveCompanyInfo = create(RECEIVE_COMPANY_INFO)

export const ENTRY_FETCHING = 'businessComponents/chapterFinancialOneAction/entry_fetching';
export const entryFetching = create(ENTRY_FETCHING);
export const ENTRY_SAGA = 'businessComponents/chapterFinancialOneAction/entry_saga';
export const entry = create(ENTRY_SAGA);