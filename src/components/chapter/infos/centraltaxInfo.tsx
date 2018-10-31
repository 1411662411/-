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
} from 'antd';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import SelectCity from '../../select-city/index';
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
    cascaderOptionsTime,
    formItemLayout,
    deadLineText,
    validatorEmpty,
    validateUpload,
} from './util/index';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

interface TOwnProps  {
    /* 是否有编辑状态 */
    edit?: boolean;

    uploadApi?: string;
    /**
     * 初始数据
     */
    data: {
        /**
         * 国税申报网址
         */
        taxUrl?: string;
        /**
         * 国税登录密码
         */
        taxPassword?: string;
        /**
         * 国税首次申报时间。 moment('2017/01')
         */
        taxFirstTime?: string;
        /**
         * 纳税申报时间节点。 （每月）
         */
        taxTimeline1?: any[];
        /**
         * 纳税申报时间节点。 （15）
         */
        taxTimeline2?: string;
        taxTimeline3?: string;
        /**
         * 年度所得汇算清缴节点。 （每年）
         */
        annualIncomeSettleTimeline1?: any[];
        /**
         * 国税服务厅地址
         */
        taxHallAddress?: {
            selectVal: number[]; 
            selectName: string[];
        };
        /**
         * 国税服务厅详细地址
         */
        taxHallAddressDetail?: string;
        /**
         * 国税管理专员名
         */
        taxPersonName?: string;
        /**
         * 国税管理专员电话
         */
        taxPersonPhone?: number[]
        /**
         * 国税CA证书有效期。 起止时间 moment('2017/01/01')
         */
        taxCaTermStart?: string;
        /**
         * 国税CA证书有效期。 终止时间 moment('2017/01/01')
         */
        taxCaTermEnd?: string;
        /**
         * 国税VPDN证书有效期。 起止时间 moment('2017/01/01')
         */
        taxVpndTermStart?: string;
        /**
         * 国税VPDN证书有效期。 终止时间 moment('2017/01/01')
         */
        taxVpndTermEnd?: string;
        /**
         * 银行委托代扣税款协议-国税
         */
        bankReplaceNational?: string;
        /**
         * 附件 三方协议（实时缴税协议书）
         */
        accTripartite?: Attachment[];
        /**
         * 附件 增值税发票技术维护协议书（如购买光盘）
         */
        accAddedTex?: Attachment[];
    }
}

interface CentralTaxProps extends TOwnProps, FormComponentProps{
    
}



interface CentralTaxState {
}

class CentralTax extends Component<CentralTaxProps, CentralTaxState> {
    constructor(props:CentralTaxProps) {
        super(props);
        this.state = {};
    }
    uploading = false;

    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        // 过滤掉beforeUpload返回false的
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
    }
    changeState = (key, value) => {
        this.setState({
            [`${key}`]: value,
        });
    }
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    render() {
        const {
            form,
            data = {},
            edit,
        } = this.props;
        const {
            /**
             * 国税申报网址
             */
            taxUrl,
            /**
             * 国税登录密码
             */
            taxPassword,
            /**
             * 国税首次申报时间。 moment('2017/01')
             */
            taxFirstTime,
            /**
             * 纳税申报时间节点。 （每月）
             */
            taxTimeline1,
            /**
             * 年度所得汇算清缴节点。
             */
            annualIncomeSettleTimeline1,
            /**
             * 国税服务厅地址
             */
            taxHallAddress,
            /**
             * 国税服务厅详细地址
             */
            taxHallAddressDetail,
            /**
             * 国税管理专员名
             */
            taxPersonName,
            /**
             * 国税管理专员电话
             */
            taxPersonPhone,
            /**
             * 国税CA证书有效期。 起止时间 moment('2017/01/01')
             */
            taxCaTermStart,
            /**
             * 国税CA证书有效期。 终止时间 moment('2017/01/01')
             */
            taxCaTermEnd,
            /**
             * 国税VPDN证书有效期。 起止时间 moment('2017/01/01')
             */
            taxVpndTermStart,
            /**
             * 国税VPDN证书有效期。 终止时间 moment('2017/01/01')
             */
            taxVpndTermEnd,
            /**
             * 银行委托代扣税款协议-国税
             */
            bankReplaceNational,
            /**
             * 附件 三方协议（实时缴税协议书）
             */
            accTripartite,
            /**
             * 附件 增值税发票技术维护协议书（如购买光盘）
             */
            accAddedTex,
        } = data;
        const {
            getFieldDecorator
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="国税申报网址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxUrl', {
                            initialValue: taxUrl,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            :
                            taxUrl ?
                             <a href={taxUrl} target="_blank">{taxUrl}</a>
                            : '/'
                            // <span>

                            //     {taxUrl || '/'}
                            // </span>
                    }
                </FormItem>
                <FormItem label="国税登录密码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxPassword', {
                            initialValue: taxPassword,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{taxPassword ? taxPassword.replace(/./g, '*') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="国税首次申报时间" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxFirstTime', {
                            initialValue: taxFirstTime && moment(taxFirstTime),
                        })(
                            <DatePicker format="YYYY/MM/DD" />
                            )
                            : <span>{taxFirstTime || '/'}</span>
                    }
                </FormItem>
                <FormItem label="纳税申报时间截点" {...formItemLayout}>
                    {
                        edit ? <span>{getFieldDecorator('taxTimeline1', {
                                        initialValue: taxTimeline1 && taxTimeline1.length > 1 ? taxTimeline1 : [],
                                    })(
                                        <Cascader options={cascaderOptionsTime} placeholder="请选择" style={{ width: 166, display: 'inline-block' }}></Cascader>
                                    )} 前
                            </span>
                            : <span>{deadLineText(taxTimeline1)}</span>
                    }
                </FormItem>
                <FormItem label="年度所得税汇算清缴截点" {...formItemLayout}>
                    {
                        edit ? <span>{getFieldDecorator('annualIncomeSettleTimeline1', {
                            initialValue:  annualIncomeSettleTimeline1 && annualIncomeSettleTimeline1.length > 1 ? annualIncomeSettleTimeline1 : [],
                        })(
                            <Cascader options={cascaderOptions} placeholder="请选择" style={{ width: 166, display: 'inline-block' }}></Cascader>
                            )} 前</span>
                            : <span>{deadLineText(annualIncomeSettleTimeline1)}</span>
                    }
                </FormItem>
                <FormItem label="国税服务厅地址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxHallAddress', {
                                initialValue: taxHallAddress ? taxHallAddress: undefined,
                                rules: [
                                    {
                                        validator: validatorSelectCity
                                    }
                                ]
                            })(
                                <SelectCity params={selectCityParams(taxHallAddress ? taxHallAddress : undefined)} />
                            )
                            : <span>
                                {
                                    !taxHallAddress && !taxHallAddressDetail ?
                                        '/' :
                                        `${taxHallAddress && taxHallAddress.selectName.join('')} ${taxHallAddressDetail|| ''}`
                                }
                            </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('taxHallAddressDetail', {
                                initialValue: taxHallAddressDetail,
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
                
                <FormItem label="国税专管员&电话" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxPersonName', {
                            initialValue: taxPersonName,
                            rules: [{
                                pattern:getRegExp('zh1-4'),
                                message:'国税专管员格式不正确',
                            }]
                        })(
                            <Input style={{ width: 166, marginRight: 10 }} placeholder="请填写姓名" />
                            )
                            : <span>{taxPersonName || ''}</span>
                    }
                    {
                        edit ? getFieldDecorator('taxPersonPhone', {
                            initialValue: taxPersonPhone,
                        })(
                            <EditableTagGroup style={{ width: 98 }} max={5} rule={getRegExp('mobile | landline ')} ruleMessage="电话格式不正确" buttonText="新增电话" />
                            )
                            : <span style={{ marginLeft: 10 }}>{taxPersonPhone ? taxPersonPhone.join('，') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="国税CA证书有效期" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxCaTerm', {
                            initialValue: dateRangeInitialValue(taxCaTermStart, taxCaTermEnd),
                            rules: [
                                {
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择国税CA证书有效期')
                                }
                            ]
                        })(
                            <DateRange format="YYYY/MM/DD" />
                            )
                            : <span>
                                {
                                    !taxCaTermStart && !taxCaTermEnd ?
                                        '/' :
                                        taxCaTermStart && !taxCaTermEnd ?
                                            taxCaTermStart : `${taxCaTermStart}  —  ${taxCaTermEnd}`
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="国税VPDN有效期" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxVpndTerm', {
                            initialValue: dateRangeInitialValue(taxVpndTermStart, taxVpndTermEnd),
                            rules: [
                                {
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择国税VPDN有效期')
                                }
                            ]
                        })(
                            <DateRange format="YYYY/MM/DD" />
                            )
                            : <span>
                                {
                                    !taxVpndTermStart && !taxVpndTermEnd ?
                                        '/' :
                                        taxVpndTermStart && !taxVpndTermEnd ?
                                            taxVpndTermStart : `${taxVpndTermStart}  —  ${taxVpndTermEnd}`
                                }
                            </span>
                    }
                </FormItem>
                <FormItem label="银行委托代扣税款协议-国税" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankReplaceNational', {
                                initialValue: bankReplaceNational,
                                rules: [{
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }],
                            })(
                                <Input placeholder="请填写" />
                                )
                            : <span>
                                {bankReplaceNational || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">三方协议（实时缴税协议书）：{!edit && !accTripartite && '/' }</label>
                    {
                        getFieldDecorator('accTripartite', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accTripartite ? accTripartite : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传三方协议（实时缴税协议书）') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accTripartite', Number.MAX_VALUE)}
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
                    <label className="attachment-label">增值税发票技术维护协议书（如购买光盘）：{!edit && !accAddedTex && '/' }</label>
                    {
                        getFieldDecorator('accAddedTex', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accAddedTex ? accAddedTex : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传增值税发票技术维护协议书') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accAddedTex', Number.MAX_VALUE)}
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


export default Form.create()(CentralTax)
