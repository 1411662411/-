import { takeEvery } from 'redux-saga';
import { put, all } from 'redux-saga/effects';
import {
    ROUTER_PATH,
} from '../../global/global';
import {
    message,
    Modal,
} from 'antd';
import {
    LIST_SAGA,
    listFetching,
    listSet,
    LIKE_SAGA,
    REPLY_SAGA,
    replyFetching,
    REPLY_LIST_SAGA,
    replylistFetching,
    replylistSet,
} from '../../action/feedback/feedBackListAction';
import {
    getList,
    like,
    reply,
    replylist,
} from '../../api/feedback/feedBackListApi'




function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    switch (type) {
        case LIST_SAGA: {
            yield put(listFetching(true))
            const userId = params.userId;
            delete params.userId;
            let [listData, likeData] = yield all([
                getList(params),
                getList({...params, userId}),
            ]);
            if (listData.status === 0) {
                yield put(listSet({listData, likeData }));
            }
            yield put(listFetching(false))
            break;
        }
        case LIKE_SAGA: {
            yield put(listFetching(true))
            const responeData = yield like(params);
            if (responeData.status === 0) {
                typeof callback === 'function' && callback();
            }
            yield put(listFetching(false))
            break;
        }
        case REPLY_SAGA: {
            yield put(replyFetching(true))
            const responeData = yield reply(params);
            
            if (responeData.status === 0) {
                message.success('回复成功');
                typeof callback === 'function' && callback();
            }
            yield put(replyFetching(false))
            break;
        }
        case REPLY_LIST_SAGA: {
            yield put(replylistFetching(true))
            const responeData = yield replylist(params);
            
            if (responeData.status === 0) {
                yield put(replylistSet(responeData));
            }
            yield put(replylistFetching(false))
            break;
        }

        

        
    }
}

export default function* watchChapterInfoEnter() {
    yield takeEvery([
        LIST_SAGA,
        LIKE_SAGA,
        REPLY_SAGA,
        REPLY_LIST_SAGA,
    ], incrementAsync);
}

