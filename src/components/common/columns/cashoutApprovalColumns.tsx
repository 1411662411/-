import * as React from 'react';
import { DOMAIN_OXT, ROUTER_PATH } from '../../../global/global';
import { browserHistory } from 'react-router';

/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};



interface columns {
    (data?): [any];
}



/**
 * 请款单审批列表
 * @param data {Object} 参数
 * @return {Array}0 业务方 1 财务  2 ceo
 */
export const cashoutApprovalColumns: columns = (params) => [
    [{
        title: '请款单号',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: "100px",
        fixed: 'left',
        render: (data) => {
            return (
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/social/cashout/business/approve/details`, name: 'cashoutApproveDetailsBusiness', params: { orderCode: data } }); }}>{data}</a>);
        }
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
        title: '客服计划付款截止日',
        dataIndex: 'countdown',
        key: 'countdown',
        width: "100px",
    }, {
        title: '本次请款付款截止时间',
        key: 'endTime',
        dataIndex: 'endTime',
        width: "150px",
    }, {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: "150px",
    }, {
        title: '收款方类型',
        key: 'payeeType',
        dataIndex: 'payeeType',
        width: "100px",
    }, {
        title: '收款方名称',
        key: 'payeeName',
        dataIndex: 'payeeName',
        width: "250px",
    }, {
        title: '请款单类型',
        key: 'cashoutType',
        dataIndex: 'cashoutType',
        width: "100px",
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
        title: '社保缴费月（操作月）',
        key: 'socialMonth',
        dataIndex: 'socialMonth',
        width: "80px",

    }, {
        title: '请款提交人',
        key: 'cashoutSubmitter',
        dataIndex: 'cashoutSubmitter',
        width: "120px",
        render: (data) => {
            return <span dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '审批经手人',
        key: 'approvalHandler',
        dataIndex: 'approvalHandler',
        width: "250px",
        render: (data) => {
            return <span style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '操作',
        key: 'action',
        width: "100px",
        fixed: 'right',

        render: (data) => {

            return (
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/social/cashout/business/approve/details`, name: 'cashoutApproveDetailsBusiness', params: { orderCode: data.orderCode } }); }}>审批</a>);
        }
    }],
    /**
     * 财务列表
     */
    [{
        title: '请款单号',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: "100px",
        render: (data) => {
            return (
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/financial/cashout/approve/details`, name: 'cashoutApproveDetailsFinancial', params: { orderCode: data } }); }}>{data}</a>);
        }
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
        title: '客服计划付款截止日',
        dataIndex: 'countdown',
        key: 'countdown',
        width: "100px",
    }, {
        title: '本次请款付款截止时间',
        key: 'endTime',
        dataIndex: 'endTime',
        width: "150px",
    }, {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: "150px",
    }, {
        title: '导出状态',
        key: 'exportStatus',
        dataIndex: 'exportStatus',
        width: "150px",
    }, {
        title: '社保业务请款性质',
        key: 'socialCashoutType',
        dataIndex: 'socialCashoutType',
        width: "150px",
    }, {
        title: '收款方类型',
        key: 'payeeType',
        dataIndex: 'payeeType',
        width: "100px",
    }, {
        title: '收款方名称',
        key: 'payeeName',
        dataIndex: 'payeeName',
        width: "250px",
    }, {
        title: '请款单类型',
        key: 'cashoutType',
        dataIndex: 'cashoutType',
        width: "100px",
    }, {
        title: '代发代付金额',
        key: 'helpbuyMoney',
        dataIndex: 'helpbuyMoney',
        width: "100px",
    }, {
        title: '人月次',
        key: 'cashoutUnit',
        dataIndex: 'cashoutUnit',
        width: "100px",
    }, {
        title: '服务费',
        key: 'cashoutFeeSum',
        dataIndex: 'cashoutFeeSum',
        width: "100px",
    }, {
        title: '人均服务费（服务费/人月次）',
        key: 'cashoutFee',
        dataIndex: 'cashoutFee',
        width: "150px",
    }, {
        title: '垫付金额',
        key: 'prepayMoney',
        dataIndex: 'prepayMoney',
        width: "100px",
    }, {
        title: '请款总金额',
        key: 'cashoutMoney',
        dataIndex: 'cashoutMoney',
        width: "100px",
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
        title: '社保缴费月（操作月）',
        key: 'socialMonth',
        dataIndex: 'socialMonth',
        width: "80px",

    }, {
        title: '请款提交人',
        key: 'cashoutSubmitter',
        dataIndex: 'cashoutSubmitter',
        width: "120px",
        render: (data) => {
            return <span dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '审批经手人',
        key: 'approvalHandler',
        dataIndex: 'approvalHandler',
        width: "250px",
        render: (data) => {
            return <span style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '操作',
        key: 'action',
        width: "100px",
        fixed: 'right',

        render: (data) => {

            return (
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/financial/cashout/approve/details`, name: 'cashoutApproveDetailsFinancial', params: { orderCode: data.orderCode } }); }}>审批</a>);
        }
    }],
    /**
     * ceo列表
     */
    [{
        title: '请款单号',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: "120px",
        render: (data) => {
            return (
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/ceo/cashout/approve/details`, name: 'cashoutApproveDetailsCeo', params: { orderCode: data } }); }}>{data}</a>);
        }
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
        title: '计划支付时间',
        dataIndex: null,
        key: 'planTime',
        render: (data,record, index) => {
            
            return params.renderColumns(data, index, 'planTime', data.planTime);
            
        },
        width: "110px",
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
        title: '客服计划付款截止日',
        dataIndex: 'countdown',
        key: 'countdown',
        width: "100px",
    }, {
        title: '本次请款付款截止时间',
        key: 'endTime',
        dataIndex: 'endTime',
        width: "130px",
    }, {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: "150px",
    }, {
        title: '收款方类型',
        key: 'payeeType',
        dataIndex: 'payeeType',
        width: "100px",
    }, {
        title: '收款方名称',
        key: 'payeeName',
        dataIndex: 'payeeName',
        width: "250px",
    }, {
        title: '请款单类型',
        key: 'cashoutType',
        dataIndex: 'cashoutType',
        width: "100px",
    }, {
        title: '代发代付金额',
        key: 'helpbuyMoney',
        dataIndex: 'helpbuyMoney',
        width: "100px",
    }, {
        title: '人月次',
        key: 'cashoutUnit',
        dataIndex: 'cashoutUnit',
        width: "100px",
    }, {
        title: '服务费',
        key: 'cashoutFeeSum',
        dataIndex: 'cashoutFeeSum',
        width: "100px",
    }, {
        title: '人均服务费（服务费/人月次）',
        key: 'cashoutFee',
        dataIndex: 'cashoutFee',
        width: "150px",
    }, {
        title: '垫付金额',
        key: 'prepayMoney',
        dataIndex: 'prepayMoney',
        width: "100px",
    }, {
        title: '请款总金额',
        key: 'cashoutMoney',
        dataIndex: 'cashoutMoney',
        width: "100px",
    }, {
        title: '请款单类型',
        key: 'socialCashoutType',
        dataIndex: 'socialCashoutType',
        width: "100px",
    }, {
        // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
        title: '社保缴费月（操作月）',
        key: 'socialMonth',
        dataIndex: 'socialMonth',
        width: "100px",

    }, {
        title: '请款提交人',
        key: 'cashoutSubmitter',
        dataIndex: 'cashoutSubmitter',
        width: "150px",
        render: (data) => {
            return <span dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '审批经手人',
        key: 'approvalHandler',
        dataIndex: 'approvalHandler',
        width: "250px",
        render: (data) => {
            return <span style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: data }}></span>;
        }
    }, {
        title: '操作',
        key: 'action',
        width: "150px",
        fixed: 'right',

        render: (data) => {
            return (
                <div>
                    <a style={{ marginRight: '8px' }} onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/ceo/cashout/approve/details`, name: 'cashoutApproveDetailsCeo', params: { orderCode: data.orderCode } }); }}>查看</a>
                    <a style={{ marginRight: '8px' }} onClick={e => params.handleSinglePass(data)}>审批通过</a>
                    <a onClick={e => params.handleSingleReject(data)}>驳回</a>
                </div>);
        }
    }]

]


