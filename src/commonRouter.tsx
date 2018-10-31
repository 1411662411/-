import * as React from 'react';
import { Route } from 'react-router';

interface commonRouter {
    systemStr: any;
    ROUTER_PATH: any;
    onEnter: any;
    routerNavJson: any;
    routerJson:any;
}

const lazyLoadComponent = (lazyModule) => {
    return (location, cb) => {
        lazyModule(module => cb(null, module.default));
    }
}

class CommonRouter extends React.Component<commonRouter>{
    constructor(props){
        super(props)
    }
    newRenderRoute = (routerJson) => {
        const { 
            ROUTER_PATH, 
            systemStr,
            onEnter,
            routerNavJson,
        } = this.props;
        let __this:any = this;
        let routes:Array<JSX.Element|any> = [];
        routerJson.map(item => {
            if(item.children){
                if(item.component && `${item.system_url}${item.url}`.indexOf(systemStr) !==-1){
                    routes.push(
                        <Route path={`${ROUTER_PATH}${item.url}`} getComponent={lazyLoadComponent(routerNavJson[item.component])} onEnter={onEnter} />
                    )
                }
                let res = __this.newRenderRoute(item.children,true)
                // res && console.log();
                res && res.map(item => routes.push(item));
            }else if(item.component && `${item.system_url}${item.url}`.indexOf(systemStr) !==-1){
                routes.push(
                    <Route path={`${ROUTER_PATH}${item.url}`} getComponent={lazyLoadComponent(routerNavJson[item.component])} onEnter={onEnter} />
                )
            }
        })
        console.log(routes)
        return routes.length > 0 ? routes : null;
    }
    render(){
        console.log(321)
        const routers = this.newRenderRoute(this.props.routerJson);
        return routers
    }
}

export default CommonRouter