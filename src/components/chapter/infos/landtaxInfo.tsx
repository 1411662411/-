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
} from 'antd';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import SelectCity from '../../select-city/index';
import address from '../../select-city/address.json';
import getRegExp from '../../../util/regExp';
import DateRange from '../../../components/date-range/index';
import uploadProps, { uProps } from './util/uploadProps';
import { Attachment } from './companyInfo';
import {
    selectCityParams,
    validatorSelectCity,
    dateRangeInitialValue,
    validatorDateRange,
    formItemLayout,
    cascaderOptions,
    deadLineText,
    validateUpload,
} from './util/index';
import EditableTagGroup from '../../tags/index';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;




const TaxDeclarationPlaceSelectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
    return {
        deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
        popupStyle: {
            width: 350,
            zIndex: 99999,
        }, /* 弹窗样式 */
        placeholder: '省市区',
        address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
        style: {
            width: 166,
        }, /* input 的样式 */
    }
}
interface TOwnProps extends FormComponentProps {
    /* 是否有编辑状态 */
    edit?: boolean;

    uploadApi?: string;
    /**
     * 初始数据
     */
    data: {
        /**
         * 个税申报地
         */
        taxDeclarationPlace?: {
            selectVal: number[];
            selectName: string[];
        };
        /**
         * 个税申报地详细地址
         */
        taxDeclarationPlaceDuoduo?: string;
        /**
         * 地税申报网址
         */
        taxUrl?: string;
        /**
         * 地税登录密码
         */
        taxPassword?: string;
        /**
         * 地税首次申报时间。 moment('2017/01')
         */
        taxFirstTime?: Moment;
        /**
         * 纳税申报时间节点。 （每月）
         */
        taxTimeline1?: any[];

        /**
         * 年度所得汇算清缴节点。 （每年）
         */
        annualSocialDeadline1?: any[];
        /**
         * 地税服务厅地址
         */
        taxHallAddress?: {
            selectVal: number[];
            selectName: string[];
        };
        /**
         * 地税服务厅详细地址
         */
        taxHallAddressDetail?: string;
        /**
         * 地税管理专员名
         */
        taxPersonName?: string;
        /**
         * 地税管理专员电话
         */
        taxPersonPhone?: number[];
        /**
         * 个税申报系统
         */
        personalTaxSystem?: string;
        /**
         * 个税申报密码
         */
        personalTaxPassword?: string;
        /**
         * 残保金是否需要申报
         */
        residualReport?: 1 | 0;
        /**
         * 个税申报是否金税三期系统。
         */
        personalTaxThirdSystem?: 1 | 0;
        /**
         * 社保申报是否地税申报扣款。 
         */
        socialLandTaxCut?: 1 | 0;

        /**
         * 地税CA证书有效期。 起止时间 moment('2017/01/01')
         */
        taxCaTermStart?: string;
        /**
         * 地税CA证书有效期。 终止时间 moment('2017/01/01')
         */
        taxCaTermEnd?: string;
        /**
         * 银行委托代扣税款协议-地税
         */
        bankReplaceLand?: string;
        /**
         * 附件 三方协议（实时缴税协议书）
         */
        accTripartite?: Attachment[];
    }
}


interface LandTaxState {
}

interface LandTaxProps extends TOwnProps, FormComponentProps {

}
class LandTax extends Component<LandTaxProps, LandTaxState> {
    constructor(props: LandTaxProps) {
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
    validatorEmpty = (value) => {
        if (value === undefined || value === '') {
            return true;
        }
        return false;
    }
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    validatorTaxDeclarationPlace = (rule, value, callback) => {
        const taxDeclarationPlaceDuoduo = this.props.form.getFieldValue('taxDeclarationPlaceDuoduo');
        let {
            selectVal = [],
            selectName = []
        } = value || {};
        // 过滤undefined成员
        selectVal = selectVal.filter(item => !!item)
        selectName = selectName.filter(item => !!item)
        if (selectName.length > 0 && selectName.length < 3 || selectName < 3 && taxDeclarationPlaceDuoduo) {
            callback('请选择省市区');
        }
        else {
            callback()
        }
        if (selectName.length === 3 && !taxDeclarationPlaceDuoduo) {
            this.props.form.setFields({
                taxDeclarationPlaceDuoduo: {
                    value: undefined,
                    errors: [new Error('请填写申报地')],
                },
            });
        }
        else {
            this.props.form.setFields({
                taxDeclarationPlaceDuoduo: {
                    value: taxDeclarationPlaceDuoduo,
                },
            });
        }
    }
    validatorTaxDeclarationPlaceDuoduo = (rule, value, callback, thirdCity = true) => {
        value = value ? value.trim() : '';
        const taxDeclarationPlace = this.props.form.getFieldValue('taxDeclarationPlace');
        if (!value && taxDeclarationPlace && taxDeclarationPlace.selectVal.length === 3) {
            return callback('请填写申报地');
        }
        if (value.trim().length > 100) {
            return callback('请控制在100个字之内');
        }
        if (value && (taxDeclarationPlace === undefined || taxDeclarationPlace && taxDeclarationPlace.selectVal.length === 0)) {
            this.props.form.setFields({
                taxDeclarationPlace: {
                    value: undefined,
                    errors: [new Error('请选择省市区')],
                },
            });
        }
        else {
            this.props.form.setFields({
                taxDeclarationPlace: {
                    value: taxDeclarationPlace,
                },
            });
        }
        callback();
    }
    render() {
        const {
            form,
            data = {},
            edit,
        } = this.props;
        const {
            /**
             * 个税申报地
             */
            taxDeclarationPlace,
            /**
             * 个税申报地详细地址
             */
            taxDeclarationPlaceDuoduo,
            /**
             * 地税申报网址
             */
            taxUrl,
            /**
             * 地税登录密码
             */
            taxPassword,
            /**
             * 地税首次申报时间。 moment('2017/01')
             */
            taxFirstTime,
            /**
             * 纳税申报时间节点。 （每月）
             */
            taxTimeline1,
            /**
             * 年度所得汇算清缴节点。
             */
            annualSocialDeadline1,
            /**
             * 地税服务厅地址
             */
            taxHallAddress,
            /**
             * 地税服务厅详细地址
             */
            taxHallAddressDetail,
            /**
             * 地税管理专员名
             */
            taxPersonName,
            /**
             * 地税管理专员电话
             */
            taxPersonPhone,
            /**
             * 地税CA证书有效期。 起止时间 moment('2017/01/01')
             */
            taxCaTermStart,
            /**
             * 地税CA证书有效期。 终止时间 moment('2017/01/01')
             */
            taxCaTermEnd,
            /**
             * 银行委托代扣税款协议-地税
             */
            bankReplaceLand,
            /**
             * 附件 三方协议（实时缴税协议书）
             */
            accTripartite,
            /**
             * 个税申报系统
             */
            personalTaxSystem,
            /**
             * 个税申报密码
             */
            personalTaxPassword,
            /**
             * 残保金是否需要申报
             */
            residualReport,
            /**
             * 个税申报是否金税三期系统。
             */
            personalTaxThirdSystem,
            /**
             * 社保申报是否地税申报扣款。 
             */
            socialLandTaxCut,
        } = data;
        const {
            getFieldDecorator
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="个税申报地" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxDeclarationPlace', {
                            initialValue: taxDeclarationPlace ? taxDeclarationPlace : undefined,
                            rules: [
                                {
                                    validator: this.validatorTaxDeclarationPlace
                                }
                            ]
                        })(
                            <SelectCity params={TaxDeclarationPlaceSelectCityParams(taxDeclarationPlace ? taxDeclarationPlace : undefined)} />
                            )
                            : <span>
                                {
                                    !taxDeclarationPlace && !taxDeclarationPlaceDuoduo ?
                                        '/' :
                                        `${taxDeclarationPlace && taxDeclarationPlace.selectName.join('')} ${taxDeclarationPlaceDuoduo}`
                                }
                            </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('taxDeclarationPlaceDuoduo', {
                                initialValue: taxDeclarationPlaceDuoduo,
                                rules: [
                                    {
                                        validator: this.validatorTaxDeclarationPlaceDuoduo,
                                    }
                                ],
                            })(
                                <TextArea placeholder="申报地" />
                                )
                        }
                    </FormItem>
                }
                <FormItem label="地税申报网址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxUrl', {
                            initialValue: taxUrl,
                            rules: [{
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
                    }
                </FormItem>
                <FormItem label="地税登录密码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxPassword', {
                            initialValue: taxPassword,
                            rules: [{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{taxPassword ? taxPassword.replace(/./g, '*') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="地税首次申报时间" {...formItemLayout}>
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
                            <Cascader options={cascaderOptions} placeholder="请选择" style={{ width: 166, display: 'inline-block' }}></Cascader>
                            )} 前</span>
                            : <span>{deadLineText(taxTimeline1)}</span>
                    }
                </FormItem>
                <FormItem label="年度社保清算截点" {...formItemLayout}>
                    {
                        edit ? <span>{getFieldDecorator('annualSocialDeadline1', {
                            initialValue: annualSocialDeadline1 && annualSocialDeadline1.length > 1 ? annualSocialDeadline1 : [],
                        })(
                            <Cascader options={cascaderOptions} placeholder="请选择" style={{ width: 166, display: 'inline-block' }}></Cascader>
                            )} 前</span>
                            : <span>{deadLineText(annualSocialDeadline1)}</span>
                    }
                </FormItem>
                <FormItem label="地税服务厅地址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxHallAddress', {
                            initialValue: taxHallAddress ? taxHallAddress : undefined,
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
                                        `${taxHallAddress && taxHallAddress.selectName.join('')}${taxHallAddressDetail || ''}`
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
                                        message: '请控制在100个字之内',
                                    }
                                ],
                            })(
                                <TextArea placeholder="请填写详细地址" />
                                )
                        }
                    </FormItem>
                }

                <FormItem label="地税专管员&电话" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxPersonName', {
                            initialValue: taxPersonName,
                            rules: [{
                                pattern: getRegExp('zh1-4'),
                                message: '地税专管员格式不正确',
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
                <FormItem label="个税申报系统" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('personalTaxSystem', {
                            initialValue: personalTaxSystem,
                            rules: [
                                {
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }
                            ],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{personalTaxSystem || '/'}</span>
                    }
                </FormItem>
                <FormItem label="个税申报密码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('personalTaxPassword', {
                            initialValue: personalTaxPassword,
                            rules: [
                                {
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }
                            ],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{personalTaxPassword ? personalTaxPassword.replace(/./g, '*') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="残保金是否需要申报" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('residualReport', {
                            initialValue: residualReport,
                        })(
                            <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>

                            )
                            : <span>{residualReport === 1 ? '是' : residualReport === 0 ? '否' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="个税申报是否金税三期系统" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('personalTaxThirdSystem', {
                            initialValue: personalTaxThirdSystem,
                        })(
                            <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                            )
                            : <span>{personalTaxThirdSystem === 1 ? '是' : personalTaxThirdSystem === 0 ? '否' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="社保申报是否地税申报扣款" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('socialLandTaxCut', {
                            initialValue: socialLandTaxCut,
                        })(
                            <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                            )
                            : <span>{socialLandTaxCut === 1 ? '是' : socialLandTaxCut === 0 ? '否' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="地税CA证书有效期" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('taxCaTerm', {
                            initialValue: dateRangeInitialValue(taxCaTermStart, taxCaTermEnd),
                            rules: [
                                {
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择地税CA证书有效期')
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
                <FormItem label="银行委托代扣税款协议-地税" {...formItemLayout}>
                    {
                        edit
                            ? getFieldDecorator('bankReplaceLand', {
                                initialValue: bankReplaceLand,
                                rules: [{
                                    max: 100,
                                    message: '请控制在100个字之内',
                                }],
                            })(
                                <Input placeholder="请填写" />
                                )
                            : <span>
                                {bankReplaceLand || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">三方协议（实时缴税协议书）：{!edit && !accTripartite && '/'}</label>
                    {
                        getFieldDecorator('accTripartite', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accTripartite ? accTripartite : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback, '请上传三方协议（实时缴税协议书）') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accTripartite', Number.MAX_VALUE) } className={edit ? "" : "upload-disabled"}>
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

export default Form.create()(LandTax);
