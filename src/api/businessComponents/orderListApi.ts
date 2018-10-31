import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
/**
 * 查询订单列表
 */
// export const ORDER_LIST_API = `${DOMAIN_OXT}/social/company/adviser/customerorder`;
export const ORDER_LIST_API = `${DOMAIN_OXT}/api/order/list`;

export const ORDER_DISMISSREASON_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/wages/query/rejectDownload`;
export const ORDER_REPEAL_API = `${DOMAIN_OXT}/apiv2_/order/order/order-cancel`;

// const tempData = {"errmsg":null,"msg":"ok","status":0,"errcode":0,"recordsFiltered":5,"recordsTotal":5,"data":[{"invoiceId":4112,"isClaimInvoice":1,"auditStatus":1,"id":"14766","orderType":"1","orderTypeName":"会员套餐订单","orderCode":"20180122095239904397","orderMoney":"5880.0","createTime":"2018-01-22 09:52:39","paymentCount":0,"lastDayNum":"-/-","companyName":"杭州今元标矩科技有限公司","customLinkmanName":"aa","customLinkmanPhone":"13078458956","customLinkmanEmail":"hh@joyowo.com","saleSity":null,"saleName":null,"salePhone":null,"claimStatus":2,"leftMicroseconds":null,"payMethod":"transferspay","payMethodName":"线下转账","orderStausName":"付款完成","orderStaus":"80","examineStatus":"2","cid":"100578","sid":null},{"invoiceId":-1,"isClaimInvoice":0,"auditStatus":1,"id":"14929","orderType":"1","orderTypeName":"会员套餐订单","orderCode":"20180307171627714962","orderMoney":"5880.0","createTime":"2018-03-07 17:16:27","paymentCount":0,"lastDayNum":"-/-","companyName":"深圳市罗湖区京创水果店","customLinkmanName":"吴一凡","customLinkmanPhone":"15988896522","customLinkmanEmail":"wuyf@joyowo.com","saleSity":null,"saleName":null,"salePhone":null,"claimStatus":2,"leftMicroseconds":null,"payMethod":"transferspay","payMethodName":"线下转账","orderStausName":"付款完成","orderStaus":"80","examineStatus":"null","cid":"100427","sid":null},{"invoiceId":3916,"isClaimInvoice":1,"auditStatus":1,"id":"13775","orderType":"1","orderTypeName":"会员套餐订单","orderCode":"20170927165628883257","orderMoney":"5880.0","createTime":"2017-09-27 16:56:28","paymentCount":0,"lastDayNum":"-/-","companyName":"测试我的资料","customLinkmanName":"吴一凡","customLinkmanPhone":"15988896190","customLinkmanEmail":"wuyf@joyowo.com","saleSity":null,"saleName":null,"salePhone":null,"claimStatus":2,"leftMicroseconds":null,"payMethod":"transferspay","payMethodName":"线下转账","orderStausName":"付款完成","orderStaus":"80","examineStatus":"2","cid":"100553","sid":null},{"invoiceId":-1,"isClaimInvoice":0,"auditStatus":1,"id":"14964","orderType":"1","orderTypeName":"会员套餐订单","orderCode":"20180309171818827542","orderMoney":"5880.0","createTime":"2018-03-09 17:18:18","paymentCount":0,"lastDayNum":"-/-","companyName":"企业社保通","customLinkmanName":"吴一凡","customLinkmanPhone":"15988896190","customLinkmanEmail":"wuyf@joyowo.com","saleSity":null,"saleName":null,"salePhone":null,"claimStatus":2,"leftMicroseconds":null,"payMethod":"transferspay","payMethodName":"线下转账","orderStausName":"付款完成","orderStaus":"80","examineStatus":"null","cid":"100561","sid":null},{"invoiceId":-1,"isClaimInvoice":0,"auditStatus":1,"id":"14978","orderType":"1","orderTypeName":"会员套餐订单","orderCode":"20180312115158802334","orderMoney":"5880.0","createTime":"2018-03-12 11:51:58","paymentCount":0,"lastDayNum":"-/-","companyName":"企业社保通","customLinkmanName":"吴一凡","customLinkmanPhone":"15988896190","customLinkmanEmail":"wuyf@joyowo.com","saleSity":null,"saleName":null,"salePhone":null,"claimStatus":2,"leftMicroseconds":null,"payMethod":"transferspay","payMethodName":"线下转账","orderStausName":"付款完成","orderStaus":"80","examineStatus":"null","cid":"100561","sid":null}]}

export const orderListApi = (params) => {
    // // 多多订单单独加个字段描述给后台
    // if(params.orderType === 6) {
    //     params.isDuoDuoList = 1;
    // } 
    return fetchFn(ORDER_LIST_API, params).then(data => data);
}
export const dismissReasonApi = (params) => fetchFn(ORDER_DISMISSREASON_API, params).then(data => data);
export const orderRepealApi = (params) => fetchFn(ORDER_REPEAL_API, params).then(data => data);