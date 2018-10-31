/**
 * Created by caozheng on 2017/1/4.
 */
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import AppRouter from './router';
import entryStores from './stores/entryStores';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import query from './util/query';
import Debug from './components/debug/debug';
const history = syncHistoryWithStore(browserHistory, entryStores, {
    selectLocationState(state) {
        return state.get('routing');
    },
});

// history.listen(location => console.log(location))
class Root extends React.Component<any, any> {
    componentDidMount() {
        document.title = '金柚网后台管理';
    }
    isDebug = () => {
        if(query('debug') === 'true') {
            return true;
        }
        return false;
    }
    render() {
        if (!__PRODUCT__) {
            const debug = this.isDebug();
            return (
                debug ?
                <Debug />
                :
                <Provider store={entryStores}>
                    <AppRouter history={history} />
                </Provider>
            );
        }
        else {
            return (
                <Provider store={entryStores}>
                    <AppRouter history={history} />
                </Provider>
            );
        }

    }
}
ReactDOM.render(<Root />, document.getElementById('wrapper'));