import React, {
    Component,
} from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {
    fetchFn
} from '../../util/fetch';
import {
    Form,
    Input,
    Modal,
    Button,
    Icon,
    message,
    Tooltip,
} from 'antd';
import {
    FormComponentProps,
    WrappedFormUtils,
} from 'antd/lib/form/Form'
import SelectCity from '../select-city/index';
import address from '../select-city/address.json';
import './expressAddress.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
export interface ExpressInfoData {
    id?: number | string;
    phone: number | string;
    name: string;
    email?: string;
    addressDetail: string;
    addressId: number[]
    addressName: string[];
}
interface ExpressAddressFormProps {

}
class ExpressAddressFormUi extends Component<ExpressAddressFormProps & ExpressInfoData & FormComponentProps, {}>  {
    constructor(props) {
        super(props);
    }
    formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 14,
            },
        }
    }
    formItemLayoutNolabel = {
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 14,
                offset: 8
            },
        }
    }
    validateTaxPhone = (rule, value, callback) => {
        value = String.prototype.trim.call(value === undefined ? '' : value);
        if (!/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(value)) {
            return callback('请输入正确的收票人手机号');
        }
        callback();
    }
    selectCityValidator = (rule, value, callback) => {
        if (!value || !value.selectVal || value.selectVal.length <= 0) {
            return callback('请选择收票人地址');
        }
        callback();
    }
    render() {
        const {
            form,
            name,
            phone,
            addressDetail,
            addressId,
            addressName,
        } = this.props;
        const {
            getFieldDecorator,
        } = form;
        const selectCityParams = {
            deepMap: [{ name: '省', value: addressId && addressId.length >= 1 ? addressId[0] : undefined }, { name: '市', value: addressId && addressId.length >= 2 ? addressId[1] : undefined }, { name: '区', value: addressId && addressId.length >= 3 ? addressId[2] : undefined }],
            // deepMap: [{name: '省'},{name: '市'},{name: '区'}],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder:'',
            address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 250,
            }, /* input 的样式 */
            onChange(selectVal, selectName, code) {  /* 选择到最后一层的回调 */
                console.log('change', selectVal, selectName, code)
            },
            onSelect(selectVal, selectName, code) { /* 每层选择的回调，除了， 除了最后一层调用onChange */
                console.log('select', selectVal, selectName, code)
            },
        }
        return (
            <Form>
                <FormItem label="收票人姓名" {...formItemLayout} >
                    {
                        getFieldDecorator('name', {
                            initialValue: name !== undefined ? name.toString() : '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入收票人姓名',
                                },
                                {
                                    max: 20,
                                    message: '请输入正确的收票人姓名，且控制在20字以内',
                                }
                            ]
                        })(
                            <Input />
                            )
                    }
                </FormItem>
                <FormItem label="收票人手机号" {...formItemLayout}>
                    {
                        getFieldDecorator('phone', {
                            initialValue: phone,
                            rules: [
                                {
                                    required: true,
                                    validator: this.validateTaxPhone
                                }
                            ]
                        })(
                            <Input />
                            )
                    }
                </FormItem>
                <FormItem label="收票人地址" {...formItemLayout}>
                    {
                        getFieldDecorator('addressId', {
                            initialValue: addressName && addressId ? {
                                selectVal: addressId,
                                selectName: addressName,
                            } : '',
                            rules: [
                                {
                                    required: true,
                                    validator: this.selectCityValidator
                                }
                            ]
                        })(
                            <SelectCity params={selectCityParams}></SelectCity>
                            )
                    }
                </FormItem>
                <FormItem {...this.formItemLayoutNolabel}>
                    {
                        getFieldDecorator('addressDetail', {
                            initialValue: addressDetail,
                            rules: [
                                {
                                    required: true,
                                    max: 100,
                                    message: '请输入正确的收票人地址，且控制在100字以内',
                                }
                            ]
                        })(
                            <TextArea style={{ marginTop: 15 }} />
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}
const ExpressAddressCreateForm = Form.create()(ExpressAddressFormUi);
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    }
}

interface ExpressAddressFormQuickProps {
    initialValue?: Immutable.Map<ExpressInfoData, any>;
    title?: string;
    onOk: (values) => void | boolean | Promise<any>;
    onCancel?: () => void | boolean | Promise<any>;
    close?: () => void;
}
interface ExpressAddressFormQuickState {
    okLoading: boolean;
}
class ExpressAddressFormQuick extends Component<ExpressAddressFormQuickProps, ExpressAddressFormQuickState> {
    constructor(props) {
        super(props);
        this.state = {
            okLoading: false
        }
    }
    ExpressAddressCreateForm;
    modalOnOK = () => {
        this.setState({
            okLoading: true,
        });
        const {
            onOk,
            close,
        } = this.props;
        this.ExpressAddressCreateForm.validateFieldsAndScroll((error, values) => {
            let result;
            if (error) {
                result = false;
            }
            else {
                result = values;
            }
            Promise.resolve(typeof onOk === 'function' ? onOk(result) : onOk).then((flag) => {
                if (flag === false || flag === undefined) {
                    this.setState({
                        okLoading: false,
                    });
                    return;
                }
                typeof close == 'function' && close();
            });
        })
    }
    modalOnCancel = () => {
        const {
            onCancel,
            close,
        } = this.props;
        typeof onCancel == 'function' && onCancel();
        typeof close == 'function' && close();
    }
    getInitialValue = () => {
        const {
            initialValue = Immutable.fromJS({}),
        } = this.props;
        const {
            name,
            phone,
            addressDetail,
            addressId,
            addressName,
            id,
        } = initialValue.toJS();
        if (id !== undefined) {
            return {
                name,
                phone,
                addressDetail,
                addressId,
                addressName,
                id,
            }
        }
        return {} as any;

    }
    render() {
        const {
            title,
        } = this.props;
        const {
            okLoading,
        } = this.state;
        return (
            <Modal
                title={title}
                visible={true}
                footer={
                    <div>
                        <Button onClick={e => this.modalOnCancel()}>取消</Button>
                        <Button type="primary" onClick={e => this.modalOnOK()} loading={okLoading}>确定</Button>
                    </div>
                }
                onCancel={() => this.modalOnCancel()}
            >
                <ExpressAddressCreateForm {...this.getInitialValue() } ref={(node:(WrappedFormUtils & Component<ExpressAddressFormProps, {}>)) => this.ExpressAddressCreateForm = node}></ExpressAddressCreateForm>
            </Modal>
        )
    }
}


const expressAddressFormQuick = (config: ExpressAddressFormQuickProps) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const close = () => {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }
    ReactDOM.render(
        <ExpressAddressFormQuick {...config} close={close}></ExpressAddressFormQuick>
        , div)
}

export class ExpressAddressForm extends Component<ExpressAddressFormProps & ExpressInfoData, {}> {
    constructor(props) {
        super(props);
    }
    private container;
    /**
     * 新增快捷方法
     */
    static add = (config: ExpressAddressFormQuickProps) => {
        return expressAddressFormQuick(config);
    }
    /**
     * 编辑快捷方法
     */
    static edit = (config: ExpressAddressFormQuickProps) => {
        return expressAddressFormQuick(config);
    }
    getResult = () => {
        let result;
        this.ExpressAddressCreateForm.validateFieldsAndScroll((error, values) => {
            if (error) {
                result = false;
            }
            else {
                result = values;
            }
        });
        return result;
    }
    ExpressAddressCreateForm;
    render() {
        return (
            <ExpressAddressCreateForm {...this.props} ref={node => this.ExpressAddressCreateForm = node}>
            </ExpressAddressCreateForm>
        )
    }
}

interface ExpressAddressProps {
    cId: number;
    activeId?: number;
    expressInfo: Immutable.List<Immutable.Map<keyof ExpressInfoData, any>>
    editExpressAddressApi: string;
    addExpressAddressApi: string;
    deleteExpressAddressApi: string;
    addCallback?: (value) => void;
    editCallback?: (value) => void;
    deleteCallback?: (value) => void;
    onChange?: (value) => void;
    checkCallback?: (id) => void;
}
interface ExpressAddressState {
    activeIndex: number;
    switchFlag: boolean;
}

/**
 * 获取高亮的索引
 * @param id {Number} id
 */
const getIndex = (id, data) => {
    let index = 0;
    for (let pair of data.entries()) {
        if (pair[1].id === id) {
            return index = pair[0];
        }
    }
    return index;
}
export class ExpressAddress extends Component<ExpressAddressProps, ExpressAddressState> {
    constructor(props) {
        super(props);
        const {
            activeId,
            expressInfo,
        } = this.props;
        this.state = {
            activeIndex: activeId !== undefined ? getIndex(activeId, expressInfo.toJS()) : 0,
            switchFlag: false,
        }
    }
    /**
     * 触发antd的form验证事件
     */
    triggerChange = (changedValue) => {
        const {
            onChange,
        } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    }
    transformValues = (values) => {
        const {
            id,
            addressDetail,
            addressName,
            addressId,
            phone,
            name,
        } = values;
        const {
            selectName,
            selectVal,
        } = addressId;
        return {
            id,
            name,
            addressDetail,
            phone,
            addressName: addressId.selectName,
            addressId: addressId.selectVal,
        }
    }
    changeState = (params) => {
        this.setState(params);
    }
    add = (e: any) => {
        const {
            addExpressAddressApi,
            addCallback,
            cId,
        } = this.props;
        e.preventDefault();
        
        ExpressAddressForm.add({
            title: '发票收票人信息',
            onOk: (values) => {
                if (values === false) return;
                const {
                    name,
                    phone,
                    addressDetail,
                    addressId,
                } = values;
                const params = {
                    cId,
                    country: 0,
                    province: addressId.selectVal[0],
                    city: addressId.selectVal[1],
                    district: addressId.selectVal[2],
                    address:addressDetail,
                    mobile: phone,
                    contacts: name,
                    cityName: addressId.selectName.join(' '),
                }
                return new Promise((resolve, reject) => {
                    fetchFn(addExpressAddressApi, params).then((responeData: any) => {
                        if (responeData.status === 0 || responeData.errcode === 0) {
                            resolve(true);
                            message.success('新增成功');
                            const newValues = this.transformValues({
                                ...values,
                                id: responeData.data,
                            });

                            /**
                             * 选择第一个
                             */
                            this.setState({
                                activeIndex: 0,
                            });
                            typeof addCallback === 'function' && addCallback(newValues);
                            this.triggerChange(newValues);
                        }
                        else {
                            resolve(false);
                        }
                    })
                    //setTimeout(() => resolve(true), 2000)
                });
            },
            onCancel: () => {
                return new Promise((resolve, reject) => {

                }).then()
            }
        })
    }
    check = (index) => {
        const {
            expressInfo,
            checkCallback,
        } = this.props;
        this.setState({
            activeIndex: index,
            switchFlag: false,
        });
        const data = expressInfo.get(index);
        typeof checkCallback === 'function' && checkCallback(data.get('id'));
        this.triggerChange(data.toJS());
    }
    delete = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        
        const {
            deleteExpressAddressApi,
            deleteCallback,
            cId,
        } = this.props;
        Modal.confirm({
            title: '确定删除该收票人信息？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return new Promise((resolve, reject) => {
                    fetchFn(deleteExpressAddressApi, {cId, id }).then((responeData: any) => {
                        if (responeData.status === 0 || responeData.errcode === 0) {
                            resolve(true);
                            message.success('删除成功');
                            typeof deleteCallback === 'function' && deleteCallback({
                                id,
                            });
                        }
                        else {
                            resolve(false);
                        }
                    })
                    //setTimeout(() => resolve(true), 2000)
                });
            }
        });
    }
    edit = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        const {
            editExpressAddressApi,
            editCallback,
            cId,
        } = this.props;
        ExpressAddressForm.edit({
            initialValue: value,
            title: '发票收票人信息',
            onOk: (values) => {
                console.log(values)
                if (values === false) return;
                const {
                    name,
                    phone,
                    addressDetail,
                    addressId,
                } = values;
                const params = {
                    id: value.get('id'),
                    cId,
                    country: 0,
                    province: addressId.selectVal[0],
                    city: addressId.selectVal[1],
                    district: addressId.selectVal[2],
                    address:addressDetail,
                    mobile: phone,
                    contacts: name,
                    cityName: addressId.selectName.join(' '),
                }
                return new Promise((resolve, reject) => {
                    fetchFn(editExpressAddressApi, params).then((responeData: any) => {
                        if (responeData.status === 0 || responeData.errcode === 0) {
                            resolve(true);
                            message.success('操作成功');
                            const newValues = this.transformValues({
                                ...values,
                                id: value.get('id'),
                            })
                            typeof editCallback === 'function' && editCallback(newValues);
                            this.triggerChange(newValues);
                        }
                        else {
                            resolve(false);
                        }
                    })
                    //setTimeout(() => resolve(true), 2000)
                });
            },
            onCancel: () => {
                return new Promise((resolve, reject) => {

                }).then()
            }
        })
    }
    switch = () => {
        this.setState({
            switchFlag: !this.state.switchFlag
        });
    }
    renderExpressInfo = () => {
        const {
            expressInfo,
        } = this.props;
        const {
            activeIndex,
            switchFlag,
        } = this.state;
        return expressInfo.map((value, index) => {
            return (
                value ?
                    switchFlag === true ?
                        <div className={index === activeIndex ? 'express-address-item active' : 'express-address-item'} key={index} onClick={() => this.check(index)}>
                            <div className="name">{value.get('name')}</div>
                            <div className="phone">{value.get('phone')}</div>
                            <div className="address">
                                <Tooltip placement="topLeft" title={value.get('addressName').toJS().join() + value.get('addressDetail')}>
                                    {value.get('addressName').toJS().join() + value.get('addressDetail')}
                                </Tooltip>
                            </div>
                            <div className="handle-wrapper">
                                <a href="" className="edit" onClick={e => this.edit(e, value)}>编辑</a>
                                {
                                    index !== activeIndex &&
                                    <a href="" className="delete" onClick={e => this.delete(e, value.get('id'))}>删除</a>
                                }
                            </div>
                            {
                                index === activeIndex &&
                                <span className="check-wrapper">
                                    <span className="triangle"></span>
                                    <Icon type="check" className="check" />
                                </span>
                            }
                        </div>
                        :
                        index === activeIndex && <div className={index === activeIndex ? 'express-address-item active' : 'express-address-item'} key={index} onClick={() => this.check(index)}>
                            <div className="name">{value.get('name')}</div>
                            <div className="phone">{value.get('phone')}</div>
                            <div className="address">
                                 <Tooltip placement="topLeft" title={value.get('addressName').toJS().join() + value.get('addressDetail')}>
                                    {value.get('addressName').toJS().join() + value.get('addressDetail')}
                                </Tooltip>
                            </div>
                            <div className="handle-wrapper">
                                <a href="" className="edit" onClick={e => this.edit(e, value)}>编辑</a>
                                {
                                    index !== activeIndex &&
                                    <a href="" className="delete" onClick={e => this.delete(e, value.get('id'))}>删除</a>
                                }
                            </div>
                            {
                                index === activeIndex &&
                                <span className="check-wrapper">
                                    <span className="triangle"></span>
                                    <Icon type="check" className="check" />
                                </span>
                            }
                        </div>
                    :
                    null
            )
        })
    }
    render() {
        const {
            expressInfo,
        } = this.props;
        const {
            activeIndex,
            switchFlag,
        } = this.state;
        return (
            <div>
                {
                    expressInfo && expressInfo.size > 0
                    ?
                    <div className="express-address-wrapper">
                        {
                            this.renderExpressInfo()
                        }
                        {
                            expressInfo.size > 1 &&
                            <div className="more-express-address-wrapper">
                                <span className="more-express-address" onClick={e => this.switch()}>
                                    {switchFlag ? '收起收票人' : '更多收票人'}<span className={switchFlag ? "switch-off" : "switch-on"}>< Icon type="double-right" /></span>
                                </span>
                            </div>
                        }
                    </div>
                    :
                    <div>
                        您还未添加发票收件人 <Button onClick={e => this.add(e)}>立即添加</Button>
                    </div>
                }
            </div>
        )
    };
}