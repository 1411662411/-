/**
 * Created by caozheng on 2017/1/4.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import indexReduces from '../reducers/index';

import {getSagaList} from './../sagas/index';

// import logger from './../middleware/loggerMiddleWare';
// import * as createLogger from 'redux-logger'
import createSagaMiddleware  from 'redux-saga';
// import thunkMiddleware from 'redux-thunk';



const sagaMiddleware = createSagaMiddleware();


const store = createStore(
    indexReduces,
    applyMiddleware(sagaMiddleware)
);

const sagaRun = sagaMiddleware.run;

for(const saga in getSagaList) {
    sagaRun( getSagaList[saga] )
}

export default store;