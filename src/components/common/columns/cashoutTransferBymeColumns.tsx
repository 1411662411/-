import * as React from 'react';
import { DOMAIN_OXT, ROUTER_PATH } from '../../../global/global';
import { browserHistory } from 'react-router';
import * as moment from 'moment';
import { formatMoney } from '../../../util/util';
import {

    Tooltip,
    Popover,
    Icon,
} from 'antd';
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

const payeeTypeMap = {
    '1': '服务商',
    '2': '分公司'
};
// 请款审批状态 0：待审批 1：审批通过 2：审批驳回 3：已取消
const approvalStatusMap = {
    '0': '待审批',
    '1': '审批通过',
    '2': '审批驳回',
    '3': '已取消',

}
const socialPayTypeMap = {
    '1': '代缴社保款',
}
const codePopover = (
    <div>
        <p><span style={{ color: 'orange' }}>橙色</span> 的请款单号表示：垫款金额 ≥ 100,000.00；</p>
        <p><span style={{ color: '#22baa0' }}>绿色</span>{' 的请款单号表示：垫款金额 < 100,000.00。'}</p>
    </div>
);

/**
 * 请款单审批列表
 * @param data {Object} 参数
 * @return {Array}0 业务方 1 财务  2 ceo 3我的请款单列表 4 SP请款付款
 */
export const cashoutTransferBymeColumns: columns = (params) => [

    {    //1
        title: params.role == 2 ? <div>请款单号<Popover content={codePopover} title=""><Icon style={{ marginLeft: '5px', color: '#FFBF00' }} type="question-circle" /></Popover></div> : '请款单号',
        dataIndex: null,
        key: 'code',
        width: "120px",
        fixed: 'left',
        render: (data) => {
            const advancePaymentFee = Number.parseFloat(data.advancePaymentFee) || 0;
            const code = data.code
            return (params.role == 2 ? <a style={{ color: advancePaymentFee < 100000 ? '#22baa0' : 'orange' }} onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: code } }); }}>{code}</a> :
                <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: code } }); }}>{code}</a>);
        }
    }, {//2
        title: '财务计划支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width: "156px",
        className: params.role == 4?'payTimeheightLinght':null,
        render: (data) => {
            return <span>{data ? moment(data * 1000).format('YYYY-MM-DD') : '/'}</span>;
        }


    } , 
    {//3
        title: '客服计划付款时间倒计时',
        dataIndex: 'countdown',
        key: 'countdown',
        width: "200px",
        render: (data) => {
            if (data === '/') {
                return data;
            } else {
                return <span style={{ color: 'red' }}>{data}</span>
            }
        }
    }, {//4
        title: '客服计划付款截止日',
        key: 'requestCutOffTime',
        dataIndex: 'requestCutOffTime',
        width: "175px",
        render: (data) => {
            return data ? moment(data * 1000).format('YYYY-MM-DD HH:mm') : '/'
        }
    }, {//5
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: "175px",
        render: (data) => {
            return moment(data * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
    }, {//6
        title: '导出状态',
        key: 'exportCustomerStatus',
        dataIndex: 'exportCustomerStatus',
        width: "100px",
        render: (data) => {
            // 0 未导出 2已导出
            return data == 1 ? '已导出' : '未导出';
        }
    } , {//7
        title: '社保业务请款性质',
        key: 'socialPayType',
        dataIndex: 'socialPayType',
        width: "100px",
        render: (data) => {
            // 1:实付情况;2:预付情况
            return data == 1 ? '实付请款' : '预付请款';
        }
    } , {//8
        title: '收款方类型',
        key: 'detailPayeeType',
        dataIndex: 'detailPayeeType',
        width: "100px",
        render: (data) => {
            return payeeTypeMap[data];
        }
    }, {//9
        title: '收款方名称',
        key: 'payeeName',
        dataIndex: 'payeeName',
        width: "250px",
        render: (data) => (
            isEmpty(data)
        )
    }, {//10
        title: '请款单类型',
        key: 'socialPayTypea',
        width: "100px",
        render: () => {
            return '代缴社保款';
        }
    }, {//11
        title: '代发代付金额',
        key: 'behalfPaymentFee',
        dataIndex: 'behalfPaymentFee',
        width: "130px",
        render: (data) => (
            formatMoney(data, 2, '')
        )
    },{//12
        title: '人月次',
        key: 'manMonthTimes',
        dataIndex: 'manMonthTimes',
        width: "100px",
        render: (data) => (
            isEmpty(data)
        )
    } ,  {//13
        title: '服务费',
        key: 'serviceFee',
        dataIndex: 'serviceFee',
        width: "100px",
        render: (data) => (
            formatMoney(data, 2, '')
        )
    } , {//14
        title: ' 人均服务费（服务费/人月次）',
        key: 'serviceFeeAvg',
        dataIndex: 'serviceFeeAvg',
        width: "120px",
        render: (data) => (
            formatMoney(data, 2, '')
        )
    } ,  {//15
        title: '垫付金额',
        key: 'advancePaymentFee',
        dataIndex: 'advancePaymentFee',
        width: "100px",
        render: (data) => (
            formatMoney(data, 2, '')
        )
    } ,{//16
        title: '请款总金额',
        key: 'totalAmount',
        dataIndex: 'totalAmount',
        width: "150px",
        render: (data) => (
            formatMoney(data, 2, '')
        )
    } , {//17
        // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
        title: '社保缴费月 （操作月）',
        key: 'socialPaymentMonth',
        dataIndex: 'socialPaymentMonth',
        width: "100px",
        render: (data) => (
            isEmpty(data)
        )

    },  {//18
        title: '请款提交人',
        key: 'submitterId',
        dataIndex: 'submitterId',
        width: "170px",
        render: (data) => {
            if (!data || params.userMapData.length < 1) {
                return '/';
            }
            return <span> {`${params.userMapData[data].name || ''}/${params.userMapData[data].phone || ''}`}</span>;
        }
    } , {//19
        title: '审批经手人',
        key: 'handleUserList',
        dataIndex: null,
        width: "300px",
        render: (data) => {
            if (!data.handleUserList || params.userMapData.length < 1) {
                return '/';
            }

            const style = {
                whiteSpace: 'nowrap',
                width: '250px',
                color: 'green',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            const tooltipData: Array<JSX.Element> = [];
            const handleUserList = data.handleUserList;
            // ceo部门id
            const ceoOrganizationId = data.ceoOrganizationId;
            // CSO部门id
            const csoOrganizationId = data.csoPositionId;

            const tooltipTextId = handleUserList[0];

            const positionString = params.userMapData[tooltipTextId].positionString;
            const organizationId = params.userMapData[tooltipTextId].organizationId;
            const positionId = params.userMapData[tooltipTextId].positionId;
            const tooltipText = (organizationId == ceoOrganizationId) ? 'CEO' : ((positionId == csoOrganizationId) ? 'CSO' : `${params.userMapData[tooltipTextId].name || ''}(${positionString || ''})/${params.userMapData[tooltipTextId].phone || ''}`)
            handleUserList.map(person => {
                // ceo不显示姓名和手机号
                if (params.userMapData[person].organizationId == ceoOrganizationId) {
                    tooltipData.push(<p className="approvePass">CEO</p>)
                } else if (params.userMapData[person].positionId == csoOrganizationId) {
                    tooltipData.push(<p className="approvePass">CSO</p>)
                } else {
                    tooltipData.push(<p className="approvePass">
                        {`${params.userMapData[person].name || ''}(${params.userMapData[person].positionString || ''})/${params.userMapData[person].phone || ''}`}</p>)
                }

            })
            return (
                <Tooltip placement="bottomLeft" title={tooltipData}>
                    <div style={style}>{tooltipText}</div>
                </Tooltip>

            );
        }
    },{//20
        title: '审批状态',
        key: 'status',
        width: "100px",
        fixed:"right",
        render: (data) => {
            // 0：待审批 1：审批通过 2：审批驳回 3：已取消
            let lastApprover = '/';
            // ceo部门id
            const ceoOrganizationId = data.ceoOrganizationId;
            // 财务部门id
            const financeOrganizationId = data.financeOrganizationId;
            // CSO部门id
            const csoOrganizationId = data.csoPositionId;

            // 最后审批人 部门id
            const lastApproverDepartment = data.lastApproverDepartment;
            const lastApproverId = data.lastApprover;
            const lastApproverData = params.userMapData[lastApproverId] || '';

            if (lastApproverId && params.userMapData) {
                if (lastApproverDepartment == ceoOrganizationId || lastApproverData.organizationId == ceoOrganizationId) {
                    lastApprover = 'CEO'
                } else if (lastApproverDepartment == financeOrganizationId || lastApproverData.organizationId == financeOrganizationId) {
                    lastApprover = '财务部'
                } else if (lastApproverDepartment == csoOrganizationId || lastApproverData.positionId == csoOrganizationId) {
                    lastApprover = 'CSO'
                } else {
                    lastApprover = `${lastApproverData.name || ''}/${lastApproverData.phone || ''}`;
                }

            }

            const style = {
                whiteSpace: 'nowrap',
                width: '80px',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                color: 'green',
            }
            const text  = <Tooltip placement="topLeft" title={lastApprover}><span style={style}>{lastApprover}</span></Tooltip>
            switch (data.status) {
                case 0: {
                    return <div><p style={{ color: 'green' }}>{text}</p><p>待审批</p></div>
                }
                case 1: {
                    return <div><p style={{ color: 'green' }}>{text}</p><p>审批通过</p></div>
                }
                case 2: {
                    return <div><p style={{ color: '#999' }}>{text}</p>
                        <p><a style={{ color: 'red' }} onClick={e => params.showRejectReason(data)}>审批驳回</a></p></div>
                }
                case 3: {
                    return <p>已取消</p>
                }
                default: {
                    return '/';
                }
            }

        }
    } , {//21
        title: '导出状态',
        key: 'exportWaitpayStatus',

        dataIndex: 'exportWaitpayStatus',

        width: "100px",
        fixed: 'right',
        render: (data) => {
            // 1已支付 2未支付
            return data == 1 ? '已导出' : '未导出'
        }
    },{//22
        title: '支付状态',
        key: 'isPay',
        dataIndex: 'isPay',
        width: "100px",
        fixed: 'right',
        render: (data) => {
            // 1已支付 2未支付
            return data == 1 ? '已支付' : '未支付'
        }
    }, {//23
        title: '操作',
        key: 'action',
        width: "150px",
        fixed: 'right',

        render: (data, index) => {

            if (params.role == 3) {
                const {
                    isPay,
                    hasPicture
                } = data;
                // 0：待审批 1：审批通过 2：审批驳回 3：已取消
                const cancelHtml: Array<JSX.Element> = [];
                if (isPay != 1) {
                    if (data.status != 1) {
                        cancelHtml.push(<a style={{ display: 'block' }} onClick={(e) => { e.preventDefault(); params.cancelCashout({ orderCode: data.code }); }}>取消请款</a>);
                    }

                }
                switch (data.status) {
                    case 0: {
                        return <div>
                            <a style={{ marginRight: '8px' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    params.setSessionStorageParams({
                                        params: { orderCode: data.code }
                                    });
                                }}>查看</a>
                            {cancelHtml}

                        </div>
                    }
                    case 1: {
                        return <div >
                            <a style={{ marginRight: '8px' }} onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: data.code } }); }}>查看</a>
                            <br />{hasPicture === 1 && <a key={index} onClick={(e) => { e.preventDefault(); params.showProvePicture({ params: { orderCode: data.code } }); }}>打款证明图片</a>}
                            {cancelHtml}
                        </div>
                    }
                    case 2: {
                        return <div>
                            <a style={{ marginRight: '8px' }} onClick={(e) => {
                                e.preventDefault();
                                params.setSessionStorageParams({
                                    params: { orderCode: data.code },
                                    url: `${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`
                                });
                            }}>查看并重新提交</a>
                            {cancelHtml}
                        </div>
                    }
                    case 3: {
                        return <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: data.code } }); }}>查看</a>
                    }
                    default: {
                        return '';
                    }
                }
            } else if (params.role === 4) {
                // 是否支付
                if (data.isPay == 1) {
                    return (<div>
                        <a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: data.code } }); }}>查看</a>
                        <br />
                        <a href="#" onClick={(e) => { e.preventDefault(); params.editPlayShallInfo(data); }}>编辑打款信息</a>
                    </div>)
                } else {
                    return (<a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: data.code }, url: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/entry` }); }}>打款信息录入</a>)
                }
            } else {
                return (<a onClick={(e) => { e.preventDefault(); params.setSessionStorageParams({ params: { orderCode: data.code } }); }}>查看</a>);
            }

        }
    }
]


