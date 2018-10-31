import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Upload,
    message,
    Modal,
    Icon,
    Select,
    Cascader,
    Radio,
    Tabs,
    Collapse,
    Checkbox,
} from 'antd';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import classnames from 'classnames'
import getRegExp from '../../../util/regExp';
import DateRange from '../../../components/date-range/index';
import uploadProps, { uProps } from './util/uploadProps';
import { Attachment } from './companyInfo';
import Immutable from 'immutable';
import {
    formItemLayout,
    validateUpload,
    accountUseString,
    accountUseOptions,
    AccountUse,
} from './util/index';
import EditableTagGroup from '../../tags/index';
import SelectPerson, { PersonSource } from './util/selectPerson';
import { BankType } from '../../../pages/chapter/chapterFinancialTwo'
import { listBankTypeApi } from '../../../api/businessComponents/chapterFinancialApi'
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;


interface TOwnProps {
    /* 是否有编辑状态 */
    edit?: boolean;
    className?: string
    uploadApi?: string;
    personSource?: PersonSource;
    bankTypes?: BankType[]
    setBankAccountSource?: () => void;
    /**
     * 初始数据
     */
    data?: {
        /**
         * 开户银行
         */
        bankName?: string;
        outerId?: number;
        id?: number;
        /**
         * 银行账号
         */
        bankAccount?: string;
        bankType?: string;
        bankTypeId?: number;
        /**
         * 省份
         */
        province?: string;
        /**
         * 城市
         */
        city?: string;
        /**
         * 账户用途（1：五险， 2：公积金， 3： 代发工资）
         */
        accountUse?: AccountUse;
        /**
         * 账户性质。（1：一般户， 2：基本户）
         */
        accountType?: 1 | 2;
        /**
         * 开户时间。moment（2017/01/01）
         */
        openTime?: string;

        /**
         * 开户经办人
         */
        openHandler?: string;
        /**
         * 开户经办人id
         */
        openHandlerId?: string | number;
        /**
         * 银行联系方式
         */
        bankContact?: number[],
        /**
         * 打印回单密码
         */
        receiptPassword?: string;
        /**
         * 开户许可证编号
         */
        openPermitCode?: string;
        /**
         * 信用代码证 有：1，无：0
         */
        creditCode?: 1 | 0;
        /**
         * 银行印鉴卡 有：1，无：0
         */
        bankSeal?: 1 | 0;
        /**
         * 密码支付器。有：1，无：0
         */
        passwordPayment?: 1 | 0;
        /**
         * 账户管理费。有：1，无：0
         */
        accountManagement?: 1 | 0;
        /**
         * 电子回单功能。有：1，无：0
         */
        electronicReceipt?: 1 | 0;
        /**
         * 对账时间。月初：1，月中：2，月末：3 
         */
        checkBillTime?: 1 | 2 | 3;
        /**
         * 对账频率。月：1，季度：2，半年度：3，年度：4'
         */
        checkBillFrequency?: 1 | 2 | 3 | 4;
        /**
         * 打款备用金。有：1，无：0
         */
        payPettyCash?: 1 | 0;
        /**
         * 打款备用金。金额
         */
        payPettyCashNumber?: number;
        /**
         * 是否办理U盾。是：1，否：0
         */
        usbKey?: 1 | 0;
        /**
         * U盾经办人 
         */
        usbKeyHandler?: string;
        /**
        * U盾经办人id 
        */
        usbKeyHandlerId?: string | number;
        /**
         * U盾复核人
         */
        usbKeyChecker?: string;
        /**
        * U盾复核人id 
        */
        usbKeyCheckerId?: string | number;
        /**
         * U盾保管部门
         */
        usbKeyKeepDep?: string;
        /**
         * U盾保管部门
         */
        usbKeyKeepDepId?: string | number;
        /**
         * 是否加入集团网银。是：1，否：0
         */
        groupBank?: 1 | 0;
        /**
         * 代发工资。是：1，否：0
         */
        replacePayroll?: 1 | 0;
        /**
         * 代发（报销等其他）。是：1，否：0
         */
        replaceOther?: 1 | 0;
        /**
         * 附件 开户许可证
         */
        accOpenPermit?: Attachment[];
        /**
         * 附件 银行印鉴卡
         */
        accBankSeal?: Attachment[];
        /**
         * 附件 信用机构代码证
         */
        accCreditCode?: Attachment[];
        /**
         * 附件 加入CBS集团网银授权书+代发协议
         */
        accCbsBank?: Attachment[];
    }
}


interface BankInfoFormState {
    /**
     * 打款备用金
     */
    payPettyCash: 1 | 0;
    /**
     * 是否办理U盾
     */
    usbKey: 1 | 0;
}
interface BankInfoFormProps extends TOwnProps, FormComponentProps {

}
class BankInfoForm extends Component<BankInfoFormProps, BankInfoFormState> {
    constructor(props: BankInfoFormProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            payPettyCash,
            usbKey,
        } = data;
        this.state = {
            payPettyCash: payPettyCash || 0,
            usbKey: usbKey || 0,
        };
    }
    uploading = false;
    fileList = []

    // 与Upload onChange方法参数一样 如{file,fileList}
    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        // 过滤掉beforeUpload返回false的
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
    }
    validatorPayPettyCashNumber = (rule, value, callback) => {
        if (this.state.payPettyCash === 1 && (value === undefined || value === '')) {
            return callback('请填写打款备用金')
        }
        if (this.state.payPettyCash === 1 && !/^\d{1,10}(\.\d{1,2})?$/.test(value)) {
            return callback('打款备用金格式不正确');
        }
        callback();
    }
    validatorUsbKeySelect = (rule, value, callback) => {
        if (this.state.usbKey === 1 && (!value || value.length > 4))
            callback('格式不正确')
        else
            callback();
    }
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    setBankAccount = (e) => {
        typeof this.props.setBankAccountSource === 'function' && this.props.setBankAccountSource();
    }
    payPettyCashNumberBlur = (e) => {
        const value = e.target.value;
        if (/^\d{1,10}(\.\d{1,2})?$/.test(value)) {
            this.props.form.setFieldsValue({
                payPettyCashNumber: Number(value).toFixed(2),
            })
        }
    }
    validatorProviceCity = (rule, value, callback, message?) => {
        if(!value || value.trim().length <= 0) {
            return callback(`请填写银行所在${message}`);
        }
        if(!getRegExp('zh').test(value)) {
            return callback(`银行所在${message}格式不正确`);
        }
        if(value.trim().length > 20) {
            return callback(`${message}请控制在20个字之内`);
        }
        callback();
    }
    render() {
        const {
            form,
            data = {},
            edit,
            personSource = Immutable.fromJS([]),
            className,
            bankTypes
        } = this.props;
        const {
            /**
             * 开户银行
             */
            bankName,
            outerId,
            id,
            /**
             * 银行账号
             */
            bankAccount,
            bankType,
            bankTypeId,
            /**
             * 账户用途
             */
            accountUse,
            province,
            city,
            /**
             * 账户性质。（1：一般户， 2：基本户）
             */
            accountType,
            /**
             * 开户时间。moment（2017/01/01）
             */
            openTime,
            /**
             * 开户经办人
             */
            openHandler,
            /**
             * 开户经办人id
             */
            openHandlerId,
            /**
             * 银行联系方式
             */
            bankContact,
            /**
             * 打印回单密码
             */
            receiptPassword,
            /**
             * 开户许可证编号
             */
            openPermitCode,
            /**
             * 信用代码证 有：1，无：0
             */
            creditCode,
            /**
             * 银行印鉴卡 有：1，无：0
             */
            bankSeal,
            /**
             * 密码支付器。有：1，无：0
             */
            passwordPayment,
            /**
             * 账户管理费。有：1，无：0
             */
            accountManagement,
            /**
             * 电子回单功能。有：1，无：0
             */
            electronicReceipt,
            /**
             * 对账时间。月初：1，月中：2，月末：3 
             */
            checkBillTime,
            /**
             * 对账频率。月：1，季度：2，半年度：3，年度：4'
             */
            checkBillFrequency,
            /**
             * 打款备用金。有：1，无：0
             */
            payPettyCash,
            /**
             * 打款备用金。金额
             */
            payPettyCashNumber,
            /**
             * 是否办理U盾。是：1，否：0
             */
            usbKey,
            /**
             * U盾经办人 
             */
            usbKeyHandler,
            /**
            * U盾经办人id 
            */
            usbKeyHandlerId,
            /**
            * U盾复核人
            */
            usbKeyChecker,
            /**
            * U盾复核人id 
            */
            usbKeyCheckerId,
            /**
             * U盾保管部门
             */
            usbKeyKeepDep,
            /**
             * U盾保管部门id
             */
            usbKeyKeepDepId,
            /**
             * 是否加入集团网银。是：1，否：0
             */
            groupBank,
            /**
             * 代发工资。是：1，否：0
             */
            replacePayroll,
            /**
             * 代发（报销等其他）。是：1，否：0
             */
            replaceOther,
            
            /**
             * 附件 开户许可证
             */
            accOpenPermit,
            /**
             * 附件 银行印鉴卡
             */
            accBankSeal,
            /**
             * 附件 信用机构代码证
             */
            accCreditCode,
            /**
             * 附件 加入CBS集团网银授权书+代发协议
             */
            accCbsBank,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue,
            setFields,
        } = form;
        return (
            <Form className={classnames("companyinfo", className)}>
                <FormItem>
                    {
                        getFieldDecorator('outerId', {
                            initialValue: outerId,
                        })(<i />)
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id', {
                            initialValue: id,
                        })(<i />)
                    }
                </FormItem>
                <FormItem label="开户银行" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankName', {
                                initialValue: bankName,
                                rules: [{
                                    required: true,
                                    message: '请填写'
                                }, {
                                    pattern: getRegExp('zh'),
                                    message: '开户银行格式不正确'
                                }, {
                                    max: 25,
                                    message: '开户银行请控制在25个字之内',
                                }],
                            })(
                                <Input placeholder="请填写" />
                                )
                            :
                            <span>
                                {bankName || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="银行账号" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankAccount', {
                                initialValue: bankAccount,
                                rules: [{
                                    required: true,
                                    message: '请填写'
                                }, {
                                    pattern: getRegExp('number1-100'),
                                    message: '银行账号格式不正确',
                                }]
                            })(
                                <Input placeholder="请填写" onBlur={this.setBankAccount} />
                                )
                            : <span>{bankAccount || '/'}</span>
                    }
                </FormItem>
                <FormItem label='银行类型' {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankType', {
                                initialValue: bankType,
                                rules: [{
                                    required: true,
                                    message: '请选择'
                                }]
                            })(
                                <Select allowClear placeholder='请选择' onSelect={(v, o: any) => setFieldsValue({ 'bankTypeId': o.props['data-id'] })}>
                                    {bankTypes && bankTypes.map((item: BankType) => <Option data-id={item.id} value={item.dictName}>{item.dictName}</Option>)}
                                </Select>
                                )
                            : <span>{bankType}</span>
                    }
                    {
                        getFieldDecorator('bankTypeId', {
                            initialValue: bankTypeId
                        })(<span></span>)
                    }
                </FormItem>
                <FormItem label='银行所在地区' {...formItemLayout} required={edit}>
                    <Form layout="inline">
                        <FormItem>
                            {
                                edit
                                    ? getFieldDecorator('province', {
                                        initialValue: province,
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => this.validatorProviceCity(rule, value, callback, '省份')
                                            }
                                        ],
                                    })(
                                        <Input placeholder="省份" />
                                        )
                                    :
                                    <span>
                                        {province || '/'}
                                    </span>
                            }
                        </FormItem>
                        <FormItem>
                            {
                                edit
                                    ? getFieldDecorator('city', {
                                        initialValue: city,
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => this.validatorProviceCity(rule, value, callback, '城市')
                                            }
                                        ],
                                    })(
                                        <Input placeholder="城市" />
                                        )
                                    :
                                    <span>
                                        {city || ''}
                                    </span>
                            }
                        </FormItem>
                    </Form>
                </FormItem>
                <FormItem label="账户用途" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('accountUse', {
                            initialValue: accountUse,
                            rules: [{
                                required: true,
                                message: '请选择账户用途'
                            }],
                        })(
                            <CheckboxGroup options={accountUseOptions} className="accountUse" />
                            )
                            : <span>{accountUseString(accountUse)}</span>
                    }
                </FormItem>
                <FormItem label="账户性质" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('accountType', {
                                initialValue: accountType,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>一般户</Radio>
                                    <Radio value={2}>基本户</Radio>
                                </Radio.Group>
                                )
                            : <span>{accountType === 1 ? '一般户' : accountType === 2 ? '基本户' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="开办时间" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('openTime', {
                            initialValue: openTime && moment(openTime),
                        })(
                            <DatePicker format="YYYY/MM/DD" />
                            )
                            : <span>{openTime || '/'}</span>
                    }
                </FormItem>
                <FormItem label="开户经办人" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('openHandler', {
                            initialValue: openHandler,
                            rules: [{
                                pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                message: '开户经办人格式不正确'
                            }]
                        })(
                            <Input placeholder='请填写' />
                            )
                            : <span>{openHandler || '/'}</span>
                    }
                </FormItem>
                <FormItem label="银行联系方式" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankContact', { initialValue: bankContact })
                                (
                                <EditableTagGroup style={{ width: 98 }} max={5} rule={getRegExp('mobile | landline ')} ruleMessage="银行联系方式格式不正确" buttonText="新增电话" />
                                )
                            : <span >{bankContact && bankContact.length > 0 ? bankContact.join('，') : '/'}</span>
                    }
                </FormItem>

                <FormItem label="打印回单密码" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('receiptPassword', {
                                initialValue: receiptPassword,
                                rules: [{
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }],
                            })
                                (
                                <Input placeholder="请填写" />
                                )
                            : <span>{receiptPassword ? receiptPassword.replace(/./g, '*') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="开户许可证编号" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('openPermitCode', {
                                initialValue: openPermitCode,
                                rules: [{
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }],
                            })
                                (
                                <Input placeholder="请填写" />
                                )
                            : <span>{openPermitCode || '/'}</span>
                    }

                </FormItem>
                <FormItem label="信用代码证" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('creditCode', {
                                initialValue: creditCode,
                            })
                                (
                                <Radio.Group>
                                    <Radio value={1}>有</Radio>
                                    <Radio value={0}>无</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    creditCode === 1 ? '有'
                                        : creditCode === 0 ? '无'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="银行印鉴卡" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankSeal', {
                                initialValue: bankSeal,
                            })
                                (
                                <Radio.Group>
                                    <Radio value={1}>有</Radio>
                                    <Radio value={0}>无</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    bankSeal === 1 ? '有'
                                        : bankSeal === 0 ? '无'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="密码支付器" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('passwordPayment', {
                                initialValue: passwordPayment,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>有</Radio>
                                    <Radio value={0}>无</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    passwordPayment === 1 ? '有'
                                        : passwordPayment === 0 ? '无'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="账户管理费" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('accountManagement', {
                                initialValue: accountManagement,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>有</Radio>
                                    <Radio value={0}>无</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    accountManagement === 1 ? '有'
                                        : accountManagement === 0 ? '无'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="电子回单功能" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('electronicReceipt', {
                                initialValue: electronicReceipt,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>有</Radio>
                                    <Radio value={0}>无</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    electronicReceipt === 1 ? '有'
                                        : electronicReceipt === 0 ? '无'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="对账时间" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('checkBillTime', {
                                initialValue: checkBillTime,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>月初</Radio>
                                    <Radio value={2}>月中</Radio>
                                    <Radio value={3}>月末</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    checkBillTime === 1 ? '月初'
                                        : checkBillTime === 2 ? '月中'
                                            : checkBillTime === 3 ? '月末'
                                                : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="对账频率" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('checkBillFrequency', {
                                initialValue: checkBillFrequency,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>月</Radio>
                                    <Radio value={2}>季度</Radio>
                                    <Radio value={3}>半年度</Radio>
                                    <Radio value={4}>年度</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    checkBillFrequency === 1 ? '月'
                                        : checkBillFrequency === 2 ? '季度'
                                            : checkBillFrequency === 3 ? '半年度'
                                                : checkBillFrequency === 4 ? '年度'
                                                    : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="打款备用金" {...formItemLayout}>
                    <Form layout="inline">
                        <FormItem label="">
                            {
                                edit ? getFieldDecorator('payPettyCash', {
                                    initialValue: payPettyCash,
                                })(
                                    <Radio.Group onChange={(e: any) => this.setState({
                                        payPettyCash: e.target.value
                                    })}>
                                        <Radio value={1}>有</Radio>
                                        <Radio value={0}>无</Radio>
                                    </Radio.Group>
                                    )
                                    : <span>
                                        {
                                            payPettyCash === 1 ?
                                                '有' :
                                                payPettyCash === 0 ?
                                                    '无' :
                                                    '/'
                                        }
                                    </span>
                            }
                        </FormItem>
                        <FormItem>
                            {
                                edit ? this.state.payPettyCash === 1 && getFieldDecorator('payPettyCashNumber', {
                                    initialValue: payPettyCashNumber,
                                    rules: [{
                                        validator: this.validatorPayPettyCashNumber
                                    }]
                                })(
                                    <Input style={{ width: 160 }} placeholder="请填写打款备用金" addonAfter={'元'} onBlur={this.payPettyCashNumberBlur} />
                                    )
                                    : <span>
                                        {
                                            payPettyCash === 1 ?
                                                payPettyCashNumber :
                                                ''
                                        }
                                    </span>
                            }

                        </FormItem>
                    </Form>
                </FormItem>
                <FormItem label="是否办理U盾" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('usbKey', {
                            initialValue: usbKey,
                        })(
                            <Radio.Group onChange={(e: any) => this.setState({ usbKey: e.target.value })}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>

                            )
                            : <span>
                                {
                                    usbKey === 1 ?
                                        '是' :
                                        usbKey === 0 ?
                                            '否' :
                                            '/'
                                }
                            </span>
                    }
                </FormItem>
                {
                    this.state.usbKey === 1 &&
                    <FormItem label="U盾经办人" {...formItemLayout}>
                        {
                            edit ? getFieldDecorator('usbKeyHandler', {
                                initialValue: usbKeyHandler,
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                    message: 'U盾经办人格式不正确'
                                }]
                            })(
                                <Input placeholder='请填写' />
                                )
                                : <span>
                                    {usbKeyHandler || '/'}
                                </span>
                        }
                    </FormItem>
                }
                {
                    this.state.usbKey === 1 && <FormItem label="U盾复核人" {...formItemLayout}>
                        {
                            edit ? getFieldDecorator('usbKeyChecker', {
                                initialValue: usbKeyChecker,
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                    message: 'U盾复核人格式不正确'
                                }]
                            })(
                                <Input placeholder='请填写' />
                                )
                                : <span>
                                    {usbKeyChecker || '/'}
                                </span>
                        }
                    </FormItem>
                }
                {
                    this.state.usbKey === 1 && <FormItem label="U盾保管部门" {...formItemLayout}>
                        {
                            edit
                                ? getFieldDecorator('usbKeyKeepDepId', {
                                    initialValue: usbKeyKeepDepId,
                                    rules: [{
                                        validator: this.validatorUsbKeySelect
                                    }]
                                })(
                                    <Select style={{ width: 166 }} placeholder="请选择"
                                        onSelect={(value, option: any) => {
                                            setFieldsValue({
                                                usbKeyKeepDep: option.props['data-usbKeyKeepDep']
                                            })
                                        }}
                                        onChange={(value) => {
                                            if (value === undefined) {
                                                setFieldsValue({ usbKeyKeepDep: undefined });
                                            }
                                        }}>
                                        <Option value={1} data-usbKeyKeepDep="开发管理部">开发管理部</Option>
                                        <Option value={2} data-usbKeyKeepDep="财务部">财务部</Option>
                                    </Select>
                                    )
                                : <span>
                                    {usbKeyKeepDep || '/'}
                                </span>
                        }
                        {
                            getFieldDecorator('usbKeyKeepDep', {
                                initialValue: usbKeyKeepDep
                            })(
                                <span></span>
                                )
                        }
                    </FormItem>
                }
                <FormItem label="是否加入集团网银" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('groupBank', {
                                initialValue: groupBank,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    groupBank === 1 ? '是'
                                        : groupBank === 0 ? '否'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="代发工资功能" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('replacePayroll', {
                                initialValue: replacePayroll,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>开通</Radio>
                                    <Radio value={0}>未开通</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    replacePayroll === 1 ? '开通'
                                        : replacePayroll === 0 ? '未开通'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="代发报销等功能" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('replaceOther', {
                                initialValue: replaceOther,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>开通</Radio>
                                    <Radio value={0}>未开通</Radio>
                                </Radio.Group>
                                )
                            : <span>
                                {
                                    replaceOther === 1 ? '开通'
                                        : replaceOther === 0 ? '未开通'
                                            : '/'
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">开户许可证：{!edit && !accOpenPermit && '/'}</label>
                    {
                        getFieldDecorator('accOpenPermit', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accOpenPermit ? accOpenPermit : [],
                            rules: [{
                                validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传开户许可证') }
                            }],
                        })(
                            <Upload
                                disabled={this.props.form.getFieldValue('accOpenPermit').length === 1}
                                {...this.uProps('accOpenPermit') }
                                className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accOpenPermit').length === 1 && message.error('上传附件数量限制为1份')}>
                                                <Icon type="upload" /> 点击上传
                                                </Button>
                                        </div>
                                        : null
                                }
                            </Upload>
                            )
                    }
                </FormItem>
                <FormItem label=" " colon={false} {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">银行印鉴卡：{!edit && !accBankSeal && '/'}</label>
                    {
                        getFieldDecorator('accBankSeal', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accBankSeal ? accBankSeal : [],
                            rules: [{
                                validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传银行印鉴卡') }
                            }],
                        })(
                            <Upload {...this.uProps('accBankSeal', Number.MAX_VALUE) }
                                className={edit ? "" : "upload-disabled"}>
                                {
                                    edit
                                        ? <div>
                                            <Button>
                                                <Icon type="upload" /> 点击上传
                                        </Button>
                                        </div>
                                        : null
                                }
                            </Upload>
                            )
                    }
                </FormItem>
                <FormItem label=" " colon={false} {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">信用机构代码证：{!edit && !accCreditCode && '/'}</label>
                    {
                        getFieldDecorator('accCreditCode', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accCreditCode ? accCreditCode : [],
                            rules: [{
                                validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传信用机构代码证') }
                            }],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accCreditCode').length === 1}
                                {...this.uProps('accCreditCode') }
                                className={edit ? "" : "upload-disabled"}>
                                {
                                    edit
                                        ? <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accCreditCode').length === 1 && message.error('上传附件数量限制为1份')}>
                                                <Icon type="upload" /> 点击上传
                                        </Button>
                                        </div>
                                        : null
                                }
                            </Upload>
                            )
                    }
                </FormItem>
                <FormItem label=" " colon={false} {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">加入CBS集团网银授权书+代发协议：{!edit && !accCbsBank && '/'}</label>
                    {
                        getFieldDecorator('accCbsBank', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accCbsBank ? accCbsBank : [],
                            rules: [{
                                validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传加入CBS集团网银授权书+代发协议') }
                            }],
                        })(
                            <Upload
                                {...this.uProps('accCbsBank', Number.MAX_VALUE) }
                                className={edit ? "" : "upload-disabled"}>
                                {
                                    edit
                                        ? <div>
                                            <Button>
                                                <Icon type="upload" /> 点击上传
                                        </Button>
                                        </div>
                                        : null
                                }
                            </Upload>
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}

const BankInfoCreateForm = Form.create()(BankInfoForm);


interface BankInfoProps extends Pick<TOwnProps, 'edit' | 'uploadApi' | 'personSource' | 'setBankAccountSource' | 'className' | 'bankTypes'> {
    data?: TOwnProps['data'][]
}
interface BankInfoState {
    data: any[];
    activeKey: string;
}


const AddNewButton = ({ onClick }) => {
    return (
        <Button onClick={onClick}>添加</Button>
    )
}


export default class BankInfo extends Component<BankInfoProps, BankInfoState> {
    index: number;
    constructor(props) {
        super(props);
        this.index = 1;
        const data = this.props.data;
        this.state = {
            data: data && data.length > 0 ? data.map((value) => ({ ...value, key: `${this.index++}` })) : [1].map(() => ({ key: `${this.index++}` })),
            activeKey: '1',
        }
    }
    bankInfoCreateForms: { ref: any, key: string }[] = [];
    /**
     * 验证并获取结果
     */
    validateFieldsAndScroll = (callback?: (error: any[] | null, values: any[] | boolean) => void) => {
        let values: any[] | boolean = [];
        let error: any[] | null = [];
        let setStateOnError = true;
        if (this.bankInfoCreateForms.length > 0) {
            for (let { ref, key } of this.bankInfoCreateForms) {
                let flag = true;
                ref.validateFieldsAndScroll((err, tempValues) => {
                    if (err) {
                        Array.isArray(error) && error.push(err);
                        /**
                         * 遇到第一个错误就切换到对应tabpane的key
                         */
                        if (setStateOnError) {
                            this.setState({
                                activeKey: key
                            }, ref.validateFieldsAndScroll);
                            setStateOnError = false;
                        }
                    }
                    Array.isArray(values) && values.push(tempValues);
                });
            }
            if (error.length <= 0) {
                error = null;
            }
        }
        if (typeof callback === 'function') {
            return callback(error, values);
        }
        return {
            error,
            values,
        }
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    addOne = () => {
        const ref = Modal.confirm({
            content: '添加后不可删除',
            okText: '确定',
            cancelText: '取消',
            maskClosable: true,
            onOk: () => {
                const {
                    data,
                } = this.state;
                const activeKey = `${this.index++}`;
                data.push({ key: activeKey });
                this.setState({ data, activeKey });
            },
            onCancel: () => {
                ref.destroy()
            }
        })
    }
    remove = (targetKey) => {
        let {
            data,
            activeKey,
        } = this.state;
        let lastIndex;
        data.forEach((value, i) => {
            if (value.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newData = this.state.data.filter(value => value.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = newData[lastIndex].key;
        }
        this.setState({ data: newData, activeKey });
    }
    panes = () => {
        const {
            data,
        } = this.state;
        const {
            uploadApi,
            edit,
            personSource,
            setBankAccountSource,
            className,
            bankTypes
        } = this.props;
        this.bankInfoCreateForms = [];
        return data.map((value, index) => {
            if (edit) {
                return (
                    <TabPane tab={`银行${++index}`} forceRender={true} key={value.key} closable={false}>
                        <BankInfoCreateForm
                            className={className}
                            uploadApi={uploadApi}
                            ref={node => { node && this.bankInfoCreateForms.push({ ref: node, key: value.key }) }}
                            edit={edit} data={value}
                            personSource={personSource}
                            bankTypes={bankTypes}
                            setBankAccountSource={setBankAccountSource} />
                    </TabPane>
                )
            }

            return (
                <Panel header={<span><strong>{value.bankName}</strong>-{value.bankAccount}</span>} key={value.key}>
                    <BankInfoCreateForm
                        edit={edit}
                        data={value} />
                </Panel>
            )

        }
        );
    }
    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    render() {
        const {
            edit,
        } = this.props;
        const {
            activeKey,
        } = this.state;
        const tabPanes = this.panes();
        return (
            <div>
                {
                    edit ?
                        <Tabs size="small" activeKey={activeKey} type="editable-card" hideAdd tabBarExtraContent={<AddNewButton onClick={this.addOne} />} onEdit={this.onEdit} onChange={this.onChange}>
                            {tabPanes}
                        </Tabs>
                        :
                        <Collapse defaultActiveKey={[activeKey]}>
                            {tabPanes}
                        </Collapse>
                }

            </div>

        )
    }

}


