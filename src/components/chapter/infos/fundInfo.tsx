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
    Radio,
    Checkbox,
} from 'antd';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import * as R from 'ramda'
import moment, { Moment } from 'moment';
import SelectCity from '../../select-city/index';
import address from '../select-city/address.json';
import getRegExp from '../../../util/regExp';
import DateRange from '../../../components/date-range/index';
import uploadProps, { uProps } from './util/uploadProps';
import { Attachment } from './companyInfo';
import EditableTagGroup from '../../tags/index';
import {
    selectCityParams,
    validatorSelectCity,
    dateRangeInitialValue,
    validatorDateRange,
    cascaderOptions,
    formItemLayout,
    validatorEmpty,
    PayMethod,
    payMethodOptions,
    getPayMethodString,
    validateUpload,
} from './util/index';
import SelectPerson, { PersonSource } from './util/selectPerson';
import Immutable from 'immutable';
import './socialInfo.less';
import { listBankTypeApi } from '../../../api/businessComponents/chapterFinancialApi'
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


interface TOwnProps {
    /* 是否有编辑状态 */
    edit?: boolean;
    uploadApi?: string;
    bankAccountSource?: any[];
    bankData?: any[]
    personSource?: PersonSource;
    /**
     * 初始数据
     */
    data: {
        /**
         * 开户条件。1：增员开户，2：直接开户
         */
        openCondition?: number | string;
        /**
         * 公积金登记编码
         */
        registerCode?: string;
        /**
         * 公积金指定收款人
         */
        payee?: string;
        bankName?: string
        /**
         * 公积金托收银行账号
         */
        bankAccount?: string;
        /**
         * 公积金款缴纳方式。多选框，存储逗号分隔，1：现金，2：支票，3：托收，4：转账
         */
        payMethod?: PayMethod;
        /**
         * 公积金款缴纳方式备注
         */
        payRemark?: string;
        /**
         * 公积金开户时间。moment（2017/01/01）
         */
        openTime?: string;
        /**
         * 公积金中心地址（省市区）
         */
        commonFundCenterAddress?: {
            selectVal: number[];
            selectName: string[];
        };
        /**
         * 公积金中心地址（详细地址）
         */
        commonFundCenterAddressDetail?: string;
        /**
         * 公积金联系人
         */
        commonFundPersonName?: string;
        commonFundPersonId?: string | number;
        /**
         * 公积金联系人电话
         */
        commonFundPersonPhone?: number[]
        /**
         * 公积金增减常规办理方式。1：在线办理，2：柜台办理
         */
        dealMethod?: 1 | 2;
        /**
         * 在线办理登录页网址
         */
        onlineUrl?: string;
        /**
         * 在线办理登录页密码
         */
        onlinePassword?: string;
        /**
         * 在线办理其他方式(所需下载软件等)
         */
        onlineOtherMethod?: string;
        /**
         * 附件 公积金保险自动缴费授权书
         */
        accAutoProxy?: Attachment[];
    }
}






interface FundInfoState {
    dealMethod: TOwnProps['data']['dealMethod']
}

interface FundInfoProps extends TOwnProps, FormComponentProps {

}


class FundInfo extends Component<FundInfoProps, FundInfoState> {
    constructor(props: FundInfoProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            dealMethod,
        } = data;
        this.state = {
            dealMethod: dealMethod !== undefined ? dealMethod : 2,
        };
        // fetch(listBankTypeApi, { credentials: 'include' })
        // .then(res => {
        //     return res.json()
        // })
        // .then(value => {
        //     console.log(value)
        //     this.bankType = value.data
        // })
        // .catch(err => {
        //     console.log(err)
        //     throw new Error('请求银行类型出错')
        // })
    }
    bankType = []
    selectedBankName: any = null
    selectedBankAccount: any = null
    uploading = false;
    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        // 过滤掉beforeUpload返回false的
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
    }
    validatorTaxPersonName = (rule, value, callback) => {
        if (validatorEmpty(value)) {
            return callback();
        }
        if (getRegExp('zh1-4').test(value) === false) {
            return callback('只限中文字符，四个字以内');
        }
        callback()
    }
    bankAccountOptions = () => {
        let {
            bankAccountSource = [],
            bankData = []
        } = this.props;
        // return bankAccountSource.map((value) => <Option value={value}>{value}</Option>);
        // 如果银行类型已选中 过滤掉此类银行外的银行账号数据
        if (this.selectedBankName) {
            bankData = bankData.filter((item) => item.bankName === this.selectedBankName)
        }
        return bankData.map(item => <Option value={item.bankAccount}>{item.bankAccount}</Option>)
    }
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    render() {
        const {
            form,
            data = {},
            edit,
            bankAccountSource = [],
            bankData = [],
            personSource = Immutable.fromJS([])
        } = this.props;
        const {
            /**
         * 开户条件。1：增员开户，2：直接开户
         */
            openCondition,
            /**
             * 公积金登记编码
             */
            registerCode,
            /**
             * 公积金指定收款人
             */
            payee,
            bankName,
            /**
             * 公积金托收银行账号
             */
            bankAccount,
            /**
             * 公积金款缴纳方式。多选框，存储逗号分隔，1：现金，2：支票，3：托收，4：转账
             */
            payMethod,
            /**
             * 公积金款缴纳方式备注
             */
            payRemark,
            /**
             * 公积金开户时间。moment（2017/01/01）
             */
            openTime,
            /**
             * 公积金中心地址（省市区）
             */
            commonFundCenterAddress,
            /**
             * 公积金中心地址（详细地址）
             */
            commonFundCenterAddressDetail,
            /**
             * 公积金联系人
             */
            commonFundPersonName,
            commonFundPersonId,
            /**
             * 公积金联系人电话
             */
            commonFundPersonPhone,
            /**
             * 公积金增减常规办理方式。1：在线办理，2：柜台办理
             */
            dealMethod,
            /**
             * 在线办理登录页网址
             */
            onlineUrl,
            /**
             * 在线办理登录页密码
             */
            onlinePassword,
            /**
             * 在线办理其他方式(所需下载软件等)
             */
            onlineOtherMethod,
            /**
             * 附件 公积金保险自动缴费授权书
             */
            accAutoProxy,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue,
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="开户条件" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('openCondition', {
                            initialValue: openCondition,
                        })(
                            <Radio.Group>
                                <Radio value={1}>增员开户</Radio>
                                <Radio value={2}>直接开户</Radio>
                            </Radio.Group>
                            )
                            : <span>{openCondition === 1 ? '增员开户' : openCondition === 2 ? '直接开户' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="公积金登记编码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('registerCode', {
                            initialValue: registerCode,
                            rules: [{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{registerCode || '/'}</span>
                    }
                </FormItem>
                <FormItem label="公积金指定收款人" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('payee', {
                            initialValue: payee,
                            rules: [{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{payee || '/'}</span>
                    }
                </FormItem>
                {/*<FormItem label="公积金托收开户银行" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('bankName', {
                                initialValue: bankName,
                            })(
                                <Select allowClear placeholder="请选择" onChange={(value) => {
                                    this.selectedBankName = value
                                    // 选择bankName时 已选了bankAccount 但已选的bankAccount不在bankName的账号数组中   
                                    // 将账号设为空
                                    // if (
                                    //     this.selectedBankAccount && 
                                    //     bankData.filter(item => item.bankName == value).map(item=>item.bankAccount).indexOf(this.selectedBankAccount) < 0
                                    // ) {
                                    //     setFieldsValue({bankAccount: null})
                                    // }
                                    // 选择bankName时默认选择第一个bankAccount
                                    setFieldsValue({bankAccount: bankData.filter(item=>item.bankName==value).map(item=>item.bankAccount)[0]})
                                }}>
                                    {
                                        // 
                                        R.uniq(bankData.map(item => item.bankName))
                                         .map(item => <Option value={item}>{item}</Option>)
                                    }
                                </Select>
                            )
                            : <span>{bankName || '/'}</span>
                    }
                </FormItem>
                <FormItem label="公积金托收银行账号" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('bankAccount', {
                            initialValue: bankAccount,
                        })(
                            <Select allowClear placeholder="请选择" onChange={(v)=> {
                                if (!v) this.selectedBankName = null // 清楚账号时置空已选择的银行类型 否则账号可选项不是全部账号因为之前已选中了银行类型
                                this.selectedBankAccount = v
                                setFieldsValue({'bankName': bankData.filter(item=>item.bankAccount==v).map(item=>item.bankName)[0]})
                            }}>
                                {this.bankAccountOptions()}
                            </Select>
                            )
                            : <span>{bankAccount || '/'}</span>
                    }
                </FormItem>*/}
                <FormItem label="公积金缴纳方式" {...formItemLayout}>
                    <Form layout="inline">
                        <FormItem>
                            {
                                edit ? getFieldDecorator('payMethod', {
                                    initialValue: payMethod,
                                })(
                                    <CheckboxGroup options={payMethodOptions} className="payMethod" />
                                    )
                                    : <span>{getPayMethodString(payMethod)}</span>
                            }
                        </FormItem>
                        <FormItem>
                            {
                                edit ? getFieldDecorator('payRemark', {
                                    initialValue: payRemark,
                                    rules: [{
                                        max: 100,
                                        message: '请控制在100个字之内',
                                    }],
                                })(
                                    <Input placeholder="请填写备注" style={{ width: 150 }} />
                                    )
                                    : <span>{payRemark && `(备注: ${payRemark})`}</span>
                            }
                        </FormItem>
                    </Form>
                </FormItem>
                <FormItem label="公积金开户时间" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('openTime', {
                            initialValue: openTime && moment(openTime),
                        })(
                            <DatePicker format="YYYY/MM/DD" />
                            )
                            : <span>{openTime || '/'}</span>
                    }
                </FormItem>
                <FormItem label="公积金中心地址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('commonFundCenterAddress', {
                            initialValue: commonFundCenterAddress ? commonFundCenterAddress : undefined,
                            rules: [
                                {
                                    validator: validatorSelectCity
                                }
                            ]
                        })
                            (
                            <SelectCity params={selectCityParams(commonFundCenterAddress ? commonFundCenterAddress : undefined)} />
                            )
                            : <span>
                                {
                                    !commonFundCenterAddress && !commonFundCenterAddressDetail ?
                                        '/' :
                                        `${commonFundCenterAddress && commonFundCenterAddress.selectName.join('')}${commonFundCenterAddressDetail || ''}`
                                }
                            </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('commonFundCenterAddressDetail', {
                                initialValue: commonFundCenterAddressDetail,
                                rules: [
                                    {
                                        max: 100,
                                        message: '请控制在100个字之内',
                                    }
                                ],
                            })(
                                <TextArea placeholder="请填写详细地址" />
                                )
                        }
                    </FormItem>
                }
                <FormItem label="公积金联系人&电话" {...formItemLayout}>

                    {
                        edit ? getFieldDecorator('commonFundPersonName', {
                            initialValue: commonFundPersonName,
                            rules: [{
                                pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                message: '联系人格式不正确'
                            }]
                        })(
                            <Input placeholder='请填写联系人' style={{ width: 150, marginRight: 10 }} />
                            )
                            : <span>{commonFundPersonName || '/'}</span>
                    }
                    {
                        edit ? getFieldDecorator('commonFundPersonPhone', {
                            initialValue: commonFundPersonPhone,
                        })(
                            <EditableTagGroup style={{ width: 98 }} max={5} rule={getRegExp('mobile | landline ')} ruleMessage="电话格式不正确" buttonText="新增电话" />
                            )
                            : <span style={{ marginLeft: 10 }}>{commonFundPersonPhone && commonFundPersonPhone.join('，')}</span>
                    }
                </FormItem>
                <FormItem label="公积金增减常规办理方式" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('dealMethod', {
                            initialValue: dealMethod,
                        })(
                            <Radio.Group onChange={(e: any) => this.setState({ dealMethod: e.target.value })}>
                                <Radio value={1}>在线办理</Radio>
                                <Radio value={2}>柜台办理</Radio>
                            </Radio.Group>
                            )
                            : <span>{dealMethod === 1 ? '在线办理' : dealMethod === 2 ? '柜台办理' : '/'}</span>
                    }
                </FormItem>
                {
                    this.state.dealMethod === 1 && <FormItem label="在线办理登录页网址" {...formItemLayout} required={false}>
                        {
                            edit ? getFieldDecorator('onlineUrl', {
                                initialValue: onlineUrl,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写网址'
                                    },
                                    {
                                        max: 100,
                                        message: '请控制在100个字之内',
                                    },
                                ],
                            })(
                                <Input style={{ width: 150 }} placeholder="请填写" />
                                )
                                : onlineUrl ?
                                    <a href={onlineUrl} target="_blank" >{onlineUrl}</a> : '/'
                        }

                    </FormItem>
                }

                {
                    this.state.dealMethod === 1 && <FormItem label="密码" {...formItemLayout} required={false}>
                        {
                            edit ? getFieldDecorator('onlinePassword', {
                                initialValue: onlinePassword,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写密码'
                                    },
                                    {
                                        max: 100,
                                        message: '请控制在100个字之内',
                                    },
                                ],
                            })(
                                <Input style={{ width: 150 }} placeholder="请填写" />
                                )
                                : <span>{onlinePassword ? onlinePassword.replace(/./g, '*') : '/'}</span>
                        }
                    </FormItem>
                }
                {
                    this.state.dealMethod === 1 && <FormItem label="在线办理其他方式" {...formItemLayout} extra='所需下载软件等'>

                        {
                            edit ? getFieldDecorator('onlineOtherMethod', {
                                initialValue: onlineOtherMethod,
                                rules: [
                                    {
                                        max: 100,
                                        message: '请控制在100个字之内',
                                    },
                                ],
                            })(
                                <Input placeholder="请填写" />
                                )
                                : <span>{onlineOtherMethod ? onlineOtherMethod : '/'}</span>
                        }
                    </FormItem>
                }

                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">公积金保险自动缴费授权书：{!edit && !accAutoProxy && '/'}</label>
                    {
                        getFieldDecorator('accAutoProxy', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accAutoProxy ? accAutoProxy : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传公积金保险自动缴费授权书') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accAutoProxy', Number.MAX_VALUE) } className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
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



export default Form.create()(FundInfo);
