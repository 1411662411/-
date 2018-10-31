/**
 * Created by caozheng on 2016/12/28.
 */
declare function require(string): string;
import * as React from "react";
import { Layout, Menu, Breadcrumb, Icon, notification, Badge } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import "./../css/mainPage.less";
import { getSideType, getSideData, setOpenKeys } from "./../action/mainPage";
import { browserHistory } from 'react-router';
import { ROUTER_PATH, DOMAIN_OXT, _SELF, _BLANK, WSS, PHP_DOMAIN } from '../global/global';
import * as Immutable from 'immutable';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const selfRegExp = new RegExp(`${_SELF}/`);
const blankRegExp = new RegExp(`${_BLANK}/`);
// interface MainPageProps {
// 	// type?: any,

import LeftMenu from '../components/common/leftMenu'
import createWebSocket from '../util/createWebsocket'

// 	// children?: any,

// 	// location?: any;




// }

interface TStateProps {
	collapsed?: boolean;
	currentKey?: any;
	names?: any;
	openKeys?: any;
	navJson?: any;
	userInfo?: any;
	leftNavJson?: any;
	messageCount: boolean;
}

interface TDispatchProps {
	dispatch: any;
}


type MainPageProps = TStateProps & TDispatchProps;

class MainPage extends React.Component<MainPageProps, any> {
	navNode: Array<any>;
	constructor(props) {
		super(props);
		this.state={
			messageCount: null,
		}
		this.createWebSocket()
		const codes = new Set(this.getCodes(this.props.leftNavJson.toJS()));
		sessionStorage.setItem('codes', JSON.stringify(codes))
	}
	getCodes(data){
		let codes:any[] = [];
		data.map(item => {
			codes.push(item.code);
			if(item.children){
				codes = [...codes, ...this.getCodes(item.children)];
			}
		})
		return codes;
	}
	// componentDidMount() {
	// 	const { dispatch } = this.props;
	// 	const obj = this.matchPath();
	// 	const {
	// 		keyPath,
	// 		currentKey,
	// 		openKeys,
	// 	} = obj;

	// 	/**
	// 	 * 这里keyPath的生成中文面包屑的问题还需要解决
	// 	 */
	// 	dispatch(getSideData(keyPath, currentKey, openKeys));
	// }


	matchPath: () => { keyPath: Array<string>, currentKey: string, openKeys: Array<string> } = () => {
		console.time('url与silde的matchPath');
		const pathName = location.pathname;
		const navJson = this.props.navJson.toJS();
		let keyPath: Array<string> = [];
		let openKeys: Array<string> = [];
		const findParents = (pathName) => {
			if (Object.prototype.hasOwnProperty.call(navJson, pathName)) {
				const pathObj = navJson[pathName];
				const {
					parents,
					hide,
				} = pathObj;
				if (!hide) {
					openKeys.unshift(pathName);
					keyPath.unshift(pathName);
				}
				if (parents && parents.length > 0) {
					findParents(parents[0]);
				}
			}
		}
		findParents(pathName);
		console.timeEnd('url与silde的matchPath');

		return {
			currentKey: pathName,
			keyPath,
			openKeys,
		}
	}
	onCollapse = () => {
		const { dispatch, collapsed, leftNavJson } = this.props;
		// console.log('onCollapse')
		if(collapsed){
			dispatch(getSideType({
				location: document.location,
            	navJson: leftNavJson.toJS(),
			}));
			
		}else{
			dispatch(getSideType(false));
		}
	};
	handleClick(e) {
		// console.log(e)
		if (e.key.indexOf('link') > -1) {
			return;
		}
		const { dispatch } = this.props;
		const mainPage = sessionStorage.getItem('mainPage')!;
		sessionStorage.clear();
		sessionStorage.setItem('mainPage', mainPage);

		/**
		 * 判断是否是新窗口外链
		 */
		if (blankRegExp.test(e.key)) {
			return;
		}

		/**
		 * 判断是否是外链
		 */
		if (selfRegExp.test(e.key)) {
			return location.href = e.key.replace(selfRegExp, '');
		}

		browserHistory.push(e.key);
	}
	onOpenChange(openKeys) {
		const { dispatch, leftNavJson } = this.props;
		dispatch(setOpenKeys(openKeys, leftNavJson.toJS()));
	}
	compare(property){
		return function(a,b){
			// 未设置index 排后面
			var value1 = a[property] || 100;
			var value2 = b[property] || 100;
			return value1 - value2;
		}
	}
	sortFilterChild = (array:Array<Array<any>>) => {
		let newArray:Array<any> = [];
		array.forEach(value => {
			newArray = newArray.concat(value);
		});
		// 根据对象里的index排序
		return newArray.sort(this.compare('index')).map(obj => obj.node);
	}
	renderNav = (routerNavJson) => {	
		if (this.navNode) {
			return this.navNode;
		}
		// console.time('renderNav');
		const deepReducer = (data, isChildren?: boolean) => {
			let navNode: Array<any> = [];
			for (let key in data) {
				const obj = data[key];
				if (!obj) continue;

				const {
					parents,
					children,
					path,
					name,
					type,
					hide,
					className,
					index,
				} = obj;

				/**
				 * 跳过需要隐藏的
				 */
				if (hide) continue;

				/**
				 * 父级
				 */
				if (!isChildren) {
					if (!parents) {
						if (path) {
							let nodeObj: any = {
								node: (
									<Menu.Item className={className} key={path}>
										<span>
											{type && <Icon type={type} />}
											{blankRegExp.test(path) ?
												<a className="nav-text" href={path.replace(blankRegExp, '')} target="_blank" >{name}</a> :
												<span className="nav-text">
													{name}
												</span>
											}

										</span>
									</Menu.Item>
								),
							}
							if (index !== undefined) {
								nodeObj.index = index;
							}
							navNode.push(nodeObj);
						}
						else {
							// console.log(children && children.map(value => deepReducer({ [value]: routerNavJson[value] }, true)))
							let nodeObj: any = {
								node: (
									<SubMenu className={className} key={key}
										title={
											<span>
												{type && <Icon type={type} />}
												{blankRegExp.test(path) ?
													<a className="nav-text" href={path.replace(blankRegExp, '')} target="_blank" >{name}</a> :
													<span className="nav-text">
														{name}
													</span>
												}

											</span>
										}>
										{children && this.sortFilterChild(children.map(value => deepReducer({ [value]: routerNavJson[value] }, true)))}
									</SubMenu>
								)
							}
							if (index !== undefined) {
								nodeObj.index = index;
							}
							navNode.push(nodeObj);
						}
					}
				}
				/* 子级 */
				else {
					if (path) {
						let nodeObj: any = {
							node: (
								<Menu.Item className={className} key={path}>
									<span>
										{type && <Icon type={type} />}
										{blankRegExp.test(path) ?
											<a className="nav-text" href={path.replace(blankRegExp, '')} target="_blank" >{name}</a> :
											<span className="nav-text">
												{name}
											</span>
										}

									</span>
								</Menu.Item>
							)
						}
						if (index !== undefined) {
							nodeObj.index = index;
						}
						navNode.push(nodeObj);
						// navNode.push(
						// 	<Menu.Item className={className} key={path}>
						// 		<span>
						// 			{type && <Icon type={type} />}
						// 			<span className="nav-text">
						// 				{name}
						// 			</span>
						// 		</span>
						// 	</Menu.Item>
						// );
					}
					else {

						let nodeObj: any = {
							node: (
								<SubMenu className={className} key={key}
									title={
										<span>
											{type && <Icon type={type} />}
											{blankRegExp.test(path) ?
												<a className="nav-text" href={path.replace(blankRegExp, '')} target="_blank" >{name}</a> :
												<span className="nav-text">
													{name}
												</span>
											}

										</span>
									}>
									{children && this.sortFilterChild(children.map(value => deepReducer({ [value]: routerNavJson[value] }, true)))}
								</SubMenu>
							)
						}
						// navNode.push(
						// 	<SubMenu className={className} key={key}
						// 		title={
						// 			<span>
						// 				{type && <Icon type={type} />}
						// 				<span className="nav-text">
						// 					{name}
						// 				</span>
						// 			</span>
						// 		}>
						// 		{children && children.map(value => deepReducer({ [value]: routerNavJson[value] }, true))}
						// 	</SubMenu>
						// )
						if (index !== undefined) {
							nodeObj.index = index;
						}
						navNode.push(nodeObj);
					}
				}
			}
			return navNode;
		}

		/**
		 * 按照索引排序从小到大
		 */

		let tempNavNode = deepReducer(routerNavJson).sort((obj1, obj2) => obj1.index > obj2.index ? 1 : 0);

		/**
		 * 取出需要的node
		 */
		this.navNode = tempNavNode.map(obj => obj.node);
		// console.timeEnd('renderNav');
		return this.navNode;
	}
	changeDocumentTitle = (names) => {
		const name = names[names.length - 1];
		if (name.title !== '' && name.title !== document.title) {
			document.title = name.title;
		}
	}
	createWebSocket(){
		new createWebSocket({
			url:`${WSS}/api/ws/connect`,
			// onopen:()=>{console.log('')},
			// onerror:(err)=>{console.log(err)},
			onmessage:(message) => {
				if(message.data != '连接成功'){
					notification.open({
						message:' ',
						description: <a className='crm-notification-message' style={{color:'#999'}} target='_blank'  href={`${DOMAIN_OXT}/newadmin/crm/workbench/message`} dangerouslySetInnerHTML={{ __html: message.data }}></a>,
					})
				}
				
			}
		})
	}
	render() {
		
		const props = this.props;
		let {
    		names,
			openKeys,
			navJson,
			collapsed,
			userInfo,
			leftNavJson,
			currentKey,
			messageCount,
    	} = props;
		typeof names == 'string' && (names = [{path: '/newadmin/crm/workbench', breadcrumbName:`<span>${names}</span>`, title: '销售管理平台'}]);
		// 
		openKeys instanceof Array || (openKeys = []);
		// const navs = this.renderNav(navJson.toJS());

		let newMessage = this.state.messageCount !== null ? this.state.messageCount : messageCount;
			
		// const navs = this.renderNav(leftNavJson.toJS());
		this.changeDocumentTitle(names);
		const children = props.children;
		return (
			<Layout style={{ flexFlow: "nowrap" }}>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={this.onCollapse}
					className="layout-sider"
				>
					<div className="logo">
						金柚网
            		</div>
					{/* <XXXX key="https://oxt.joyomm.com/admin/newAdmin" /> */}
					<LeftMenu
						url='https://oxt.joyomm.com/admin'
						collapsed={collapsed}
						data={leftNavJson.toJS()}
						openKeys={openKeys}
						currentKey = {currentKey}
						onOpenChange={this.onOpenChange.bind(this)}
					/>
				</Sider>
				<Layout className="ant-layout-right" >
					<Header className="ant-layout-header" key="2" style={{position:'relative'}} >
						<Icon
							className="collapsed-trigger"
							type={collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.onCollapse}
						/>
						<div className='header-icons' style={{marginRight: 20}}>
						<Badge
							dot={newMessage}
						><a style={{color:'#999'}} target='_blank' href={`${DOMAIN_OXT}/newadmin/crm/workbench/message`}>
							<i className={`crmiconfont crmicon-xiaoxitixing-wuxiaoxi`}></i>
						</a></Badge>
						<div className="header-user-wrapper" style={{display: 'inline-block',height: 64, verticalAlign: 'middle', marginLeft: 5, marginRight: 5}}>
							<Menu
								// onClick={this.handleClick}
								mode="horizontal"
								selectable={false}
							>
								<SubMenu title={<span><Icon type="user" />{userInfo.name}</span>}>
									{/* <MenuItemGroup title="users"> */}
										{/*<Menu.Item key="setting:1">更改账号</Menu.Item>*/}
										<Menu.Item key="userInfo">
											<Link to={`${DOMAIN_OXT}/newadmin/userinfo`}>
												<Icon type="user" />
												个人资料
                      						</Link>
										</Menu.Item>
										<Menu.Item key="setting:2">
											<a target='_blank' href={`${PHP_DOMAIN}/privilege/account/editpassword`}>
												<Icon type="setting" />
												修改密码
                      						</a>
										</Menu.Item>
										<Menu.Item key="setting:1">
											<a target='_blank' href={`${DOMAIN_OXT}/feedback/feedback`}>
												<Icon type="mail" />
												使用反馈
                      						</a>
										</Menu.Item>
									{/* </MenuItemGroup> */}
								</SubMenu>
							</Menu>
						</div>
						<span><a style={{color: '#5f5f5f'}} href={`${DOMAIN_OXT}/logout`}>
							<Icon type="logout" style={{marginRight: 5}} />	
							安全退出
						</a></span>
						</div>
					</Header>
					{/*主体内容*/}
					<Content key="1" style={{ margin: "12px 16px 24px" }}>
						<Breadcrumb className='static-breadcrumb' style={{ margin: '12px 0' }} separator="_" itemRender={(route, params, routes, paths) => {
							return <span dangerouslySetInnerHTML={{__html:route.breadcrumbName}}></span>
						}} routes={names}/>
						<div style={{ padding: 24, background: '#fff', minHeight: 750,}}>
							{children}
						</div>
					</Content>
					{/*footer*/}
					<Footer className="layout-footer">
						Copyright © 2017 - 2018杭州今元标矩科技有限公司 版权归今元集团所有
            		</Footer>
				</Layout>
			</Layout>
		);
	}
}

const mapStateToProps = (state: any): TStateProps => {
	return {
		collapsed: state.getIn(['mainPage', 'collapsed']),
		names: state.getIn(['mainPage', 'navNames', 'names']),
		currentKey: state.getIn(['mainPage', 'navNames', 'currentKey']),
		openKeys: state.getIn(['mainPage', 'navNames', 'openKeys']),
		navJson: state.getIn(['routerPermission', 'permission', 'navJson']),
		userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
		leftNavJson: state.getIn(['routerPermission', 'permission', 'leftNavJson']),
		messageCount: state.getIn(['routerPermission', 'messageCount']),
	}
}
export default connect(mapStateToProps)(MainPage)





