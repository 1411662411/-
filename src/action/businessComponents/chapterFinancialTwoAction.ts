import create from '../createActionCreator'

// saga data 请求与响应
export const GET_BANK_INFO = 'get_bank_info'
export const RECEIVE_BANK_INFO = 'receive_bank_info'
export const getBankInfo = create(GET_BANK_INFO)
export const receiveBankInfo = create(RECEIVE_BANK_INFO)

export const ENABLE_SWITCH = 'businessComponents/chapterFinancialTwoAction/enable_switch'
export const enableSwitch = create(ENABLE_SWITCH)
export const ENABLE_SWITCH_SET = 'businessComponents/chapterFinancialTwoAction/enable_switch_set'
export const enableSwitchSet = create(ENABLE_SWITCH_SET)

export const ENABLE_SWITCH_FETCHING = 'businessComponents/chapterFinancialTwoAction/enable_switch_fetching'
export const enableSwitchFetching = create(ENABLE_SWITCH_FETCHING)