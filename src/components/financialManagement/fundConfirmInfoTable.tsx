import * as React from 'react';
import { Tooltip } from 'antd';
const typepay = ['CBS', '支付宝', '微信', '京东'];
/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};

export const orderColumns: Array<any> = [{
    title: '收款来源',
    dataIndex: 'transationPlatform',
    key: 'transationPlatform',
    render: (data) =>{
        return typepay[data] || 'CBS';
    },
    width: 100,
    fixed: 'left'
}, {
    title: '交易Id',
    dataIndex: 'transId',
    key: 'transId',
    width: 200,
    fixed: 'left'
},{
    title: '银行账号',
    width: 200,
    key: 'accounts',
    dataIndex: 'accounts'
}, {
    title: '银行账户名称',
    key: 'accountsName',
    width: 250,
    dataIndex: 'accountsName',
}, {
    title: '对方银行开户行',
    key: 'oppositeBankName',
    width: 250,
    dataIndex: 'oppositeBankName'

}, {
    title: '对方银行账户名称',
    key: 'oppositeAccountsName',
    width: 250,
    dataIndex: 'oppositeAccountsName',
}, {
    title: '对方银行账号',
    key: 'oppositeAccounts',
    width: 150,
    dataIndex: 'oppositeAccounts',

}, {
    title: '银行交易日期时间',
    key: 'transDatetime',
    width: 150,
    dataIndex: 'transDatetime',

},{
    title: '贷款标志',
    key: 'debitCreditFlag',
    dataIndex: 'debitCreditFlag',
    width: 50,
    render: (data) => {
        return data == 1 ? "借" : '贷';
    }
},{
    title: '协议类型',
    key: 'protocolType',
    dataIndex: 'protocolType',
    width: 100,
    render: (data) => {
        switch (data && data.toLocaleLowerCase()) {
            case 'u': return '上划';
            case 'd': return '下拨';
            case 'f': return '费用';
            default: return '未知类型';
        }
    }
},{
    title: '交易金额',
    key: 'amount',
    dataIndex: 'amount',
    width: 150,
},{
    title: '币种',
    key: 'currencyType',
    dataIndex: 'currencyType',
    width: 100,
},{
    title: '用途',
    key: 'purpose',
    dataIndex: 'purpose',
    width: 100,
    render: (data) => data && data !== 'null' ? data : '/',
},{
    title: '摘要',
    key: 'abstractMsg',
    dataIndex: 'abstractMsg',
    render: (data) => {
        data = isEmpty(data);
        if(data === '/') {
            return <span>{data}</span>
        }
        else {
            const style = {
                whiteSpace: 'nowrap',
                width: '134px',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="topLeft" title={data}>
                    <span style={style}>{data}</span>
                </Tooltip>
            )
        }
    },
    width: 150,
},{
    title: '银行流水号',
    key: 'bankSeqNumber',
    dataIndex: 'bankSeqNumber',
    width: 250,
},{
    title: '业务参考号',
    key: 'referenceNumber',
    dataIndex: 'referenceNumber',
    width: 150,
},{
    title: '交易识别码',
    key: 'transNumber',
    dataIndex: 'transNumber',
    width: 150,
},{
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    width: 150,
},{
    title: '来源',
    key: 'fromWhoFlag',
    dataIndex: 'fromWhoFlag',
    width: 150,
    render: (data) => {
        return data && data.toLocaleLowerCase() == 'b' ? '银行' : '用户';
    }
},{
    title: '备注信息',
    key: 'recordInfo',
    dataIndex: 'recordInfo',
    render: (data) => {
        data = isEmpty(data);
        if(data === '/') {
            return <span>{data}</span>
        }
        else {
            const style = {
                whiteSpace: 'nowrap',
                width: '134px',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="topLeft" title={data}>
                    <span style={style}>{data}</span>
                </Tooltip>
            )
        }
    },
    width: 150,
}];