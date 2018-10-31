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
import uploadProps,{uProps} from './util/uploadProps';
import { Attachment } from './companyInfo';
import SelectPerson, { PersonSource } from './util/selectPerson';
import {
    formItemLayout,
    cascaderOptions,
    deadLineText,
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
         * 工商年检网址
         */
        url?: string;
        /**
         * 工商年检联络人id
         */
        contactPersonId?: number | string;
        /**
         * 工商年检联络人
         */
        contactPerson?: string;
        /**
         * 工商年检截点
         */
        deadline1?: any[];
        /**
         * 工商年检密码
         */
        password?: string;
        /**
         * 附件
         */
        acc?: Attachment[];
    }
}


interface IannualInspectInfoState {
}
interface IannualInspectInfoProps extends  TOwnProps, FormComponentProps{

}
class IannualInspectInfo extends Component<IannualInspectInfoProps, IannualInspectInfoState> {
    constructor(props:IannualInspectInfoProps) {
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
             * 工商年检网址
             */
            url,
            /**
             * 工商年检联络人id
             */
            contactPersonId,
            /**
             * 工商年检联络人
             */
            contactPerson,
            /**
             * 工商年检截点
             */
            deadline1,
            /**
             * 工商年检密码
             */
            password,
            /**
             * 附件
             */
            acc,
        } = data;
        const {
            getFieldDecorator,
            setFieldsValue
        } = form;
        return (
            <Form className="companyinfo">
                <FormItem label="工商年检网址" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('url', {
                            initialValue: url,
                            rules: [
                                {
                                    max: 100,
                                    message: '请控制在100个字之内',
                                },
                            ],
                        })(
                            <Input placeholder="请填写" />
                            )
                            :
                            url ?
                             <a href={url} target="_blank">{url}</a>
                            : '/'
                    }
                </FormItem>
                <FormItem label="工商年检联络人" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('contactPerson', {
                            initialValue: contactPerson,
                            rules: [{
                                pattern: /^[\u4e00-\u9fa5]{0,4}$/,
                                message: '联络人格式不正确'
                            }]
                        })(
                            <Input placeholder='请填写联系人' style={{width: 150, marginRight: 10}}/>
                            )
                            : <span>{contactPerson || '/'}</span>
                    }
                </FormItem>
                <FormItem label="工商年检截点" {...formItemLayout}>
                    {
                        edit ? <span>{getFieldDecorator('deadline1', {
                            initialValue: deadline1 && deadline1.length > 1 ? deadline1 : [],
                        })(
                            <Cascader options={cascaderOptions} placeholder="请选择" style={{ width: 166, display: 'inline-block' }}></Cascader>
                            )} 前</span>
                            : <span>{deadLineText(deadline1)}</span>
                    }
                </FormItem>
                <FormItem label="工商年检密码" {...formItemLayout}>
                    {
                        edit ? getFieldDecorator('password', {
                            initialValue: password,
                            rules: [
                                {
                                    max: 100,
                                    message: '请控制在100个字之内',
                                },
                            ],
                        })(
                            <Input placeholder="请填写" />
                            )
                            : <span>{password ? password.replace(/./g, '*') : '/'}</span>
                    }
                </FormItem>
                <FormItem label="附件" {...formItemLayout} extra={edit ? '支持.jpg .jpeg .bmp .gif .pdf格式，大小不超过8M' : ''}>
                    <span>{!edit && !acc && '/' }</span>
                    {
                        getFieldDecorator('acc', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            initialValue: acc ? acc : [],
                            rules: [
                                {
                                    validator: (rule, value, callback) => { validateUpload(rule, value, callback,  '请上传附件') }
                                }
                            ],
                        })(
                            <Upload {...this.uProps('acc', Number.MAX_VALUE)} className={edit ? "" : "upload-disabled"}>
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
export default Form.create()(IannualInspectInfo);
