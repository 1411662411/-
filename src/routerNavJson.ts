import {
    ROUTER_PATH,
    _SELF,
    _BLANK,
    PHP_DOMAIN,
    DOMAIN_OXT,
    HE_XIAO_DOMAIN,
} from './global/global';
import * as Index from './pages/index/index';
/* 财务 */
import * as Invoice from './pages/financialManagement/invoice';
import * as FundConfirm from './pages/financialManagement/fundConfirm';
import * as FundConfirmInfo from './pages/financialManagement/fundConfirmInfo';
import * as GetheringInfo from './pages/financialManagement/gatheringInfo';
import * as OutputAccountant from './pages/financialManagement/outputAccountant';
import * as EarningAccountant from './pages/financialManagement/earningAccountant';
import * as SocialApprove from './pages/financialManagement/socialApprove';
import * as FilialeEntry from './pages/financialManagement/filialeEntry';
import * as SocialPayment from './pages/financialManagement/socialPayment';
import * as SocialPaymentRecords from './pages/financialManagement/socialPaymentRecords';
import * as InvoiceInfo from './pages/financialManagement/invoiceInfo';
import * as PayInfoEntry from './pages/financialManagement/payInfoEntry';
import * as PayInfo from './pages/financialManagement/payInfo';
import * as PayInfoForPayment from './pages/financialManagement/payInfoForPayment';
import * as PayInfoArrpove from './pages/financialManagement/payInfoApprove';
import * as CustomerCodeSync from './pages/financialManagement/customerCodeSync';
import * as FinancialCashoutApprovalList from './pages/financialManagement/cashoutNeedsApproval';
import * as FinancialCashoutTransferByme from './pages/financialManagement/cashoutTransferByme';
import * as CashoutApproveDetailsFinancial from './pages/financialManagement/cashoutApproveDetails';
import * as SpPayInfoEntry from './pages/financialManagement/spPayInfoEntry';
import * as SpPayInfoCheck from './pages/financialManagement/spPayInfoCheck';
import * as SpPayment from './pages/financialManagement/spPayment';
import * as MailSet from './pages/financialManagement/mailset';
import * as InvoicesSendList from './pages/financialManagement/invoicesSend';
import * as InvoicesRegisterList from './pages/financialManagement/invoicesRegister';
import invoiceImportExportRecords from './pages/financialManagement/invoiceImportExportRecords';
import expressImportExportRecords from './pages/financialManagement/expressImportExportRecords';
import chargeOffByFiliale from './pages/financialManagement/chargeOffByFiliale';
import * as SpPayInfoRecords from './pages/financialManagement/importExportSocialRecords';
import Refund from './pages/financialManagement/refundConfirm';

/* 社保 */
import * as CashoutApproveSubmit from './pages/socialManagement/cashoutApproveSubmit';
import * as CashoutApproveReSubmit from './pages/socialManagement/cashoutApproveReSubmit';
import * as SocialCashoutApprovalList from './pages/socialManagement/cashoutNeedsApproval';
import * as CashoutApproveDetailsReadonly from './pages/socialManagement/cashoutApproveDetailsReadonly';
import * as cashoutApproveDetailsBusiness from './pages/socialManagement/cashoutApproveDetailsBusiness';
import * as SocialCashoutTransferByme from './pages/socialManagement/cashoutTransferByme';
import * as CashoutApproveList from './pages/socialManagement/cashoutApproveList';
import * as CashoutImportRecord from './pages/socialManagement/cashoutImportRecord';
import * as CashoutImportRecordForModify from './pages/socialManagement/cashoutImportRecord';
import * as payeeManagement from './pages/socialManagement/payeeManagement';
import * as TianwuCashoutApprove from './pages/socialManagement/tianwuCashoutApprove';
import * as CashoutManagement from './pages/socialManagement/cashoutManagement';
import * as CashoutManagementBill from './pages/socialManagement/cashoutManagementBill';

import * as ImportBillSp from './pages/socialManagement/importBillSp';
import * as SocialOrderSubmit from './pages/socialManagement/socialOrderSubmit';
import * as SocialOrderDetail from './pages/socialManagement/socialOrderDetail';

import * as ZZZManager from "./pages/socialManagement/zzzManager";
import ImportSocialNumber from './pages/socialManagement/importSocialNumber';
import ImportSocialNumberRecords from  './pages/socialManagement/importSocialNumberRecords';

import * as SearchSocialMaterial from './pages/socialManagement/searchSocialMaterial';
import * as SoleManagement from './pages/policyPackage/soleManagement';
import * as ImportBillDuoduo from './pages/socialManagement/importBillDuoduo';
/*CEO办公室 */
import * as CeoCashoutApprovalList from './pages/ceoOffice/cashoutNeedsApproval';
import * as CashoutApproveDetailsCeo from './pages/ceoOffice/cashoutApproveDetails';
import * as CeoCashoutTransferByme from './pages/ceoOffice/cashoutTransferByme';

/**
 * 销售工作台
 */
import CashClaim from './pages/saleWorkbench/CashClaim';
import InvoiceDetail from './pages/saleWorkbench/invoiceDetail';
import InvoiceEdit from './pages/saleWorkbench/invoiceEdit';


/**
 * 章证照
 */
import ChapterAdd from './pages/chapter/chapterAdd';
import ChapterAdmin from './pages/chapter/chapterAdmin';
import ChapterInfo from './pages/chapter/chapterInfo';
import ChapterFinancialOne from './pages/chapter/chapterFinancialOne'
import ChapterFinancialTwo from './pages/chapter/chapterFinancialTwo'


/**
 * 单立户
 */
import SingleAccountAdd from './pages/policyPackage/singleAccountAdd';
import SingleAccountAudit from './pages/policyPackage/singleAccountAudit';
import SingleAccountEdit from './pages/policyPackage/singleAccountEdit';
import SingleAccountInfo from './pages/policyPackage/singleAccountInfo';
import SingleAccountManageList from './pages/policyPackage/singleAccountManageList';
import SingleAccountAuditList from './pages/policyPackage/singleAccountAuditList';

/**
 * 业务管理
 */
import * as InvoiceInfoForBusinessManagement from './pages/businessManagement/invoiceInfo';

/**
 *政策维护
 */
import PolicyList from './pages/policyMaintenance/policyList';




// let index = 1;
// const timestamp = () => {
//     return Date.now() + (index++);
// }
/* 
 * crm
 */
import CrmWorkbench from './pages/crm/Workbench' //工作台
import Proclamation from './pages/crm/Proclamation' //公告详情页
import WorkbenchConfig from './pages/crm/WorkbenchConfig' //销售工作台配置
import Message from './pages/crm/Message' //消息中心
import WorkbenchConfigSetting from './pages/crm/WorkbenchConfig/Setting'//工作台配置
import TianwuIcon from './pages/crm/TianwuIcon' //天吴图标库
import UserInfo from './pages/crm/UserInfo' //个人资料页

import crm from './pages/crm'

export default {
    "Index": Index,
    "Invoice": Invoice,
    "FundConfirm": FundConfirm,
    "FundConfirmInfo": FundConfirmInfo,
    "GetheringInfo": GetheringInfo,
    "OutputAccountant": OutputAccountant,
    "EarningAccountant": EarningAccountant,
    "SocialApprove": SocialApprove,
    "FilialeEntry": FilialeEntry,
    "SocialPayment": SocialPayment,
    "InvoiceInfo": InvoiceInfo,
    "PayInfoEntry": PayInfoEntry,
    "PayInfo": PayInfo,
    "PayInfoForPayment": PayInfoForPayment,
    "PayInfoArrpove": PayInfoArrpove,
    "CustomerCodeSync": CustomerCodeSync,
    "FinancialCashoutApprovalList": FinancialCashoutApprovalList,
    "FinancialCashoutTransferByme": FinancialCashoutTransferByme,
    "CashoutApproveDetailsFinancial": CashoutApproveDetailsFinancial,
    "SpPayInfoEntry": SpPayInfoEntry,
    "SpPayInfoCheck": SpPayInfoCheck,
    "SpPayment": SpPayment,
    "MailSet": MailSet,
    "InvoicesSendList": InvoicesSendList,
    "InvoicesRegisterList": InvoicesRegisterList,
    "invoiceImportExportRecords": invoiceImportExportRecords,
    "expressImportExportRecords": expressImportExportRecords,
    "chargeOffByFiliale": chargeOffByFiliale,
    "CashoutApproveSubmit": CashoutApproveSubmit,
    "SearchSocialMaterial":SearchSocialMaterial,
    "CashoutApproveReSubmit": CashoutApproveReSubmit,
    "SocialCashoutApprovalList": SocialCashoutApprovalList,
    "CashoutApproveDetailsReadonly": CashoutApproveDetailsReadonly,
    "cashoutApproveDetailsBusiness": cashoutApproveDetailsBusiness,
    "SocialCashoutTransferByme": SocialCashoutTransferByme,
    "CashoutApproveList": CashoutApproveList,
    "CashoutImportRecord": CashoutImportRecord,
    "CashoutImportRecordForModify": CashoutImportRecordForModify,
    "payeeManagement": payeeManagement,
    "TianwuCashoutApprove": TianwuCashoutApprove,
    "CashoutManagement": CashoutManagement,
    "CashoutManagementBill": CashoutManagementBill,
    "CeoCashoutApprovalList": CeoCashoutApprovalList,
    "CashoutApproveDetailsCeo": CashoutApproveDetailsCeo,
    "CeoCashoutTransferByme": CeoCashoutTransferByme,
    "CashClaim": CashClaim,
    "InvoiceDetail": InvoiceDetail,
    "InvoiceEdit": InvoiceEdit,
    "ChapterAdd": ChapterAdd,
    "ChapterAdmin": ChapterAdmin,
    "ChapterInfo": ChapterInfo,
    "ChapterFinancialOne": ChapterFinancialOne,
    "ChapterFinancialTwo": ChapterFinancialTwo,
    "SingleAccountAdd": SingleAccountAdd,
    "SingleAccountAudit": SingleAccountAudit,
    "SingleAccountEdit": SingleAccountEdit,
    "SingleAccountInfo": SingleAccountInfo,
    "SingleAccountManageList": SingleAccountManageList,
    "SingleAccountAuditList": SingleAccountAuditList,
    "SocialPaymentRecords": SocialPaymentRecords,
    "ZZZManager": ZZZManager,
    "Refund": Refund,
    "InvoiceInfoForBusinessManagement": InvoiceInfoForBusinessManagement,
    "PolicyList": PolicyList,
    "AdjustableBaseImport":"AdjustableBaseImport",

    //crm
    "WorkbenchConfig":WorkbenchConfig,
    "Proclamation":Proclamation,
    "Workbench":CrmWorkbench,
    "WorkbenchConfigSetting":WorkbenchConfigSetting,
    "Message": Message,
    "TianwuIcon": TianwuIcon,
    "UserInfo": UserInfo,
    //! ...crm, 不知道为什么不可以

    "SoleManagement": SoleManagement,
    "ImportBillDuoduo": ImportBillDuoduo
}

let index = 1;
const timestamp = () => {
    return Date.now() + (index++);
}

export const routerNavJson = {
    [`${ROUTER_PATH}/newadmin/basic/common`]: {
        index: 1,
        code: -1,
        name: "首页",
        type: "home",
        path: `${ROUTER_PATH}/newadmin/basic/common`,
        component: Index,
        className: 'home',
    },
    'saleWorkbench': {
        index: 2,
        code: 'customer_customersituation_index',
        name: '销售工作台',
        type: "laptop",
        children: [
            `${_SELF}/${DOMAIN_OXT}/crm/background/contractmanagement/contracts`,
        ],
    },
    [`${_SELF}/${DOMAIN_OXT}/crm/background/contractmanagement/contracts`]: {
        name: '合同管理',
        code: -1,
        path: `${_SELF}/${DOMAIN_OXT}/crm/background/contractmanagement/contracts`,
        component: null,
        parents: ['saleWorkbench'],
    },
    [`${ROUTER_PATH}/newadmin/sale/cash/claim`]: {
        code: 'TIANWU_createContract_7',
        name: "到款认领&发票申领",
        path: `${ROUTER_PATH}/newadmin/sale/cash/claim`,
        component: CashClaim,
        parents: [`${_SELF}/${DOMAIN_OXT}/crm/background/contractmanagement/contracts`],
    },
    [`${ROUTER_PATH}/newadmin/sale/cash/invoice/detail`]: {
        code: -1,
        name: "发票详情",
        path: `${ROUTER_PATH}/newadmin/sale/cash/invoice/detail`,
        component: InvoiceDetail,
        parents: [],
    },
    [`${ROUTER_PATH}/newadmin/sale/cash/invoice/edit`]: {
        code: -1,
        name: "修正发票信息",
        path: `${ROUTER_PATH}/newadmin/sale/cash/invoice/edit`,
        component: InvoiceEdit,
        parents: [],
    },

    'financialControl': {
        index: 2,
        code: 'TIANWU_FINANCE',
        name: '财务管理',
        type: "pay-circle-o",
        children: [
            'invoiceManagement',
            'spCashout',
            `${ROUTER_PATH}/newadmin/financial/fund`,
            `${ROUTER_PATH}/newadmin/financial/refund`,
            `${ROUTER_PATH}/newadmin/financial/filiale/entry`,
            `${ROUTER_PATH}/newadmin/financial/gathering/info`,
            `${ROUTER_PATH}/newadmin/financial/social/approve`,
            `${ROUTER_PATH}/newadmin/financial/social/payment`,
            `${ROUTER_PATH}/newadmin/financial/earning/accountant`,
            `${ROUTER_PATH}/newadmin/financial/output/accountant`,
            `${ROUTER_PATH}/newadmin/financial/code/sync`,
            `${ROUTER_PATH}/newadmin/financial/social/spPayment`,
            `${ROUTER_PATH}/newadmin/financial/mailset`,
            `${ROUTER_PATH}/newadmin/financial/cashout/chargeoff`,
            `${ROUTER_PATH}/newadmin/chapter/financial_one`,
            `${ROUTER_PATH}/newadmin/chapter/financial_two`,

        ],
    },
    [`${ROUTER_PATH}/newadmin/financial/social/approve`]: {
        index: 4,
        code: 'TIANWU_socialManagement_orderForFinance',
        name: "天吴请款审批",
        title: '工作台 | 审批_财务方_社保业务_社保专员请款',
        path: `${ROUTER_PATH}/newadmin/financial/social/approve`,
        component: SocialApprove,
        parents: ['financialControl'],
    },
    'invoiceManagement': {
        index: 3,
        code: 'order_invoice',
        name: '发票管理',
        children: [
            `${ROUTER_PATH}/newadmin/financial/invoice/register`,
            `${ROUTER_PATH}/newadmin/financial/invoice/express`,
        ],
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/invoice/register`]: {
        name: '开发票&登记发票号',
        code: 'invoice_send',
        title: '工作台 | 财务专员_开发票_发票信息导出&发票号导入',
        path: `${ROUTER_PATH}/newadmin/financial/invoice/register`,
        component: InvoicesRegisterList,
        children: [
            `${ROUTER_PATH}/newadmin/financial/invoice/importexport/records`,
        ],
        parents: ['invoiceManagement'],
    },
    [`${ROUTER_PATH}/newadmin/financial/invoice/express`]: {
        name: '登记发票快递号',
        code: 'shiping_number',
        title: '工作台 | 业务专员_寄发票_寄送信息导出&快递号导入',
        path: `${ROUTER_PATH}/newadmin/financial/invoice/express`,
        component: InvoicesSendList,
        parents: ['invoiceManagement'],
        children: [
            `${ROUTER_PATH}/newadmin/financial/express/importexport/records`,
        ],
    },
    'spCashout': {
        index: 6,
        code: 'TIANWU_finance_sp_approval',
        name: 'SP 请款审批',
        children: [
            `${ROUTER_PATH}/newadmin/financial/cashout/approve/transfer`,
            `${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`,
        ],
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/approve/details`]: {
        name: '请款单查看',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/financial/cashout/approve/details`,
        component: CashoutApproveDetailsReadonly,
        parents: [`${ROUTER_PATH}/newadmin/financial/cashout/approve/transfer`],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`]: {
        index: 6,
        name: '需要我审批',
        code: 'TIANWU_finance_sp_my_approval',
        title: 'SP 请款审批（财务方）_需要我审批',
        path: `${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`,
        component: FinancialCashoutApprovalList,
        parents: ['spCashout'],
        children: [`${ROUTER_PATH}/newadmin/financial/cashout/approve`],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/approve`]: {
        name: '审批', /* 财务方审批 */
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/financial/cashout/approve`,
        component: CashoutApproveDetailsFinancial,
        parents: [`${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/approve/transfer`]: {
        name: '我转移的审批',
        code: 'TIANWU_finance_sp_transfer_approval',
        title: 'SP 请款审批（财务方）_我转移的审批',
        path: `${ROUTER_PATH}/newadmin/financial/cashout/approve/transfer`,
        component: FinancialCashoutTransferByme,
        parents: ['spCashout'],
    },
    [`${ROUTER_PATH}/newadmin/financial/fund`]: {
        index: 1,
        code: 'TIANWU_financelist',
        name: "到款确认",
        title: '财务管理 | 财务专员_订单到款确认',
        path: `${ROUTER_PATH}/newadmin/financial/fund`,
        component: FundConfirm,
        parents: ['financialControl'],
        children: [`${ROUTER_PATH}/newadmin/financial/fund/info`],
    },
    [`${ROUTER_PATH}/newadmin/financial/refund`]: {
        index:2,
        code: 'TIANWU_finance_refund',
        name: "退费确认",
        title: '财务管理 | 财务专员_订单退费确认',
        path: `${ROUTER_PATH}/newadmin/financial/refund`,
        component: Refund,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/fund/info`]: {
        code: -1, //原先是 TIANWU_financelist_1
        name: "查看订单详情",
        path: `${ROUTER_PATH}/newadmin/financial/fund/info`,
        component: FundConfirmInfo,
        parents: [`${ROUTER_PATH}/newadmin/financial/fund`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/financial/filiale/entry`]: {
        index: 11,
        code: 'TIANWU_branch_office',
        name: "分公司信息录入",
        title: '工作台 | 分公司管理_分公司账号信息录入',
        path: `${ROUTER_PATH}/newadmin/financial/filiale/entry`,
        component: FilialeEntry,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/gathering/info`]: {
        index: 2,
        code: 'TIANWU_transaction_excel',
        name: "收款记录导入",
        path: `${ROUTER_PATH}/newadmin/financial/gathering/info`,
        component: GetheringInfo,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/social/payment`]: {
        index: 5,
        code: 'TIANWU_finance_social_payment',
        name: "天吴社保款付款",
        title: '工作台 | 付款_财务方_社保业务_社保专员请款',
        path: `${ROUTER_PATH}/newadmin/financial/social/payment`,
        component: SocialPayment,
        parents: ['financialControl'],
        children: [
            `${ROUTER_PATH}/newadmin/financial/social/payment/records`,
        ]
    }, [`${ROUTER_PATH}/newadmin/financial/social/payment/records`]: {
        code: -1,
        name: "查看导入导出历史",
        path: `${ROUTER_PATH}/newadmin/financial/social/payment/records`,
        component: SocialPaymentRecords,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/payment`],
    },
    [`${ROUTER_PATH}/newadmin/financial/social/payinfoentry`]: {
        code: 'TIANWU_finance_social_payment_3',
        name: "打款信息录入",
        path: `${ROUTER_PATH}/newadmin/financial/social/payinfoentry`,
        component: PayInfoEntry,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/payment`],
    },
    [`${ROUTER_PATH}/newadmin/financial/social/payinfo`]: {
        code: 'TIANWU_socialManagement_orderForFinance_1',
        name: "打款信息查看",
        path: `${ROUTER_PATH}/newadmin/financial/social/payinfo`,
        component: PayInfo,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/approve`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/financial/social/payinfo/payment`]: {
        code: 'TIANWU_finance_social_payment_1',
        name: "打款信息查看", /* 社保款付款的子集 */
        path: `${ROUTER_PATH}/newadmin/financial/social/payinfo/payment`,
        component: PayInfoForPayment,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/payment`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/financial/social/payinfoapprove`]: {
        code: 'TIANWU_socialManagement_orderForFinance_1',
        name: "打款信息审核",
        title: '工作台 | 审批_财务方_社保业务_社保专员请款',
        path: `${ROUTER_PATH}/newadmin/financial/social/payinfoapprove`,
        component: PayInfoArrpove,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/approve`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/financial/social/spPayment`]: {
        index: 7,
        code: -1,
        name: 'SP 社保款付款',
        title: '工作台 | SP 请款付款_财务方_社保业务_社保专员请款',
        path: `${ROUTER_PATH}/newadmin/financial/social/spPayment`,
        component: SpPayment,
        parents: ['financialControl'],
        children: [
            `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/entry`,
            `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/check`,
            `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/records`,
        ]
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/payinfo/entry`]: {
        code: -1,
        name: "打款信息录入",
        path: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/entry`,
        component: SpPayInfoEntry,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/spPayment`],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/payinfo/check`]: {
        code: -1,
        name: "打款信息录入查看",
        path: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/check`,
        component: SpPayInfoCheck,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/spPayment`],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/payinfo/records`]: {
        code: -1,
        name: "查看导入导出历史",
        path: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/records`,
        component: SpPayInfoRecords,
        parents: [`${ROUTER_PATH}/newadmin/financial/social/spPayment`],
    },
    [`${ROUTER_PATH}/newadmin/financial/earning/accountant`]: {
        index: 8,
        code: 'TIANWU_finance_receipt',
        name: "应收会计",
        title: '工作台_应收会计',
        path: `${ROUTER_PATH}/newadmin/financial/earning/accountant`,
        component: EarningAccountant,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/output/accountant`]: {
        index: 9,
        code: 'TIANWU_finance_payment',
        name: "应付会计",
        title: '工作台_应付会计',
        path: `${ROUTER_PATH}/newadmin/financial/output/accountant`,
        component: OutputAccountant,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/cashout/chargeoff`]: {
        code: 'TIANWU_socialManagement_request_chargeoff',
        name: "分公司请款核销",
        title: '工作台 | 财务管理_分公司请款核销_代缴社保款',
        path: `${ROUTER_PATH}/newadmin/financial/cashout/chargeoff`,
        component: chargeOffByFiliale,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/mailset`]: {
        index: 13,
        code: 'TIANWU_finance_email_remind',
        name: "邮件提醒",
        path: `${ROUTER_PATH}/newadmin/financial/mailset`,
        component: MailSet,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/code/sync`]: {
        index: 12,
        code: 'transmitdatafornc_index',
        name: "客户编码同步",
        title: '客户编码同步',
        path: `${ROUTER_PATH}/newadmin/financial/code/sync`,
        component: CustomerCodeSync,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/financial/invoice/importexport/records`]: {
        code: -1,
        name: "发票信息导出&发票号导入",
        title: '工作台 | 财务专员_开发票_发票信息导出&发票号导入',
        hide: true,
        path: `${ROUTER_PATH}/newadmin/financial/invoice/importexport/records`,
        component: invoiceImportExportRecords,
        parents: [`${ROUTER_PATH}/newadmin/financial/invoice/register`],
    },
    [`${ROUTER_PATH}/newadmin/financial/express/importexport/records`]: {
        code: -1,
        name: "寄送信息导出&快递号导入",
        title: '工作台 | 业务专员_寄发票_寄送信息导出&快递号导入',
        hide: true,
        path: `${ROUTER_PATH}/newadmin/financial/express/importexport/records`,
        component: expressImportExportRecords,
        parents: [`${ROUTER_PATH}/newadmin/financial/invoice/express`],
    },
    'socialControl': {
        index: 5,
        code: 'social_manage',
        name: '社保管理',
        type: "team",
        children: [
            'socialcashout',
            `${ROUTER_PATH}/newadmin/social/payee/management`,
            `${_SELF}/${PHP_DOMAIN}/socialbackend/social/business/socialbusiness`,
            `${_SELF}/${DOMAIN_OXT}/socialManagement/orderForApprove`,
            `${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`,
            `${ROUTER_PATH}/newadmin/social/cashout/management`,
            `${ROUTER_PATH}/newadmin/social/zzz/manager`,
            `${ROUTER_PATH}/newadmin/social/import/number`,
            
            `${ROUTER_PATH}/newadmin/social/material/query`,
        ],
    },
    [`${ROUTER_PATH}/newadmin/social/zzz/manager`]: {
        code: 'TIANWU_company_infomation_manager_search',
        name: "章证照保管人查询",
        title: '工作台 | 章证照保管人查询',
        path: `${ROUTER_PATH}/newadmin/social/zzz/manager`,
        component: ZZZManager,
        parents: ['socialControl']
    },
    [`${ROUTER_PATH}/newadmin/social/import/number`]: {
        name: '导入社保/公积金编号',
        code: -1,
        path: `${ROUTER_PATH}/newadmin/social/import/number`,
        component: ImportSocialNumber,
        parents: ['socialControl'],
    },
    [`${ROUTER_PATH}/newadmin/social/import/number/record`]: {
        name: '查看导入记录',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/import/number/record`,
        component: ImportSocialNumberRecords,
        parents: [`${ROUTER_PATH}/newadmin/social/import/number`],
    },

    
    [`${_SELF}/${PHP_DOMAIN}/socialbackend/social/business/socialbusiness`]: {
        name: '社保专员工作台',
        code: 'social_work_table',
        path: `${_SELF}/${PHP_DOMAIN}/socialbackend/social/business/socialbusiness`,
        component: null,
        parents: ['socialControl'],
    },
    [`${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`]: {
        name: '社保顾问',
        code: 'company_adviser_overviewpage',
        path: `${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`,
        component: null,
        parents: ['socialControl'],
        children: [`${ROUTER_PATH}/newadmin/company/adviser/importbillsp`,
        `${ROUTER_PATH}/newadmin/social/customer/socialorderdetail`,
        `${ROUTER_PATH}/newadmin/company/adviser/socialordersubmit`]
    },
    [`${ROUTER_PATH}/newadmin/company/adviser/importbillsp`]: {
        code: -1,
        name: "SP社保账单导入",
        title: '客户顾问_客户管理_SP社保账单导入',
        path: `${ROUTER_PATH}/newadmin/company/adviser/importbillsp`,
        component: ImportBillSp,
        parents: [`${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/company/adviser/socialordersubmit`]: {
        code: -1,
        name: "SP社保订单提交",
        title: '客户顾问_客户管理_SP社保订单提交',
        path: `${ROUTER_PATH}/newadmin/company/adviser/socialordersubmit`,
        component: SocialOrderSubmit,
        parents: [`${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/social/customer/socialorderdetail`]: {
        code: -1,
        name: "订单详情",
        title: '客户顾问_客户管理_订单详情',
        path: `${ROUTER_PATH}/newadmin/social/customer/socialorderdetail`,
        component: SocialOrderDetail,
        parents: [`${_SELF}/${PHP_DOMAIN}/social/company/adviser/overviewpage`],
        hide: true,
    },
    
    [`${ROUTER_PATH}/newadmin/social/cashout/payinfo`]: {
        code: -1,
        name: "请款单明细",
        path: `${ROUTER_PATH}/newadmin/social/cashout/payinfo`,
        component: PayInfo,
        parents: [`${_SELF}/${PHP_DOMAIN}/socialbackend/social/business/socialbusiness`],
        hide: true,
    },
    [`${_SELF}/${DOMAIN_OXT}/socialManagement/orderForApprove`]: {
        name: '社保款审批',
        code: 'TIANWU_socialManagement_orderForApprove',
        path: `${_SELF}/${DOMAIN_OXT}/socialManagement/orderForApprove`,
        component: null,
        parents: ['socialControl'],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/payinfo/approve`]: {
        code: 'TIANWU_socialManagement_orderForApprove',
        name: "社保款审批",
        path: `${ROUTER_PATH}/newadmin/social/cashout/payinfo/approve`,
        component: TianwuCashoutApprove,
        parents: [`${_SELF}/${DOMAIN_OXT}/socialManagement/orderForApprove`],
        hide: true,
    },
    'socialcashout': {
        code: 'TIANWU_social_management_sp_approval',
        name: 'SP 请款审批',
        children: [
            `${ROUTER_PATH}/newadmin/social/cashout/approve/submit`,
            `${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`,
            `${ROUTER_PATH}/newadmin/social/cashout/approve/needme`,
            `${ROUTER_PATH}/newadmin/social/cashout/approve/transfer`,
            
        ],
        parents: ['socialControl'],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/submit`]: {
        name: '提交请款审批',
        code: 'TIANWU_social_management_submit_approval',
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/submit`,
        component: CashoutApproveSubmit,
        parents: ['socialcashout'],
        children: [
            `${ROUTER_PATH}/newadmin/social/cashout/approve/list`,
            `${ROUTER_PATH}/newadmin/social/cashout/import/record`,
        ]
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/list`]: {
        name: '请款单列表',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/list`,
        component: CashoutApproveList,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/submit`],
        children: [
            `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
            `${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`,
        ]
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/import/record`]: {
        name: '导入记录',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/import/record`,
        component: CashoutImportRecord,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/submit`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/import/recordformodify`]: {
        name: '导入记录',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/import/recordformodify`,
        component: CashoutImportRecordForModify,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/details`]: {
        name: '请款单查看',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
        component: CashoutApproveDetailsReadonly,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/list`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`]: {
        name: '请款单修正',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/resubmit`,
        component: CashoutApproveReSubmit,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/list`],
        children: [`${ROUTER_PATH}/newadmin/social/cashout/import/recordformodify`]
    },
    [`${ROUTER_PATH}/newadmin/social/business/cashout/approve/details`]: {
        name: '请款单查看',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/business/cashout/approve/details`,
        component: CashoutApproveDetailsReadonly,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/transfer`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/needme`]: {
        name: '需要我审批',
        code: 'TIANWU_social_management_my_approva',
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/needme`,
        component: SocialCashoutApprovalList,
        parents: ['socialcashout'],
        children: [`${ROUTER_PATH}/newadmin/social/business/cashout/approve`],
    },
    [`${ROUTER_PATH}/newadmin/social/business/cashout/approve`]: {
        name: '审批', /* 业务方审批 */
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/business/cashout/approve`,
        component: cashoutApproveDetailsBusiness,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/approve/needme`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/approve/transfer`]: {
        name: '我转移的审批',
        code: 'TIANWU_social_management_transfer_approva',
        path: `${ROUTER_PATH}/newadmin/social/cashout/approve/transfer`,
        component: SocialCashoutTransferByme,
        parents: ['socialcashout'],
    },
    [`${ROUTER_PATH}/newadmin/social/material/query`]: {
        name: '参保材料查询',
        code: 'TIANWU_material_query',
        path: `${ROUTER_PATH}/newadmin/social/material/query`,
        component: SearchSocialMaterial,
        parents: ['socialControl'],
    },
    [`${ROUTER_PATH}/newadmin/social/payee/management`]: {
        name: '二次请款收款方管理',
        code: 'TIANWU_branchoffice_again',
        path: `${ROUTER_PATH}/newadmin/social/payee/management`,
        component: payeeManagement,
        parents: ['socialControl'],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/management`]: {
        name: 'SP 请款单管理',
        code: 'TIANWU_social_sp_request_management',
        path: `${ROUTER_PATH}/newadmin/social/cashout/management`,
        component: CashoutManagement,
        parents: ['socialControl'],
        children: [`${ROUTER_PATH}/newadmin/social/cashout/management/bill`],
    },
    [`${ROUTER_PATH}/newadmin/social/cashout/management/bill`]: {
        name: 'SP 请款单管理',
        title: 'SP 请款单管理',
        code: 'TIANWU_social_sp_request_management',
        hide: true,
        path: `${ROUTER_PATH}/newadmin/social/cashout/management/bill`,
        component: CashoutManagementBill,
        parents: [`${ROUTER_PATH}/newadmin/social/cashout/management`],

    },


    /**CEO */
    'ceoControl': {
        index: 6,
        code: 'TIANWU_ceo',
        name: 'CEO 办公室',
        type: "api",
        children: ['ceocashout'],
    },
    'ceocashout': {
        code: 'TIANWU_ceo_sp_approval',
        name: 'SP 请款审批',
        children: [
            `${ROUTER_PATH}/newadmin/ceo/cashout/approve/submit`,
            `${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`,
            `${ROUTER_PATH}/newadmin/ceo/cashout/approve/transfer`,
        ],
        parents: ['ceoControl'],
    },
    [`${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`]: {
        index: 4 - 1 - 1,
        name: '需要我审批',
        code: 'TIANWU_ceo_my_approval',
        path: `${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`,
        component: CeoCashoutApprovalList,
        parents: ['ceocashout'],
        children: [
            `${ROUTER_PATH}/newadmin/ceo/cashout/approve`,
        ]
    },
    [`${ROUTER_PATH}/newadmin/ceo/cashout/approve`]: {
        name: '社保款审批',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/ceo/cashout/approve`,
        component: CashoutApproveDetailsCeo,
        parents: [`${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`],
    },
    [`${ROUTER_PATH}/newadmin/ceo/cashout/approve/transfer`]: {
        index: 4 - 1 - 2,
        name: '我转移的审批',
        code: 'TIANWU_ceo_transfer_approval',
        path: `${ROUTER_PATH}/newadmin/ceo/cashout/approve/transfer`,
        component: CeoCashoutTransferByme,
        parents: ['ceocashout'],
    },
    [`${ROUTER_PATH}/newadmin/ceo/cashout/approve/details`]: {
        name: '请款单查看',
        code: -1,
        hide: true,
        path: `${ROUTER_PATH}/newadmin/ceo/cashout/approve/details`,
        component: CashoutApproveDetailsReadonly,
        parents: [`${ROUTER_PATH}/newadmin/ceo/cashout/approve/transfer`],
    },
    'chapter': {
        index: 7,
        code: 'TIANWU_company_infomation_management',
        name: '公司信息管理',
        type: "solution",
        children: [
            `${ROUTER_PATH}/newadmin/chapter/add`,
            `${ROUTER_PATH}/newadmin/chapter/admin`,
            `${ROUTER_PATH}/newadmin/chapter/info`,
        ],
    },
    [`${ROUTER_PATH}/newadmin/chapter/add`]: {
        index: 7 - 1 - 1,
        name: '章证照录入',
        title: '工作台｜城市开发部_分公司网点开办人_章证照情况录入',
        code: 'TIANWU_company_infomation_import_add',
        path: `${ROUTER_PATH}/newadmin/chapter/add`,
        component: ChapterAdd,
        parents: ['chapter'],
    },
    [`${ROUTER_PATH}/newadmin/chapter/admin`]: {
        index: 7 - 1 - 1,
        name: '章证照管理',
        title: '工作台｜业务管理_城市开发部_章证照情况管理',
        code: 'TIANWU_company_infomation_import_management',
        path: `${ROUTER_PATH}/newadmin/chapter/admin`,
        component: ChapterAdmin,
        parents: ['chapter'],
    },
    [`${ROUTER_PATH}/newadmin/chapter/info`]: {
        index: 7 - 1 - 3,
        name: '信息展示页',
        title: '工作台｜城市开发部_分公司网点开办人_信息展示页',
        code: 'TIANWU_company_infomation_detail_show',
        path: `${ROUTER_PATH}/newadmin/chapter/info`,
        component: ChapterInfo,
        parents: ['chapter'],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/chapter/financial_one`]: {
        name: '分公司企业信息',
        title: '工作台｜财务部_财务专员_分公司企业信息',
        code: 'TIANWU_company_infomation_company_show',
        path: `${ROUTER_PATH}/newadmin/chapter/financial_one`,
        component: ChapterFinancialOne,
        parents: ['financialControl'],
    },
    [`${ROUTER_PATH}/newadmin/chapter/financial_two`]: {
        name: '分公司银行信息',
        title: '工作台｜财务部_财务专员_分公司银行信息',
        code: 'TIANWU_company_infomation_bank_show',
        path: `${ROUTER_PATH}/newadmin/chapter/financial_two`,
        component: ChapterFinancialTwo,
        parents: ['financialControl'],
    },

    singleAccount: {
        index: 8,
        code: 'TIANWU_SINGLETON_ACCOUNT',
        name: '单立户',
        type: "bulb",
        children: [
            `${ROUTER_PATH}/newadmin/singleaccount/add`,
            `${ROUTER_PATH}/newadmin/singleaccount/auditlist`,
            `${ROUTER_PATH}/newadmin/singleaccount/manage`,
            `${ROUTER_PATH}/newadmin/singleaccount/info`,
        ],
    }, 
    [`${ROUTER_PATH}/newadmin/singleaccount/manage`]: {
        index: 1,
        name: '政策包管理',
        title: '政策管理部_单立户_政策包管理',
        code: 'TIANWU_SINGLETON_ACCOUNT_MANAGE',
        path: `${ROUTER_PATH}/newadmin/singleaccount/manage`,
        component: SingleAccountManageList,
        parents: ['singleAccount'],
        children: [
            `${ROUTER_PATH}/newadmin/singleaccount/audit`,
        ]
    },
    [`${ROUTER_PATH}/newadmin/singleaccount/auditlist`]: {
        index: 2,
        name: '我的政策包',
        title: '政策管理部_单立户_我的政策包',
        code: 'TIANWU_SINGLETON_ACCOUNT_AUDITLIST',
        path: `${ROUTER_PATH}/newadmin/singleaccount/auditlist`,
        component: SingleAccountAuditList,
        parents: ['singleAccount'],
        children: [
            `${ROUTER_PATH}/newadmin/singleaccount/edit`
        ]
    },
    [`${ROUTER_PATH}/newadmin/singleaccount/add`]: {
        index: 3,
        name: '政策包录入',
        title: '政策管理部_单立户_政策包录入',
        code: 'TIANWU_SINGLETON_ACCOUNT_ADD',
        path: `${ROUTER_PATH}/newadmin/singleaccount/add`,
        component: SingleAccountAdd,
        parents: ['singleAccount'],
    },
    [`${ROUTER_PATH}/newadmin/singleaccount/info`]: {
        index: 4,
        name: '政策包查看',
        title: '政策管理部_单立户_政策包查看',
        code: 'TIANWU_SINGLETON_ACCOUNT_INFO',
        path: `${ROUTER_PATH}/newadmin/singleaccount/info`,
        component: SingleAccountInfo,
        parents: ['singleAccount'],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/singleaccount/edit`]: {
        index: 5,
        name: '政策包编辑',
        title: '政策管理部_单立户_政策包编辑',
        code: 'TIANWU_SINGLETON_ACCOUNT_EDIT',
        path: `${ROUTER_PATH}/newadmin/singleaccount/edit`,
        component: SingleAccountEdit,
        parents: [`${ROUTER_PATH}/newadmin/singleaccount/auditlist`],
        hide: true,
    },
    [`${ROUTER_PATH}/newadmin/singleaccount/audit`]: {
        index: 5,
        name: '政策包审核',
        title: '政策管理部_单立户_政策包审核',
        code: 'TIANWU_SINGLETON_ACCOUNT_AUDIT',
        path: `${ROUTER_PATH}/newadmin/singleaccount/audit`,
        component: SingleAccountAudit,
        parents: [`${ROUTER_PATH}/newadmin/singleaccount/manage`],
        hide: true,
    },
    businessManagement: {
        index: 9,
        code: 'business_manager',
        name: '业务管理',
        type: 'book',
        children: [
            `${ROUTER_PATH}/newadmin/businessmanagement/invoice`,
        ],
    }, 
    [`${ROUTER_PATH}/newadmin/businessmanagement/invoice`]: {
        name: '发票信息',
        title: '发票信息',
        code: -1,
        path: `${ROUTER_PATH}/newadmin/businessmanagement/invoice`,
        component: InvoiceInfoForBusinessManagement,
        parents: ['businessManagement'],
    },
    policyMaterialList:{
        index: 10,
        code: 'TIANWU_policy_management',
        name: '政策维护',
        type: 'inbox',
        children: [
            `${ROUTER_PATH}/newadmin/policyManergement/List`,
        ],
    },
    [`${ROUTER_PATH}/newadmin/policyManergement/List`]:{
        name: '政策包参保材料列表',
        title: '政策包参保材料列表',
        code: 'TIANWU_policy_material_list',
        path: `${ROUTER_PATH}/newadmin/policyManergement/List`,
        component: PolicyList,
        parents: ['policyMaterialList'],
    }

};

    

