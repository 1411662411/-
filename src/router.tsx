/**
 * Created by caozheng on 2017/1/4.
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Router, IndexRoute, Redirect } from 'react-router';
import { ROUTER_PATH } from './global/global';
import {
    getPermission,
} from './action/routerPermissionAction';
import { Dispatch } from 'redux';
import {
    getSideData,
} from './action/mainPage/index'
import { Spin, LocaleProvider } from 'antd';
import zhCn from 'antd/lib/locale-provider/zh_CN';
import * as Index from './pages/index/index';
import * as MainPage from "./pages/mainPage";
import * as NoMatch from './pages/404';
import { Map } from 'immutable';
import routerNavJson from './routerNavJson/index';

import * as authorityPage from './pages/authority/';
import * as AdviserOrderList from './pages/socialManagement/adviserOrderList';


// import CommonRouter from './CommonRouter'
function lazyLoadComponents(lazyModules) {
    return (location, cb) => {
        const moduleKeys = Object.keys(lazyModules);
        const promises = moduleKeys.map(key => {
            return new Promise(resolve => lazyModules[key](resolve))
        }
        )

        Promise.all(promises).then(modules => {
            cb(null, modules.reduce((obj, module, i) => {
                obj[moduleKeys[i]] = module;
                return obj;
            }, {}))
        })
    }
}

const lazyLoadComponent = (lazyModule) => {
    return (location, cb) => {        
        lazyModule(module => {
            cb(null, module.default)
        });
    }
}

type AppRouterType = TStateProps & TOwnProps & { dispatch: Dispatch<any>};

// interface AppRouterType {
//     history?: any;
//     dispatch: any;
// }
interface TStateProps {
    permissionReady: boolean;
    routerJson: Map<any, any>;
    navJson: Map<any, any>;
    leftNavJson: Map<any, any>;
}
interface TOwnProps {
    history?: any;
}

class AppRouter extends React.Component<AppRouterType, any> {
    constructor(props: any) {
        super(props);
        this.state={
            isAuthority: false,
        }
    }
    componentWillMount() {
        let pathname = location.pathname.split('/');
        pathname.pop();
        // console.log(pathname.join('/'), ROUTER_PATH);
        if(pathname.join('/') !== `${ROUTER_PATH}/authority`){
            this.setState({isAuthority: false});
            this.props.dispatch(getPermission({}));
        }else{
            this.setState({isAuthority: true});
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     const thisProps = this.props || {};
    // 	const thisState = this.state || {};
    // 	nextProps = nextProps || {};
    // 	nextState = nextState || {}
    //     if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
    //         return true;
    //     }
    //     for (const key in nextProps) {
    // 		if(key === 'routeParams' || key === 'children') {
    // 			continue
    // 		}
    //         if (!Immutable.is(thisProps[key], nextProps[key])) {
    //             return true;
    //         }
    //     }

    //     for (const key in nextState) {
    //         if (thisState[key] !== nextState[key] || !Immutable.is(thisState[key], nextState[key])) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    routerEnter = () => {
        const {
            history,
            dispatch,
            navJson,
            leftNavJson,
        } = this.props;
        // dispatch(getSideData({
        //     location: history.getCurrentLocation(),
        //     navJson: navJson.toJS(),
        // }));
        let pathname = location.pathname.split('/').slice(2,).join('/');
        // console.log(pathname)
        if(pathname.indexOf('newadmin/crm/workbenchconfig/setting') !== -1 || pathname == 'newadmin/crm/workbench'){
            document.querySelectorAll('.ant-breadcrumb + div')[0] && document.querySelectorAll('.ant-breadcrumb + div')[0].setAttribute('style',"padding: 0px; background: #F0F3F8; min-height: 750px;");
        }else{
            document.querySelectorAll('.ant-breadcrumb + div')[0] && document.querySelectorAll('.ant-breadcrumb + div')[0].setAttribute('style',"padding: 24px; background: #FFF; min-height: 750px;");
        }
        dispatch(getSideData({
            location: history.getCurrentLocation(),
            navJson: leftNavJson.toJS(),
        }));
        window.scrollTo(0,0);
    }
    renderRoute = (routerJson) => {
        let routes:Array<JSX.Element> = [];
        for (let index in routerJson) {
            let obj = routerJson[index];
            if (obj.path) {
                routes.push(
                    <Route path={obj.path} getComponent={lazyLoadComponent(obj.component)} onEnter={this.routerEnter} />
                )
            }

        }
        // console.log(routes)
        return routes;
    }
    newRenderRoute = (routerJson, permissionReady) => {
        if(!permissionReady){
            return [];
        }
        let __this:any = this;
        let routes:Array<JSX.Element|any> = [];
        routerJson.map(item => {
            if(item.children){
                if(item.component){
                
                // if(item.component && `${item.system_url}${item.url}`.indexOf('admin/newadmin') !==-1){
                    routes.push(
                        <Route path={`${ROUTER_PATH}${item.url}`} getComponent={lazyLoadComponent(routerNavJson[item.component])} onEnter={this.routerEnter} />
                    )
                }
                let res = __this.newRenderRoute(item.children,true)
                // res && console.log();
                res && res.map(item => routes.push(item));
            }else if(item.component){
                

            // }else if(item.component && `${item.system_url}${item.url}`.indexOf('admin/newadmin') !==-1){
                routes.push(
                    <Route path={`${ROUTER_PATH}${item.url}`} getComponent={lazyLoadComponent(routerNavJson[item.component])} onEnter={this.routerEnter} />
                )
            }
        })
        // console.log(routes)
        return routes.length > 0 ? routes : null;
    }
    render() {
        const {isAuthority} = this.state;
        const history = this.props && this.props.history;
        const routerProps = {
            getComponent: lazyLoadComponent(MainPage),
        };
        // const routers = this.renderRoute(this.props.routerJson.toJS());
        const permissionReady = this.props.permissionReady;
        const routers = this.newRenderRoute(this.props.leftNavJson.toJS(), permissionReady);
        // console.log(this.getC(this.props.leftNavJson.toJS()))
        return (
            <div>
                {
                    isAuthority === true ? <LocaleProvider locale={zhCn}>
                    <Router history={history}>
                        <Route path={`${ROUTER_PATH}/authority/*`} getComponent={lazyLoadComponent(authorityPage)} />
                    </Router>
                    </LocaleProvider>

                    : permissionReady === true ?
                        <LocaleProvider locale={zhCn}>
                        <Router history={history}>
                            <Redirect from={`${ROUTER_PATH}/`} to={`${ROUTER_PATH}/newadmin/crm/workbench`} ></Redirect>
                            <Route path={`${ROUTER_PATH}/authority/*`} getComponent={lazyLoadComponent(authorityPage)} />
                            <Route path={`${ROUTER_PATH}/newadmin/singlepage/*`} getComponent={lazyLoadComponent(AdviserOrderList)}/>
                            <Route path={`${ROUTER_PATH}/basic/common`} {...routerProps}>
                                <IndexRoute getComponent={lazyLoadComponent(Index)} onEnter={this.routerEnter} />
                                {routers}
                                {/* <CommonRouter 
                                    systemStr = {'admin/newadmin'}
                                    ROUTER_PATH = {ROUTER_PATH}
                                    onEnter = {this.routerEnter}
                                    routerNavJson = {this.props.leftNavJson.toJS()}
                                    routerJson = {this.props.leftNavJson.toJS()}
                                ></CommonRouter> */}
                                <Route path={`${ROUTER_PATH}/*`} getComponent={lazyLoadComponent(NoMatch)} />
                            </Route>
                        </Router>
                        </LocaleProvider>
                        :
                        (<div style={{ width: 100, height: 50, position: 'fixed', left: '50%', margin: '-25px 0 0 -50px', top: '50%' }}>
                            <Spin size="large" tip="加载中..." />
                        </div>)

                }
            </div>
        )
    }
}


const mapStateToProps = (state:Any.Store, ownProps: TOwnProps):TStateProps => {
    const data = state.getIn(['routerPermission']);
    return {
        permissionReady: data.getIn(['permission', 'permissionReady']),
        routerJson: data.getIn(['permission', 'routerJson']),
        navJson: data.getIn(['permission', 'navJson']),
        leftNavJson: data.getIn(['permission', 'leftNavJson']),
    }
}
export default connect(mapStateToProps)(AppRouter)



