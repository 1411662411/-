import Immutable from 'immutable'
import { RECEIVE_BANK_INFO, ENABLE_SWITCH_SET, ENABLE_SWITCH_FETCHING, } from '../../action/businessComponents/chapterFinancialTwoAction'
import { BankInfo } from '../../pages/chapter/chapterFinancialTwo'
import _ from 'lodash'

const initialState = Immutable.fromJS({
    data: [],
    dataSorted: [],
    originalData: [],
    total: 0
})

export default (state = initialState, action) => {
    const { type, payload, extra } = action
    switch (type) {
        case RECEIVE_BANK_INFO:
            const data = preProcessPayload(payload)
            return state.update('data', () => Immutable.fromJS(data))
                .update('dataSorted', () => Immutable.fromJS(sortData(data)))
                .update('total', () => payload.totalCount)
                .update('originalData', () => Immutable.fromJS(payload.rows))
                .update('random', () => new Date().getTime())
        case ENABLE_SWITCH_SET:
            return state.updateIn(['dataSorted', payload.index, 'enableStatus'], () => payload.enableStatus);
        case ENABLE_SWITCH_FETCHING: {
            return state.updateIn(['dataSorted', payload.index, 'enableSwitchFetching'], () => payload.enableSwitchFetching);
        }
        default:
            return state
    }
}

function preProcessPayload(payload) {
    const rows = payload.rows
    const data: BankInfo[] = []
    rows.forEach((row, index) => {
        const { companyName, companyCode, jsInfoBanks = [], jsInfoCommonFund, jsInfoSocial, id, enableSwitchFetching } = rows[index];
        const bankAccountFund = jsInfoCommonFund && jsInfoCommonFund.bankAccount
        const bankAccountSocial = jsInfoSocial && jsInfoSocial.bankAccount
        const payMethodFund = jsInfoCommonFund && jsInfoCommonFund.payMethod
        const payMethodSocial = jsInfoSocial && jsInfoSocial.payMethod

        // 不存在银行信息 填写默认值
        if (jsInfoBanks.length == 0) {
            let b: any = {}
            b.csId = id;
            b.enableStatus = -1,
            b.enableSwitchFetching = enableSwitchFetching;
            b.len = 0
            b.location = index // 以公司为参考的行数
            b.companyName = companyName
            b.companyCode = setDefaultValue(companyCode)
            b.bankName = setDefaultValue(null)
            b.bankAccount = setDefaultValue(null)
            b.bankType = setDefaultValue(null)
            b.area = setDefaultValue(null)
            b.accountType = setDefaultValue(null)
            b.bankContact = setDefaultValue(null)
            b.creditCode = setDefaultValue(null)
            b.passwordPayment = setDefaultValue(null)
            b.accountManagement = setDefaultValue(null)
            b.checkBillTime = setDefaultValue(null)
            b.checkBillFrequency = setDefaultValue(null)
            b.usbKey = setDefaultValue(null)
            b.usbKeyHandler = setDefaultValue(null)
            b.usbKeyChecker = setDefaultValue(null)
            b.usbKeyKeepDep = setDefaultValue(null)
            b.groupBank = setDefaultValue(null)
            b.replacePayroll = setDefaultValue(null)
            b.replaceOther = setDefaultValue(null)
            b.bankAccountSocial = setDefaultValue(null)
            b.bankAccountFund = setDefaultValue(null)
            b.payMethodSocial = translate(3, payMethodSocial)
            b.payMethodFund = translate(3, payMethodFund)
            data.push(b)
        } else {
            jsInfoBanks.forEach((bank: BankInfo, i) => {
                // let b: BankInfo = <BankInfo>{}
                let b: any = {}
                if (i == 0) {
                    b.len = jsInfoBanks.length
                }
                b.csId = id;
                b.bankId = bank.id;
                b.city = bank.city;
                b.province = bank.province;
                b.enableStatus = bank.enableStatus;
                b.enableSwitchFetching = enableSwitchFetching;
                b.accountUse = bank.accountUse;
                b.location = index // 以公司为参考的行数
                b.companyName = translate(0, companyName)
                b.companyCode = translate(0, companyCode)
                b.bankName = translate(0, bank.bankName)
                b.bankAccount = translate(0, bank.bankAccount)
                b.bankType = translate(0, bank.bankType)
                b.area = translate(8, bank.area)
                b.accountType = translate(1, bank.accountType)
                b.bankContact = translate(0, bank.bankContact)
                b.creditCode = translate(2, bank.creditCode)
                b.passwordPayment = translate(2, bank.passwordPayment)
                b.accountManagement = translate(2, bank.accountManagement)
                b.checkBillTime = translate(4, bank.checkBillTime)
                b.checkBillFrequency = translate(6, bank.checkBillFrequency)
                b.usbKey = translate(5, bank.usbKey)
                b.usbKeyHandler = translate(0, bank.usbKeyHandler)
                b.usbKeyChecker = translate(0, bank.usbKeyChecker)
                b.usbKeyKeepDep = translate(0, bank.usbKeyKeepDep)
                b.groupBank = translate(5, bank.groupBank)
                b.replacePayroll = translate(9, bank.replacePayroll)
                b.replaceOther = translate(9, bank.replaceOther)
                b.bankAccountSocial = translate(7, [bank.bankAccount, bankAccountSocial])
                b.bankAccountFund = translate(7, [bank.bankAccount, bankAccountFund])
                b.payMethodSocial = translate(3, payMethodSocial)
                b.payMethodFund = translate(3, payMethodFund)
                data.push(b)
            })
        }

    })
    return data
}

function setDefaultValue(a) {
    if (!a)
        return '/'
    return a
}

function translate(type, key) {
    switch (type) {
        case 0:
            return setDefaultValue(key)
        case 1:
            return setDefaultValue(_.isNumber(key) ? (key - 1 == 0 ? '一般户' : '基本户') : '')
        case 9:
            return setDefaultValue(_.isNumber(key) ? (key == 0 ? '未开通' : '开通') : '')
        case 5:
            return setDefaultValue(_.isNumber(key) ? (key == 0 ? '否' : '是') : '')
        case 2:
            return setDefaultValue(_.isNumber(key) ? (key == 0 ? '无' : '有') : '')
        case 3:
            return setDefaultValue(
                (() => {
                    const arr: any = key || []
                    const arrStr = arr.map(item => {
                        switch (item) {
                            case '1': return '现金'
                            case '2': return '支票'
                            case '3': return '托收'
                            case '4': return '转账'
                        }
                    })
                    return arrStr.join('，')
                })()
            )
        case 4:
            return setDefaultValue(
                key === 1 ? '月初'
                    : key === 2 ? '月中'
                        : key === 3 ? '月末'
                            : ''
            )
        case 6:
            return setDefaultValue(
                key === 1 ? '月'
                    : key === 2 ? '季度'
                        : key === 3 ? '半年度'
                            : key === 4 ? '年度'
                                : ''
            )
        case 7:
            return setDefaultValue(
                key[0] && (key[0] !== key[1] ? '否' : '是')
            )
        case 8:
            return setDefaultValue(key && key.selectName && key.selectName.join(' '))
        default:
            break
    }
}

// 排序所有行
function sortData(data: any[]) {
    let i = 0
    while (i < data.length) {
        let len = data[i].len
        // 大于两条银行数据的公司 有必要排序
        if (len > 2) {
            for (let j = i; j < i + len; j++) { // 局部排序

            }
            const partition = data.slice(i, i + len)
            sort(partition)
            data.splice(i, len, ...partition)
        }
        // 排序多少行 跳过多少行 len为0时也跳一行
        i += (len || 1)
    }
    return data
}

function sort(data) {
    const cachedBankName: any = []

    // 遇到银行名重复的数据 插入排序 结束此轮
    const res = data.some((item, index) => {
        if (
            cachedBankName.indexOf(item.bankName) > -1 &&
            (item.bankName !== (data[index - 1] ? data[index - 1].bankName : undefined))
        ) {
            let moving = index - 1
            // 遇到重复银行 且不相邻 向后移动一位
            while (
                moving > 0 &&
                (item.bankName !== (data[moving] ? data[moving].bankName : undefined))
            ) {
                data[moving + 1] = data[moving]
                moving--
            }
            // 首次找到重名的索引moving
            data[moving + 1] = item
            return true
        } else if (cachedBankName.indexOf(item.bankName) < 0) {
            cachedBankName.push(item.bankName)
        }
        return false
    })

    // 递归查找下一条重复数据
    if (res)
        sort(data)
}