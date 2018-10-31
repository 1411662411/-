import React from 'react'
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH, DOMAIN_OXT, _SELF, _BLANK, } from '../../../global/global';

import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu;

interface TStateProps {
    collapsed?: boolean;
    url: string;
    data: any[];
    openKeys: Array<any>;
    onOpenChange: any;
    handleClick?: any;
    currentKey?: any;
}

class LeftMenu extends React.Component<TStateProps>{
    constructor(props){
        super(props)
    }

    handleClick(event) {
        const e = event.item.props;
		// if (e.url.indexOf('link') > -1) {
        //     return;
        // }
        
        const { url } = this.props;
		const mainPage = sessionStorage.getItem('mainPage')!;
		const codes = sessionStorage.getItem('codes')!;
		sessionStorage.clear();
		sessionStorage.setItem('mainPage', mainPage);
		sessionStorage.setItem('codes', codes);

		/**
		 * 判断是否是新窗口外链
		 */
        
		// if (url !== e.systemUrl) {
		// 	return;
		// }

		/**
		 * 判断是否是外链
		 */
        // console.log(e.url.split('/'))
        // console.log(e.url)

		if (e.url.split('/')[1] !== 'newadmin') {
			return location.href = e.systemUrl + e.url;
        }
		browserHistory.push(`${ROUTER_PATH}${e.url}`);
    }

    renderNav(data: any, isOne = false): Array<any>|null{
        let { url } = this.props;
        // console.log('22',data)
        let __this = this;
        let navs: any[] = [];
        data.map((item, index) => {
            if(item.children && (item.type == 1 || item.type == 0)){
                let isPage = item.children.filter(item => item.type == 1 || item.type == 0)
                // console.log('isPage',isPage)
                if(isPage.length == 0){
                    if(!isOne){
                        navs.push(<Menu.Item systemUrl={item.system_url} key = {item.code} url = {item.url}>
                            <span>
                            { isOne && <Icon type={item.icon} />}
                            {item.url.split('/')[1] !== 'newadmin' ?
                                <a  title={item.name} onClick={(e) => {e.preventDefault()}} className="nav-text" href={`${item.system_url}${item.url}`} target="_blank" >{item.name}</a> :
                                <a onClick={(e) => {e.preventDefault()}} href={`${item.system_url}${item.url}`} title={item.name} className="nav-text">
                                    {item.name}
                                </a>
                            }
    
                        </span>
                        </Menu.Item>)
                    }
                    
                }else{
                    let elm = <SubMenu
                    title = {
                        <span>
                            { isOne && <Icon type={item.icon} />}
                            <span className="nav-text">
                                {item.name}
                            </span>
                        </span>
                    }
                    key = {item.code}
                    url = {`${item.system_url}${item.url}`}
                    >
                        {__this.renderNav(item.children)} 
                    </SubMenu>;
                    navs.push(elm)
                }
                
            }else if(item.type == 1 || item.type == 0 || item.type == 11){
                navs.push(<Menu.Item systemUrl={item.system_url} url = {item.url} key = {item.code}>
                    <span>
                        { isOne && <Icon type={item.icon} />}
                        {item.url.split('/')[1] !== 'newadmin' ?
                            <a title={item.name} onClick={(e) => {e.preventDefault()}} className="nav-text" href={`${item.system_url}${item.url}`} target="_blank" >{item.name}</a> :
                            <a href={`${item.system_url}${item.url}`} onClick={(e) => {e.preventDefault()}} title={item.name} className="nav-text">
                                {item.name}
                            </a>
                        }

                    </span>
                </Menu.Item>)
            }
        })
        return navs.length > 0 ? navs : null;
    }

    render(){
        let {
            data, 
            collapsed,
            onOpenChange,
            openKeys,
            handleClick,
            currentKey,
        } = this.props;
        // console.log(data.sort((a,b):any => {
        //     return Number(a.type) < Number(b.type);
        // }));
        // console.log(openKeys, '||', collapsed, '**', currentKey)
        const navs = this.renderNav(data, true);
        return (
            <Menu
                theme="dark"
                // onSelect={(e) => { collapsed && this.handleClick(e)}}
                onClick={(e) => {  this.handleClick(e)}}
                style={{ marginBottom: "45px" }}
                onOpenChange={onOpenChange}
                selectedKeys={currentKey}
                openKeys={openKeys}

                // mode={collapsed ? 'vertical' : 'inline'}
                mode = {'inline'}
                inlineCollapsed = {collapsed}
                inlineIndent={20}
            >
                {navs}

                {/* <Menu.Item style={{ backgroundColor: 'transparent' }} key='link'>
                    <a href={`${ROUTER_PATH}`}><Icon type="rollback" /><span className="nav-text">返回旧版</span></a>
                </Menu.Item> */}
            </Menu>
        )
    }
}

export default LeftMenu