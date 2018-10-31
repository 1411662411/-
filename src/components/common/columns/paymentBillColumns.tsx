import { Tooltip } from 'antd';
import * as React from 'react';
import {formatMoney} from '../../../util/util';
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
 * 付款清单（客户维度）
 * @param data {Object} 参数
 * @return {Array}
 */
export const columnsCustomer: columns = (data) => [
    {
        title: '序号',
        key: 'id',
        width: 100,
        fixed: 'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '单位名称',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 400,
        fixed: 'left',
    },
    {
        title: '所属客服',
        dataIndex: 'customerService',
        key: 'customerService',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '分公司',
        dataIndex: 'branchOffice',
        key: 'branchOffice',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '所属销售',
        dataIndex: 'salesman',
        key: 'salesman',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '客户到款日',
        dataIndex: 'customBillDate',
        key: 'customBillDate',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '月份',
        dataIndex: 'month',
        key: 'month',
        width: 100,
        // fixed: 'left',
    },
    {
        title: '参保城市',
        dataIndex: 'insuredCity',
        key: 'insuredCity',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>人数<br />(合计:{data.peopleNumber})</span>,
        dataIndex: 'peopleNumber',
        key: 'peopleNumber',
        width: 100,
        // fixed: 'left',
    },
    {
        title: <span>人次<br />(合计: {data.personTime})</span>,
        dataIndex: 'personTime',
        key: 'personTime',
        width: 100,
        // fixed: 'left',
    },
    {
        title: <span>社保<br />(合计: {formatMoney(data.social,2,'')})</span>,
        dataIndex: 'social',
        key: 'social',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>公积金<br />(合计: {formatMoney(data.fund,2,'')})</span>,
        dataIndex: 'fund',
        key: 'fund',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>残障金<br />(合计: {formatMoney(data.disability,2,'')} )</span>,
        dataIndex: 'disability',
        key: 'disability',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>代发工资<br />(合计:{formatMoney(data.payrollCredit,2,'')})</span>,
        dataIndex: 'payrollCredit',
        key: 'payrollCredit',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>采暖费<br />(合计:{formatMoney(data.heating,2,'')})</span>,
        dataIndex: 'heating',
        key: 'heating',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>滞纳金<br />(合计:{formatMoney(data.overduePayment,2,'')})</span>,
        dataIndex: 'overduePayment',
        key: 'overduePayment',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>合同工本费<br />(合计:{formatMoney(data.contractFee,2,'')})</span>,
        dataIndex: 'contractFee',
        key: 'contractFee',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>小计<br />(合计:{formatMoney(data.subtotal,2,'')})</span>,
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>服务费<br />(合计:{formatMoney(data.serviceFee,2,'')})</span>,
        dataIndex: 'serviceFee',
        key: 'serviceFee',
        width: 150,
    },
    {
        title: <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
        dataIndex: 'total',
        key: 'total2',
        width: 150,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (data) => {
            data = isEmpty(data);
            if (data === '/') {
                return <span>{data}</span>
            }
            else {
                const style = {
                    whiteSpace: 'nowrap',
                    width: '80px',
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
    },
    {
        title:  <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
        dataIndex: 'total',
        key: 'total',
        width: 150,
        fixed: 'right',
    },
]


/**
 * 垫款明细
 * @param data {Object} 参数
 * @return {Array}
 */
export const columnsAdvance: columns = (data) => [
    {
        title: '序号',
        key: 'id',
        width: 100,
        fixed: 'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '单位名称',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 400,
        fixed: 'left',
    },
    {
        title: '所属客服',
        dataIndex: 'customService',
        key: 'customService',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '分公司',
        dataIndex: 'businessArea',
        key: 'businessArea',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '所属销售',
        dataIndex: 'serviceManager',
        key: 'serviceManager',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '客户到款日',
        dataIndex: 'customBillDate',
        key: 'customBillDate',
        width: 150,
        // fixed: 'left',
    },
    {
        title: '月份',
        dataIndex: 'month',
        key: 'month',
        width: 100,
        // fixed: 'left',
    },
    {
        title: '参保城市',
        dataIndex: 'insuredCity',
        key: 'insuredCity',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>人数<br />(合计:{data.peopleNumber})</span>,
        dataIndex: 'peopleNumber',
        key: 'peopleNumber',
        width: 100,
        // fixed: 'left',
    },
    {
        title: <span>人次<br />(合计: {data.personTime})</span>,
        dataIndex: 'personTime',
        key: 'personTime',
        width: 100,
        // fixed: 'left',
    },
    {
        title: <span>社保<br />(合计: {formatMoney(data.social,2,'')})</span>,
        dataIndex: 'social',
        key: 'social',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>公积金<br />(合计: {formatMoney(data.fund,2,'')})</span>,
        dataIndex: 'fund',
        key: 'fund',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>残障金<br />(合计: {formatMoney(data.disability,2,'')} )</span>,
        dataIndex: 'disability',
        key: 'disability',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>代发工资<br />(合计:{formatMoney(data.payrollCredit,2,'')})</span>,
        dataIndex: 'payrollCredit',
        key: 'payrollCredit',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>采暖费<br />(合计:{formatMoney(data.heating,2,'')})</span>,
        dataIndex: 'heating',
        key: 'heating',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>滞纳金<br />(合计:{formatMoney(data.overduePayment,2,'')})</span>,
        dataIndex: 'overduePayment',
        key: 'overduePayment',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>合同工本费<br />(合计:{formatMoney(data.contractFee,2,'')})</span>,
        dataIndex: 'contractFee',
        key: 'contractFee',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>小计<br />(合计:{formatMoney(data.subtotal,2,'')})</span>,
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 150,
        // fixed: 'left',
    },
    {
        title: <span>服务费<br />(合计:{formatMoney(data.serviceFee,2,'')})</span>,
        dataIndex: 'serviceFee',
        key: 'serviceFee',
        width: 150,
    },
    {
        title: <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
        dataIndex: 'total',
        key: 'total2',
        width: 150,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (data) => {
            data = isEmpty(data);
            if (data === '/') {
                return <span>{data}</span>
            }
            else {
                const style = {
                    whiteSpace: 'nowrap',
                    width: '80px',
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
    },
    {
        title:  <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
        dataIndex: 'total',
        key: 'total',
        width: 100,
        fixed: 'right',
    },
]



/**
 * 付款账单（人月次维度明细表）
 */
export const columnsPersonMonthNum: columns = (data) => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            fixed: 'left',
            render: (text, record, index) => index + 1,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            fixed: 'left',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            fixed: 'left',
        },
        {
            title: '身份证号',
            dataIndex: 'identityCard',
            key: 'identityCard',
            width: 250,
            // fixed: 'left',
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 350,
            // fixed: 'left',
        },
        {
            title: '顾问',
            dataIndex: 'adviser',
            key: 'adviser',
            width: 100,
            // fixed: 'left',
        },
        {
            title: '参保地',
            dataIndex: 'insuredPlace',
            key: 'insuredPlace',
            width: 180,
            // fixed: 'left',
        },
        {
            title: '户籍性质',
            dataIndex: 'householdType',
            key: 'householdType',
            width: 180,
            // fixed: 'left',
        },
        {
            title: '增员派单时间',
            dataIndex: 'increaseSendBillTime',
            key: 'increaseSendBillTime',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '社保费用所属月份',
            dataIndex: 'socialFeeMonth',
            key: 'socialFeeMonth',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '社保起做时间',
            dataIndex: 'socialStartTime',
            key: 'socialStartTime',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '养老基数',
            dataIndex: 'pensionBase',
            key: 'pensionBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '医疗基数',
            dataIndex: 'medicalBase',
            key: 'medicalBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '大病基数',
            dataIndex: 'illnessBase',
            key: 'illnessBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '失业基数',
            dataIndex: 'unemployedBase',
            key: 'unemployedBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '生育基数',
            dataIndex: 'birthBase',
            key: 'birthBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '工伤基数',
            dataIndex: 'injuryBase',
            key: 'injuryBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: <span>养老单位金额<br />(合计:{formatMoney(data.pensionOffice,2,'')})</span>,
            dataIndex: 'pensionOffice',
            key: 'pensionOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>养老个人金额<br />(合计:{formatMoney(data.pensionPerson,2,'')})</span>,
            dataIndex: 'pensionPerson',
            key: 'pensionPerson',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>医疗单位金额<br />(合计:{formatMoney(data.medicalOffice,2,'')})</span>,
            dataIndex: 'medicalOffice',
            key: 'medicalOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>医疗个人金额<br />(合计:{formatMoney(data.medicalPerson,2,'')})</span>,
            dataIndex: 'medicalPerson',
            key: 'medicalPerson',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>大病单位金额<br />(合计:{formatMoney(data.illnessOffice,2,'')})</span>,
            dataIndex: 'illnessOffice',
            key: 'illnessOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>大病个人金额<br />(合计:{formatMoney(data.illnessPerson,2,'')})</span>,
            dataIndex: 'illnessPerson',
            key: 'illnessPerson',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>失业单位金额<br />(合计:{formatMoney(data.unemployedOffice,2,'')})</span>,
            dataIndex: 'unemployedOffice',
            key: 'unemployedOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>失业个人金额<br />(合计:{formatMoney(data.unemployedPerson,2,'')})</span>,
            dataIndex: 'unemployedPerson',
            key: 'unemployedPerson',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>生育单位金额<br />(合计:{formatMoney(data.birthOffice,2,'')})</span>,
            dataIndex: 'birthOffice',
            key: 'birthOffice',
            width:180,
            // fixed: 'left',
        },
        {
            title: <span>工伤单位金额<br />(合计:{formatMoney(data.injuryOffice,2,'')})</span>,
            dataIndex: 'injuryOffice',
            key: 'injuryOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: '公积金起做时间',
            dataIndex: 'fundStartTime',
            key: 'fundStartTime',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '公积金费用所属月份',
            dataIndex: 'fundFeeMonth',
            key: 'fundFeeMonth',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '公积金基数',
            dataIndex: 'fundBase',
            key: 'fundBase',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '公积金单位比例',
            dataIndex: 'fundOfficeRatio',
            key: 'fundOfficeRatio',
            width: 150,
            // fixed: 'left',
        },
        {
            title: '公积金个人比例',
            dataIndex: 'fundPersonRatio',
            key: 'fundPersonRatio',
            width: 150,
            // fixed: 'left',
        },
        {
            title: <span>公积金单位金额<br />(合计:{formatMoney(data.fundOffice,2,'')})</span>,
            dataIndex: 'fundOffice',
            key: 'fundOffice',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>公积金个人金额<br />(合计:{formatMoney(data.fundPerson,2,'')})</span>,
            dataIndex: 'fundPerson',
            key: 'fundPerson',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>社保小计<br />(合计:{formatMoney(data.socialSubtotal,2,'')})</span>,
            dataIndex: 'socialSubtotal',
            key: 'socialSubtotal',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>公积金小计<br />(合计:{formatMoney(data.fundSubtotal,2,'')})</span>,
            dataIndex: 'fundSubtotal',
            key: 'fundSubtotal',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>残保金<br />(合计:{formatMoney(data.residualPremium,2,'')})</span>,
            dataIndex: 'residualPremium',
            key: 'residualPremium',
            width: 180,
            // fixed: 'left',
        },
       {
            title: <span>采暖费<br />(合计:{formatMoney(data.heating,2,'')})</span>,
            dataIndex: 'heating',
            key: 'heating',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>滞纳金<br />(合计:{formatMoney(data.overduePayment,2,'')})</span>,
            dataIndex: 'overduePayment',
            key: 'overduePayment',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>合同工本其它费用<br />(合计:{formatMoney(data.contractOtherFee,2,'')})</span>,
            dataIndex: 'contractOtherFee',
            key: 'contractOtherFee',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>小计<br />(合计:{formatMoney(data.subtotal,2,'')})</span>,
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: 180,
            // fixed: 'left',
        },
        {
            title: <span>服务费<br />(合计:{formatMoney(data.serviceFee,2,'')})</span>,
            dataIndex: 'serviceFee',
            key: 'serviceFee',
            width: 180,
            // fixed: 'left',
        },
         {
            title: <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
            dataIndex: 'total',
            key: 'total3',
            width: 180,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 100,
            render: (data) => {
                data = isEmpty(data);
                if (data === '/') {
                    return <span>{data}</span>
                }
                else {
                    const style = {
                        whiteSpace: 'nowrap',
                        width: '80px',
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
        },
        {
            title: '社保编号',
            dataIndex: 'socialCode',
            key: 'socialCode',
            width: 100,
            // fixed: 'left',
        },
        {
            title: '公积金编号',
            dataIndex: 'fundCode',
            key: 'fundCode',
            width: 100,
            // fixed: 'left',
        },
        {
            title: '医保个账',
            dataIndex: 'mipa',
            key: 'mipa',
            width: 100,
        },
        {
            title: '住院基本医疗',
            dataIndex: 'hospitalBaseMedical',
            key: 'hospitalBaseMedical',
            width: 150,
        },
        {
            title: '住院补充医疗',
            dataIndex: 'hospitalAdditionalMedical',
            key: 'hospitalAdditionalMedical',
            width: 150,
        },
        {
            title: '门诊基本医疗',
            dataIndex: 'outpatientBaseMedical',
            key: 'outpatientBaseMedical',
            width: 150,
        },
        {
            title: '医保个账单位金额',
            dataIndex: 'mipaOffice',
            key: 'mipaOffice',
            width: 150,
        },
        {
            title: '医保个账个人金额',
            dataIndex: 'mipaPerson',
            key: 'mipaPerson',
            width: 150,
        },
        {
            title: '住院基本医疗单位金额',
            dataIndex: 'hospitalBaseMedicalOffice',
            key: 'hospitalBaseMedicalOffice',
            width: 170,
        },
        {
            title: '住院补充医疗单位金额',
            dataIndex: 'hospitalAdditionalMedicalOffice',
            key: 'hospitalAdditionalMedicalOffice',
            width: 170,
        },
        {
            title: '门诊医疗单位金额',
            dataIndex: 'outpatientMedicalOffice',
            key: 'outpatientMedicalOffice',
            width: 150,
        },
        {
            title: '门诊医疗个人金额',
            dataIndex: 'outpatientMedicalPerson',
            key: 'outpatientMedicalPerson',
            width: 150,
        },
        {
            title: '公积金基数',
            dataIndex: 'fundBase1',
            key: 'fundBase1',
            width: 100,
        },
        {
            title: '公积金单位比例',
            dataIndex: 'fundOfficeRatio1',
            key: 'fundOfficeRatio1',
            width: 150,
        },
        {
            title: '公积金个人比例',
            dataIndex: 'fundPersonRatio1',
            key: 'fundPersonRatio1',
            width: 150,
        },
        {
            title: '公积金单位金额',
            dataIndex: 'fundOffice1',
            key: 'fundOffice1',
            width: 150,
        },
        {
            title: '公积金个人金额',
            dataIndex: 'fundPerson1',
            key: 'fundPerson1',
            width: 150,
        },
        {
            title: '补充公积金基数',
            dataIndex: 'additionalFundBase',
            key: 'additionalFundBase',
            width: 150,
        },
        {
            title: '补充公积金单位比例',
            dataIndex: 'additionalFundOfficeRatio',
            key: 'additionalFundOfficeRatio',
            width: 180,
        },
        {
            title: '补充公积金个人比例',
            dataIndex: 'additionalFundPersonRatio',
            key: 'additionalFundPersonRatio',
            width: 180,
        },
        {
            title: '补充公积金单位金额',
            dataIndex: 'additionalFundOffice',
            key: 'additionalFundOffice',
            width: 180,
        },
        {
            title: '补充公积金个人金额',
            dataIndex: 'additionalFundPerson',
            key: 'additionalFundPerson',
            width: 180,
        },
        {
            title: <span>合计<br />(合计:{formatMoney(data.total,2,'')})</span>,
            dataIndex: 'total',
            key: 'total2',
            width: 180,
            fixed: 'right',
        },
    ]
}


