import { 
    takeEvery,
} from 'redux-saga';
import {
    put,
} from 'redux-saga/effects';
import {
    message
} from 'antd';
import * as _ from 'lodash';
import {
    getBranchList,
    updateData,
    addBranch,
    delBranch,
} from '../../api/financialManagement/filialeEntryApi';
import {
    FILIALE_ENTRY_SAGA,
    DATA_RECEIVED,
    SAVE_TABLE_DATA,
    ISFETCHING,
    EDIT_TABLE_DATA,
    START_STOP_TABLE_DATA,
    DELETE_TABLE_DATA,
    ADD_TABLE_DATA,
    ADD_ISFETCHING,
    inputChange,
} from '../../action/financialManagement/filialeEntryAction';

function* getBranchListGenerator(params) {
    try {
        yield put({type: ISFETCHING, listIsFetching: true, searchListFetching: true,});
        return yield getBranchList(params);
    }
    catch (error) {
        yield put({type: ISFETCHING, listIsFetching: false, searchListFetching: false,});
        message.error(error.toString(), 3);
    }
};

function* updateDataGenerator(params) {
    try {
        yield put({type: ISFETCHING, listIsFetching: true});
        return yield updateData(params);
    }
    catch (error) {
        yield put({type: ISFETCHING, listIsFetching: false});
        message.error(error.toString(), 3);
    }
}

function* addBranchGenerator(params) {
    try {
        yield put({type: ADD_ISFETCHING, addIsFetching: true});
        return yield addBranch(params);
    }
    catch (error) {
        yield put({type: ADD_ISFETCHING, addIsFetching: false});
        message.error(error.toString(), 5);
    }
}
function* delBranchGenerator(params) {
    try {
        yield put({type: ISFETCHING, listIsFetching: true});
        return yield delBranch(params);
    }
    catch (error) {
        yield put({type: ISFETCHING, listIsFetching: false});
        message.error(error.toString(), 5);
    }
}




function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    const {
        dataSource,
        id,
        index,
        depositName,
        branchName,
        branchType,
        depositAccount,
        depositCity,
        depositBank,
        enableStatus,
        resolve,
        reject,
        bankTypeName,
        cityName,
        bankType,
        provinceId,
        cityId,
        districtId,
        pageSize,
        currentPage,
    } = params;
    switch (type) {
        case FILIALE_ENTRY_SAGA: {
            let data = yield getBranchListGenerator(params);
            data = _.assign(data, {pageSize, currentPage, branchName, defaultAddValue: ''});
            yield put({type: DATA_RECEIVED, data});
            break;
        }
        case ADD_TABLE_DATA: {
            delete params.pageSize;
            let data = yield addBranchGenerator(params);
            if(data.errcode === 0) {
                yield put({type: FILIALE_ENTRY_SAGA, params: {currentPage: 1, pageSize}});

                /**
                 * 清空input
                 */
                yield put(inputChange({
                    addFilialeSearchName: '',
                    addDepositName: '',
                    addDepositAccount: '',
                    bankTypeName:'',
                    provice:'',
                    city: '',
                    bankType:'',
                    branchType:1,
                }));
            }
            else {
                yield put({type: ADD_ISFETCHING, addIsFetching: false});
            }
            break;
        }
        case SAVE_TABLE_DATA: {
            
            let data = yield updateDataGenerator({
                id,
                depositName,
                branchName,
                depositAccount,
                bankTypeName,
                cityName,
                provinceId,
                cityId,
                districtId,
                depositCity,
                depositBank,
                branchType,
                bankType,
            });
            if(data.errcode === 0) {
                 yield put({type: ISFETCHING, listIsFetching: false});
                yield put({ type: FILIALE_ENTRY_SAGA, params: {} });
            }
            else {
                yield put({type: ISFETCHING, listIsFetching: false});
                // yield put({
                //     type: EDIT_TABLE_DATA,
                //     params: {dataSource, index, id, isEdit: true}
                // });

            }
            break;
        }
        case START_STOP_TABLE_DATA: {
            let data = yield updateDataGenerator({
                id,
                branchName,
                depositName,
                branchType,
                depositAccount,
                depositCity,
                depositBank,
                enableStatus,
            });

            if(data.errcode === 0) {
                message.success('操作成功');
                yield put({type: ISFETCHING, listIsFetching: false});
                // yield put({
                //     type: START_STOP_TABLE_DATA,
                //     params: {dataSource, index, id}
                // });
                resolve();
            }
            else {
                yield put({type: ISFETCHING, listIsFetching: false});
                reject();
            }
            break;
        }
        case DELETE_TABLE_DATA: {
            let data = yield delBranchGenerator({
                id,
            });

            if(data.errcode === 0) {
                message.success('操作成功');
                
                params.callback && params.callback();
                yield put({type: ISFETCHING, listIsFetching: false});
                resolve();
            }
            else {
                yield put({type: ISFETCHING, listIsFetching: false});
                reject();
            }
            break;
        }
    }

    
}

export default function* watchCompanyEntryAsync() {
    yield takeEvery([
        FILIALE_ENTRY_SAGA, 
        SAVE_TABLE_DATA, 
        START_STOP_TABLE_DATA,
        ADD_TABLE_DATA,
        // DELETE_TABLE_DATA,
        ] , incrementAsync);
}




