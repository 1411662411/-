import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';



/**
 * 邮件提醒设置查询
 * @param businessType 空:所有;1:天吴请款审批邮件提醒人员;2:天吴社保款付款邮件提醒人员;3: SP 请款审批邮件提醒人员;4:SP 社保款付款邮件提醒人员;5:确认到款邮件提醒人员
 */
const MAILREMINDERSETTINGS_QUERY_API = `${DOMAIN_OXT}/apiv2_/permission/v1/mailReminderSettings/query`;
/**
 * 邮件提醒设置删除
 * @param id 
 */
const MAILREMINDERSETTINGS_DEL_API = `${DOMAIN_OXT}/apiv2_/permission/v1/mailReminderSettings/del`;
/**
 * 邮件提醒设置修改
 * @param id 
 * @param userId 用户ID
 * @param userName 姓名
 * @param mail 邮箱
 */
const MAILREMINDERSETTINGS_EDIT_API = `${DOMAIN_OXT}/apiv2_/permission/v1/mailReminderSettings/edit`;
/**
 * 邮件提醒设置修改
 * @param businessType 设定类型[1:天吴请款审批邮件提醒人员;2:天吴社保款付款邮件提醒人员;3: SP 请款审批邮件提醒人员;4:SP 社保款付款邮件提醒人员;5:确认到款邮件提醒人员;]
 * @param userId 用户ID
 * @param userName 姓名
 * @param mail 邮箱
 */
const MAILREMINDERSETTINGS_SAVE_API = `${DOMAIN_OXT}/apiv2_/permission/v1/mailReminderSettings/save`;
/**
 * 根据名称查询组织架构信息
 * @param name 组织架构名称 @type String 
 */
const QUERYORGANIZATIONINFO_API = `${DOMAIN_OXT}/apiv2_/permission/v1/mailReminderSettings/queryOrganizationInfo`;
/**
 * 获取组织架构列表和部门人员
 * @param positionId 所属职位id
 * @param userIds
 * @param organizationIds
 */
const USER_BY_ORGANIZATIONS_API = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsersWithInfo`;

/**
 * 邮件设置请求
 * @param  data.type
 * @param data 
 */
export const mailreminderSettingsApi = (data) => {
    
    switch (data.type) {
        case 'query': {
            return fetchFn(MAILREMINDERSETTINGS_QUERY_API, data).then(data => data);
        }
        case 'del': {
            return fetchFn(MAILREMINDERSETTINGS_DEL_API, data).then(data => data);
        }
        case 'edit': {
            return fetchFn(MAILREMINDERSETTINGS_EDIT_API, data).then(data => data);
        }
        case 'save': {
            return fetchFn(MAILREMINDERSETTINGS_SAVE_API, data).then(data => data);
        }
    }
}
/**
 * 根据名称查询组织架构信息
 * @param name 组织架构名称 @type String 
 */
export const queryorganizationinfoApi = (data) => {
    return fetchFn(QUERYORGANIZATIONINFO_API, data).then(data => data);
}
/**
 * 获取组织架构列表和部门人员
 * @param positionId 所属职位id
 * @param userIds
 * @param organizationIds
 */
export const userByOrganizationsApi = (data) => {
    return fetchFn(USER_BY_ORGANIZATIONS_API, data).then(data => data);
}