import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';


const WEBSITE_ACTIVITY_LIST = `${DOMAIN_OXT}/apiv2_/website/web/activity/list`;
const WEBSITE_ISRELEASE = `${DOMAIN_OXT}/apiv2_/website/web/activity/release`;
const WEBSITE_CHECK = `${DOMAIN_OXT}/apiv2_/website/web/activity/checkforback`;
const WEBSITE_SIGNUP = `${DOMAIN_OXT}/apiv2_/website/api/webSign/list`;
const WEBSITE_ADD = `${DOMAIN_OXT}/apiv2_/website/web/activity/add`;

const WEBSITE_AREA = `${DOMAIN_OXT}/apiv2_/website/api/address/actarea`;
const WEBSITE_CREATOR = `${DOMAIN_OXT}/apiv2_/website/web/activity/actcreators`;

const WEBSITE_EXPORTSIGNUPLIST = `${DOMAIN_OXT}/apiv2_/website/api/webSign/exportSignUpList`;
const WEBSITE_ISRELEASESTATUS = `${DOMAIN_OXT}/apiv2_/website/web/activity/buttonstatus`;
const parseData = (data) => {

    const { currentPage, pageSize } = data;
    if (currentPage !== undefined && pageSize !== undefined) {
        return {
            ...data,
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
        }
    }
    return data;
}

export const websiteIsrealeaseStatus = (data) => {
    return fetchFn(WEBSITE_ISRELEASESTATUS, data).then(data => {
        return data
    });
}

export const websiteExportSignUpList = (data) => {
    return fetchFn(WEBSITE_EXPORTSIGNUPLIST, data).then(data => { 
       return data
    });
}
export const websiteCreator = (data) => {
    return fetchFn(WEBSITE_CREATOR, data).then(data => data);
}

export const websiteArea = (data) => {
    return fetchFn(WEBSITE_AREA, data).then(data => data);
}

export const websiteAdd = (data) => {
    return fetchFn(WEBSITE_ADD, data).then(data => data);
}

export const websiteActivityList = (data) => {
    return fetchFn(WEBSITE_ACTIVITY_LIST, parseData(data)).then(data => data);
}

export const websiteCheck = (data) => {
    return fetchFn(WEBSITE_CHECK, data).then(data => data);
}

export const websiteSignUp = (data) => {
    return fetchFn(WEBSITE_SIGNUP, parseData(data)).then(data => data);
}

export const websiteIsRelease =(data)=>{
    return fetchFn(WEBSITE_ISRELEASE, parseData(data)).then(data => data);
}
