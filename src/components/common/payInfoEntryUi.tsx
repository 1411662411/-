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
} from 'antd/lib/form/Form'

import TableUI from '../Table';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
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
const formItemLayoutNolabel1 = {
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
            offset: 2,
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
            offset: 6
        },
    }
}
const formItemLayoutTable = {
    labelCol: {
        xs: {
            span: 0,
        },
        sm: {
            span: 0,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24,
        },
    }
}

interface selectSource {
    name: string | number;
    value: string | number;
}
interface EntryInfoProps {
    bankSource?: Array<selectSource>; /* 打款银行名称source */
    payerSource?: Array<selectSource>; /* 付款方名称source */
    serialNumber?: number; /* 流水号 */
    accountNumber?: number; /* 出票人账号 */
    checkNumber?: number; /* 支票号 */
    paytime?: any; /* 打款时间  */
    invoicingTime?: any; /* 开票时间 */
    attachment?: {
        ossKey?: string; /* oss的key */
        name?: string;
        value?: string; /* 显示的url */
    }; /* 附件 */
    bank?: string; /* 打款银行名称 */
    payBankAccount? : string; /* 打款银行账号 */
    payer?: string;/* 付款方名称 */
    form?: any;
    edit?: boolean; /* 录入：true 查看: false */
    type?: number; /*信息类型 1：银行转账，2：支票 */
    vertical?: boolean; /* 为true时，显示老版样式，反之表格样式 */ 
}

interface EntryInfoState {
    type: number;
    changed: boolean; /* 是否改变的标识符 */
}
/**
 * 上传文件flag
 */
let attachmentuploading = false;
/**
 * 打款信息
 */
class EntryInfoForm extends React.Component<EntryInfoProps & FormComponentProps, EntryInfoState> {
    // static defaultProps = {
    //     values: {},
    // }
    constructor(props) {
        super(props)
        const type = props.type;
        this.state = {
            changed: false,
            type: 1 , /*信息类型 1：银行转账，2：支票 */
        };
    }
    serialNumberCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写流水号');
        }
        if (value.length > 50) {
            return callback('流水号需控制在50字以内');
        }
        callback();
    }
    checkNumberCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写支票号');
        }
        if (value.length > 50) {
            return callback('支票号需控制在50字以内');
        }
        callback();
    }
    paytimeProps = () => ({
        style: { width: 200 },
        showTime: true,
        format: 'YYYY-MM-DD HH:mm',
        disabledDate: (current) => {
            return !(current && current.valueOf() < moment().add(30, 'days').valueOf() && current.valueOf() > moment().subtract(30, 'days').valueOf());;
        }
    });
    normFile = (e, c) => {
        // console.log(e)
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList && e.fileList.filter(file => file.status === 'done' || !!file.ossKey);
    }
    /* 上传文件的缓存 */
    private fileList = [];

    attachmentUploadProps = (_self) => {
        const form = this.props.form;
        const props: any = {
            name: "file",
            action: `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`,
            accept: '.jpg,.jpeg,.bmp,.gif,.png',
            listType: "picture",
            beforeUpload: (file) => {
                // const attachmentLength = this.props.form.getFieldValue('attachment');
                // if (attachmentLength && attachmentLength.length > 0) {
                //     message.error('上传图片数量限制为1张');
                //     return false;
                // }
                if(file.size == 0){
                    message.error('请上传有效的图片');
                    return false;
                }
                const types = ['image/bmp', 'image/png', 'image/gif', 'image/jpeg',];
                const isLt8M = file.size / 1024 / 1024 < 8;
                if (!isLt8M) {
                    message.error('上传的附件大小不超过8Mb');
                    return false;
                }
                if (types.indexOf(file.type) === -1) {
                    message.error('上传的附件格式支持 .jpg、.jpeg、.bmp、.gif、.png');
                    return false;
                }

                attachmentuploading = true;
            },
            onRemove: (file) => {
                const deleteUid = file.uid;
                const fileList = this.props.form.getFieldValue('attachment');
                let deletIndex : number | null = null;
                // for (let [index, { uid }] of fileList.entries()) {
                //     if (uid === deleteUid) {
                //         deletIndex = index;
                //         break;
                //     }
                // }
                for (let i = 0, l = fileList.length; i < l; i++) {
                    let uid = fileList[i].uid;
                    if (uid === deleteUid) {
                        deletIndex = i;
                        break;
                    }
                }
                if (deletIndex !== null) {
                    fileList.splice(deletIndex, 1);
                    _self.fileList = fileList;
                    this.props.form.setFields({
                        attachment: {
                            value: fileList,
                        },
                    });
                    return true;
                }
                return false;
            },
            onSuccess: (response, file) => {
                const {
                    uid,
                    name,
                } = file;
                const {
                    msg,
                    status,
                    errcode,
                    data,
                    errmsg,
                } = response;
                const {
                    ossKey,
                    url,
                } = data;
                let fileList = _self.fileList;
                if (Number(status)  === 0 || Number(errcode) === 0) {
                    const newfile = {
                        uid,
                        name,
                        status: 'done',
                        url,
                        ossKey: ossKey,
                    };
                    // fileList.push(newfile);
                    fileList=[newfile];
                }
                else {
                    const newfile = {
                        uid,
                        name,
                        status: 'error',
                        response: errmsg,
                    };
                    // fileList.push(newfile);
                }
                this.props.form.setFields({
                    attachment: {
                        value: fileList,
                    },
                });
                attachmentuploading = false;
            },
        }
        return props;
    }
    typeOnchange = (e) => {
        const newType = e.target.value;
        this.fileList = [];
        const {
            type,
            attachment,
            form,
        } = this.props;
        /**
         * 存在默认
         */
        if (attachment && attachment.ossKey && type === newType) {
            form.setFields({
                attachment: {
                    value: [{
                        uid: -1,
                        name: attachment.name,
                        status: 'done',
                        ossKey: attachment.ossKey,
                        url: attachment.value
                    }],
                },
            });
        }
        else {
            form.setFields({
                attachment: {
                    value: [],
                },
            });
        }


        this.setState({ type: e.target.value, changed: true, });
    }
    render() {
        let {
            form,
            bankSource,
            payerSource,
            edit,
            bank,
            payBankAccount,
            paytime,
            serialNumber,
            payer,
            checkNumber,
            invoicingTime,
            attachment,
            accountNumber,
        } = this.props;
        let {
            changed,
            type,
        } = this.state;
        const propsType = this.props.type;
        type = changed ? type : propsType || type;
        const { getFieldDecorator } = form;
        return (
            <div key="entryInfo" style={{maxWidth: this.props.vertical === true ? 600 : '100%'}}>
            {/* <div key="entryInfo" style={{ maxWidth: 600 }}> */}
            {
                this.props.vertical === true ? <Form>
                {
                    edit &&
                    <div>
                        {/* <FormItem
                            key="type"
                            {...formItemLayoutNolabel}
                        >
                            {
                                getFieldDecorator('type', {
                                    initialValue: type
                                })(
                                    <RadioGroup onChange={e => this.typeOnchange(e)}>
                                        <Radio value={1}>银行转账</Radio>
                                        <Radio value={2}>支票</Radio>
                                    </RadioGroup>
                                    )
                            }
                        </FormItem> */}
                        {
                            type === 1 &&
                            <div>
                                <FormItem
                                    key="bank"
                                    {...formItemLayout}
                                    label="打款银行名称"
                                >
                                    {
                                        getFieldDecorator('bank', {
                                            initialValue: bank || '招商银行杭州分行萧山支行',
                                            rules: [
                                                { required: true, message: '打款银行名称', },
                                            ],
                                        })(
                                            <Select placeholder="请选择">
                                                {bankSource!.map(({ name, value }) => <Option value={value}>{name}</Option>)}
                                            </Select>
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="payBankAccount"
                                    {...formItemLayout}
                                    label="打款银行账号"
                                >
                                    {
                                        getFieldDecorator('payBankAccount', {
                                            initialValue: 571908890710868
                                        })(
                                            <span>571908890710868</span>
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="serialNumber"
                                    {...formItemLayout}
                                    label="流水号"
                                >
                                    {
                                        getFieldDecorator('serialNumber', {
                                            initialValue: serialNumber || '',
                                            rules: [
                                                { required: true, validator: this.serialNumberCheck },
                                            ],
                                        })(
                                            <Input />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="paytime"
                                    {...formItemLayout}
                                    label="打款时间"
                                >
                                    {
                                        getFieldDecorator('paytime', {
                                            initialValue: paytime ? moment(paytime * 1000) : '',
                                            rules: [
                                                { required: true, message: '打款时间', },
                                            ],
                                        })(
                                            <DatePicker {...this.paytimeProps() } />
                                            )
                                    }
                                </FormItem>

                            </div>
                        }
                        {
                            type === 2 &&
                            <div>
                                <FormItem
                                    key="payer"
                                    {...formItemLayout}
                                    label="付款方名称"
                                >
                                    {
                                        getFieldDecorator('payer', {
                                            initialValue: payer || '大连招商银行',
                                            rules: [
                                                { required: true, message: '付款方名称', },
                                            ],
                                        })(
                                            <Select placeholder="请选择">
                                                {payerSource!.map(({ name, value }) => <Option value={value}>{name}</Option>)}
                                            </Select>
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="accountNumber"
                                    {...formItemLayout}
                                    label="出票人账号"
                                >
                                    {
                                        getFieldDecorator('accountNumber', {
                                            initialValue: 411905694210601
                                        })(
                                            <span>411905694210601</span>
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="checkNumber"
                                    {...formItemLayout}
                                    label="支票号"
                                >
                                    {
                                        getFieldDecorator('checkNumber', {
                                            initialValue: checkNumber || '',
                                            rules: [
                                                { required: true, validator: this.checkNumberCheck },
                                            ],
                                        })(
                                            <Input />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="invoicingTime"
                                    {...formItemLayout}
                                    label="开票时间"
                                >
                                    {
                                        getFieldDecorator('invoicingTime', {
                                            initialValue: invoicingTime ? moment(invoicingTime * 1000) : '',
                                            rules: [
                                                { required: true, message: '开票时间', },
                                            ],
                                        })(
                                            <DatePicker {...this.paytimeProps() } />
                                            )
                                    }
                                </FormItem>
                            </div>
                        }

                        <FormItem
                            key="attachment"
                            {...formItemLayout}
                            label="附件"
                            extra="上传的图片格式支持 .jpg、.jpeg、.bmp、.gif、.png，大小不超过8Mb"
                        >
                            {getFieldDecorator('attachment', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                                initialValue: attachment && attachment.ossKey ? [{
                                    uid: -1,
                                    name: attachment.name,
                                    status: 'done',
                                    ossKey: attachment.ossKey,
                                    url: attachment.value
                                }] : [],
                            })(
                                <Upload {...this.attachmentUploadProps(this) }>
                                    <Button>
                                        <Icon type="upload" /> 上传附件
                                    </Button>
                                </Upload>
                                )}
                        </FormItem>
                    </div>
                }
                {
                    !edit &&
                    <div>
                        <FormItem
                            key="type"
                            {...formItemLayoutNolabel}
                        >
                            <span style={{ color: '#108ee9', fontSize: 16 }}>{type === 1 ? '银行转账' : '支票'}</span>
                        </FormItem>
                        {
                            type === 1 &&
                            <div>
                                <FormItem
                                    key="bank"
                                    {...formItemLayout}
                                    label="打款银行名称"
                                >
                                    <span>{bank}</span>
                                </FormItem>
                                <FormItem
                                    key="payBankAccount"
                                    {...formItemLayout}
                                    label="打款银行账号"
                                >
                                    {payBankAccount}
                                </FormItem>
                                <FormItem
                                    key="serialNumber"
                                    {...formItemLayout}
                                    label="流水号"
                                >
                                    {serialNumber}
                                </FormItem>
                                <FormItem
                                    key="paytime"
                                    {...formItemLayout}
                                    label="打款时间"
                                >
                                    {paytime ? moment(paytime * 1000).format('YYYY-MM-DD HH:mm') : ''}
                                </FormItem>

                            </div>
                        }
                        {
                            type === 2 &&
                            <div>
                                <FormItem
                                    key="payer"
                                    {...formItemLayout}
                                    label="付款方名称"
                                >
                                    <span>{payer}</span>
                                </FormItem>
                                <FormItem
                                    key="accountNumber"
                                    {...formItemLayout}
                                    label="出票人账号"
                                >
                                    {
                                        getFieldDecorator('accountNumber', {
                                            initialValue: accountNumber
                                        })(
                                            <span>{accountNumber}</span>
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    key="checkNumber"
                                    {...formItemLayout}
                                    label="支票号"
                                >
                                    <span>{checkNumber}</span>
                                </FormItem>
                                <FormItem
                                    key="invoicingTime"
                                    {...formItemLayout}
                                    label="开票时间"
                                >
                                    <span>{invoicingTime ? moment(invoicingTime * 1000).format('YYYY-MM-DD HH:mm') : ''}</span>
                                </FormItem>
                            </div>
                        }

                        <FormItem
                            key={`attachment-${type}`}
                            {...formItemLayout}
                            label="附件"
                        >

                        {
                            attachment!.value 
                            &&
                            <ImageZoom
                                image={{
                                    src: attachment!.value,
                                    alt: '附件',
                                    className: 'img',
                                    style: { width: '200px' }
                                }}
                                zoomImage={{
                                    src: attachment!.value,
                                    alt: '附件'
                                }}
                            />
                        }
                            
                        </FormItem>
                    </div>
                }
            </Form>
                :<Form>
                {
                    edit &&
                    <div>
                        {/* <FormItem
                            key="type"
                            {...formItemLayoutNolabel1}
                        >
                            {
                                getFieldDecorator('type', {
                                    initialValue: type
                                })(
                                    <RadioGroup onChange={e => this.typeOnchange(e)}>
                                        <Radio value={1}>银行转账</Radio>
                                        <Radio value={2}>支票</Radio>
                                    </RadioGroup>
                                    )
                            }
                        </FormItem> */}
                        {
                            type === 1 && <TableUI
                            dataSource={[
                                {
                                    label: '打款银行名称',
                                    required: true,
                                    value: <FormItem
                                        key="bank"
                                        {...formItemLayoutTable}
                                        label="打款银行名称"
                                    >
                                        {
                                            getFieldDecorator('bank', {
                                                initialValue: bank || '招商银行杭州分行萧山支行',
                                                rules: [
                                                    { required: true, message: '打款银行名称', },
                                                ],
                                            })(
                                                <Select placeholder="请选择">
                                                    {bankSource!.map(({ name, value }) => <Option value={value}>{name}</Option>)}
                                                </Select>
                                                )
                                        }
                                    </FormItem>
                                },
                                {
                                    label: '打款银行账号',
                                    value: <FormItem
                                        key="payBankAccount"
                                        {...formItemLayoutTable}
                                        label="打款银行账号"
                                    >
                                        {
                                            getFieldDecorator('payBankAccount', {
                                                initialValue: 571908890710868
                                            })(
                                                <span>571908890710868</span>
                                                )
                                        }
                                    </FormItem>
                                },
                                {
                                    label: '流水号',
                                    required: true,
                                    value: <FormItem
                                        key="serialNumber"
                                        {...formItemLayoutTable}
                                        label="流水号"
                                    >
                                        {
                                            getFieldDecorator('serialNumber', {
                                                initialValue: serialNumber || '',
                                                rules: [
                                                    { required: true, validator: this.serialNumberCheck },
                                                ],
                                            })(
                                                <Input />
                                                )
                                        }
                                    </FormItem>
                                },
                                {
                                    label: '打款时间',
                                    required: true,
                                    value: <FormItem
                                        key="paytime"
                                        {...formItemLayoutTable}
                                        label="打款时间"
                                    >
                                        {
                                            getFieldDecorator('paytime', {
                                                initialValue: paytime ? moment(paytime * 1000) : '',
                                                rules: [
                                                    { required: true, message: '打款时间', },
                                                ],
                                            })(
                                                <DatePicker {...this.paytimeProps() } />
                                                )
                                        }
                                    </FormItem>
                                },
                                {
                                    label: '附件',
                                    isAll: true,
                                    value: <FormItem
                                        key="attachment"
                                        {...formItemLayoutTable}
                                        label="附件"
                                        extra="上传的图片格式支持 .jpg、.jpeg、.bmp、.gif、.png，大小不超过8Mb"
                                    >
                                        {getFieldDecorator('attachment', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                            initialValue: attachment && attachment.ossKey ? [{
                                                uid: -1,
                                                name: attachment.name,
                                                status: 'done',
                                                ossKey: attachment.ossKey,
                                                url: attachment.value
                                            }] : [],
                                        })(
                                            <Upload {...this.attachmentUploadProps(this) }>
                                                <Button>
                                                    <Icon type="upload" /> 上传附件
                                                </Button>
                                            </Upload>
                                            )}
                                    </FormItem>    
                                }
                            ]}
                        />
                        }
                        {
                            // type === 1 &&
                            // <div>
                            // </div>
                        }
                        {
                            type === 2 && <TableUI
                                dataSource={[
                                    {
                                        label: '付款方名称',
                                        required: true,
                                        value: <FormItem
                                            key="payer"
                                            {...formItemLayoutTable}
                                            label="付款方名称"
                                        >
                                            {
                                                getFieldDecorator('payer', {
                                                    initialValue: payer || '大连招商银行',
                                                    rules: [
                                                        { required: true, message: '付款方名称', },
                                                    ],
                                                })(
                                                    <Select placeholder="请选择">
                                                        {payerSource!.map(({ name, value }) => <Option value={value}>{name}</Option>)}
                                                    </Select>
                                                    )
                                            }
                                        </FormItem>
                                    },
                                    {
                                        label: '出票人账号',
                                        value: <FormItem
                                            key="accountNumber"
                                            {...formItemLayoutTable}
                                            label="出票人账号"
                                        >
                                            {
                                                getFieldDecorator('accountNumber', {
                                                    initialValue: 411905694210601
                                                })(
                                                    <span>411905694210601</span>
                                                    )
                                            }
                                        </FormItem>
                                    },
                                    {
                                        label: '支票号',
                                        required: true,
                                        value:<FormItem
                                            key="checkNumber"
                                            {...formItemLayoutTable}
                                            label="支票号"
                                        >
                                            {
                                                getFieldDecorator('checkNumber', {
                                                    initialValue: checkNumber || '',
                                                    rules: [
                                                        { required: true, validator: this.checkNumberCheck },
                                                    ],
                                                })(
                                                    <Input />
                                                    )
                                            }
                                        </FormItem>
                                    },
                                    {
                                        label: '开票时间',
                                        required: true,
                                        value: <FormItem
                                            key="invoicingTime"
                                            {...formItemLayoutTable}
                                            label="开票时间"
                                        >
                                            {
                                                getFieldDecorator('invoicingTime', {
                                                    initialValue: invoicingTime ? moment(invoicingTime * 1000) : '',
                                                    rules: [
                                                        { required: true, message: '开票时间', },
                                                    ],
                                                })(
                                                    <DatePicker {...this.paytimeProps() } />
                                                    )
                                            }
                                        </FormItem>
                                    },
                                    {
                                        label: '附件',
                                        isAll: true,
                                        value: <FormItem
                                            key="attachment"
                                            {...formItemLayoutTable}
                                            label="附件"
                                            extra="上传的图片格式支持 .jpg、.jpeg、.bmp、.gif、.png，大小不超过8Mb"
                                        >
                                            {getFieldDecorator('attachment', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                initialValue: attachment && attachment.ossKey ? [{
                                                    uid: -1,
                                                    name: attachment.name,
                                                    status: 'done',
                                                    ossKey: attachment.ossKey,
                                                    url: attachment.value
                                                }] : [],
                                            })(
                                                <Upload {...this.attachmentUploadProps(this) }>
                                                    <Button>
                                                        <Icon type="upload" /> 上传附件
                                                    </Button>
                                                </Upload>
                                                )}
                                        </FormItem>    
                                    }
                                ]}
                            />
                        }
                        {
                            // type === 2 &&
                            // <div>
                                
                                
                                
                                
                            // </div>
                        }

                        
                    </div>
                }
                {
                    !edit &&
                    <div>
                        {/* <FormItem
                            key="type"
                            {...formItemLayoutNolabel1}
                        >
                            <span style={{ color: '#108ee9', fontSize: 16 }}>{type === 1 ? '银行转账' : '支票'}</span>
                        </FormItem> */}
                        {
                            type === 1 && <TableUI
                                dataSource={[
                                    {
                                        label: '打款银行名称',
                                        value: <FormItem
                                            key="bank"
                                            {...formItemLayoutTable}
                                            label="打款银行名称"
                                        >
                                            <span>{bank}</span>
                                        </FormItem>
                                    },
                                    {
                                        label: '打款银行账号',
                                        value: <FormItem
                                            key="payBankAccount"
                                            {...formItemLayoutTable}
                                            label="打款银行账号"
                                        >
                                            {payBankAccount}
                                        </FormItem>
                                    },
                                    {
                                        label: '流水号',
                                        value: <FormItem
                                            key="serialNumber"
                                            {...formItemLayoutTable}
                                            label="流水号"
                                        >
                                            {serialNumber}
                                        </FormItem>
                                    },
                                    {
                                        label: '打款时间',
                                        value: <FormItem
                                            key="paytime"
                                            {...formItemLayoutTable}
                                            label="打款时间"
                                        >
                                            {paytime ? moment(paytime * 1000).format('YYYY-MM-DD HH:mm') : ''}
                                        </FormItem>
                                    },
                                    {
                                        label: '附件',
                                        value: <FormItem
                                            key={`attachment-${type}`}
                                            {...formItemLayoutTable}
                                            label="附件"
                                        >
            
                                        {
                                            attachment!.value 
                                            &&
                                            <ImageZoom
                                                image={{
                                                    src: attachment!.value,
                                                    alt: '附件',
                                                    className: 'img',
                                                    style: { width: '200px' }
                                                }}
                                                zoomImage={{
                                                    src: attachment!.value,
                                                    alt: '附件'
                                                }}
                                            />
                                        }
                                            
                                        </FormItem>
                                    },
                                ]}
                            />
                        }
                        {
                            // type === 1 &&
                            // <div>
                            // </div>
                        }
                        {
                            type === 2 && <TableUI
                                dataSource={[
                                    {
                                        label: '付款方名称',
                                        value: <FormItem
                                            key="payer"
                                            {...formItemLayoutTable}
                                            label="付款方名称"
                                        >
                                            <span>{payer}</span>
                                        </FormItem>
                                    },
                                    {
                                        label: '出票人账号',
                                        value: <FormItem
                                            key="accountNumber"
                                            {...formItemLayoutTable}
                                            label="出票人账号"
                                        >
                                            {
                                                getFieldDecorator('accountNumber', {
                                                    initialValue: accountNumber
                                                })(
                                                    <span>{accountNumber}</span>
                                                    )
                                            }
                                        </FormItem>
                                    },
                                    {
                                        label: '支票号',
                                        value: <FormItem
                                            key="checkNumber"
                                            {...formItemLayoutTable}
                                            label="支票号"
                                        >
                                            <span>{checkNumber}</span>
                                        </FormItem>
                                    },
                                    {
                                        label: '开票时间',
                                        value: <FormItem
                                            key="invoicingTime"
                                            {...formItemLayoutTable}
                                            label="开票时间"
                                        >
                                            <span>{invoicingTime ? moment(invoicingTime * 1000).format('YYYY-MM-DD HH:mm') : ''}</span>
                                        </FormItem>
                                    },
                                    {
                                        label: '附件',
                                        value: <FormItem
                                            key={`attachment-${type}`}
                                            {...formItemLayoutTable}
                                            label="附件"
                                        >
            
                                        {
                                            attachment!.value 
                                            &&
                                            <ImageZoom
                                                image={{
                                                    src: attachment!.value,
                                                    alt: '附件',
                                                    className: 'img',
                                                    style: { width: '200px' }
                                                }}
                                                zoomImage={{
                                                    src: attachment!.value,
                                                    alt: '附件'
                                                }}
                                            />
                                        }
                                            
                                        </FormItem>
                                    },
                                ]}
                            />
                        }
                        {
                            // type === 2 &&
                            // <div>
                                
                            // </div>
                        }

                        
                    </div>
                }
            </Form>
            }
            </div>
        )
    }
}
const EntryInfoCreatForm = Form.create()(EntryInfoForm);
export class EntryInfo extends React.Component<EntryInfoProps, any> {
    constructor(props) {
        super(props);
    }
    entryInfoCreatForm: any;
    validate = () => {
        let result = false;
        if (attachmentuploading) {
            console.log('attachmentuploading...');
            return result;
        }
        this.entryInfoCreatForm.validateFields((err, values) => {
            if (err) {
                return;
            }
            const {
                attachment
            } = values;

            if (attachment) {
                for (let { status } of attachment.values()) {
                    if (status === 'error') {
                        return;
                    }
                }
                // for (let i = 0, l = attachment.length; i < l; i++) {
                //     let status = attachment[i].status;
                //     if (status === 'error') {
                //         return;
                //     }
                // }
            }
            result = values;
        });
        return result;
    }
    render() {
        return <EntryInfoCreatForm {...this.props} ref={node => this.entryInfoCreatForm = node} />
    }
}



