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
import Immutable from 'immutable';
import moment, { Moment } from 'moment';
import SelectCity from '../../select-city/index';
import address from '../select-city/address.json';
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
    PersonSourceProps,
    validateUpload,
} from './util/index';
import EditableTagGroup from '../../tags/index';
import SelectPerson, { PersonSource } from './util/selectPerson';
import CascaderRange from '../../cascader-range/index';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

interface TOwnProps {
    /* 是否有编辑状态 */
    edit?: boolean;
    personSource?: PersonSource;
    uploadApi?: string;
    /**
     * 初始数据
     */
    data: {
        /**
         * 编号
         */
        code?: string;
        /**
         * 机构名称
         */
        orgName?: string;
        /**
         * 地址（省市区）
         */
        address?: {
            selectVal: number[]; 
            selectName: string[];
        };
        /**
         * 地址（详细地址）
         */
        addressDetail?: string;
        /**
         * 法定代表人（负责人）id'
         */
        chargerId?: string;
        /**
         * 法定代表人（负责人）
         */
        charger?: string;
        /**
         * 机构性质
         */
        orgProperty?: string;
        /**
         * 许可文号
         */
        permitNumber?: string;
        /**
         * 服务范围
         */
        serviceScope?: string;
        /**
         * 发证日期moment(2017/01/01)
         */
        issueDate?: string;
        /**
         * 有效期限moment(2017/01/01)
         */
        deadline?: string;
        /**
         * 年检时间
         */
        annualSurveyStart?: any[];
        annualSurveyEnd?: any[];
        /**
         * 附件 人力资源许可证正本
         */
        accHuman?: Attachment[];
        /**
         * 附件 人力资源许可证副本
         */
        accHumanCopy?: Attachment[];
    }
}


interface HumanInfoState {
}

interface HumanInfoProps extends TOwnProps, FormComponentProps {

}
class HumanInfo extends Component<HumanInfoProps, HumanInfoState> {
    constructor(props:HumanInfoProps) {
        super(props);
        this.state = {};
    }
    uploading = false;

    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
    }
    validateAnnualSurvey = (rule, value, callback) => {
        console.log(value);
        if(value === undefined || value && (value[0].length === 0 && value[1].length === 0 || value[0].length === 3 && value[1].length === 3)) {
            return callback();
        }
        callback('请选择年检时间');
    }
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    render() {
        const {
            form,
            data = {},
            edit,
            personSource = Immutable.fromJS([])
        } = this.props;
        const {
            /**
         * 编号
         */
            code,
            /**
             * 机构名称
             */
            orgName,
            /**
             * 地址（省市区）
             */
            address,
            /**
             * 地址（详细地址）
             */
            addressDetail,
            /**
             * 法定代表人（负责人）id'
             */
            chargerId,
            /**
             * 法定代表人（负责人）
             */
            charger,
            /**
             * 机构性质
             */
            orgProperty,
            /**
             * 许可文号
             */
            permitNumber,
            /**
             * 服务范围
             */
            serviceScope,
            /**
             * 发证日期moment(2017/01/01)
             */
            issueDate,
            /**
             * 有效期限moment(2017/01/01)
             */
            deadline,
            /**
             * 年检时间
             */
            annualSurveyStart,
            annualSurveyEnd,
            /**
             * 附件 人力资源许可证正本
             */
            accHuman,
            /**
             * 附件 人力资源许可证副本
             */
            accHumanCopy,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue,
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="编号" {...formItemLayout}>
                    {
                        getFieldDecorator('code', {
                            initialValue: code,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            edit ?
                                <Input placeholder="请填写" />
                                :
                                <span>
                                    {code || '/'}
                                </span>
                            )
                    }
                </FormItem>
                <FormItem label="机构名称" {...formItemLayout}>
                    {
                        getFieldDecorator('orgName', {
                            initialValue: orgName,
                            rules:[
                                {
                                    pattern: getRegExp('zh1-100'),
                                    message: '机构名称格式不正确',
                                },
                            ]
                        })(
                            edit ?
                                <Input placeholder="请填写" />
                                :
                                <span>
                                    {orgName || '/'}
                                </span>
                            )
                    }
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('address', {
                            initialValue: address ? address : undefined,
                            rules: [{
                                validator: validatorSelectCity,
                            }]
                        })
                            (
                                <SelectCity params={selectCityParams(address ? address : undefined)} />
                                )
                                : <span>
                                {
                                    !address && !addressDetail ?
                                        '/' :
                                        `${address && address.selectName.join('')}${addressDetail || ''}`
                                }
                                </span>
                    }
                </FormItem>
                {
                    edit && <FormItem label=" " colon={false} {...formItemLayout}>
                        {
                            getFieldDecorator('addressDetail', {
                                initialValue: addressDetail,
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
                <FormItem label="法定代表人" {...formItemLayout} extra={edit ? '负责人' : ''}>
                    {
                        edit ? getFieldDecorator('charger', {
                                initialValue: charger,
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                    message: '法定代表人格式不正确'
                                }]
                            })(
                                <Input placeholder='请填写法定代表人' style={{width: 150, marginRight: 10}}/>
                            )
                            : <span>{charger || '/'}</span>
                    }
                </FormItem>
                <FormItem label="机构性质" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('orgProperty', {
                            initialValue: orgProperty,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                                <Input placeholder="请填写" />                              
                            )
                            :
                            <span>
                                {orgProperty || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="许可文号" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('permitNumber', {
                            initialValue: permitNumber,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                            <Input placeholder="请填写" />
                            )
                            :
                            <span>
                                {permitNumber || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="服务范围" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('serviceScope', {
                            initialValue: serviceScope,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                                <Input placeholder="请填写" />
                            )
                            :
                            <span>
                                {serviceScope || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="发证日期" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('issueDate', {
                            initialValue: issueDate && moment(issueDate),
                        })(
                             <DatePicker format="YYYY/MM/DD" /> 
                            )
                            : <span>{issueDate || '/'}</span>
                    }
                </FormItem>
                <FormItem label="有效期限" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('deadline', {
                            initialValue: deadline && moment(deadline),
                        })(
                             <DatePicker format="YYYY/MM/DD" /> 
                            )
                            : <span>{deadline || '/'}</span>
                    }
                </FormItem>
                <FormItem label="年检时间" {...formItemLayout}>
                    {
                        edit ? 
                            <FormItem style={{marginRight: 5}}>
                                {getFieldDecorator('annualSurvey', {
                                    initialValue: annualSurveyStart && annualSurveyStart.length > 2 ? [annualSurveyStart, annualSurveyEnd] :  [[], []],
                                    rules: [
                                        {
                                            validator: this.validateAnnualSurvey
                                        }
                                    ],
                                })(
                                    <CascaderRange style={{width: 166}} options={[[cascaderOptions[1]], [cascaderOptions[1]], ]} placeholder="请选择年检时间" />
                                    )}
                            </FormItem>
                            : <span>{deadLineText(annualSurveyStart, false)} - {deadLineText(annualSurveyEnd, false)}</span>
                    }
                </FormItem>

                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">人力资源许可证正本：{!edit && !accHuman && '/' }</label>
                    {
                        getFieldDecorator('accHuman', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accHuman ? accHuman : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传人力资源许可证正本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accHuman').length===1} 
                                    {...this.uProps('accHuman')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accHuman').length===1 && message.error('上传附件数量限制为1份')}>
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
                    <label className="attachment-label">人力资源许可证副本：{!edit && !accHumanCopy && '/' }</label>
                    {
                        getFieldDecorator('accHumanCopy', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accHumanCopy ? accHumanCopy : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传人力资源许可证副本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accHumanCopy').length===1} 
                                    {...this.uProps('accHumanCopy')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accHumanCopy').length===1 && message.error('上传附件数量限制为1份')}>
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

export default Form.create()(HumanInfo);
