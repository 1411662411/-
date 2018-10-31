/**
 * Created by caozheng on 2017/2/22.
 */
import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
import { message } from 'antd';
import { browserHistory } from 'react-router';
import * as _ from 'lodash';

const GET_DETAIL = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/getDetial`;
const GET_RECEIVABLES_INFO = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/getReceivablesInfo`;
const GET_TABLE_DATA = `${DOMAIN_OXT}/apiv2_/social/social/finance/list`;
/**
 * 社保审核
 */
const AUDIT_SOCIAL= `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/auditOfProfession`

/**
 * 财务审核
 */
const AUDIT_FINANCE = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/auditOfFinance`;
const ADD_PREPAYMENTS = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/addPrepayments`;
// 查询银行列表
const GET_ACCOUNT_LIST = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/getAccountList`;
// 打款录入确认提交
const EMIT_SUBMIT = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/entryPayInfo`;


export const getDetail = (params) => {
    let json:any;
    let api:string;
    const {
        orderNum,
        companyId,
        city,
        companyType,
    } = params;
    if(params.type === 1) {
        json = {
            receivablesId:companyId,
            areaPolicyId:city,
            type: companyType,
        }
        api = GET_RECEIVABLES_INFO;
    }
    else {
        json = {
            prepaymentsCode: orderNum,
        };
        api = GET_DETAIL;
    }

    
    return fetchFn(api, json).then(data => data);
};

export const getTableDataAPI = (param) => {
    return fetchFn(GET_TABLE_DATA, param).then(data => data)
};

export const setAuditFinance = (param) => {
    const {
        role,
        prepaymentsCode,
        financeStatus,
        financeReason,
        professionReason,
    } = param;
    let newParams;
    let api = AUDIT_FINANCE;

    if(role === 1) {
        api = AUDIT_SOCIAL;
        newParams = {
            prepaymentsCode,
            professionStatus: financeStatus,
            professionReason: financeReason,
        }
    }
    else {
        newParams = param;
    }
    delete newParams.role;
    return fetchFn(api, newParams).then(data => data);
};

export const getAccountListApi = () => {
    return fetchFn(GET_ACCOUNT_LIST, {}).then(data => data);
};

const emitParam = {
    prepaymentsCode: '',
    payStatus: 1,
    payType: '',
    payBankName: '',
    paySerialNumber: '',
    payDrawer: '',
    payTime: ''
};
export const emitSubmitApi = (param) => {
    let resultParam = _.assign({}, emitParam, param);
    return fetchFn(EMIT_SUBMIT, resultParam).then(data => data);
};

/**
 * 生成支付请款单
 * @param params {Object} 参数
 */
export const addPrepayments  = (params) => fetchFn(ADD_PREPAYMENTS, params).then(data => data);