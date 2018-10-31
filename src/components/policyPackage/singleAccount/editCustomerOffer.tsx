import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, message, Radio, Tag, Tooltip, Icon, Upload,notification,DatePicker,Modal } from 'antd';
import * as _ from 'lodash';
import moment from 'moment';
import TableUI from '../../Table/';
import './editCustomerOffer.less';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import {
    fetchFn,
} from '../../../util/fetch';
import { DOMAIN_OXT } from '../../../global/global';
import { Map } from 'immutable';
import uploadProps from './util/uploadProps';
// import './editCustomerOffer.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface editCustomerOfferProps extends FormComponentProps {
    type: 1|2|3; // 1 编辑 2 只读(带输入框) 3 查看
    id?: string;
    data?:any;
    dictionaryData?:any[]; // 单立户材料名称数据字典
    callback?: any;
   
}


interface editCustomerOfferState {
    id:string;
    data:any;
    uploading:boolean;
    allowSubmit:boolean;
}
const compare =(property)=>{
    return function(a,b){
        // 未设置index 排后面
        var value1 = a[property] ;
        var value2 = b[property] ;
        return value1 - value2;
    }
}
const TableFormItemLayout = {
    labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
};
class editCustomerOfferForm extends Component<editCustomerOfferProps, editCustomerOfferState> {
    constructor(props: editCustomerOfferProps) {
        super(props);
        const {
            data = [] as any,
            id

        } = props;
        
        this.state = {
            id:id||'',
            data:[],
            uploading:false,
            allowSubmit:true,
        };
    }


   
    componentWillMount() {
        // 优先读取穿过来的props
        const {
            id,
            data
        } = this.props;
        if(data){
            this.setState({
                data:this.transformCustomerOfferData(data)
            })
        }else {
            this.getCustomerOfferData(id)
        }
        
    }
    /**
     * 查询客户需要提供材料
     */
    getCustomerOfferData = async (id) => {
        
        const data:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/getcustomeroffer`, { id });
        if (data.status === 0) {
            if(data.data && data.data.customerOffer){
                
                
                const customerOffer = this.transformCustomerOfferData(data.data.customerOffer);
                // let customerOfferData:any = [];
                // TableUI 专属格式 {label,value}
                // customerOffer.map((item, index) => {
                //     let temp = {
                //         'label': this.transformMaterialsName(item),
                //         'value': this.renderTableCell(item)
                //     }
                //     customerOfferData.push(temp);
                // })
                
                this.setState({
                    data:customerOffer
                })
            }
            
        }
    }
    // 对象转数组
    transformCustomerOfferData = (data) => {
        return _.values(_.omit(data,'_op')).sort(compare('index'))
    }
    transformMaterialsName = (record) => {
        if(record){
            const {
                dictionaryData
            } = this.props;
            const materialsKey = record.materialsKey;
            if(materialsKey && dictionaryData && dictionaryData.length>0){
                const data =  dictionaryData.find(function(obj, index, arr) {
                    return obj.dictKey == materialsKey;
                })
                return data.dictName || ''
            }else{
                return record.materialsName || ''
            }
        }
        
        
    }
    
    renderTableCell = (record = {} as any) => {

        const {
            type
        } = this.props;
        const {
            materialsType,
            materialsName,
            materialsValue
        } = record

        return (materialsName && <FormItem {...TableFormItemLayout}>
                    { materialsType ===1 && this.renderInputDom(record,type) }
                    { materialsType ===2 && this.renderSelectDom(record,type) }
                    { materialsType ===3 && this.renderUploadDom(record,type) }

                    
                </FormItem>)
    }
    renderInputDom = (record,type) => {
        
        const {
            materialsValue,
            materialsType,
            materialsKey,
            materialsName,
            materialsList,
            materialsDescription
        } = record
        const handleInputChange = (e,materialsKey,record) => {
            const {
                data
            } = this.state;
            record[materialsKey] = e.target.value;
            const tempData =  data[record.index] = record;
            
            this.setState({data:tempData})
            
        }
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        const max = materialsDescription == "手机号码"?11:(materialsDescription == "邮政编码"?6:250);
        const inputType = (materialsDescription == "手机号码"|| materialsDescription == "数字"|| materialsDescription == "邮政编码")?'number':(materialsDescription == "邮箱"?'email':'string');
        return   type ===3? (materialsValue || ''):getFieldDecorator(materialsKey, {
            initialValue:(materialsDescription == "日期" || materialsDescription == "时间")? materialsValue && moment(materialsValue): materialsValue,
            // initialValue:materialsValue,
            
            rules: [
                {
                required: true,
                max,
                type:inputType,
                validator: (rule, value, callback)=>{this.validateCustomerOfferItem(rule, value, callback,materialsDescription,materialsName)}
                }],
            })(
              
               (materialsDescription == "日期" || materialsDescription == "时间") ? <DatePicker allowClear={false} disabled={type===2?true:false}  onChange={(date, dateString)=>{
                    setFieldsValue({legalPerson:dateString})
                }} format={ materialsDescription == "时间"?"YYYY-MM-DD HH:mm:ss":"YYYY-MM-DD"} showTime={materialsDescription == "时间"}/>:
                <Input placeholder="请填写" disabled={type===2?true:false} defaultValue={materialsValue} />
              
            
                
            )
    }
    // handleDateChange = (date, dateString,key)=> {
    //     var value = new Object();
    //     value[key] = dateString
        
    // }
    renderSelectDom = (record,type) => {
        const {
            materialsKey,
            materialsName,
            materialsValue,
            materialsType,
            materialsList
        } = record
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        
        const optionDom: Array<JSX.Element> = [];
        
        if (Object.prototype.toString.apply(materialsList) === '[object Array]') {
            materialsList.map(item => {

                optionDom.push(<Option value={item} title={item}>{item}</Option>)
            })
            
            return type===3?(materialsValue||''):getFieldDecorator(materialsKey, {
                initialValue:materialsValue,
                
                rules: [
                    {
                    required: true,message: "请选择"+materialsName,
                    }],
                })(
                   
                    <Select defaultValue={materialsValue} disabled={type===2?true:false} placeholder="请选择">{optionDom}</Select>
                        
                    
                );;
        }
    }
    uploading = false;
    // type 1 图片 2 文件
    uploadProps: (params: { key: string, type?: number, fileList?:any[]}) => any = ({ key, type, fileList}) => {

        const {
            form,
        } = this.props
        // `${DOMAIN_OXT}/api/policypackage/material/template/upload`,//
        const props: any = {
            name: "file",
            action: `${DOMAIN_OXT}/api/fileupload`,
            accept: type===1?'.jpg,.jpeg,.bmp,.gif,.png,.pdf':undefined,
            listType: 'picture-card',
            fileList,
            showUploadList:{
                showRemoveIcon:this.props.type===1
            },
            beforeUpload: (file) => {
                const attachment = form.getFieldValue(key);
                // if (number && attachment && attachment.length >= number) {
                //     message.error(`上传附件数量限制为${number}张`);
                //     return false;
                // }
                const types = ['image/bmp', 'image/png', 'image/gif', 'image/jpeg','application/pdf',];
                
                const isLt16M = file.size / 1024 / 1024 < 16;
               
                if (!isLt16M) {
                    message.error('上传的附件大小不超过16Mb',1);
                    
                    return false;
                }
                if (type ===1 && types.indexOf(file.type) === -1) {
                    message.error('请上传格式为.jpg、.jpeg、.bmp、.gif、.png、pdf 的图片',1);
                    return false;
                }

                this.uploading = true;
            },
            onChange: (info) => {
                // 验证失败后文件也会被添加进来 单独设置值 (无效 改为normFile 验证)
                // if(!info.file.status){
                //     this.uploading = false;
                //     form.setFields({
                //         [`${key}`]: {
                //             value: [],
                //         },
                //     });
                   
                //     console.log(fileList)
                //     return;
                // }
                if (info.file.status === 'uploading') {
                    this.uploading = true;
                    return;
                  }
                if (info.file.status === 'done') {
                    const {
                        uid,
                        name,
                        response,
                    } = info.file;
                    const {
                        msg,
                        status,
                        errcode,
                        data,
                        errmsg,
                    } = response;
                    let fileList = this.props.form.getFieldValue(key);
                    let newfile;
                    if (Number(status) === 0 || Number(errcode) === 0) {
                        newfile = {
                            uid,
                            name,
                            url: data,
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

                    
                    for (let i = 0, l = fileList.length; i < l; i++) {
                        let tempUid = fileList[i].uid;
                        if (tempUid === uid) {
                            fileList[i] = newfile;
                            break;
                        }
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
                }
            },
            onRemove: (file) => {
                const deleteUid = file.uid;
                let fileList = this.props.form.getFieldValue(key);
                let deletIndex: number | null = null;
                // 不可编辑情况下点击删除
                if(this.props.type ===2 ||  this.props.type ===3){
                    return false;
                }
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
                                form.setFields({
                                    [`${key}`]: {
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
            // onSuccess: (response, file) => {
            //     debugger
            //     const {
            //         uid,
            //         name,
            //     } = file;
            //     const {
            //         msg,
            //         status,
            //         errcode,
            //         data,
            //         errmsg,
            //     } = response;
            //     // const {
            //     //     ossKey,
            //     //     url,
            //     // } = data;
            //     let fileList = this.props.form.getFieldValue(key);
            //     let newfile;
            //     if (Number(status) === 0 || Number(errcode) === 0) {
            //         newfile = {
            //             uid,
            //             name,
            //             url: data,
            //             ossKey: data,
            //             status: 'done',
            //         };
            //     }
            //     else {
            //         newfile = {
            //             uid,
            //             name,
            //             status: 'error',
            //             response: errmsg,
            //         };
            //     }

                
            //     for (let i = 0, l = fileList.length; i < l; i++) {
            //         let tempUid = fileList[i].uid;
            //         if (tempUid === uid) {
            //             fileList[i] = newfile;
            //             break;
            //         }
            //     }
            

            //     /**
            //      * 设置值
            //      */
            //     this.props.form.setFields({
            //         [`${key}`]: {
            //             value: fileList,
            //         },
            //     });
            //     this.uploading = false;
                
            // },

        }
        return props;
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        
        const fileList =  e && e.fileList;
        let list:any = [];
        // 删除验证失败的文件
        for (let file of fileList) {
            if(file && file.status){
                list.push(file)
            }
        }
        return list;
    }
    renderUploadDom = (record,type) => {
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        const {
            uploading
        } = this.state;
        const {
            materialsKey,
            materialsName,
            materialsType,
            materialsValue,
            materialsDescription,
            materialsList
        } = record;

       
        let tempValue:any = []
        // jquery 版本上传返回结果不一样
        
        if(materialsValue && materialsValue[0] && !materialsValue[0].url){
            for (let index = 0; index < materialsValue.length; index++) {
                const element = materialsValue[index];
                if(element){
                    tempValue.push({
                        uid: element,
                        name: element,
                        status: 'done',
                        url: element,
                    })
                }
                
                
            }
        }else{
            tempValue = materialsValue
        }
        return  getFieldDecorator(materialsKey, {
            initialValue:tempValue,
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            rules: [
                {
                required: true,
                // validator: (rule, value, callback)=>{this.validateCustomerOfferItem(rule, value, callback,materialsDescription,materialsName)}
                validator: (rule, value, callback)=>{this.validateUpload(rule, value, callback,materialsName)}
                }],
            })(
                <Upload {...this.uploadProps({ key: materialsKey, type: materialsDescription=="图片"?1:2,fileList:tempValue }) }
                disabled={uploading || type===2}>
                    {type !=3 && <Button type="primary" icon="cloud-upload" loading={uploading}>
                        {uploading ? '上传中...' : '上传'}
                    </Button>}
                    
                </Upload>
                    
                
            )
        
        
    }
    
    validateCustomerOfferItem = (rule, value, callback,materialsDescription,materialsName) => {
        value = String.prototype.trim.call(value === undefined ? '' : value);
        if(!value){
            return callback('请填写'+materialsName);        
        }
        switch (materialsDescription) {
            case '电话':
                var telReg = /^(\d{3,4}-)?\d{7,8}(-\d{1,6})?$/; 
                if(telReg.test(value)){
                    return callback();
                }else{
                    return callback('请填写电话号码');
                }
            case '邮政编码':
                
                if(value.length === 6){
                    return callback();
                }else{
                    return callback('请填写正确的邮政编码');
                }
            case '手机号码':
                
                if(value.length === 11){
                    return callback();
                }else{
                    return callback('请填写正确的手机号码');
                }
            case '邮箱':
                var emaliReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
                if(emaliReg.test(value)){
                    return callback();
                }else{
                    return callback('请填写正确的邮箱');
                }
        
            default:
                if(value) {
                    return callback();
                }else{
                    return callback('请填写'+materialsName);
                }
                
        }
        
    }
    validateUpload = (rule, value, callback,materialsName) => {
        if (value && value.length) {
            for (let { status } of value) {
                console.log(status)
                if (!status ||status === 'error') {
                    return callback('请上传正确的'+materialsName);
                }
            }
            return callback();
        }else{
            return callback('请上传'+materialsName);
        }

        
        
    }
 
 
    /**
     * 点击提交
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const that = this;
        const {
            callback
        } = this.props;
        // 验证form
        this.props.form.validateFields((err, values) => {
            
            if (!err) {
                this.transformJsonResult(values)
                callback && callback();
            }
        });
    }

    transformJsonResult = (values) => {
        const {
            data
        } = this.state;
        const tempData = data;
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                // const element = values[key];
                const item = tempData.find(function(value, index, arr) {
                    return value.materialsKey == key;
                }) // 2
                if(item){
                    tempData[item.index].materialsValue = values[key]
                }
            }
            
        }
        return  tempData
    }
    
    renderTableTr = () => {
        const {
            data
        } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const trList: Array<JSX.Element> = [];
        for (let index = 0; index < Math.ceil(data.length/2); index++) {
            
            trList.push(<tr>
                <td><span>{this.transformMaterialsName(data[index*2])}</span></td>
                <td>{this.renderTableCell(data[index*2])}</td>
                <td><span>{this.transformMaterialsName(data[index*2+1])}</span></td>
                <td>{this.renderTableCell(data[index*2+1])}</td>
            
                
            </tr>)
            
        }
        return trList
    }
    renderTableTd = (index) => {
        const {
            data
        } = this.state;
        const record = data[index];
     
        return (record && <td>{this.transformMaterialsName(record)}</td>
        )
        
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;


        
        const {
            id,
            data,
            
        } = this.state;
        return data.length>0 ? <Form onSubmit={this.handleSubmit} className="edit-customer-offer">
            <table className="table border-table" key="customer-offer-table">
                <colgroup style={{ width: '20%' }}></colgroup>
                <colgroup style={{ width: '30%' }}></colgroup>
                <colgroup style={{ width: '20%' }}></colgroup>
                <colgroup style={{ width: '30%' }}></colgroup>
                {this.renderTableTr()}
            </table>
            
            {getFieldDecorator('customerOffer',{ initialValue: data })}
            {/* <Button
                htmlType="submit"
                // disabled={hasErrors(getFieldsError())}
                type="primary"
            >
                自己提交
            </Button> */}
            
        </Form>:<div>暂无数据</div>;
    }
}

export default Form.create()(editCustomerOfferForm);






