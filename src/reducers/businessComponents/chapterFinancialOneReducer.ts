import Immutable from 'immutable'
import { RECEIVE_COMPANY_INFO } from '../../action/businessComponents/chapterFinancialOneAction'
import _ from 'lodash'

const initialState = Immutable.fromJS({
    data: [],
    total: 0
})

export default (state = initialState, action) => {
    const { type, payload, extra } = action
    switch (type) {
        case RECEIVE_COMPANY_INFO:
            return state.update('data', () => Immutable.fromJS(preProcessPayload(payload)))
                .update('total', () => payload.totalCount)
                .update('random', () => new Date().getTime())
        default:
            return state
    }
}

function preProcessPayload(payload) {
    // companyName
    // creatorId
    // creatorInfo
    // csMap
    // fitAll
    // id
    // jsInfoBanks
    // jsInfoCommonFund
    // jsInfoCompanyBasic
    // jsInfoContact
    // jsInfoHuman
    // jsInfoIndustry
    // jsInfoLabor
    // jsInfoLandTax
    // jsInfoNationalTax
    // jsInfoSocial
    // type
    return payload.rows.map(item => {
        const { companyName, jsInfoCompanyBasic, jsInfoNationalTax, jsInfoLandTax, jsInfoSocial, jsInfoCommonFund, id } = item

        const { // 公司基本信息
            chargeMan = null, fundingTime = null, taxpayerCreditCode = null,
            businessRegisterAddress1 = null, businessRegisterAddress2 = null,
            businessOfficeAddress1 = null, businessOfficeAddress2 = null,
            capitalVerificationReport = null, registerDeadlineStart = null,
            registerDeadlineEnd = null, invoiceSeal = null,
            businessDeadlineEnd = null, businessDeadlineLong = null, businessDeadlineStart = null
        } = jsInfoCompanyBasic || {}
        const { // 国税
            taxUrl = null, taxPassword = null, taxFirstTime = null, taxPersonName = null, taxPersonPhone = [],
            taxCaTermStart = null, taxCaTermEnd = null, taxVpndTermStart = null, taxVpndTermEnd = null
        } = jsInfoNationalTax || {}

        const { // 地税
            taxUrl: taxUrl_ = null, taxPassword: taxPassword_ = null, taxFirstTime: taxFirstTime_ = null,
            taxPersonName: taxPersonName_ = null, taxPersonPhone: taxPersonPhone_ = [], taxHallAddress = null, taxHallAddressDetail = null,
            taxCaTermStart: taxCaTermStart_ = null, taxCaTermEnd: taxCaTermEnd_ = null, personalTaxSystem = null,
            personalTaxPassword = null, residualReport = null, socialLandTaxCut = null, annualSocialDeadline1 = null
        } = jsInfoLandTax ||　{}

        const {
            registerCode = null, socialBureauPersonName = null, bankAccount = null, bankName = null, firstCutTime = null, payee = null
        } = jsInfoSocial || {}
        return {
            id,
            companyName:                item.companyName,
            chargeMan:                  translate(0, chargeMan),
            fundingTime:                translate(0, fundingTime),
            taxpayerCreditCode:         translate(0, taxpayerCreditCode),
            businessRegisterAddress1:   translate(5, businessRegisterAddress1) + (businessRegisterAddress2 ? businessRegisterAddress2: ''),
            businessOfficeAddress1:     translate(5, businessOfficeAddress1) + (businessOfficeAddress2 ? businessOfficeAddress2 : ''),
            capitalVerificationReport:  translate(0, capitalVerificationReport),
            registerDeadline:           translate(6, [businessDeadlineStart, businessDeadlineEnd, businessDeadlineLong]),
            invoiceSeal:                translate(2, invoiceSeal),

            taxUrl:                     translate(0, taxUrl),
            taxPassword:                translate(0, taxPassword),
            taxFirstTime:               translate(0, taxFirstTime),
            taxPerson:                  [taxPersonName, taxPersonPhone || []],
            taxCaTerm:                  translate(1, [taxCaTermStart, taxCaTermEnd]),
            taxVpndTerm:                translate(1, [taxVpndTermStart, taxVpndTermEnd]),

            taxUrl_:                    translate(0, taxUrl_),
            taxFirstTime_:              translate(0, taxFirstTime_),
            taxPassword_:               translate(0, taxPassword_),
            taxHallAddress:             translate(5, taxHallAddress) + (taxHallAddressDetail ? taxHallAddressDetail : ''),
            taxPerson_:                 [taxPersonName_, taxPersonPhone_ || []],
            taxCaTerm_:                 translate(1, [taxCaTermStart_, taxCaTermEnd_]),
            personalTaxSystem:          translate(0, personalTaxSystem),
            personalTaxPassword:        translate(0, personalTaxPassword),
            residualReport:             translate(3, residualReport),
            socialLandTaxCut:           translate(3, socialLandTaxCut),

            registerCode:               translate(0, registerCode),
            payee:                      translate(0, payee),
            bankName:                   translate(0, bankName),
            bankAccount:                translate(0, bankAccount),
            firstCutTime:               translate(0, firstCutTime),
            annualSocialDeadline1:      translate(4, annualSocialDeadline1),
        }
    })
}

function setDefaultValue(a){
    if (!a)
        return '/'
    return a
}

function translate(type, key) {
    // console.log(type, key)
    switch (type) {
        case 0:
            return setDefaultValue(key)
        case 1:
            return (!key[0] || !key[1]) ? '/' : `${key[0]} - ${key[1]}`
        case 6:
            if (key[2]) {
                return `${key[0]} - 长期`
            } else {
                return (!key[0] || !key[1]) ? '/' : `${key[0]} - ${key[1]}`
            }
        case 2:
            return setDefaultValue(_.isNumber(key) ? (key === 0 ? '无' : '有') : '')
        case 3:
            return setDefaultValue(_.isNumber(key) ? (key === 0 ? '否' : '是') : '')
        case 4:
            return key
                ? (key[0] == 1 ? '每月' : '每年') +
                    (key[2]
                        ? `${key[1]}月${key[2]}日前`
                        : `${key[1]}日前` )
                : '/'
        case 5:
            if (key && key.selectName)
                return setDefaultValue(key.selectName.join(''))
            return setDefaultValue(null)
        default:
            break
    }
}