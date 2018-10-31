import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';
/**
 * 查询政策包列表
 */
export const SINGLE_ACCOUNT_LIST_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/policylists`;
/**
 * 查询政策包列表
 */
export const SINGLEACCOUNT_UPORDOWNPOLICY_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/upordownpolicy`;
/**
 * 查询数据字典里的客户需提供材料名称
 */
export const SINGLEACCOUNT_DICTIONARY_NAME_API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getChildrenByDictKey`;
/**
 * 更改保存状态
 */
export const SINGLEACCOUNT_UPDATE_VETTED_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/changeVettedStatus`;
/**
 * 根据政策包地区查询具体政策包id和名称
 */
export const SINGLE_ACCOUNT_POLICYLIST_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/policylist`;
/**
 * 查询政策包详情
 */
export const SINGLE_ACCOUNT_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/policydetail`;
/**
 * 删除政策包对应的材料类型
 */
export const SINGLE_ACCOUNT_DELETETYPE_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/deleteinsuredtype`;

/**
 * 录入提交
 */
export const SINGLEACCOUNT_SUBMIT_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/policysubmit`;
/**
 * 编辑提交
 */
export const SINGLEACCOUNT_EDIT_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/editpolicy`;
/**
 * 审核提交
 */
export const SINGLEACCOUNT_AUDIT_API = `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/auditpolicy`;

const tempData = {
    status:0,
    
    data:{
        areaId:500,
        areaName:"东城区",
        cityId: 52,
        cityName:"北京",
        provinceId: 2,
        provinceName:"北京",
        // 生效时间
        effectiveTime:'2018-01-17',
        remark:'我是备注仅开放给政策包审核人用', // 备注
        isOnline: 2, //上线状态 1 启用 2停用 
        vetted: 3, // 审核状态 1 待审核 2审核通过 3 被驳回
        rejectReason: '仅开放给政策包审核人用', //驳回原因
        // 材料数据
        materials:{
            social1_fund1:{
                key:'social1_fund1',
                
                // 客户需提供
                offerData:{
                    1:{
                        key: '1',
                        materialsName: '组织机构代码',
                        materialsValue: 'EDDF6545454DF2D',
                        materialsType: 1,
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    },
                    2: {
                        key: '2',
                        materialsName: '单位简称',
                        materialsValue: '1',
                        materialsType: 2,
                        materialsList: ['选项选项选项一','选项选项选项二','选项选项选项三'],
                        status:2, // 材料状态 1新增 2修改 3删除|停用
                    }
                },
                // 客户需准备
                prepareData:{
                    1:{
                        key:1,
                        materialsName:'《组织机构代码证》(副本)',
                        materialsRequire:2,
                        sealRequire:1,
                        amount:3,
                        purpose:1,
                        mark:'统一社会信用代码：9-16位',
                        template:[{
                            uid: 1111111112,
                            ossKey: 'dddddddddddddd', /* oss的key */
                            name: '文件1.docx',
                            url: 'http://www.joyowo.com', /* 显示的url */
                        }],
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    },
                    2:{
                        key:2,
                        materialsName:'《营业执照》（企业）副本或工商《注册证》（办事处）或代表机构注册证',
                        materialsRequire:2,
                        sealRequire:2,
                        amount:1,
                        purpose:1,
                        mark:'注意营业执照有效期，必须在年检有效期范围之内',
                        template:[{
                            uid: 1111111112,
                            ossKey: 'dddddddddddddd', /* oss的key */
                            name: '文件1.docx',
                            url: 'http://www.joyowo.com', /* 显示的url */
                        }],
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    }
                }
                
               
            },
            // 社保已开户公积金未开户需要开户
            social1_fund2:{
                key:'social1_fund2',
                
            },
            // 社保已开户公积金未开户暂不开户
            social1_fund3:{
                key:'social1_fund3',
                
            },
            // 社保未开户需要开户公积金已开户
            social2_fund1:{
                key:'social2_fund1',
                
            },
            // 社保未开户需要开户公积金未开户需要开户
            social2_fund2:{
                key:'social2_fund2',
                
            },
            // 社保未开户需要开户公积金未开户暂不开户
            social2_fund3:{
                key:'social3_fund2',
                
            }
        }
        
        
        
        
    
    }
}

export const singleAccountList = (params) => fetchFn(SINGLE_ACCOUNT_LIST_API, params).then(data => data);

export const singleAccountPolicylist = (params) => fetchFn(SINGLE_ACCOUNT_POLICYLIST_API, params).then(data => data);
export const singleaccountUpordownpolicy = (params) => fetchFn(SINGLEACCOUNT_UPORDOWNPOLICY_API, params).then(data => data);
export const singleaccountUpdateVetted = (params) => fetchFn(SINGLEACCOUNT_UPDATE_VETTED_API, params).then(data => data);

/**
 * 信息录入详情
 * @param params {Object} 请求参数
 */
export const getDetail = (params) => fetchFn(SINGLE_ACCOUNT_API, params).then(data => data);

export const singleaccountDictionaryNameApi = (params) => fetchFn(SINGLEACCOUNT_DICTIONARY_NAME_API, params).then(data => data);

export const singleAccountDeleteType = (params) => fetchFn(SINGLE_ACCOUNT_DELETETYPE_API, params).then(data => data);

export const singleAccountSubmit = (params) => fetchFn(SINGLEACCOUNT_SUBMIT_API, params,{
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}).then(data => data);
export const singleAccountEdit = (params) => fetchFn(SINGLEACCOUNT_EDIT_API, params).then(data => data);
export const singleAccountAudit = (params) => fetchFn(SINGLEACCOUNT_AUDIT_API, params).then(data => data);



