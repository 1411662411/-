import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import { 
    WORKBENCH_CONFIG_GET_PROCLAMATION, 
    WORKBENCH_CONFIG_GET_ALL, 
    setProclamation, 
    loading, 
    WORKBENCH_CONFIG_GET_ANNOUNCEMENT,
    setAnnouncement,
    WORKBENCH_CONFIG_GET_WELCOME_CONTENT,
    setWelcomeContent,
    WORKBENCH_CONFIG_GET_CONFIG_LIST,
    setPositionList,
    setConfigLoading,
    setConfigList,
} from '../../../action/crm/WorkbenchConfig';
import { 
    getBulletinBoard, 
    getConfigList, 
    getAnnouncement, 
    getWelcomeContent,
    getPositionListApi,
 } from '../../../api/crm/WorkbenchConfig';

import { message } from 'antd';


function* getBulletinBoardSaga({type, params}) {
    yield put(loading(true))
    try {
    switch (type){
        case WORKBENCH_CONFIG_GET_ALL: {
            let [
                proclamation, 
                config, 
                welCome,
                list,
            ] = yield [
                        getBulletinBoard(params.proclamation), 
                        getConfigList(params.config), 
                        getWelcomeContent(params.welCome),
                        getPositionListApi({key: '_POSITION'}),
                    ];
            // console.log(proclamation, 
            //     config, 
            //     welCome,
            //     list,)
            yield [
                put(setProclamation({...proclamation.data})),
                put(setConfigList({...config.data})),
                put(setWelcomeContent(welCome.data)),
                put(setPositionList(list.data)),
            ];
            break;
        };
        case WORKBENCH_CONFIG_GET_PROCLAMATION: {
            
            let res = yield getBulletinBoard(params);
            let { data } = res;
            // console.log(data)
            yield put(setProclamation(data));
            break;
        };
        case WORKBENCH_CONFIG_GET_ANNOUNCEMENT: {
            let res = yield getAnnouncement(params);
            if(res.data){
                yield put(setAnnouncement(res.data));
            }else{
                message.error('暂无数据')
            }
            break;
        }
        case WORKBENCH_CONFIG_GET_WELCOME_CONTENT: {
            let res = yield getWelcomeContent(params);
            if(res.data){
                yield put(setWelcomeContent(res.data));
            }else{
                message.error('暂无数据')
            }
            break;
        }
        case WORKBENCH_CONFIG_GET_CONFIG_LIST: {
            yield put(setConfigLoading(true))
            let res = yield getConfigList(params);
            if(res.data){
                yield put(setConfigList(res.data));
            }else{
                message.error('暂无数据')
            }
            yield put(setConfigLoading(false))
            break;
        }
    }
    }
    catch (error) {
        message.error(error.toString(), 3);
    }
    yield put(loading(false))
}

export default function* watchGetBulletinBoard() {
    yield takeEvery([
        WORKBENCH_CONFIG_GET_ALL,
        WORKBENCH_CONFIG_GET_PROCLAMATION,
        WORKBENCH_CONFIG_GET_ANNOUNCEMENT,
        WORKBENCH_CONFIG_GET_WELCOME_CONTENT,
        WORKBENCH_CONFIG_GET_CONFIG_LIST,
    ], getBulletinBoardSaga);
}