import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd'
import {
    getPolicyDataListApi,
    getPolicyDedtailDataListApi,
    getPolicyDedtailDataExportApi
} from '../../api/socialManagement/searchSocialMaterialApi'
import {
    searchSocialMaterialRecived,
    SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH,
    SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH,
    searchSocialListMaterialRecived,
    SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH,
    searchSocialListExportRecived,
    searchSocialLoadingExportDis,
    searchSocialFechingExportDis
} from '../../action/socialManagement/searchSocialMaterialAction'

function* incrementAsync(action) {
    let data

    switch (action.type) {
        case SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH:
            data = yield getPolicyDataListApi(action.params)
            return yield put(searchSocialMaterialRecived(data));

        case SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH:
            yield put(searchSocialLoadingExportDis(true))
            if (action.params.policyPackageIds) {
                data = yield getPolicyDedtailDataListApi(action.params)
            }else{
                data = ''
            }
            yield put(searchSocialLoadingExportDis(false))
            return yield put(searchSocialListMaterialRecived(data))

        case SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH:
            yield put(searchSocialFechingExportDis(true))
            data = yield getPolicyDedtailDataExportApi(action.params)
            yield put(searchSocialFechingExportDis(false))
            return yield put(searchSocialListExportRecived(data))
            
        default:
        
            throw ('error from cashOutDetailSaga, action type')
    }
}
export default function* watchPolicyPolicyDataDetail() {

    yield takeEvery([
        SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH,
        SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH,
        SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH
    ], incrementAsync);
}