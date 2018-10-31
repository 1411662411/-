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
import moment, { Moment } from 'moment';
import getRegExp from '../../../util/regExp';
import DateRange from '../../../components/date-range/index';
import uploadProps,{uProps} from './util/uploadProps';
import { Attachment } from './companyInfo';
import EditableTagGroup from '../../tags/index';
import {
    dateRangeInitialValue,
    validatorDateRange,
    formItemLayout,
    validateUpload,
} from './util/index';
import Immutable from 'immutable';
import SelectPerson, { PersonSource } from './util/selectPerson';
import './socialInfo.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


interface TOwnProps {
    /* 是否有编辑状态 */
    edit?: boolean;
    uploadApi?: string;
    personSource?: PersonSource;
    /**
     * 初始数据
     */
    data: {
        /**
         * 当地联系人
         */
        contact?: string;
        contactId?: string | number;
        /**
         * 公积金局业务联系人
         */
        phone?: number[];
        /**
         * 税务申报人
         */
        reporterPerson?: string;
        /**
         * 税务申报联系方式
         */
        contactMethod?: number[];
        /**
         * 办公地租房合同。有：1，无：0
         */
        rentContract?: 1 | 0;
        /**
         * 办公地营业场所地址有效期。起止时间moment(2017/01/01)
         */
        officeDeadline1?: string;
        /**
         * 办公地营业场所地址有效期。终止时间（2017/01/01）
         */
        officeDeadline2?: string;
        /**
         * 附件 办公地租房合同（如有）
         */
        accRentContract?: Attachment[];
    }
}


interface ContactInfoProps extends TOwnProps, FormComponentProps {

}

class ContactInfo extends Component<ContactInfoProps, {}> {
    uploading = false;
    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        // 过滤掉beforeUpload返回false的
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);
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
             * 当地联系人
             */
            contact,
            contactId,
            /**
             * 公积金局业务联系人
             */
            phone,
            /**
             * 税务申报人
             */
            reporterPerson,
            /**
             * 税务申报联系方式
             */
            contactMethod,
            /**
             * 办公地租房合同。有：1，无：0
             */
            rentContract,
            /**
             * 办公地营业场所地址有效期。起止时间moment(2017/01/01)
             */
            officeDeadline1,
            /**
             * 办公地营业场所地址有效期。终止时间（2017/01/01）
             */
            officeDeadline2,
            /**
             * 附件 办公地租房合同（如有）
             */
            accRentContract,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue,
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="当地联系人&电话" {...formItemLayout}>
                {
                        edit ? getFieldDecorator('contact', {
                                initialValue: contact,
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                    message: '联系人格式不正确'
                                }]
                            })(
                                <Input placeholder='请填写联系人' style={{width: 150, marginRight: 10}}/>
                            )
                            : <span>{contact || '/'}</span>
                    }
                    {
                        edit ? getFieldDecorator('phone', {
                            initialValue: phone,
                        })(
                            <EditableTagGroup style={{ width: 98 }} max={5} rule={getRegExp('mobile | landline')} ruleMessage="电话格式不正确" buttonText="新增电话" />
                            )
                            : <span style={{ marginLeft: 10 }}>{phone && phone.join('，')}</span>
                    }
                </FormItem>
                <FormItem label="税务申报人" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('reporterPerson', {
                            initialValue: reporterPerson,
                            rules: [
                                {
                                    pattern: getRegExp('zh1-4'),
                                    message: '税务申报人格式不正确'
                                }
                            ]
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{reporterPerson || '/'}</span>
                    }
                </FormItem>
                <FormItem label="税务申报联系方式" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('contactMethod', {
                            initialValue: contactMethod,
                        })(
                            <EditableTagGroup style={{ width: 98 }} max={5} rule={getRegExp('mobile | landline')} ruleMessage="税务申报联系方式格式不正确" buttonText="新增电话" />
                            )
                            : <span style={{ marginLeft: 10 }}>{contactMethod ? contactMethod.join('，'): '/'}</span>
                    }
                </FormItem>
                <FormItem label="办公地租房合同" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('rentContract', {
                            initialValue: rentContract,
                        })(
                            <Radio.Group>
                                <Radio value={1}>有</Radio>
                                <Radio value={0}>无</Radio>
                            </Radio.Group>
                            )
                            : <span>{rentContract === 1 ? '有' : rentContract === 0 ? '无' : '/'}</span>
                    }
                </FormItem>
                <FormItem label="办公地营业场所地址有效期" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('officeDeadline', {
                            initialValue: dateRangeInitialValue(officeDeadline1, officeDeadline2),
                            rules: [
                                {
                                    validator: (rule, value, callback) => validatorDateRange(rule, value, callback, '请选择办公地营业场所地址有效期')
                                }
                            ]
                        })(
                            <DateRange format="YYYY/MM/DD" />
                            )
                            : <span> {
                                !officeDeadline1 && !officeDeadline2 ?
                                    '/' :
                                    officeDeadline1 && !officeDeadline2 ?
                                        officeDeadline1 : `${officeDeadline1}  —  ${officeDeadline2}`
                            }</span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <label className="attachment-label">办公地租房合同（如有）：{!edit && !accRentContract && '/' }</label>
                    {
                        getFieldDecorator('accRentContract', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: accRentContract ? accRentContract : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传办公地租房合同') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('accRentContract', Number.MAX_VALUE)} className={edit ? "" : "upload-disabled"}>
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

export default Form.create()(ContactInfo);
