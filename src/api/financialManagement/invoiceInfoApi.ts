import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const INVOICE_INFO_API = `${DOMAIN_OXT}/api/crm/background/financeset/invoicedetail`;



export const invoiceInfo = (params) => {
    return fetchFn(INVOICE_INFO_API, params).then(data => data)
};

