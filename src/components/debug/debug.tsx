import React, { Component } from 'react';
import {
	Modal,
	Alert,
	Form,
	Input,
	Button,
	message,
} from 'antd';


import {
	FormComponentProps,
	WrappedFormUtils,
} from 'antd/lib/form/Form';
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 14 },
	},
};


let domianOxtDefault;
let routerPathDefault;
if (__DEV__) {
	domianOxtDefault = "https://oxt.joyomm.com/admindev";
	routerPathDefault = "/admindev";
}
if (__ALPHA__) {
	domianOxtDefault = "https://oxt.joyomm.com/admin";
	routerPathDefault = "/admin";
}
if (__BETA__) {
	domianOxtDefault = "https://tigert.joyomm.com/admin";
	routerPathDefault = '/admin';
}
if (__PRODUCT__) {
	domianOxtDefault = "https://tianwu.joyowo.com/admin"
	routerPathDefault = '/admin';
}

class DebugForm extends Component<{} & FormComponentProps, {}> {
	urlValidator = (rule, value, callback) => {
		if (!/^((http:\/\/)|(https:\/\/))/.test(value)) {
			return callback('请填写http或者https的地址')
		}
		callback();
	}
	render() {
		const proxyApi = localStorage.getItem('proxyApi') || JSON.stringify({
			domainOxt: domianOxtDefault,
			routerPath: routerPathDefault,
		});
		const {
			domainOxt,
			routerPath,
		} = JSON.parse(proxyApi)
		const {
			form
		} = this.props;
		const {
            getFieldDecorator,
        } = form;
		return (
			<Form>
				<FormItem
					{...formItemLayout}
					label="请求API域名"
					hasFeedback
					extra={<div>
						修改例如：
									<ol style={{ marginLeft: 20 }}>
							<li>
								1. http://localhost:8181/admindev
										</li>
							<li>
								2. http://localhost:8181
										</li>
							<li>
								...
										</li>
						</ol>
					</div>}
				>
					{getFieldDecorator('domainOxt', {
						initialValue: domainOxt,
						rules: [
							{
								required: true,
								validator: this.urlValidator,
							}
						],
					})(
						<Input placeholder="http://localhost:8181/admindev" />
						)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="路径的前缀"
					hasFeedback
					extra={<div>
						例如：
							<div style={{ marginLeft: 20 }}>
								首页路由为 “/admin/newadmin/basic/common”
								<br/>
								这个 <strong>“/admin”</strong>就是这个修改配置。
								<br/>
								不填写就是会修改成 “/newadmin/basic/common”
								</div>
					</div>}
				>
					{getFieldDecorator('routerPath', {
						initialValue: routerPath,
					})(
						<Input />
						)}
				</FormItem>
			</Form>
		)
	}
}
const DebugCreatForm = Form.create()(DebugForm);


interface DebugState {
	visible: boolean;
}
const style = {
	strong: {
		color: '#f04134',
	}
}
export default class extends Component<{}, DebugState> {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
		}
	}
	DebugCreatForm: WrappedFormUtils & Component<{} & FormComponentProps, {}>
	reset = () => {
		localStorage.removeItem('proxyApi');
		message.success('重置成功', 1.5, () => {
			this.redirect();
		});
	}
	setProxy = () => {
		this.DebugCreatForm.validateFieldsAndScroll((error, values) => {
			if (error) {

			}
			else {
				localStorage.setItem('proxyApi', JSON.stringify(values));
				message.success('设置成功', 1.5, () => {
					this.redirect();
				});
			}
		})

	}
	redirect = () => {
		const url = location.origin + location.pathname;
		const searchArray = location.search.slice(1).split('&');
		if (searchArray.length === 1) {
			location.href = url;
		}
		else {
			let deleteindex;
			for (let [index, data] of searchArray.entries()) {
				if (data === 'debug=true') {
					deleteindex = index;
					break;
				}
			}
			if (deleteindex !== undefined) {
				searchArray.splice(deleteindex, 1);
			}
			location.href = `${url}?${searchArray.join('&')}`
		}
	}
	render() {
		return (
			<Modal
				visible={this.state.visible}
				title="代理配置"
				closable={true}
				onCancel={() => this.redirect()}
				footer={
					<div>
						<Button onClick={() => this.reset()}>重置</Button>
						<Button type="primary" onClick={() => this.setProxy()}>确定</Button>
					</div>
				}
			>
				<Alert
					message="api代理"
					description={<span>修改本地请求代理, 修改后存在 <strong style={style.strong}>localStorage</strong>中的<strong style={style.strong}>proxyApi</strong>字段中</span>}
					type="warning"
					showIcon
					style={{ marginBottom: 50 }}
				/>
				<DebugCreatForm ref={(node: WrappedFormUtils & Component<{} & FormComponentProps, {}>) => this.DebugCreatForm = node}></DebugCreatForm>
			</Modal>
		)
	}
}


