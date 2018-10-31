import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import {
    message,
    Modal,
} from 'antd';
import {
    policyPackageFetching,
    setPolicyPackageData,
    GET_POLICYPACKAGE_DATA,
    SUBMIT_POLICYPACKAGE,
    APPROVE_POLICYPACKAGE,
    approvePolicyPackageFetching,
    submitPolicyPackageFetching,
} from '../../../action/businessComponents/policyMaintenance/materialsAction';
import {
    getPolicypackageData,
    getMaterialData,
    updatePolicypackageData,
    approvePolicypackageData,
} from '../../../api/businessComponents/policyMaintenance/materialsApi';

function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    switch (type) {
        case GET_POLICYPACKAGE_DATA: {
            yield put(policyPackageFetching(true))

            /**
             * 材料的公共选项
             */
            let responeData = yield getPolicypackageData(params);

            
            /**
             * 对应的policyId材料
             */
            const materialResponeData = yield getMaterialData(params);
            
         
       
            
            
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                if(materialResponeData.status === 0) {
                    responeData.data = {
                        ...responeData.data,
                        ...materialResponeData.data,
                    }
                    yield put(setPolicyPackageData(responeData, callback));
                }
                
            }
            yield put(policyPackageFetching(false))
            break;
        }
        case SUBMIT_POLICYPACKAGE: {
            yield put(submitPolicyPackageFetching(true));

            const responeData = yield updatePolicypackageData(params);

            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                callback && callback();
                message.success('操作成功');
                browserHistory.goBack();
            }
            yield put(submitPolicyPackageFetching(false))
            break;
        }
        case APPROVE_POLICYPACKAGE: {
            yield put(approvePolicyPackageFetching(true));

            const responeData = yield approvePolicypackageData(params);

            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                callback && callback();
                message.success('操作成功');
                browserHistory.goBack();
            }
            yield put(approvePolicyPackageFetching(false))
            break;
        }
    }
}

export default function* watchMaterialsSaga() {
    yield takeEvery([
        GET_POLICYPACKAGE_DATA,
        SUBMIT_POLICYPACKAGE,
        APPROVE_POLICYPACKAGE,
    ], incrementAsync);
}

