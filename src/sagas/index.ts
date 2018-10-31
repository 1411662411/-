// import 'babel-polyfill';

/**
 * 财务
 */
import watchFundConfirm from './financialManagement/fundConfirmSaga';
import watchRouterPermission from './routerPermissionSaga';
import watchCompanyEntryAsync from './financialManagement/filialeEntrySaga';
import watchGatheringInfoSagaAsync from './financialManagement/gatheringInfoSaga';
import watchSocialApprove from './financialManagement/socialApproveSaga';
import watchFundConfirmInfo from './financialManagement/fundConfirmInfoSaga';
import watchInvoiceSaga from './financialManagement/invoiceSaga';
import watchInvoiceInfoSaga from './financialManagement/invoiceInfoSaga';
import watchEarningAccountant from './financialManagement/earningAccountantSaga';
import watchCashOutDetail from './financialManagement/cashOutDetailSaga';
import watchOutputAccountant from './financialManagement/outputAccountantSaga';
import watchSocialPayment from './financialManagement/socialPaymentSaga';
import watchCustomerCodeSerach from './financialManagement/customerCodeSyncSaga';
import watchSpPayment from './financialManagement/spPaymentSaga';
import watchMailset from './financialManagement/mailsetSaga';
import watchInvoicesSendSaga from './financialManagement/invoicesSendSaga';
import watchChargeOffByFilialeSaga from './financialManagement/chargeOffByFilialeSaga';
import watchRefund from './financialManagement/refundSaga';
import watchinvoiceWhitelist from './financialManagement/invoiceWhitelistSaga';


/**
 * 社保
 */
import watchCashoutApproveSubmit from './businessComponents/cashoutApproveSubmitSaga';
import watchCashoutApproveReSubmit from './socialManagement/cashoutApproveReSubmitSaga';
import watchCashoutNeedsApproval from './socialManagement/cashoutNeedsApprovalSaga';
import watchCashoutTransferByme from './socialManagement/cashoutTransferBymeSaga';
import watchCashoutImportRecord from './socialManagement/cashoutImportRecordSaga';
import watchPayeeManagement from './socialManagement/payeeManagementSaga';
import watchcashoutManagement from './socialManagement/cashoutManagementSaga';
import resPaymentlist from './socialManagement/resPaymentListSaga';  //请款改造
import startMergePayment from './socialManagement/resPaymentListSaga'; //请款改造
import getPaymentDetail from './socialManagement/resPaymentListSaga'; //请款改造
import watchCashoutManagementBill from './socialManagement/cashoutManagementBillSaga';
import watchImportBillSp from './socialManagement/importBillSpSaga';
import watchSocialOrderSubmit from './socialManagement/socialOrderSubmitSaga';
import watchSocialOrderDetail from './socialManagement/socialOrderDetailSaga';
import watchDuoduoSocialOrderDetail from './socialManagement/importBillReviewSaga';

import watchImportSocialNumber from './socialManagement/importSocialNumberSaga';
import watchSocialImportExport from './socialManagement/socialMentImportRecordsSaga'
import watchPayImportExport from './businessComponents/PayGetInfoRecordsSaga' ;
import watchPolicyPolicyDataDetail from './policyMaintenance/searchSocialMaterialSaga';
import watchAdjustBaseImportBillSaga from './socialManagement/adjustBaseImportBillSaga';

import watchBlacklistManagement from './socialManagement/blacklistManagementSaga';
import socialEncycleList from './socialEncycleSaga/socialEncycleSaga';

/**
 * businessComponents
 */
import watchCashoutOrderDetails from './businessComponents/cashoutOrderDetailsSaga';
import watchPayInfoEntry from './businessComponents/payInfoEntrySaga';
import watchPayeeInfo from './businessComponents/payeeInfoSaga';
import watchInvoice from './businessComponents/invoiceSaga';
import watchImportExport from './businessComponents/importExportSaga';
import watchChapterList from './businessComponents/chapterListSaga';
import watchChapterInfo from './businessComponents/chapterInfoSaga';
import watchChapterInfoEnter from './businessComponents/chapter/chapterInfoEnterSaga';
import watchChapterFinancialOne from './businessComponents/chapterFinancialOneSaga';
import watchChapterFinancialTwo from './businessComponents/chapterFinancialTwoSaga';
import watchSingleAccountSaga from './businessComponents/policyPackage/singleAccountSaga';
import watchMaterialsSaga from './businessComponents/policyMaintenance/materialsSaga';
import watchOrderListSaga from './businessComponents/orderListSaga';
import watchChapterHandleRecord from './businessComponents/chapter/chapterHandleRecordSaga';



/**
 * 销售
 */
import cashClaimSaga from './saleWorkbench/cashClaimSaga';
import invoiceEditSaga from './saleWorkbench/invoiceEditSaga';
/**
 * CRM
 */
import watchGetBulletinBoard from './crm/WorkbenchConfig'
import watchCrmWorkBenchSaga from './crm/Workbench'
import watchWorkbenchMessageList from './crm/MessageSaga/'
import watchCrmMyTeamList from './crm/MyTeamSaga/'


/**
 * 业务管理
 */
import watchInvoiceInfoSagaForBusinessManagement from './businessManagement/invoiceInfoSaga';
/**
 * 政策包材料管理列表
 */

import watchPolicyListDetail from './policyMaintenance/policyListSaga'
import watchSingleInfoDetail from './singleInfo/singleInfoSaga';
/**
 * 官网活动管理
 */
import watchWebsiteActivityList from './website/websiteSaga';


/**
 * 反馈
 */
import feedBackListSaga from './feedback/feedBackListSaga';


export const getSagaList = {

    
    /* 财务 */
    watchFundConfirm,
    watchRouterPermission,
    watchCompanyEntryAsync,
    watchGatheringInfoSagaAsync,
    watchSocialApprove,
    watchFundConfirmInfo,
    watchInvoiceSaga,
    watchInvoiceInfoSaga,
    watchEarningAccountant,
    watchOutputAccountant,
    watchSocialPayment,
    watchCashOutDetail,
    watchCustomerCodeSerach,
    watchSpPayment,
    watchMailset,
    watchInvoicesSendSaga,
    watchChargeOffByFilialeSaga,
    watchRefund,

   
    watchPayImportExport,
    watchPolicyPolicyDataDetail,
    watchinvoiceWhitelist,

    /* 社保 */
    watchCashoutApproveSubmit,
    watchCashoutApproveReSubmit,
    watchCashoutNeedsApproval,
    watchCashoutTransferByme,
    watchCashoutImportRecord,
    watchPayeeManagement,
    watchcashoutManagement,
    watchCashoutManagementBill,
    watchImportBillSp,
    watchSocialOrderSubmit,
    watchSocialOrderDetail,
    watchDuoduoSocialOrderDetail,
    watchImportSocialNumber,
    watchSocialImportExport,
    watchAdjustBaseImportBillSaga,
    watchBlacklistManagement,

    socialEncycleList,
    /**
     * 销售
     */
    cashClaimSaga,
    invoiceEditSaga,
    
    /**
     * businessComponents
     */
    watchCashoutOrderDetails,
    watchPayInfoEntry,
    watchPayeeInfo,
    watchInvoice,
    watchImportExport,
    watchChapterList,
    watchChapterInfo,
    watchChapterInfoEnter,
    watchChapterFinancialOne,
    watchChapterFinancialTwo,
    watchSingleAccountSaga,
    watchSingleInfoDetail,
    watchMaterialsSaga,
    watchOrderListSaga,
    watchChapterHandleRecord,

    /**
     * 业务管理
     */
    watchInvoiceInfoSagaForBusinessManagement,

    /** crm */
    watchGetBulletinBoard,
    watchCrmWorkBenchSaga,
    watchWorkbenchMessageList,
    watchCrmMyTeamList,
    /**
 * 政策包材料管理列表
 */
    watchPolicyListDetail,
    // 官网活动..
    watchWebsiteActivityList,

    /**
     * 反馈
     */    
    feedBackListSaga,

    /**
     * 请款改造
     */
    resPaymentlist,
    startMergePayment,
    getPaymentDetail
};



