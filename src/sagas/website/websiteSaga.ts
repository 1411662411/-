import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import { ROUTER_PATH, WSS, DOMAIN_OXT } from '../../global/global';
import {
    activityListReciv,
    ACTIVITY_LIST_DISPATCH,
    activityIsReleaseReciv,
    ACTIVITY_ISRELEASE_DISPATCH,
    activityCheckReciv,
    ACTIVITY_CHECK_DISPATCH,
    activitySignUpReciv,
    ACTIVITY_SIGNUP_DISPATCH,
    ACTIVITY_ADD_DISPATCH,
    activityAddReciv,
    ACTIVITY_AREA_DISPATCH,
    activityAreaReciv,
    ACTIVITY_CREATOR_DISPATCH,
    activityCreatorReciv,
    activityExportSignUpListReciv,
    ACTIVITY_EXPORTSIGNUP_DISPATCH,
    ACTIVITY_ISRELEASESTATUS_DISPATCH,
    activityIsrealeaseStatusReciv,
    LoadingRecieve,
    dataLoadingRecieve
} from '../../action/website/websiteAction';
import {
    websiteActivityList,
    websiteIsRelease,
    websiteCheck,
    websiteSignUp,
    websiteAdd,
    websiteArea,
    websiteCreator,
    websiteExportSignUpList,
    websiteIsrealeaseStatus,

} from '../../api/website/websiteAPI';
import { mapCurrentPageToStart } from '../../util/pagination';



export function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    /**去除为空的参数给后台 */

   
    const newParams:any = mapCurrentPageToStart(removeEmpty(params));
 
    switch (type) {
        case ACTIVITY_LIST_DISPATCH: {
            yield put(dataLoadingRecieve(true));
            let data = yield websiteActivityList(newParams);
      
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(activityListReciv(data));
                
            }
            yield put(dataLoadingRecieve(false));
            break;
        }
        case ACTIVITY_ISRELEASE_DISPATCH: {
            yield put(dataLoadingRecieve(true));
            let data = yield websiteIsRelease(newParams);
            let dataList=''
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(activityIsReleaseReciv(data));
                if (dataList!=''){
                    yield put(activityListReciv(dataList));
                }
               
            }
            yield put(dataLoadingRecieve(false));
            if (callback) {
                const newcallback = mapCurrentPageToStart(removeEmpty(callback))
                dataList = yield websiteActivityList(newcallback);
                yield put(activityListReciv(dataList));
            }
            break;
        }
        case ACTIVITY_CHECK_DISPATCH: {

            let data = yield websiteCheck(newParams);

            let { resolve } = newParams
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                resolve({ data: data})
                yield put(activityCheckReciv(data.data));
            }
            break;
        }
        case ACTIVITY_SIGNUP_DISPATCH: {
           
            yield put(LoadingRecieve(true));
            let data = yield websiteSignUp(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(activitySignUpReciv(data));
                
            }
            yield put(LoadingRecieve(false));
            break;
        }
        case ACTIVITY_ADD_DISPATCH: {

            let data = yield websiteAdd(newParams);
           
           
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                
                message.success(data.data,5)
                if (callback) {
                    callback()
                }
            }
            break;
        }
        case ACTIVITY_AREA_DISPATCH: {

            let data = yield websiteArea(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
               
                yield put(activityAreaReciv(data.data));
            }
            break;
        }
        case ACTIVITY_CREATOR_DISPATCH: {

            let data = yield websiteCreator(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(activityCreatorReciv(data.data));
            }
            break;
        } 
        case ACTIVITY_EXPORTSIGNUP_DISPATCH:{
            
            let data = yield websiteExportSignUpList(newParams);
            if (Number(data.errcode) === 0 || Number(data.status) === 0) {
                window.open(data.data)
            }
            
            break;
        }
        case ACTIVITY_ISRELEASESTATUS_DISPATCH: {

            let data = yield websiteIsrealeaseStatus(newParams);
            
            if (Number(data.errcode) === 0 || Number(data.status) === 0) {
                yield put(activityIsrealeaseStatusReciv(data.data));
            }

            break;
        }



    }
  
}
const removeEmpty = (obj: any) => {
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];

        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default function* watchWebsiteActivityList() {
    yield takeEvery(
        [
            ACTIVITY_LIST_DISPATCH,
            ACTIVITY_ISRELEASE_DISPATCH,
            ACTIVITY_CHECK_DISPATCH,
            ACTIVITY_SIGNUP_DISPATCH,
            ACTIVITY_ADD_DISPATCH,
            ACTIVITY_AREA_DISPATCH,
            ACTIVITY_CREATOR_DISPATCH,
            ACTIVITY_EXPORTSIGNUP_DISPATCH,
            ACTIVITY_ISRELEASESTATUS_DISPATCH,
        ], incrementAsync)
}
