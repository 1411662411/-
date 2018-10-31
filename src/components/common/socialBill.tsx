/**
 * Created by yangws on 2018/4/02.
 */
import React, { Component } from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import {formatMoney} from '../../util/util';
import {
    Input,
    Table,
    Alert,
    Spin,
    Tooltip
} from 'antd';
import { total } from '../../action/businessComponents/chapterListActions';
interface bill {
    list: any[],
    total: any[],
    isError?: boolean;
}
interface SocialBillProps {
    type: 1|2|3|4|5|6; // 账单类型 1会员订单 2 社保订单 3商保订单 4社保补差 5SP社保订单 6多多订单
    dataSource?: bill;
    callback?: any;
   
}
interface columns {
    (data?): any;
}
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};
/**
 * SP账单Columns
 * @param data {Object} 参数
 * @return {Array}
 */
export const columnsSpBill: columns = (data) => [
    {
        title: '序号',
        // dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed:'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '失败原因',
        dataIndex: 'errMsg',
        key: 'errMsg',
        width: 200,
        fixed:'left',
        render:(data)=>{
            const style = {
                whiteSpace: 'nowrap',
                width: '180px',
                color: 'red',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="bottomLeft" title={data}>
                    <div style={style}>{data}</div>
                </Tooltip>

            );
        }
        
    },
    {
        title: '状态',
        dataIndex: 'socialStatus',
        key: 'socialStatus',
        width: 50,
    },
    {
        title: '客户名称',
        dataIndex: 'cname',
        key: 'cname',
        width: 200,
    },
    {
        title: '姓名',
        dataIndex: 'userSocialName',
        key: 'userSocialName',
        width: 100,
    },
    {
        title: '身份证号',
        dataIndex: 'certificateNumber',
        key: 'certificateNumber',
        width: 170,
    },
    {
        title: '参保地',
        dataIndex: 'policyName',
        key: 'policyName',
        width: 150,
    },
    {
        title: '户籍性质',
        dataIndex: 'householdName',
        key: 'householdName',
        width: 100,
    },
    {
        title: '社保起做时间',
        dataIndex: 'socialStartMonth',
        key: 'socialStartMonth',
        width: 100,
        render: (data)=>{
            return data?data.substr(0,10):'/'
        }
    },{
        title: '公积金起做时间',
        dataIndex: 'fundStartMonth',
        key: 'fundStartMonth',
        width: 120,
        render: (data)=>{
            return data?data.substr(0,10):'/'
        }
    },
    {
        title: '帐单年月',
        dataIndex: 'insuranceFeesMonth',
        key: 'insuranceFeesMonth',
        width: 100,
        render: (data)=>{
            return data?data.substr(0,7):'/'
        }
    },
    {
        title: '社保费用所属月（缴纳月）',
        dataIndex: 'socialMonth',
        key: 'socialMonth',
        width: 100,
        render: (data)=>{
            return data?data.substr(0,10):'/'
        }
    },
    {
        title: '公积金费用所属月（缴纳月）',
        dataIndex: 'fundMonth',
        key: 'fundMonth',
        width: 100,
        render: (data)=>{
            return data?data.substr(0,10):'/'
        }
    },
    {
        title: '养老企业基数',
        dataIndex: 'pensionCompanyBase',
        key: 'pensionCompanyBase',
        width: 100,
    },
    {
        title: '养老企业比例',
        dataIndex: 'pensionCompanyPro',
        key: 'pensionCompanyPro',
        width: 100,
    },
    {
        title: <span>养老企业汇缴<br /><b className="total">(合计: {formatMoney(data.pensionCompanyAmount,2,'')})</b></span>,
        dataIndex: 'pensionCompanyAmount',
        key: 'pensionCompanyAmount',
        width: 120,
    },
    {
        title: '养老个人基数',
        dataIndex: 'pensionPersonBase',
        key: 'pensionPersonBase',
        width: 100,
    },
    {
        title: '养老个人比例',
        dataIndex: 'pensionPersonPro',
        key: 'pensionPersonPro',
        width: 100,
    },
    {
        title: <span>养老个人汇缴<br /><b className="total">(合计: {formatMoney(data.pensionPersonAmount,2,'')})</b></span>,
        dataIndex: 'pensionPersonAmount',
        key: 'pensionPersonAmount',
        width: 120,
    },
    {
        title: <span>养老合计<br /><b className="total">(合计: {formatMoney(data.pensionTotalAmount,2,'')})</b></span>,
        dataIndex: 'pensionTotalAmount',
        key: 'pensionTotalAmount',
        width: 120,
    },
    {
        title: '医疗企业基数',
        dataIndex: 'medicalCompanyBase',
        key: 'medicalCompanyBase',
        width: 100,
    },
    {
        title: '医疗企业比例',
        dataIndex: 'medicalCompanyPro',
        key: 'medicalCompanyPro',
        width: 100,
    },
    {
        title: <span>医疗企业大病<br /><b className="total">(合计: {formatMoney(data.medicalCompanyIllness,2,'')})</b></span>,
        dataIndex: 'medicalCompanyIllness',
        key: 'medicalCompanyIllness',
        width: 120,
    },
    {
        title: <span>医疗企业汇缴<br /><b className="total">(合计: {formatMoney(data.medicalCompanyAmount,2,'')})</b></span>,
        dataIndex: 'medicalCompanyAmount',
        key: 'medicalCompanyAmount',
        width: 120,
    },
    {
        title: '医疗个人基数',
        dataIndex: 'medicalPersonBase',
        key: 'medicalPersonBase',
        width: 100,
    },
    {
        title: '医疗个人比例',
        dataIndex: 'medicalPersonPro',
        key: 'medicalPersonPro',
        width: 100,
    },
    {
        title: <span>医疗个人大病<br /><b className="total">(合计: {formatMoney(data.medicalPersonIllness,2,'')})</b></span>,
        dataIndex: 'medicalPersonIllness',
        key: 'medicalPersonIllness',
        width: 120,
    },
    {
        title: <span>医疗个人汇缴<br /><b className="total">(合计: {formatMoney(data.medicalPersonAmount,2,'')})</b></span>,
        dataIndex: 'medicalPersonAmount',
        key: 'medicalPersonAmount',
        width: 120,
    },
    {
        title: <span>医疗合计<br /><b className="total">(合计: {formatMoney(data.medicalTotalAmount,2,'')})</b></span>,
        dataIndex: 'medicalTotalAmount',
        key: 'medicalTotalAmount',
        width: 100,
    },
    {
        title: '失业企业基数',
        dataIndex: 'unemploymentCompanyBase',
        key: 'unemploymentCompanyBase',
        width: 100,
    },
    {
        title: '失业企业比例',
        dataIndex: 'unemploymentCompanyPro',
        key: 'unemploymentCompanyPro',
        width: 100,
    },
    {
        title: <span>失业单位汇缴<br /><b className="total">(合计: {formatMoney(data.unemploymentCompanyAmount,2,'')})</b></span>,
        dataIndex: 'unemploymentCompanyAmount',
        key: 'unemploymentCompanyAmount',
        width: 120,
    },
    {
        title: '失业个人基数',
        dataIndex: 'unemploymentPersonBase',
        key: 'unemploymentPersonBase',
        width: 100,
    },
    {
        title: '失业个人比例',
        dataIndex: 'unemploymentPersonPro',
        key: 'unemploymentPersonPro',
        width: 100,
    },
    {
        title: <span>失业个人汇缴<br /><b className="total">(合计: {formatMoney(data.unemploymentPersonAmount,2,'')})</b></span>,
        dataIndex: 'unemploymentPersonAmount',
        key: 'unemploymentPersonAmount',
        width: 100,
    },
    {
        title: <span>失业合计<br /><b className="total">(合计: {formatMoney(data.unemploymentTotalAmount,2,'')})</b></span>,
        dataIndex: 'unemploymentTotalAmount',
        key: 'unemploymentTotalAmount',
        width: 100,
    },
    {
        title: '生育企业基数',
        dataIndex: 'birthCompanyBase',
        key: 'birthCompanyBase',
        width: 100,
    },
    {
        title: '生育企业比例',
        dataIndex: 'birthCompanyPro',
        key: 'birthCompanyPro',
        width: 100,
    },
    {
        title: <span>生育企业汇缴<br /><b className="total">(合计: {formatMoney(data.birthCompanyAmount,2,'')})</b></span>,
        dataIndex: 'birthCompanyAmount',
        key: 'birthCompanyAmount',
        width: 100,
    },
    {
        title: '工伤企业基数',
        dataIndex: 'injuryCompanyBase',
        key: 'injuryCompanyBase',
        width: 100,
    },
    {
        title: '工伤企业比例',
        dataIndex: 'injuryCompanyPro',
        key: 'injuryCompanyPro',
        width: 100,
    },
    {
        title: <span>工伤企业汇缴<br /><b className="total">(合计: {formatMoney(data.injuryCompanyAmount,2,'')})</b></span>,
        dataIndex: 'injuryCompanyAmount',
        key: 'injuryCompanyAmount',
        width: 100,
    },
    {
        title: <span>单位社保<br /><b className="total">(合计: {formatMoney(data.socialCompanyAmount,2,'')})</b></span>,
        dataIndex: 'socialCompanyAmount',
        key: 'socialCompanyAmount',
        width: 120,
    },
    {
        title: <span>个人社保<br /><b className="total">(合计: {formatMoney(data.socialPersonAmount,2,'')})</b></span>,
        dataIndex: 'socialPersonAmount',
        key: 'socialPersonAmount',
        width: 120,
    },
    {
        title: <span>社保合计<br /><b className="total">(合计: {formatMoney(data.socialAmount,2,'')})</b></span>,
        dataIndex: 'socialAmount',
        key: 'socialAmount',
        width: 120,
    },
    {
        title: '公积金企业基数',
        dataIndex: 'fundCompanyBase',
        key: 'fundCompanyBase',
        width: 120,
    },
    {
        title: '公积金企业比例',
        dataIndex: 'fundCompanyPro',
        key: 'fundCompanyPro',
        width: 120,
    },
    {
        title: <span>公积金企业汇缴<br /><b className="total">(合计: {formatMoney(data.fundCompanyAmount,2,'')})</b></span>,
        dataIndex: 'fundCompanyAmount',
        key: 'fundCompanyAmount',
        width: 120,
    },
    {
        title: '公积金个人基数',
        dataIndex: 'fundPersonBase',
        key: 'fundPersonBase',
        width: 120,
    },
    {
        title: '公积金个人比例',
        dataIndex: 'fundPersonPro',
        key: 'fundPersonPro',
        width: 120,
    },{
        title: <span>公积金个人汇缴<br /><b className="total">(合计: {formatMoney(data.fundPersonAmount,2,'')})</b></span>,
        dataIndex: 'fundPersonAmount',
        key: 'fundPersonAmount',
        width: 120,
    },
    {
        title: <span>公积金合计<br /><b className="total">(合计: {formatMoney(data.fundTotalAmount,2,'')})</b></span>,
        dataIndex: 'fundTotalAmount',
        key: 'fundTotalAmount',
        width: 120,
    },
    {
        title: <span>社保公积金小计<br /><b className="total">(合计: {formatMoney(data.socialFundTotalAmount,2,'')})</b></span>,
        dataIndex: 'socialFundTotalAmount',
        key: 'socialFundTotalAmount',
        width: 120,
    },
    {
        title: <span>残保金企业缴纳<br /><b className="total">(合计: {formatMoney(data.disabilityGoldAmount,2,'')})</b></span>,
        dataIndex: 'disabilityGoldAmount',
        key: 'disabilityGoldAmount',
        width: 120,
    },
    {
        title: <span>滞纳金<br /><b className="total">(合计: {formatMoney(data.delayFee,2,'')})</b></span>,
        dataIndex: 'delayFee',
        key: 'delayFee',
        width: 100,
    },
    {
        title: <span>档案费<br /><b className="total">(合计: {formatMoney(data.archivesFee,2,'')})</b></span>,
        dataIndex: 'archivesFee',
        key: 'archivesFee',
        width: 100,
    },
    {
        title: <span>制卡费<br /><b className="total">(合计: {formatMoney(data.cardFee,2,'')})</b></span>,
        dataIndex: 'cardFee',
        key: 'cardFee',
        width: 100,
    },
    {
        title: <span>工会费<br /><b className="total">(合计: {formatMoney(data.unionFee,2,'')})</b></span>,
        dataIndex: 'unionFee',
        key: 'unionFee',
        width: 100,
    },
    {
        title: <span>采暖费<br /><b className="total">(合计: {formatMoney(data.heatingFee,2,'')})</b></span>,
        dataIndex: 'heatingFee',
        key: 'heatingFee',
        width: 100,
    },
    {
        title: <span>其它费用<br /><b className="total">(合计: {formatMoney(data.otherFee,2,'')})</b></span>,
        dataIndex: 'otherFee',
        key: 'otherFee',
        width: 100,
        
    },
    {
        title: <span>小计（不含服务费）<br /><b className="total">(合计: {formatMoney(data.socialSecurityBureauAmount,2,'')})</b></span>,
        dataIndex: 'socialSecurityBureauAmount',
        key: 'socialSecurityBureauAmount',
        width: 100,
    },
    {
        title: <span>服务费<br /><b className="total">(合计: {formatMoney(data.serviceFee,2,'')})</b></span>,
        dataIndex: 'serviceFee',
        key: 'serviceFee',
        width: 100,
    },
    {
        title: <span>合计<br /><b className="total">(合计: {formatMoney(data.totalAmount,2,'')})</b></span>,
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: 130,
    },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
        render:(data)=>{
            const style = {
                whiteSpace: 'nowrap',
                width: '180px',
                color: 'green',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="bottomLeft" title={data}>
                    <div style={style}>{data}</div>
                </Tooltip>

            );
        }
    },
    {
        title: '社保编号',
        dataIndex: 'socialNumber',
        key: 'socialNumber',
        width: 100,
    },
    {
        title: '公积金编号',
        dataIndex: 'fundNumber',
        key: 'fundNumber',
        width: 100,
    },
    {
        title: '医保个账',
        dataIndex: 'medicalInsuranceAmount',
        key: 'medicalInsuranceAmount',
        width: 100,
    },
    {
        title: <span>住院基本医疗</span>,
        dataIndex: 'hospitalizationBaseAmount',
        key: 'hospitalizationBaseAmount',
        width: 100,
    },
    {
        title: '住院补充医疗',
        dataIndex: 'hospitalizationSupAmount',
        key: 'hospitalizationSupAmount',
        width: 100,
    },
    {
        title: '门诊基本医疗',
        dataIndex: 'outpatientBaseAmount',
        key: 'outpatientBaseAmount',
        width: 100,
    },
    {
        title: <span>医保个账单位金额<br /><b className="total">(合计: {formatMoney(data.medicalInsuranceCompanyAmount,2,'')})</b></span>,
        dataIndex: 'medicalInsuranceCompanyAmount',
        key: 'medicalInsuranceCompanyAmount',
        width: 100,
    },
    {
        title: <span>医保个账个人金额<br /><b className="total">(合计: {formatMoney(data.medicalInsurancePersonAmount,2,'')})</b></span>,
        dataIndex: 'medicalInsurancePersonAmount',
        key: 'medicalInsurancePersonAmount',
        width: 100,
    },
    {
        title: <span>住院基本医疗单位金额<br /><b className="total">(合计: {formatMoney(data.hospitalizationBaseCompanyAmount,2,'')})</b></span>,
        dataIndex: 'hospitalizationBaseCompanyAmount',
        key: 'hospitalizationBaseCompanyAmount',
        width: 100,
    },
    {
        title: <span>住院补充医疗单位金额<br /><b className="total">(合计: {formatMoney(data.hospitalizationSupCompanyAmount,2,'')})</b></span>,
        dataIndex: 'hospitalizationSupCompanyAmount',
        key: 'hospitalizationSupCompanyAmount',
        width: 100,
    },
    {
        title: <span>门诊医疗单位金额<br /><b className="total">(合计: {formatMoney(data.outpatientCompanyAmount,2,'')})</b></span>,
        dataIndex: 'outpatientCompanyAmount',
        key: 'outpatientCompanyAmount',
        width: 100,
    },
    {
        title: <span>门诊医疗个人金额<br /><b className="total">(合计: {formatMoney(data.outpatientPersonAmount,2,'')})</b></span>,
        dataIndex: 'outpatientPersonAmount',
        key: 'outpatientPersonAmount',
        width: 100,
    },{
        title: '补充公积金基数',
        dataIndex: 'supplementaryFundBase',
        key: 'supplementaryFundBase',
        width: 120,
    },
    {
        title: '补充公积金单位比例',
        dataIndex: 'supplementaryFundCompanyPro',
        key: 'supplementaryFundCompanyPro',
        width: 100,
    },
    {
        title: '补充公积金个人比例',
        dataIndex: 'supplementaryFundPersonPro',
        key: 'supplementaryFundPersonPro',
        width: 100,
    },
    {
        title: <span>补充公积金单位金额<br /><b className="total">(合计: {formatMoney(data.supplementaryFundCompanyAmount,2,'')})</b></span>,
        dataIndex: 'supplementaryFundCompanyAmount',
        key: 'supplementaryFundCompanyAmount',
        width: 100,
    },
    {
        title: <span>补充公积金个人金额<br /><b className="total">(合计: {formatMoney(data.supplementaryFundPersonAmount,2,'')})</b></span>,
        dataIndex: 'supplementaryFundPersonAmount',
        key: 'supplementaryFundPersonAmount',
        width: 100,
    }

    
]
/**
 * 社保账单Columns
 * @param data {Object} 参数
 * @return {Array}
 */
export const columnsSocialBill: columns = (data) => [1
]
/**
 * 多多账单Columns
 * @param data {Object} 参数
 * @return {Array}
 */
export const columnsDuoduoBill: columns = (data) => [
    {
        title: '序号',
        // dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed:'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '失败原因',
        dataIndex: 'errorInfo',
        key: 'errorInfo',
        width: 200,
        fixed:'left',
        render:(data)=>{
            const style = {
                whiteSpace: 'nowrap',
                width: '180px',
                color: 'red',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="bottomLeft" title={data}>
                    <div style={style}>{data}</div>
                </Tooltip>

            );
        }
        
    },
    {
        title: '公司名称',
        fixed:'left',
        dataIndex: 'outerCname',
        key: 'outerCname',
        width: 250,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 170,
    },
    {
        title: '国籍',
        dataIndex: 'nationality',
        key: 'nationality',
        width: 100,
        render: (data)=>{
            return data?data:'中国'
        }
    },
    {
        title: '来华时间',
        dataIndex: 'dateOfComing',
        key: 'dateOfComing',
        width: 170,
        render: (data)=>{
            return data?data:'/'
        }
    },
    {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        width: 150,
    },
    {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 100,
    },
    {
        title: '证件类型',
        dataIndex: 'idType',
        key: 'idType',
        width: 100,
        render: (data)=>{
            return data || '/'
        }
    },{
        title: '证件号码',
        dataIndex: 'idNum',
        key: 'idNum',
        width: 170,
        render: (data)=>{
            return data || '/'
        }
        
    },
    {
        title: '开户银行',
        dataIndex: 'openBank',
        key: 'openBank',
        width: 250,
        render: (data)=>{
            return data || '/'
        }
    },
    {
        title: '开户地省',
        dataIndex: 'openProvince',
        key: 'openProvince',
        width: 100,
        render: (data)=>{
            return data || '/'
        }
    },
    {
        title: '开户地市',
        dataIndex: 'openCity',
        key: 'openCity',
        width: 100,
        render: (data)=>{
            return data || '/'
        }
    },
    {
        title: '银行账号',
        dataIndex: 'bankAccount',
        key: 'bankAccount',
        width: 150,
    },
    {
        title: <span>成本中心<br />（部门）</span>,
        dataIndex: 'costCenter',
        key: 'costCenter',
        width: 100,
    },
    {
        title: <span>个税<br />申报地</span>,
        dataIndex: 'taxDeclarationArea',
        key: 'taxDeclarationArea',
        width: 120,
    },
    {
        title: '基本工资',
        dataIndex: 'basicSalary',
        key: 'basicSalary',
        width: 120,
    },
    {
        title: '津贴补贴',
        dataIndex: 'subsidy',
        key: 'subsidy',
        width: 120,
    },
    
    {
        title: <span>免税项目<br />（通讯费等）<br/><b className="total">(合计: {formatMoney(data.taxExemptItems,2,'')})</b></span>,
        dataIndex: 'taxExemptItems',
        key: 'taxExemptItems',
        width: 100,
    },
    {
        title: <span>应税工资合计<br/><b className="total">(合计: {formatMoney(data.wagePaya,2,'')})</b></span>,
        dataIndex: 'wagePaya',
        key: 'wagePaya',
        width: 100,
    },
    
    {
        title: <span>养老保险<br />个人缴纳<br/><b className="total">(合计: {formatMoney(data.pensionPerson,2,'')})</b></span>,
        dataIndex: 'pensionPerson',
        key: 'pensionPerson',
        width: 120,
    },
    {
        title: <span>医疗保险<br />个人缴纳<br/><b className="total">(合计: {formatMoney(data.medicalPerson,2,'')})</b></span>,
        dataIndex: 'medicalPerson',
        key: 'medicalPerson',
        width: 120,
    },
    {
        title: <span>失业保险<br />个人缴纳<br/><b className="total">(合计: {formatMoney(data.unemployedPerson,2,'')})</b></span>,
        dataIndex: 'unemployedPerson',
        key: 'unemployedPerson',
        width: 100,
    },
    {
        title: <span>住房公积金<br />个人缴纳<br/><b className="total">(合计: {formatMoney(data.fundPerson,2,'')})</b></span>,
        dataIndex: 'fundPerson',
        key: 'fundPerson',
        width: 100,
    },
    {
        title: <span>其他费用<br />个人缴纳<br/><b className="total">(合计: {formatMoney(data.otherPerson,2,'')})</b></span>,
        dataIndex: 'otherPerson',
        key: 'otherPerson',
        width: 120,
    },
    {
        title: <span>社保公积金<br />个人缴纳合计<br/><b className="total">(合计: {formatMoney(data.socialFundSubtotal,2,'')})</b></span>,
        dataIndex: 'socialFundSubtotal',
        key: 'socialFundSubtotal',
        width: 120,
    },
    {
        title: <span>税前工资<br/><b className="total">(合计: {formatMoney(data.grossPay,2,'')})</b></span>,
        dataIndex: 'grossPay',
        key: 'grossPay',
        width: 100,
    },
    {
        title: <span>应税工资<br/><b className="total">(合计: {formatMoney(data.taxableWages,2,'')})</b></span>,
        dataIndex: 'taxableWages',
        key: 'taxableWages',
        width: 100,
    },
    {
        title: '费用扣除标准',
        dataIndex: 'deduction',
        key: 'deduction',
        width: 120,
    },
    {
        title: <span>应纳税所得<br/><b className="total">(合计: {formatMoney(data.taxableIncome,2,'')})</b></span>,
        dataIndex: 'taxableIncome',
        key: 'taxableIncome',
        width: 120,
    },
    {
        title: '税率',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 100,
    },
    {
        title: <span>速算<br />扣除数</span>,
        dataIndex: 'qcd',
        key: 'qcd',
        width: 100,
    },
    {
        title: <span>个人所得税<br/><b className="total">(合计: {formatMoney(data.itfi,2,'')})</b></span>,
        dataIndex: 'itfi',
        key: 'itfi',
        width: 100,
    },
    {
        title: <span>税后扣款<br />（我司不收费）<br/><b className="total">(合计: {formatMoney(data.withhold,2,'')})</b></span>,
        dataIndex: 'withhold',
        key: 'withhold',
        width: 120,
    },
    {
        title: <span>个税差或其他<br />（我司收费）<br/><b className="total">(合计: {formatMoney(data.other,2,'')})</b></span>,
        dataIndex: 'other',
        key: 'other',
        width: 120,
    },
    {
        title: <span>实发工资<br/><b className="total">(合计: {formatMoney(data.netPayment,2,'')})</b></span>,
        dataIndex: 'netPayment',
        key: 'netPayment',
        width: 100,
    },
    {
        title: <span>服务费<br/><b className="total">(合计: {formatMoney(data.serviceFee,2,'')})</b></span>,
        dataIndex: 'serviceFee',
        key: 'serviceFee',
        width: 100,
    },
    {
        title: '残保金征收标准',
        dataIndex: 'residualGold',
        key: 'residualGold',
        width: 100,
    },
    {
        title: '百分比',
        dataIndex: 'percentage',
        key: 'percentage',
        width: 100,
    },
    {
        title: <span>残保金等其他<br/><b className="total">(合计: {formatMoney(data.rOther,2,'')})</b></span>,
        dataIndex: 'rOther',
        key: 'rOther',
        width: 100,
    },
    {
        title: <span>费用总计<br/><b className="total">(合计: {formatMoney(data.totalCost,2,'')})</b></span>,
        dataIndex: 'totalCost',
        key: 'totalCost',
        width: 150,
    
    },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
        render:(data)=>{
            const style = {
                whiteSpace: 'nowrap',
                width: '180px',
                color: 'green',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return (
                <Tooltip placement="bottomLeft" title={data}>
                    <div style={style}>{data}</div>
                </Tooltip>

            );
        }
    }
    

    
]

export class  SocialBill extends Component<SocialBillProps, any> {
    constructor(props) {
        super(props);
    }
    getColumns = (total) => {
        const {
            type
        } = this.props;
        switch (type) {
            case 2:
                return columnsSocialBill(total)
            case 5:
                return columnsSpBill(total)
            case 6:
                return columnsDuoduoBill(total)    
            // return columnsDuoduoBill(total)
            default:
                break;
        }
    }
    tableProps = () => {
        const {
            type
        } = this.props
        const data = this.props.dataSource
        const dataSource = data && data.list || [];
        let total = data && (data.total) || {};
        


        let scrollX = 0;
        switch (type) {
            case 5:
                scrollX = 8950
                break;
            case 6:
                scrollX = 5210
          
                break;
        
            default:
                scrollX = 4670
                break;
        }
        let columns = this.getColumns(total);
        // 没有错误信息下移除列
        if(!data || (data && !data.isError)){
            columns.splice(1, 1);
            scrollX = scrollX - 200;
        }
        let props: any = {
            rowKey:　record => record.id,
            columns,
            pagination: {
                defaultPageSize: 100,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                pageSizeOptions: [100, 200, 300, 400],
            },
            bordered:true,
            scroll: { y: 500, x: scrollX },
            ...this.props,
            dataSource,
        }
        return props;
    }

    render() {
        return (<div>
            <Table className="social-bill-table" {...this.tableProps() } />
        </div>)
    }
}

