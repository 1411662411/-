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
} from 'antd';
import Immutable from 'immutable';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import {
    selectCityParams,
    validatorSelectCity,
    dateRangeInitialValue,
    validatorDateRange,
    formItemLayout,
    validatorEmpty,
    validateUpload,
} from './util/index';
import moment, { Moment } from 'moment';
import SelectCity from '../../select-city/index';
import address from '../select-city/address.json';
import getRegExp from '../../../util/regExp';
import DateRange from '../../../components/date-range/index';
import uploadProps, { uProps } from './util/uploadProps';
import SelectPerson, { PersonSource } from './util/selectPerson';
import './companyInfo.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
/**
 * 附件
 */
export interface Attachment {
    uid: number;
    ossKey?: string; /* oss的key */
    name?: string;
    url?: string; /* 显示的url */
};

interface TOwnProps  {
    /* 是否有编辑状态 */
    edit?: boolean;
    uploadApi?: string;
    personSource?: PersonSource;
    /**
     * 初始数据
     */
    data: {
        /* 公司名称 */
        companyName: string;
        /* 公司类型 */
        companyType?: string;
        /* 负责人 */
        chargeMan?: string;
        chargeManId?: string;
        /* 负责人身份证号 */
        changeManIdCode?: number;
        /* 成立时间。 下拉选时间  */
        fundingTime?: string;
        /* 纳税人统一信用代码 */
        taxpayerCreditCode?: string | number;
        /* 验资报告 */
        capitalVerificationReport?: string;
        /* 营业场所（注册地址）（省市区） */
        businessRegisterAddress1?: {
            selectVal: number[]
            selectName: string[];
        }
        /* 营业场所（注册地址）（详细地址） */
        businessRegisterAddress2?: string;
        /* 注册地址期限。 起始时间  */
        registerDeadlineStart?: string;
        /* 注册地址期限。 终止时间  */
        registerDeadlineEnd?: string;
        registerDeadlineLong?: boolean
        /* 营业场所（办公地址）（省市区） */
        businessOfficeAddress1?: {
            selectVal: number[]
            selectName: string[];
        };
        /* 营业场所（办公地址）（详细地址） */
        businessOfficeAddress2?: string;
        /* 邮编 */
        zipCode?: string | number;
        /* 营业期限。 起始时间（2017/01/01） */
        businessDeadlineStart?: string;
        /* 营业期限。 终止时间（2017/01/01） */
        businessDeadlineEnd?: string;
        /* 营业期限是否长期 */
        businessDeadlineLong?: boolean;
        /* 附件 营业执照正本 */
        accBusinessLicense?: Attachment[];
        /* 附件 营业执照副本 */
        accBusinessLicenseCopy?: Attachment[];
        /* 附件 验资报告 */
        accCapitalVerificationReport?: Attachment[];
        /* 附件 租赁合同 */
        accLeaseAgreement?: Attachment[];
    }
}

interface CompanyInfoProps extends TOwnProps, FormComponentProps {

}
class CompanyInfo extends Component<CompanyInfoProps> {
    constructor(props:CompanyInfoProps) {
        super(props);
    }
    uploading = false;
    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
    }
    
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    render() {

        const {
            form,
            data = {} as any,
            edit,
            personSource = Immutable.fromJS([]) ,
        } = this.props;
        const {
            companyName,
            companyType,
            chargeMan,
            chargeManId,
            changeManIdCode,
            fundingTime,
            taxpayerCreditCode,
            capitalVerificationReport,
            businessRegisterAddress1,
            businessRegisterAddress2,
            registerDeadlineStart,
            registerDeadlineEnd,
            registerDeadlineLong,
            businessDeadlineLong,
            businessOfficeAddress1,
            businessOfficeAddress2,
            zipCode,
            businessDeadlineStart,
            businessDeadlineEnd,
            accBusinessLicense,
            accBusinessLicenseCopy,
            accCapitalVerificationReport,
            accLeaseAgreement,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue,
        } = form!;
        return (
            <Form className="companyinfo">
                <FormItem label="公司名称" {...formItemLayout}>
                    {
                        getFieldDecorator('companyName', {
                            initialValue: companyName,
                        })(
                            <span>
                                {companyName || '/'}
                            </span>
                            )
                    }
                </FormItem>
                <FormItem label="公司类型" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('companyType', {
                            initialValue: companyType,
                            rules:[
                                {
                                    pattern: getRegExp('zh1-100'),
                                    message: '公司类型格式不正确'
                                }
                            ]
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{companyType || '/'}</span>
                    }
                </FormItem>
                <FormItem label="负责人" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('chargeMan', {
                                initialValue: chargeMan,
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                    message: '负责人格式不正确'
                                }]
                            })(
                                <Input placeholder='请填写' />
                            )
                            : <span>{chargeMan || '/'}</span>
                    }
                </FormItem>
                <FormItem label="负责人身份证号" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('changeManIdCode', {
                            initialValue: changeManIdCode,
                            rules: [
                                {
                                    pattern:getRegExp('idcard'),
                                    message: '负责人身份证号格式不正确',
                                }
                            ]
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{changeManIdCode || '/'} </span>
                    }
                </FormItem>
                <FormItem label="成立时间" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('fundingTime', {
                            initialValue: fundingTime && moment(fundingTime),
                        })(
                            <DatePicker format="YYYY/MM/DD" />
                            )
                            : <span>{fundingTime || '/'}</span>
                    }
                </FormItem>
                <FormItem label="纳税人统一信用代码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxpayerCreditCode', {
                            initialValue: taxpayerCreditCode,
                            rules: [
                                {
                                    pattern: /^[0-9a-zA-Z]{18,18}$/,
                                    message: '纳税人统一信用代码格式不正确'
                                }
                            ]
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{taxpayerCreditCode || '/'}</span>
                    }
                </FormItem>
                <FormItem label="验资报告" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('capitalVerificationReport', {
                            initialValue: capitalVerificationReport,
                            rules: [
                                {
                                    max: 100,
                                    message:'请控制在100个字之内',
                                }
                            ]
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{capitalVerificationReport || '/'}</span>
                    }
                </FormItem>
                <FormItem label="营业场所(注册地址)" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('businessRegisterAddress1', {
                            initialValue: businessRegisterAddress1 ? businessRegisterAddress1 : undefined,
                            rules: [{
                                validator: validatorSelectCity,
                            }]
                        })(
                            <SelectCity params={selectCityParams(businessRegisterAddress1 ? businessRegisterAddress1 : undefined)} />
                            )
                            : <span>
                            {
                                !businessRegisterAddress1 && !businessRegisterAddress2 ?
                                    '/' :
                                    `${businessRegisterAddress1.selectName.join('')}${businessRegisterAddress2 || ''}`
                            }
                            </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('businessRegisterAddress2', {
                                initialValue: businessRegisterAddress2,
                                rules: [
                                    {
                                        max: 100,
                                        message:'请控制在100个字之内',
                                    }
                                ],
                            })(
                                <TextArea placeholder="请填写详细地址" />
                                )
                        }
                    </FormItem>
                }
                <FormItem label="注册地址期限" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('registerDeadline', {
                                initialValue: dateRangeInitialValue(registerDeadlineStart, registerDeadlineEnd, registerDeadlineLong),
                                rules: [{
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择注册地址期限')
                                }]
                            })(
                                <DateRange format="YYYY/MM/DD" hasLong/>
                            )
                            : <span> {
                                !registerDeadlineStart && !registerDeadlineEnd ?
                                    '/' :
                                    registerDeadlineStart && !registerDeadlineEnd ?
                                        `${registerDeadlineStart} - 长期` : `${registerDeadlineStart}  —  ${registerDeadlineEnd}`
                            }</span>
                    }
                </FormItem>
                <FormItem label="营业场所(办公地址)" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('businessOfficeAddress1', {
                            initialValue: businessOfficeAddress1 ? businessOfficeAddress1 : undefined,
                            rules: [{
                                validator: validatorSelectCity
                            }]
                        })(
                            <SelectCity params={selectCityParams(businessOfficeAddress1 ?  businessOfficeAddress1 : undefined)} />
                            )


                            : <span>
                            {
                                !businessOfficeAddress1 && !businessOfficeAddress2 ?
                                    '/' :
                                    `${businessOfficeAddress1.selectName.join('')}${businessOfficeAddress2 || ''}`
                            }
                            </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('businessOfficeAddress2', {
                                initialValue: businessOfficeAddress2,
                                rules: [
                                    {
                                        max: 100,
                                        message:'请控制在100个字之内',
                                    }
                                ],
                            })(
                                <TextArea placeholder="请填写详细地址" />
                                )
                        }
                    </FormItem>
                }
                <FormItem label="邮编" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('zipCode', {
                                initialValue: zipCode,
                                rules: [
                                    {
                                        pattern: getRegExp('zip'),
                                        message: '邮编格式不正确'
                                    }
                                ]
                            })(
                                <Input placeholder="请填写" />
                            )
                            : <span>{zipCode || '/'}</span>
                    }
                </FormItem>
                <FormItem label="营业期限" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('businessDeadline', {
                                initialValue: dateRangeInitialValue(businessDeadlineStart, businessDeadlineEnd, businessDeadlineLong),
                                rules: [{
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择营业期限')
                                }]
                            })(
                                <DateRange format="YYYY/MM/DD" hasLong />
                            )
                            : <span>
                                {
                                    !businessDeadlineStart && !businessDeadlineEnd ?
                                        '/' :
                                        businessDeadlineStart && !businessDeadlineEnd ?
                                            `${businessDeadlineStart} - 长期` : `${businessDeadlineStart}  —  ${businessDeadlineEnd}`
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">营业执照正本：{!edit && !accBusinessLicense && '/' } </label>
                    {
                        getFieldDecorator('accBusinessLicense', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accBusinessLicense ? accBusinessLicense : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传营业执照正本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accBusinessLicense').length===1} 
                                    {...this.uProps('accBusinessLicense')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accBusinessLicense').length===1 && message.error('上传附件数量限制为1份')}>
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
                    <label className="attachment-label">营业执照副本：{!edit && !accBusinessLicenseCopy && '/' }</label>
                    {
                        getFieldDecorator('accBusinessLicenseCopy', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accBusinessLicenseCopy ? accBusinessLicenseCopy : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传营业执照副本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accBusinessLicenseCopy').length===1} 
                                    {...this.uProps('accBusinessLicenseCopy')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accBusinessLicenseCopy').length===1 && message.error('上传附件数量限制为1份')}>
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
                    <label className="attachment-label">验资报告：{!edit && !accCapitalVerificationReport && '/' }</label>
                    {
                        getFieldDecorator('accCapitalVerificationReport', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accCapitalVerificationReport ? accCapitalVerificationReport : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传验资报告') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accCapitalVerificationReport', Number.MAX_VALUE)}
                                    className={edit ? "" : "upload-disabled"}>
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
                <FormItem label=" " colon={false} {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">租赁合同：{!edit && !accLeaseAgreement && '/' }</label>
                    {
                        getFieldDecorator('accLeaseAgreement', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accLeaseAgreement ? accLeaseAgreement : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传租赁合同') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accLeaseAgreement', Number.MAX_VALUE)}
                                    className={edit ? "" : "upload-disabled"}>
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


export default Form.create()(CompanyInfo)