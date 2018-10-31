import * as React from 'react';
import * as moment from 'moment';
import * as Immutable from 'immutable';
import ImageZoom from 'react-medium-image-zoom'
import '../../css/components/cashoutApproveUi';
import { browserHistory, Link } from 'react-router';
import { DOMAIN_OXT } from '../../global/global';
import {
    Tabs,
    Form,
    Input,
    Radio,
    DatePicker,
    Card,
    Select,
    Icon,
    Button,
    Table,
    Cascader,
    Row,
    Modal,
    Upload,
    message,
    notification,
    Spin,
    Menu,
    Dropdown,
    Alert,
} from 'antd';
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
import address from '../../components/select-city/address.json';
import SelectCity from '../../components/select-city/index';
import bankType from '../../components/selectBankType/bankType.json';
import getRegExp from '../../util/regExp';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const TextArea = Input.TextArea;
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
const formItemLayoutNolabel = {
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

// name, value
const financeTypeList = [{
    name: '分公司',
    value: 1,
}, {
    name: '社保局',
    value: 2,
}, {
    name: '公积金中心',
    value: 3,
}]

interface selectSource {
    id: string | number;
    code: string | number;
    branchName: string | number;
    depositName: string;
    depositAccount: string | number;
}
interface payeeInfoProps {
    id?: string;
    code?: string;
    payeeSource?: Array<selectSource>; /* 付款方名称source */
    payeeType?: number; /* 收款方类型 */
    branchName?: string; /* 收款方名称 */
    cityName?: string; /* 地区名*/
    depositName?: string; /**开户行 */
    depositAccount?: string; /**开户账号 */
    remark?: string; /**备注 */
    financeType?: number; /** 请款类型 默认为1分公司 2社保局 3公积金*/
    financeAgain?: number; /**是否为二次请款 1首次 2二次 */
    enableStatus?: number; /*启用状态 1：停用中，0：启用中 */
    edit?: boolean; /* 添加：true 查看: false */
    bankTypeName?: any;
}

interface payeeInfoState {
    enableStatus: number;
    financeType?: number;
    changed: boolean; /* 是否改变的标识符 */
}
let bankTypeId: number
/**
 * 收款方信息
 */
class PayeeInfoForm extends React.Component<payeeInfoProps & FormComponentProps, payeeInfoState> {
    // static defaultProps = {
    //     values: {},
    // }
    constructor(props) {
        super(props)
        const enableStatus = props.enableStatus;
        this.state = {
            changed: false,
            financeType: props.financeType,
            enableStatus: 0, /*启用状态 1：停用中，0：启用中 */

        };
    }
    branchNameCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写二次请款收款方名称');
        }
        if (value.length > 50) {
            return callback('二次请款收款方名称需控制在50字以内');
        }
        callback();
    }
    // 开户行校验
    depositNameCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写开户行');
        }
        if (value.length > 50) {
            return callback('开户行需控制在50字以内');
        }
        callback();
    }
    // 开户行账号校验
    depositAccountCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写账号');
        }
        if (value.length > 50) {
            return callback('账号需控制在50字以内');
        }
        callback();
    }
    // 备注校验
    remarkCheck = (rule, value, callback) => {

        if (value && value.length > 180) {
            return callback('备注需控制在 180 字以内');
        }
        callback();
    }
    typeOnchange = (value) => {
        this.setState({ financeType: value, changed: true, });
    }
    branchNameOnchange = (value) => {
        this.setState({ financeType: value, changed: true, });
    }
    handleBranchChange = (value, option) => {
        const officeId = option.props['data-id'];
        this.props.form.setFieldsValue({
            branchData: {
                name: value,
                id: officeId
            }

        });

    }
    bankOnchange = (value) => {
        let len = bankType.data.length

        for (let i = 0; i < len; i++) {
            if (bankType.data[i].dictName == value) {
                bankTypeId = bankType.data[i].id;
                break
            }

        }
    }
    selectOptionRender = (id, financeType) => {
        const optionList: Array<JSX.Element> = [];
        if (id) {
            if (financeType === 1) {
                optionList.push(<Option value={1}>分公司</Option>)
            } else {
                financeTypeList.map(({ name, value }) => {
                    if (value !== 1) {
                        optionList.push(<Option value={value}>{name}</Option>)
                    }
                })
            }
        } else {
            financeTypeList.map(({ name, value }) => {
                optionList.push(<Option value={value}>{name}</Option>)
            })
        }
        return optionList;

    }
    // handleSetSingeState = (params) => {
    //     this.set
    // }

    // payeeType?: number; /* 收款方类型 */
    //     payeeName?: string; /* 收款方名称 */
    //     provinceId?: number; /* 省*/
    //     cityId?: number; /* 市*/
    //     districtId?: number; /* 区*/
    //     cityName?: number; /* 地区名*/
    //     depositName?: string; /**开户行 */
    //     depositAccount?: string; /**开户账号 */
    //     remark?: string; /**备注 */
    validatorProviceCity = (rule, value, callback, message?) => {
        if (!value || value.trim().length <= 0) {
            return callback(`请填写银行所在${message}`);
        }
        if (!getRegExp('zh').test(value)) {
            return callback(`银行所在${message}格式不正确`);
        }
        if (value.trim().length > 20) {
            return callback(`${message}请控制在20个字之内`);
        }
        callback();
    }
    render() {
        let {
            form,
            id,
            code,
            payeeSource,
            payeeType,
            branchName,
            edit,
            cityName = '',
            depositName,
            depositAccount,
            remark,
            bankTypeName,
        } = this.props;
        let {
            changed,
            enableStatus,
            financeType,
        } = this.state;
        const [province, city] = cityName.split(' ');


        const propsType = this.props.enableStatus;
        enableStatus = changed ? enableStatus : propsType || enableStatus;
        const { getFieldDecorator } = form;
        const SelectBankType = bankType.data
        const branchParams = {
            onSelect: (value, option) => {
                const officeId = option.props['data-id'];
                this.props.form.setFieldsValue({
                    branchData: {
                        name: value,
                        id: officeId
                    }

                });
            }

        }


        return (
            <div key="payeeInfo" style={{ maxWidth: 600 }}>
                <Form>
                    {
                        edit &&
                        <div>
                            <FormItem
                                key="type"
                                {...formItemLayoutNolabel}
                            >
                            </FormItem>
                            {
                                getFieldDecorator('id', {
                                    initialValue: id,
                                })
                            }
                            {
                                getFieldDecorator('officeId', {
                                    initialValue: null,
                                })
                            }
                            <div>
                                <FormItem
                                    key="financeType"
                                    {...formItemLayout}
                                    label="二次请款收款方类型"
                                >
                                    {
                                        getFieldDecorator('financeType', {
                                            initialValue: financeType,
                                            rules: [
                                                { required: true, message: '请选择二次请款收款方类型', },
                                            ],
                                        })(
                                            <Select placeholder="请选择" onChange={e => this.typeOnchange(e)}>

                                                {this.selectOptionRender(id, financeType)}

                                            </Select>
                                            )
                                    }
                                </FormItem>


                                {financeType === 1 ? <FormItem
                                    key="branchName2"
                                    {...formItemLayout}
                                    label="二次请款收款方名称"
                                >
                                    {
                                        getFieldDecorator('branchName2', {
                                            initialValue: branchName,
                                            rules: [
                                                { required: true, message: '请填写二次请款收款方名称', },
                                            ],
                                        })(

                                            <Select showSearch optionFilterProp="children" placeholder="请选择" onSelect={(value, option: any) => {
                                                const officeId = option.props['data-id'];
                                                this.props.form.setFieldsValue({ officeId })
                                            }}>
                                                {payeeSource!.map(({ id, branchName }) => <Option value={branchName} data-id={id}>{branchName}</Option>)}
                                            </Select>

                                            )
                                    }
                                </FormItem> : <FormItem
                                    key="branchName"
                                    {...formItemLayout}
                                    label="二次请款收款方名称"
                                >
                                        {
                                            getFieldDecorator('branchName', {
                                                initialValue: branchName,
                                                rules: [
                                                    { required: true, validator: this.branchNameCheck },
                                                ],
                                            })(
                                                <Input />
                                                )
                                        }
                                    </FormItem>}
                                <FormItem
                                    key="depositName"
                                    {...formItemLayout}
                                    label="开户行"
                                >
                                    {
                                        getFieldDecorator('depositName', {
                                            initialValue: depositName,
                                            rules: [
                                                { required: true, validator: this.depositNameCheck },
                                            ],
                                        })(
                                            <Input />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="depositAccount"
                                    {...formItemLayout}
                                    label="账号"
                                >
                                    {
                                        getFieldDecorator('depositAccount', {
                                            initialValue: depositAccount,
                                            rules: [
                                                { required: true, validator: this.depositAccountCheck },
                                            ],
                                        })(
                                            <Input />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="bankTypeName"
                                    {...formItemLayout}
                                    label="银行类型"
                                >
                                    {
                                        getFieldDecorator('bankTypeName', {
                                            initialValue: bankTypeName,
                                            rules: [
                                                { required: true, message: '请选择银行类型', },
                                            ],
                                        })(
                                            // SelectBankType
                                            <Select value={bankTypeName} style={{ width: 190 }} size="default" onChange={e => this.bankOnchange(e)}
                                                showSearch
                                                placeholder="请选择银行类型"
                                                optionFilterProp="children"
                                                getPopupContainer={(node => node.parentNode) as any}

                                                filterOption={(value, options) => {
                                                    let flag = 0;
                                                    let option = options.props.children;
                                                    if (String(option).indexOf(value) > -1) {
                                                        flag += 1;
                                                        return true;
                                                    } else if (options.props.children === '其他银行-OTH' && flag === 0) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }}
                                            >
                                                {SelectBankType.map((item) => {
                                                    return <Option key={item.id} value={item.dictName}>{item.dictName}</Option>
                                                })}

                                            </Select>
                                            )
                                    }
                                </FormItem>

                                <FormItem label='银行所在地区' {...formItemLayout} required>
                                    <Form layout="inline">
                                        <FormItem style={{ width: 120 }}>
                                            {
                                                getFieldDecorator('province', {
                                                    initialValue: province,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validatorProviceCity(rule, value, callback, '省份')
                                                        }
                                                    ],
                                                })(
                                                    <Input placeholder="省份" />
                                                    )
                                            }
                                        </FormItem>
                                        <FormItem style={{ width: 120 }}>
                                            {
                                                getFieldDecorator('city', {
                                                    initialValue: city,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validatorProviceCity(rule, value, callback, '城市')
                                                        }
                                                    ],
                                                })(
                                                    <Input placeholder="城市" />
                                                    )
                                            }
                                        </FormItem>
                                    </Form>
                                </FormItem>
                                <FormItem
                                    key="remark"
                                    {...formItemLayout}
                                    label="备注"
                                >
                                    {
                                        getFieldDecorator('remark', {
                                            initialValue: remark,
                                            rules: [
                                                { required: false, validator: this.remarkCheck },
                                            ],
                                        })(
                                            <TextArea />
                                            )
                                    }
                                </FormItem>

                            </div>

                        </div>
                    }
                    {
                        !edit &&
                        <div>
                            <FormItem
                                key="code"
                                {...formItemLayout}
                                label="编码"
                            >
                                <span>{code}</span>
                            </FormItem>
                            <FormItem
                                key="payBankAccount"
                                {...formItemLayout}
                                label="二次请款收款方类型"
                            >
                                {financeTypeList[financeType!].name}
                            </FormItem>
                            <FormItem
                                key="branchName"
                                {...formItemLayout}
                                label="二次请款收款方名称"
                            >
                                {branchName}
                            </FormItem>
                            <FormItem
                                key="cityName"
                                {...formItemLayout}
                                label="地区"
                            >
                                {cityName}
                            </FormItem>
                            <FormItem
                                key="depositName"
                                {...formItemLayout}
                                label="开户行"
                            >
                                {depositName}
                            </FormItem>
                            <FormItem
                                key="depositAccount"
                                {...formItemLayout}
                                label="账号"
                            >
                                {depositAccount}
                            </FormItem>
                            <FormItem
                                key="remark"
                                {...formItemLayout}
                                label="备注"
                            >
                                {remark}
                            </FormItem>

                        </div>
                    }
                </Form>
            </div>
        )
    }
}
const PayeeInfoCreatForm = Form.create()(PayeeInfoForm);
export class PayeeInfo extends React.Component<payeeInfoProps, any> {
    constructor(props) {
        super(props);
    }
    payeeInfoCreatForm: any;
    validate = () => {
        let result = false;
        this.payeeInfoCreatForm.validateFields((err, values) => {
            if (err) {
                return;
            }
            result = values;
        });
        return result;
    }
    render() {
        return <PayeeInfoCreatForm {...this.props} ref={node => this.payeeInfoCreatForm = node} />
    }
}



