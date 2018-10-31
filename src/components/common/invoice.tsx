import React, {
    Component,
} from 'react';
import Immutable from 'immutable';
import {
    Form,
    Icon,
    Input,
    Radio,
    Tooltip,
    Alert,
    Card,
    Button,
    Upload,
    message,
    Modal,
} from 'antd';

import '../../css/components/invoice';
import {
    fetchFn,
} from '../../util/fetch';
import {
    ExpressInfoData,
    ExpressAddressForm,
    ExpressAddress,
} from './expressAddress';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
interface UploadImg {
    url: string;
    uid: number;
    name: string;
    ossKey: string;
    status: 'uploading' | 'done' | 'error' | 'removed';
}

import {
    FormComponentProps,
    WrappedFormUtils,
} from 'antd/lib/form/Form'
interface baseInfo {
    cId: number;
    taxCode?: number | string;
    taxImg?: UploadImg[];
    taxPhone?: string | number;
    taxAddress?: string;
    bankAccount?: string | number;
    openBank?: string;
    bankImg?: UploadImg[];
    taxPersonImg?: UploadImg[];
    ePersonName?: string;
    eMail?: string;
    ePhone?: number | string;
    invoiceType?: number;
    
}
export interface InvoiceProps {
    uploadApi?: string;
    addExpressAddressApi?: string;
    editExpressAddressApi?: string;
    deleteExpressAddressApi?: string;
    baseInfo: Immutable.Map<
    keyof baseInfo
    , any>
    expressInfo?: Immutable.List<Immutable.Map<keyof ExpressInfoData, any>>;
    edit?: boolean;
    activeId?: number;
    orderType?:number;

}


interface InvoiceState {
    // hasInvoice: -1 | 1 | 2;
    /**
     * 电子普通发票 3，
     * 纸制专用发票 2
     * 纸制普通发票 1
     */
    activeId: number | undefined;
    invoiceType: 1 | 2 | 3;
    expressAddressModal: boolean;
    expressInfo: Immutable.List<Immutable.Map<keyof ExpressInfoData, any>>
}



class InvoiceForm extends Component<InvoiceProps & FormComponentProps, InvoiceState> {
    constructor(props) {
        super(props);
        const {
            expressInfo = Immutable.fromJS([]),
            baseInfo,
            activeId,
        } = this.props;
        this.state = {
            activeId,
            invoiceType: baseInfo.get('invoiceType') !== undefined ? baseInfo.get('invoiceType') : 3,
            expressAddressModal: false,
            expressInfo: expressInfo.size > 0 ? expressInfo : Immutable.fromJS([]),
        };
    }
    /**
     * 上传文件flag
     */
    uploading = false;
    validateRequired = (rule, value, callback, msg) => {
        const {
            invoiceType
        } = this.state;
        if (invoiceType === 2 && (value === undefined || value === null || String.prototype.trim.call(value === undefined ? '' : value) === '')) {
            return callback(msg || '请填写')
        }
        callback();
    }
    validateMax = (rule, value, callback, max, msg) => {
        value = String.prototype.trim.call(value === undefined || value === null ? '' : value);
        if (value.length > max) {
            return callback(msg);
        }
        callback();
    }
    validateTaxCode = (rule, value, callback) => {
        value = String.prototype.trim.call(value === undefined || value === null ? '' : value);
        if (value === '') {
            return callback('请输入税号');
        }
        var reg = /^[0-9a-zA-Z]+$/
        if (reg.test(value)) {
            // 格式长度限制为15、18、20位数字或字母
            if (value.length ===15 || value.length ===18 || value.length ===20) {
                callback();
            }
        }else{
            return callback('请输入正确的税号');
        }
        callback();
    }
    validateTaxPhoneLandLine = (rule, value, callback) => {
        value = String.prototype.trim.call(value === undefined || value === null ? '' : value);
        if (value !== '' && !/^(\d{3,4}-?)?\d{7,8}(-(\d{0,6}))?$/.test(value) && !/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(value)) {
            return callback('请输入正确的电话');
        }
        callback();
    }
    validateTaxPhone = (rule, value, callback) => {
        value = String.prototype.trim.call(value === undefined || value === null ? '' : value);
        if (!/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(value)) {
            return callback('请输入正确的收票人手机号');
        }
        callback();
    }

    validateUpload = (rule, value, callback, number, message?) => {
        if (number <= 0) {
            return callback();
        }
        if (!value || !value.length || value.length <= 0) {
            return callback(message);
        }
        callback();
    }
    uploadProps: (params: { key: string, number?: number, }) => any = ({ key, number, }) => {
        const {
            form,
            uploadApi,
        } = this.props
        const props: any = {
            name: "file",
            action: uploadApi,
            accept: '.jpg,.jpeg,.bmp,.gif,.png',
            listType: 'picture-card',
            beforeUpload: (file) => {
                const attachment = this.props.form.getFieldValue(key);
                // if (number && attachment && attachment.length >= number) {
                //     message.error(`上传附件数量限制为${number}张`);
                //     return false;
                // }
                const types = ['image/bmp', 'image/png', 'image/gif', 'image/jpeg',];
                const isLt8M = file.size / 1024 / 1024 < 8;
                if (!isLt8M) {
                    message.error('上传的附件大小不超过8Mb');
                    return false;
                }
                if (types.indexOf(file.type) === -1) {
                    message.error('请上传格式为.jpg、.jpeg、.bmp、.gif、.png 的图片');
                    return false;
                }

                this.uploading = true;
            },
            onRemove: (file) => {
                const deleteUid = file.uid;
                let fileList = this.props.form.getFieldValue(key);
                let deletIndex: number | null = null;
                // for (let [index, { uid }] of fileList.entries()) {
                //     if (uid === deleteUid) {
                //         deletIndex = index;
                //         break;
                //     }
                // }
                if (!fileList) {
                    return true;
                }
                return new Promise((resolve, reject) => {
                    Modal.confirm({
                        title: '是否确定删除？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            for (let i = 0, l = fileList.length; i < l; i++) {
                                let uid = fileList[i].uid;
                                if (uid === deleteUid) {
                                    deletIndex = i;
                                    break;
                                }
                            }
                            if (deletIndex !== null) {
                                fileList.splice(deletIndex, 1);
                                this.props.form.setFields({
                                    attachment: {
                                        value: fileList,
                                    },
                                });
                            }
                            resolve();
                        },
                        onCancel: () => {
                            resolve(false);
                        }
                    });
                });



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
                // const {
                //     ossKey,
                //     url,
                // } = data;
                let fileList = this.props.form.getFieldValue(key);
                let newfile;
                if (Number(status) === 0 || Number(errcode) === 0) {
                    newfile = {
                        uid,
                        name,
                        url: data,
                        thumbUrl:data,
                        ossKey: data,
                        status: 'done',
                    };
                }
                else {
                    newfile = {
                        uid,
                        name,
                        status: 'error',
                        response: errmsg,
                    };
                }

                if (number && number > 1) {
                    for (let i = 0, l = fileList.length; i < l; i++) {
                        let tempUid = fileList[i].uid;
                        if (tempUid === uid) {
                            fileList[i] = newfile;
                            // break;
                        }
                    }
                }
                else {
                    fileList = [newfile];
                }
                
                /**
                 * 设置值
                 */
                this.props.form.setFields({
                    [`${key}`]: {
                        value: fileList,
                    },
                });
                this.uploading = false;
            },
        }
        return props;
    }
    normFile = (e, c) => {
        
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList && e.fileList.filter(file => !!file.status || !!file.ossKey);

    }
    getInvoiceType(type: 1 | 2 | 3) {
        switch (type) {
            case 3:
                return '电子_普通发票';
            case 2:
                return '纸质_专用发票';
            case 1:
                return '纸质_普通发票';
            default:
                throw new Error('error invoiceType, expect "1 | 2 | 3"');
        }
    }
    expressInfoInitialValue = () => {
        const {
            expressInfo,
        } = this.state;
        const {
            activeId,
        } = this.state;
        if (!expressInfo || expressInfo.size <= 0) {
            return '';
        }
        if (activeId === undefined) {
            return expressInfo.get(0).toJS();
        }
        if (activeId !== undefined) {
            for (let value of expressInfo.toJS()) {
                if (value.id === activeId) {
                    return value;
                }
            }

            /**默认选中第一个 */
            return expressInfo.get(0).toJS();
            //throw new Error(`没有匹配的寄送地址，id为${activeId}`);
        }
    }
    ExpressAddress: any;
    addExpressAddress = (e: any) => {
        const {
            addExpressAddressApi,
            baseInfo,
        } = this.props;
        e.preventDefault();

        ExpressAddressForm.add({
            title: '发票收票人信息',
            onOk: (values) => {
                console.log(values)
                if (values === false) return;
                const {
                    name,
                    phone,
                    addressDetail,
                    addressId,
                } = values;
                const params = {
                    cId: baseInfo.get('cId'),
                    country: 0,
                    province: addressId.selectVal[0],
                    city: addressId.selectVal[1],
                    district: addressId.selectVal[2],
                    address: addressDetail,
                    mobile: phone,
                    contacts: name,
                    cityName: addressId.selectName.join(' '),
                }
                return new Promise((resolve, reject) => {
                    fetchFn(addExpressAddressApi, params).then((responeData: any) => {
                        if (responeData.status === 0 || responeData.errcode === 0) {
                            resolve(true);
                            message.success('新增成功');
                            const value = {
                                id: responeData.data,
                                name,
                                addressDetail,
                                phone,
                                addressName: addressId.selectName,
                                addressId: addressId.selectVal,
                            }
                            this.setState(({ expressInfo, activeId }) => ({
                                activeId: value.id,
                                expressInfo: expressInfo.unshift(Immutable.fromJS(value))
                            }));
                            this.ExpressAddress.changeState({
                                activeIndex: 0
                            })
                            this.props.form.setFields({
                                expressInfo: {
                                    value,
                                }
                            });
                        }
                        else {
                            resolve(false);
                        }
                    })
                    //setTimeout(() => resolve(true), 2000)
                });
            },
            onCancel: () => {
                return new Promise((resolve, reject) => {

                }).then()
            }
        })
    }
    checkCallback = (id) => {
        // 
        // this.setState({
        //     activeId: id
        // });
    }
    addCallback = (values) => {
        this.setState(({ expressInfo, activeId }) => ({
            activeId: values.id,
            expressInfo: expressInfo.unshift(Immutable.fromJS(values))
        }));
    }
    editCallback = (values) => {
        const {
            id,
        } = values;
        this.setState(({ expressInfo }) => ({
            expressInfo: expressInfo.map((value) => {
                if (value && value.get('id') === id) {
                    return Immutable.fromJS(values);
                }
                return value;
            }) as any
        }));
    }
    deleteCallback = (values) => {
        const {
            id,
        } = values;
        this.setState(({ expressInfo }) => ({
            expressInfo: expressInfo.filter((value) => {
                if (!value) return false;
                return value.get('id') !== id
            }) as any,
        }));
    }
    changeInvoiceType = (value) => {

        // this.props.form.setFields({
        //     invoiceType: {
        //         value,
        //     }
        // })
        this.setState({ invoiceType: value })
    }
    render() {
        const {
            form,
            editExpressAddressApi,
            deleteExpressAddressApi,
            addExpressAddressApi,
            edit = true,
            activeId,
            baseInfo,
            orderType,
        } = this.props;
        const {
            taxCode,
            taxImg,
            taxPhone,
            taxAddress,
            bankAccount,
            openBank,
            bankImg,
            taxPersonImg,
            ePersonName,
            eMail,
            ePhone,
            eAddress,
            invoiceWhiteExists,
            cId,
            
        } = baseInfo.toJS();
        
        const {
            invoiceType,
            expressInfo,
        } = this.state;
        const {
            getFieldDecorator,
        } = form;
        return (
            <div key="invoice-wrapper" className="invoice-wrapper">
                <Form key="invoice-form">
                    <Card className={edit ? "invoice-type-head" : ""} title={
                        <div>
                            <FormItem label="发票类型" className="invoice-type-item">
                                {
                                    getFieldDecorator('invoiceType', {
                                        initialValue: invoiceType,
                                        rules: [
                                            {
                                                required: edit ? true : false,
                                                message: '请选择发票类型',
                                            }
                                        ]
                                    })(
                                        edit ?
                                            <RadioGroup onChange={(e: any) => { this.changeInvoiceType(e.target.value) }}>
                                                <Radio value={3}>
                                                    <span>
                                                        电子_普通发票<span className="recommended">
                                                            （推荐 <Tooltip title="与纸质发票同等法律效力，免配送费。即时发送，可下载打印。"><Icon className="question-circle" type="question-circle" /></Tooltip>）</span>
                                                    </span>
                                                </Radio>
                                                <Radio value={2}>纸质_专用发票</Radio>
                                                {
                                                    invoiceWhiteExists && <Radio value={1}>纸质_普通发票</Radio>
                                                }
                                                
                                            </RadioGroup>
                                            :
                                            <span className="invoice-type-name">{this.getInvoiceType(invoiceType)}</span>
                                        )
                                }

                            </FormItem>
                            {
                                edit &&
                                <Alert message="根据国家相关税务要求，即开票金额不能等于差额征税金额，系统将只能开具普通发票。" type="warning" />
                            }
                        </div>}
                    >
                        <div>
                            <FormItem label="发票资质信息" style={{ fontWeight: 700 }} className="label-no-after"></FormItem>
                            <table className="table border-table" key="invoice-table">
                                <colgroup style={{ width: '15%' }}></colgroup>
                                <colgroup style={{ width: '35%' }}></colgroup>
                                <colgroup style={{ width: '15%' }}></colgroup>
                                <colgroup style={{ width: '35%' }}></colgroup>
                                {
                                    invoiceType === 2 &&
                                    <tr>
                                        <td>
                                            <span className={edit ? "ant-form-item-required" : ""}>
                                                一般纳税人资质证明
                                                {
                                                    edit && <Tooltip title={
                                                        <ul>
                                                            <li>增值税一般纳税人的证明文件（以下任意一份即可）</li>
                                                            <li>a、增值税一般纳税人认定书</li>
                                                            <li>b、加盖增值税一般纳税人字样的客户税务登记证</li>
                                                            <li>c、发票领购本（显示曾经领购过增值税专用发票）</li>
                                                            <li>d、贵公司为其他公司开具的增值税专用发票</li>
                                                            <li>e、其他税务局的证明文件</li>
                                                        </ul>
                                                    }>
                                                        <Icon className="question-circle" type="question-circle" />
                                                    </Tooltip>
                                                }
                                                ：
                                            </span>
                                        </td>
                                        <td>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('taxPersonImg', {
                                                        valuePropName: 'fileList',
                                                        getValueFromEvent: this.normFile,
                                                        initialValue: taxPersonImg ? taxPersonImg : [],
                                                        rules: [
                                                            {
                                                                validator: (rule, value, callback) => { this.validateUpload(rule, value, callback, 1, '请上传一般纳税人资质证明') }
                                                            }
                                                        ]
                                                    })(
                                                        <Upload {...this.uploadProps({ key: 'taxPersonImg', number: 3 }) } className={edit ? "" : "upload-disabled"}>
                                                            {
                                                                edit ?
                                                                    <div>
                                                                        <Button>
                                                                            <Icon type="upload" /> 点击上传图片
                                                                </Button>
                                                                    </div>
                                                                    : null
                                                            }

                                                        </Upload>
                                                        )
                                                }
                                            </FormItem>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                }
                                <tr>
                                    <td>
                                        <span className={edit ? "ant-form-item-required" : ""}>
                                            税号 {
                                                edit && <Tooltip title="如办理五证合一并且在主管税务机关备案过的企业，“税号 （纳税人识别号）”即为“统一社会信用代码”"><Icon className="question-circle" type="question-circle" /></Tooltip>
                                            }：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator('taxCode', {
                                                    initialValue: taxCode,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            validator: this.validateTaxCode
                                                        },{
                                                            whitespace:true,
                                                        }
                                                    ],
                                                    
                                                    validateTrigger: 'onBlur',
                                                })(
                                                    edit ? <Input /> : <p>{taxCode}</p>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                    <td>
                                        <span className={edit ? "ant-form-item-required" : ""}>
                                            税务登记证扫描件  {edit && <Tooltip title={
                                                <ul>
                                                    <li>营业执照许可证（三证合一客户）</li>
                                                    <li>税务登记证扫描件（非三证合一客户）</li>
                                                </ul>
                                            }><Icon className="question-circle" type="question-circle" /></Tooltip>}：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator('taxImg', {
                                                    valuePropName: 'fileList',
                                                    getValueFromEvent: this.normFile,
                                                    initialValue: taxImg ? taxImg : [],
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => { this.validateUpload(rule, value, callback, 1, '请上传税务登记证扫描件') }
                                                        }
                                                    ]
                                                })(
                                                    <Upload {...this.uploadProps({ key: 'taxImg', number: 1 }) } className={edit ? "" : "upload-disabled"}>
                                                        <div>
                                                            {edit && <Button>
                                                                <Icon type="upload" /> 点击上传图片
                                                            </Button>}
                                                        </div>
                                                    </Upload>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={edit && invoiceType === 2 ? "ant-form-item-required" : ''}>
                                            在主管税务机关备案的地址 ：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator(`taxAddress${invoiceType}`, {
                                                    initialValue: taxAddress,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validateRequired(rule, value, callback, '请输入在主管税务机关备案的地址')
                                                        },
                                                        {
                                                            validator: (rule, value, callback) => this.validateMax(rule, value, callback, 100, '请输入正确的地址，且控制在100字以内')
                                                        }
                                                    ],
                                                    validateTrigger: 'onBlur',
                                                })(
                                                    edit ? <Input /> : <p>{taxAddress}</p>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                    <td>
                                        <span className={edit && invoiceType === 2 ? "ant-form-item-required" : ''}>
                                            税务票据开票电话 ：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator(`taxPhone${invoiceType}`, {
                                                    initialValue: taxPhone,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validateRequired(rule, value, callback, '请输入税务票据开票电话')
                                                        },
                                                        {
                                                            validator: this.validateTaxPhoneLandLine
                                                        }
                                                    ],
                                                    validateTrigger: 'onBlur',
                                                })(
                                                    edit ? <Input /> : <p>{taxPhone}</p>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={edit && invoiceType === 2 ? "ant-form-item-required" : ''}>
                                            开户银行 ：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator(`openBank${invoiceType}`, {
                                                    initialValue: openBank,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validateRequired(rule, value, callback, '请输入开户银行')
                                                        },
                                                        {
                                                            validator: (rule, value, callback) => this.validateMax(rule, value, callback, 100, '请输入正确的开户银行，且控制在100字以内')
                                                        }
                                                    ],
                                                    validateTrigger: 'onBlur',
                                                })(
                                                    edit ? <Input /> : <p>{openBank}</p>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                    <td>
                                        <span className={edit && invoiceType === 2 ? "ant-form-item-required" : ''}>
                                            银行账号 ：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator(`bankAccount${invoiceType}`, {
                                                    initialValue: bankAccount,
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => this.validateRequired(rule, value, callback, '请输入银行账号')
                                                        },
                                                        {
                                                            validator: (rule, value, callback) => this.validateMax(rule, value, callback, 100, '请输入正确的银行账号，且控制在100字以内')
                                                        }
                                                    ],
                                                    validateTrigger: 'onBlur',
                                                })(
                                                    edit ? <Input /> : <p>{bankAccount}</p>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            银行开户证明 ：
                                        </span>
                                    </td>
                                    <td>
                                        <FormItem>
                                            {
                                                getFieldDecorator('bankImg', {
                                                    valuePropName: 'fileList',
                                                    getValueFromEvent: this.normFile,
                                                    initialValue: bankImg ? bankImg : [],
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => { this.validateUpload(rule, value, callback, 0, ) }
                                                        }
                                                    ]
                                                })(
                                                    <Upload {...this.uploadProps({ key: 'bankImg', number: 1 }) } className={edit ? "" : "upload-disabled"}>
                                                        <div>
                                                            {edit && <Button>
                                                                <Icon type="upload" /> 点击上传图片
                                                            </Button>}

                                                        </div>
                                                    </Upload>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </table>


                            <FormItem label="发票收票人信息" className="invoice-person-info top-line label-no-after" style={{ fontWeight: 700 }}>
                                {
                                    edit
                                    &&
                                    invoiceType !== 3
                                    &&
                                    expressInfo
                                    &&
                                    expressInfo.size > 0
                                    &&
                                    <a href="" className="add-invoice-person" onClick={e => this.addExpressAddress(e)}>新增收票人</a>
                                }
                            </FormItem>

                            {
                                edit && invoiceType !== 3 &&
                                <div>
                                    <FormItem>
                                        {
                                            getFieldDecorator('expressInfo', {
                                                initialValue: this.expressInfoInitialValue(),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请添加发票收票人信息'
                                                    }
                                                ]
                                            })(
                                                <ExpressAddress
                                                    ref={node => this.ExpressAddress = node}
                                                    expressInfo={expressInfo}
                                                    editExpressAddressApi={editExpressAddressApi!}
                                                    deleteExpressAddressApi={deleteExpressAddressApi!}
                                                    addExpressAddressApi={addExpressAddressApi!}
                                                    addCallback={(values) => this.addCallback(values)}
                                                    editCallback={(values) => this.editCallback(values)}
                                                    deleteCallback={(values) => this.deleteCallback(values)}
                                                    checkCallback={(id) => this.checkCallback(id)}
                                                    activeId={activeId}
                                                    cId={cId}
                                                />
                                                )
                                        }
                                    </FormItem>
                                </div>
                            }


                            {

                                (edit === false || invoiceType === 3) &&
                                <table className="table border-table" key="invoice-person-table">
                                    <colgroup style={{ width: '15%' }}></colgroup>
                                    <colgroup style={{ width: '35%' }}></colgroup>
                                    <colgroup style={{ width: '15%' }}></colgroup>
                                    <colgroup style={{ width: '35%' }}></colgroup>
                                    <tr>
                                        <td>
                                            <span className={edit ? "ant-form-item-required" : ""}>
                                                收票人姓名：
                                        </span>
                                        </td>
                                        <td>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('ePersonName', {
                                                        initialValue: ePersonName,
                                                        rules: [
                                                            {
                                                                required: true, message: '请输入收票人姓名',
                                                            },
                                                            {
                                                                validator: (rule, value, callback) => this.validateMax(rule, value, callback, 20, '请输入正确的收票人姓名，且控制在20字以内')
                                                            }
                                                        ],
                                                        validateTrigger: 'onBlur',
                                                    })(
                                                        edit ? <Input /> : <p>{ePersonName}</p>
                                                        )
                                                }
                                            </FormItem>
                                        </td>
                                        <td>
                                            <span className={edit ? "ant-form-item-required" : ""}>
                                                收票人手机号 ：
                                        </span>
                                        </td>
                                        <td>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('ePhone', {
                                                        initialValue: ePhone,
                                                        rules: [
                                                            {
                                                                validator: (rule, value, callback) => this.validateRequired(rule, value, callback, '请输入税务票据开票电话')
                                                            },
                                                            {
                                                                validator: this.validateTaxPhone
                                                            }
                                                        ],
                                                        validateTrigger: 'onBlur',
                                                    })(
                                                        edit ? <Input /> : <p>{ePhone}</p>
                                                        )
                                                }
                                            </FormItem>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className={edit ? "ant-form-item-required" : ""}>
                                                {
                                                    invoiceType === 3 ?
                                                        "收票人E-mail ："
                                                        :
                                                        "收票人地址："
                                                }

                                            </span>
                                        </td>
                                        <td>
                                            <FormItem>

                                                {
                                                    invoiceType === 3 ?

                                                        getFieldDecorator(`eMail`, {
                                                            initialValue: eMail,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请输入正确的收票人E-mail',
                                                                    type: 'email',
                                                                },
                                                            ],
                                                            validateTrigger: 'onBlur',
                                                        })(
                                                            edit ? <Input /> : <p>{eMail}</p>
                                                            )
                                                        :
                                                        getFieldDecorator(`eAddress`, {
                                                            initialValue: eAddress,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请输入正确的收票人地址',
                                                                },
                                                            ],
                                                            validateTrigger: 'onBlur',
                                                        })(
                                                            edit ? <Input /> : <p dangerouslySetInnerHTML={{ __html: eAddress }}>{}</p>
                                                            )
                                                }
                                            </FormItem>
                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                </table>
                            }

                            {(orderType &&  orderType ===6)&&<FormItem label="特殊开票需求" className="invoice-person-info top-line label-no-after" style={{ fontWeight: 700 }}>
                                
                                </FormItem>}
                            {(orderType &&  orderType ===6)&&<FormItem>
                                {
                                    getFieldDecorator('specificRemark', {
                                        rules: [
                                            {
                                                max:300,
                                                message: '最多可输入300字'
                                            }
                                        ]
                                    })(
                                        <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
                                    )
                                }
                            </FormItem>
                            }
                        </div>
                    </Card>
                </Form>

            </div>
        )
    }
}
const InvoiceCreatForm = Form.create()(InvoiceForm);

export default class Invoice extends Component<InvoiceProps, {}> {
    constructor(props) {
        super(props);
    }
    InvoiceCreatForm: WrappedFormUtils & Component<InvoiceProps, {}>;
    getResult = (e) => {
        let result;
        this.InvoiceCreatForm.validateFieldsAndScroll((err, values) => {
            if (err) {
                result = false;
            }
            else {
                const {
                    invoiceType,
                    bankImg,
                    taxImg,
                    taxPersonImg,
                    eMail,
                    ePersonName,
                    ePhone,
                    taxCode,
                    expressInfo,
                    specificRemark,
                } = values;

                result = {
                    invoiceType,
                    bankImg,
                    taxImg,
                    taxCode:String.prototype.trim.call(taxCode === undefined || taxCode === null ? '' : taxCode),
                    bankAccount: values[`bankAccount${invoiceType}`],
                    openBank: values[`openBank${invoiceType}`],
                    taxAddress: values[`taxAddress${invoiceType}`],
                    taxPhone: values[`taxPhone${invoiceType}`],
                    specificRemark
                }
                if (invoiceType === 3) {
                    result = {
                        ...result,
                        eMail,
                        ePersonName,
                        ePhone,
                    }
                }
                if (invoiceType === 2) {
                    result = {
                        ...result,
                        taxPersonImg,
                        expressInfo,
                    }
                }
                if (invoiceType === 1) {
                    result = {
                        ...result,
                        expressInfo,
                    }
                }
            }
        });
        return result;
    }
    render() {
        return (
            <div>
                <InvoiceCreatForm {...this.props} ref={(node: WrappedFormUtils & Component<InvoiceProps, {}>) => this.InvoiceCreatForm = node}>
                </InvoiceCreatForm>

            </div>

        )
    }
}