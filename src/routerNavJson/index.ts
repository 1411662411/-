import Index from '../pages/index/index';
import * as crm from './crm';
import * as financial from './financial';
import * as social from './social';
import * as companyinfo from './companyinfo';
import * as feedback from './feedBack';

export default {
    Index,

    /**
     * crm
     */
    ...crm,

    /**
     * 财务
     */
    ...financial,

    /**
     * 天吴社保
     */
    ...social,

    /**
     * 公司信息管理
     */
    ...companyinfo,

    /**
     * 使用反馈
     */
    ...feedback,
}; 