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
import SelectPerson, { PersonSource } from './util/selectPerson';
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
         * 单位名称
         */
        unitName?: string;
        /**
         * 住所（省市区）
         */
        address?: {
            selectVal: number[]; 
            selectName: string[];
        };
        /**
         * 住所（详细地址）
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
         * 注册资本
         */
        registerCapital?: string;
        /**
         * 许可经营事项
         */
        permitBusinessItem?: string;
        /**
         * 服务范围
         */
        serviceScope?: string;
        /**
         * 有效期限。起止时间 moment(2017/01/01)
         */
        deadlineStart?: string;
        /**
         * 有效期限。终止时间 moment(2017/01/01)
         */
        deadlineEnd?: string;
        /**
         * 发证机关
         */
        issueOrg?: string;
        /**
         * 发证日期。moment(2017/01/01)
         */
        issueDate?: string;
        /**
         * 年检时间
         */
        annualSurvey?: any[];
        /**
         * 附件 劳务派遣许可证正本
         */
        accLabor?: Attachment[];
        /**
         * 附件 劳务派遣许可证副本
         */
        accLaborCopy?: Attachment[];
    }
}


interface LaborInfoState {
}
interface LaborInfoProps extends TOwnProps, FormComponentProps {
    
}
class LaborInfo extends Component<LaborInfoProps, LaborInfoState> {
    constructor(props:LaborInfoProps) {
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
    uploadProps = uploadProps.bind(this);
    uProps = uProps.bind(this)
    render() {
        const {
            form,
            data = {},
            edit,
            personSource = Immutable.fromJS([]),
        } = this.props;
        const {
            /**
             * 编号
             */
            code,
            /**
             * 单位名称
             */
            unitName,
            /**
             * 住所（省市区）
             */
            address,
            /**
             * 住所（详细地址）
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
             * 注册资本
             */
            registerCapital,
            /**
             * 许可经营事项
             */
            permitBusinessItem,
            /**
             * 服务范围
             */
            serviceScope,
            /**
             * 有效期限。起止时间 moment(2017/01/01)
             */
            deadlineStart,
            /**
             * 有效期限。终止时间 moment(2017/01/01)
             */
            deadlineEnd,
            /**
             * 发证机关
             */
            issueOrg,
            /**
             * 发证日期。moment(2017/01/01)
             */
            issueDate,
            /**
             * 年检时间
             */
            annualSurvey,
            /**
             * 附件 劳务派遣许可证正本
             */
            accLabor,
            /**
             * 附件 劳务派遣许可证副本
             */
            accLaborCopy,
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
                <FormItem label="单位名称" {...formItemLayout}>
                    {
                        getFieldDecorator('unitName', {
                            initialValue: unitName,
                            rules:[
                                {
                                    pattern: getRegExp('zh1-100'),
                                    message: '单位名称格式不正确',
                                },
                            ],
                        })(
                            edit ?
                                <Input placeholder="请填写" />
                                :
                                <span>
                                    {unitName || '/'}
                                </span>
                            )
                    }
                </FormItem>
                <FormItem label="住所" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('address', {
                            initialValue: address ? address : undefined,
                            rules: [{
                                validator: validatorSelectCity,
                            }]
                        }) (
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
                <FormItem label="法定代表人" {...formItemLayout} >
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
                <FormItem label="注册资本" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('registerCapital', {
                            initialValue: registerCapital,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                                <Input placeholder="请填写" /> 
                            )
                            :
                            <span>
                                {registerCapital || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="许可经营事项" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('permitBusinessItem', {
                            initialValue: permitBusinessItem,
                            rules:[{
                                max: 100,
                                message: '请控制在100个字之内',
                            }],
                        })(
                                <Input placeholder="请填写" />
                            )
                            :
                            <span>
                                {permitBusinessItem || '/'}
                            </span>
                    }
                </FormItem>
                <FormItem label="有效期限" {...formItemLayout}>
                    {
                       edit ? getFieldDecorator('deadline', {
                            initialValue: dateRangeInitialValue(deadlineStart, deadlineEnd),
                            rules:[
                                {
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择有效期限')
                                }
                            ]
                        })(
                            <DateRange format="YYYY/MM/DD" />
                            )
                            : <span> {
                                !deadlineStart && !deadlineEnd ?
                                    '/' :
                                    deadlineStart && !deadlineEnd ?
                                        deadlineStart : `${deadlineStart}  —  ${deadlineEnd}`
                            }</span>
                    }
                </FormItem>
                <FormItem label="发证机关" {...formItemLayout}>
                    {
                        getFieldDecorator('issueOrg', {
                            initialValue: issueOrg,
                            rules:[
                                {
                                    pattern: getRegExp('zh1-100'),
                                    message: '发证机关格式不正确',
                                },
                            ],
                        })(
                            edit ?
                                <Input placeholder="请填写" />
                                :
                                <span>
                                    {issueOrg || '/'}
                                </span>
                            )
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
                <FormItem label="年检时间" {...formItemLayout}>
                    {
                        edit ? <span>{getFieldDecorator('annualSurvey', {
                            initialValue: annualSurvey && annualSurvey.length > 1 ? annualSurvey : [],
                        })(
                            <Cascader options={[cascaderOptions[1]]} placeholder="请选择年检时间" style={{ width: 166, display: 'inline-block' }}></Cascader>
                            )} 前</span>
                            : <span>{deadLineText(annualSurvey)}</span>
                    }
                </FormItem>

                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">劳务派遣许可证正本：{!edit && !accLabor && '/' }</label>
                    {
                        getFieldDecorator('accLabor', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accLabor ? accLabor : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传劳务派遣许可证正本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accLabor').length===1} 
                                    {...this.uProps('accLabor')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accLabor').length===1 && message.error('上传附件数量限制为1份')}>
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
                    <label className="attachment-label">劳务派遣许可证副本：{!edit && !accLaborCopy && '/' }</label>
                    {
                        getFieldDecorator('accLaborCopy', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accLaborCopy ? accLaborCopy : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传劳务派遣许可证副本') }
                                }
                            ],
                        })(
                            <Upload disabled={this.props.form.getFieldValue('accLaborCopy').length===1} 
                                    {...this.uProps('accLaborCopy')}
                                    className={edit ? "" : "upload-disabled"}>
                                {
                                    edit ?
                                        <div>
                                            <Button onClick={() => this.props.form.getFieldValue('accLaborCopy').length===1 && message.error('上传附件数量限制为1份')}>
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
export default Form.create()(LaborInfo);
