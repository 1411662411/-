import { combineReducers } from 'redux-immutable';
import { routerReducer } from 'react-router-redux';
import { routerPermission } from './routerPermissionReducers';

/**
 * mainPage
 */ 
import { mainPage } from "./mainPage";

/**
 * 财务
 */
import { gatheringInfo } from './financialManagement/gatheringInfoReducer';
import { fundConfirm } from "./financialManagement/fundConfirmReducer";
import { filialeEntry }from './financialManagement/filialeEntryReducer';
import { fundConfirmInfo } from './financialManagement/fundConfirmInfoReducer';
import { socialApprove } from './financialManagement/socialApproveReducer';
import { invoiceReducer } from './financialManagement/invoiceReducer';
import { invoiceInfo } from './financialManagement/invoiceInfoReducer';
import { earningAccountant } from './financialManagement/earningAccountantReducer';
import { cashOutDetailReducer} from './financialManagement/cashOutDetailReducer';
import { outputAccountant } from './financialManagement/outputAccountantReducer';
import { socialPayment } from './financialManagement/socialPaymentReducer';
import { customerCodeSync} from './financialManagement/customerCodeSyncReducer';
import { spPaymentReducer } from './financialManagement/spPaymentReducer';
import { mailsetReducer } from './financialManagement/mailsetReducer';
import { invoicesSendReducers } from './financialManagement/invoicesSendReducers';
import chargeOffByFilialeReducer from './financialManagement/chargeOffByFilialeReducer';
import refund from './financialManagement/refundReducer';
import {invoiceWhitelistReducer} from './financialManagement/invoiceWhitelistReducer';


/**
 * 社保
 */
import { cashoutApproveSubmit } from './businessComponents/cashoutApproveSubmitReducer';
import { cashoutNeedsApproval} from './socialManagement/cashoutNeedsApprovalReducer';
import { cashoutTransferByme } from './socialManagement/cashoutTransferBymeReducer';
import { importBillDetail } from './socialManagement/importBillReviewReducer';
import { cashoutApproveReSubmit } from './socialManagement/cashoutApproveReSubmitReducer';
import { cashoutImportRecord } from './socialManagement/cashoutImportRecordReducer';
import { payeeManagementReducer } from './socialManagement/payeeManagementReducers';
import { cashoutManagementReducer } from './socialManagement/cashoutManagementReducer';
import { resPaymentListReducer } from './socialManagement/resPaymentListReducer';
import { cashoutManagementBillReducer } from './socialManagement/cashoutManagementBillReducer';
import { importBillSpReducer } from './socialManagement/importBillSpReducer';
import { socialOrderSubmitReducer } from './socialManagement/socialOrderSubmitReducer';
import { socialOrderDetailReducer } from './socialManagement/socialOrderDetailReducer';
import importSocialNumberReducer from './socialManagement/importSocialNumberReducer';
import { getSocialPayInfo } from './socialManagement/socialMentRecordsReducer';
import policyDataListReducer from './policyMaintenance/searchSocialMaterialReducer';
import adjustBaseImportBillReducer from './socialManagement/adjustBaseImportBillReducer';


import {socialEncycleListReducer} from './socialEncycleReducer/socialEncycleReducer';


import { blacklistManagementReducer } from './socialManagement/blacklistManagementReducer';

/**
 * 销售
 */
import { cashClaimReducers } from './saleWorkbench/cashClaimReducers';
import { invoiceEdit } from './saleWorkbench/invoiceEditReducers';


/**
 * businessComponents
 */

import { cashoutOrderDetails} from './businessComponents/cashoutOrderDetailsReducer';
import { payInfoEntry } from './businessComponents/payInfoEntryReducer';
import { payeeInfo } from './businessComponents/payeeInfoReducer';
import { getPayInfo } from './financialManagement/payinfoExportReducer';

import { invoice as invoiceBusinessComponents } from './businessComponents/invoiceReducer';
import { importExportRecords as importExportRecordsBusinessComponents } from './businessComponents/importExportRecordsReducer';
import chapterList from './businessComponents/chapterListReducer';
import chapterInfo from './businessComponents/chapterInfoReducer'
import chapterInfoEnter from './businessComponents/chapter/chapterInfoEnterReducer';
import chapterFinancialOne from './businessComponents/chapterFinancialOneReducer';
import chapterFinancialTwo from './businessComponents/chapterFinancialTwoReducer';
import singleAccountReducer  from './businessComponents/policyPackage/singleAccountReducer';
import singleInfoReducer from './singleInfo/singleInfoReducer'
import materialsReducer from './businessComponents/policyMaintenance/materialsReducer';
import {orderListReducer} from './businessComponents/orderListReducer';
import chapterHandleRecordReducer from './businessComponents/chapter/chapterHandleRecordReducer';

/**
 * 业务管理
 */
import invoiceInfoForBusinessManagement from './businessManagement/invoiceInfoReducer';
/**
 * 政策包材料管理列表
 */
import policyListReducer from './policyMaintenance/policyListReducer'

// crm
import crm from './crm'
import {crmWorkbenchConfig} from './crm/WorkbenchConfig'
import {crmWorkbench} from './crm/workbench'
import {crmWorkbenchMessage} from './crm/MessageReducer/'
import {crmMyTeam} from './crm/MyTeamReducer/'

//官网活动管理
import { websiteActivityListReducer } from './website/websiteReducer'


import feddBackListReducer from './feedback/feddBackListReducer';


const reducers =  
    {
        /* mainPage*/
        mainPage,
    
        /* 财务 */
        fundConfirm,
        filialeEntry,
        gatheringInfo,
        fundConfirmInfo,
        socialApprove,
        socialPayment,
        invoiceReducer,
        invoiceInfo,
        earningAccountant,
        cashOutDetailReducer,
        outputAccountant,
        routerPermission,
        customerCodeSync,
        spPaymentReducer,
        mailsetReducer,
        invoicesSendReducers,
        chargeOffByFilialeReducer,
        refund,
        invoiceWhitelistReducer,
        
        /* 社保 */
        cashoutApproveSubmit,
        cashoutApproveReSubmit,
        cashoutNeedsApproval,
        cashoutTransferByme,
        importBillDetail,
        cashoutImportRecord,
        cashoutManagementReducer,
        cashoutManagementBillReducer,
        importBillSpReducer,
        socialOrderSubmitReducer,
        socialOrderDetailReducer,
        importSocialNumberReducer,
        getSocialPayInfo,
        policyDataListReducer,
        adjustBaseImportBillReducer,
        blacklistManagementReducer,
         /**
         * 百科
         */
        socialEncycleListReducer,

        
        /**
         * 销售
         */
        cashClaimReducers,
        invoiceEdit,
        

        /**
         * businessComponents
         */
        cashoutOrderDetails,
        payInfoEntry,
        payeeManagementReducer,
        payeeInfo,
        getPayInfo,
        invoiceBusinessComponents,
        importExportRecordsBusinessComponents,
        chapterList,
        chapterInfo,
        chapterInfoEnter,
        chapterFinancialOne,
        chapterFinancialTwo,
        singleAccountReducer,
        singleInfoReducer,
        materialsReducer,
        orderListReducer,
        chapterHandleRecordReducer,


        /**
         * 业务管理
         */
        invoiceInfoForBusinessManagement,
        /**
         * 政策包材料管理列表
         */
        policyListReducer,
        /* react-router-redux */
        routing: routerReducer,

        //crm
        crmWorkbenchConfig,
        crmWorkbench,
        crmWorkbenchMessage,
        crmMyTeam,

        //官网活动管理
        websiteActivityListReducer,
        
        

        //反馈
        feddBackListReducer,

        /**
         * 请款改造
         */
        resPaymentListReducer
    }

export type ReducerInteface = typeof reducers;

const indexReduces = combineReducers(reducers);

export default indexReduces;