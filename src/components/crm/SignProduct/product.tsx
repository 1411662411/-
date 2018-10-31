import React from 'react';
import { browserHistory } from 'react-router'
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'react-redux';
import { 
    Spin,
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    message,
    Checkbox,
    Icon,
    Tag,
    Radio,
    Popconfirm,
    Modal,
    InputNumber,
} from 'antd';

import TableUi from '../../Table';
import PartTitle from '../Title';

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from "../../../util/fetch";
import query from '../../../util/query';

const urlId = query('id');

import EditSignSubject from './editSignSubject';

const API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/list`; //获取签约主体

const saveProduct = (data) => {
    if(urlId){
        return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/update`, data).then(data => data);
    }
}

const getDataList = (key) => {
    return fetchFn(API, {
        'key': key
    }).then(data => data);
}

const getTypeDataList = () => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getProductType`, {}).then(data => data);
}

const getProductList = () => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/listByType`, {}).then(data => data);
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option, OptGroup } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const CheckableTag = Tag.CheckableTag;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea

interface UserFormProps extends FormComponentProps {
    resData: any;
}

class Signproduct extends React.Component<UserFormProps,any>{
    constructor(props: UserFormProps){
        super(props)
        this.state={
            loading: false,
            detailData: null,
            signSubject:[], //签约主体
            signSubjectVisible: false,
            signSubjectNumber: 0,
            signSubjectList: [],
            typeTags: [],//产品类型
            typeAdd: false,
            typeAddLoading: false,
            typeAddVal: '',
            startDateType: [], //对应合同起始日期
            productList: [], //签单产品
            isEdit: false,
            conflictVal: null,
            changeable: false,//是否可改签
            defaultChangeableProduct: undefined,
            changeableVal: null,
            addable: false,//是否可加签
            defaultAddableProduct: undefined,
            addableVal: null,
            oldNameVal: null,
            oldCodeVal: null,
        }
    }
    
    async componentWillMount(){
        this.setState({loading: true});
        await this.getDetail();
        await this.getSignSubjectList();
        await this.getTypeDataList();
        await this.getStartDateType();
        await this.getProductList();
    }

    /**
     * 获取页面数据
     */
    getDetail = async() => {
        if(this.props.resData){
            const {
                resData
            } = this.props;
            this.setState({
                detailData: resData,
                conflictVal: resData.conflictProduct,
                changeableVal: resData.changeableProduct,
                addableVal: resData.addableProduct,
                loading: false,
                oldNameVal: resData.name,
                oldCodeVal: resData.code,
            })
            document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = `签单产品_查看 | ${resData.name}`;
            document.title = `签单产品_查看 | ${resData.name}`;
            if(resData.changeable === 1){
                this.setState({
                    changeable: true,
                    defaultChangeableProduct: resData.changeableProductName ? resData.changeableProductName.split(';') : undefined,
                })
            }
            if(resData.addable === 1){
                this.setState({
                    addable: true,
                    defaultAddableProduct: resData.addableProductName ? resData.addableProductName.split(';') : undefined,
                })
            }
        }
    }

    /**
     * 获取签约主体
     */
    getSignSubjectList = async() => {
        let res:any = await getDataList('QYZT');
        if(res.status === 0){
            let tempArr:any = [];
            res.data.map((item) => {
                tempArr.push({
                    'label': `${item.dictName} | ${item.description}`,
                    'value': item.code,
                })
            })
            this.setState({
                signSubject: tempArr,
                loading: false,
            })
        }
    }
    /**
     * 获取产品类型
     */
    getTypeDataList = async() => {
        let res:any = await getTypeDataList();
        if(res.status === 0){
            const typeData = res.data;
            let typeTags:any = [];
            typeData.map((item) =>{
                typeTags.push(<RadioButton value={item.code}>{item.dictName}{item.deleteStatus ? <Popconfirm
                    title={<span>是否确定删除？</span>}
                    okText="确定"
                    onConfirm={(e) => { this.delTypeHandle(e, item) }}
                    cancelText="取消"
                >
                    <Icon type="delete"></Icon>
                </Popconfirm> : ''}</RadioButton>)
            })
            this.setState({
                typeTags: typeTags,
                loading: false,
            })
        }
    }
    /**
     * 获取对应合同起始日期
     */
    getStartDateType = async() => {
        let res:any = await getDataList('DYHTQSRQ');
        if(res.status === 0){
            let startDateType:any = [];
            res.data.map((item) =>{
                startDateType.push(
                    <Option value={item.code}>{item.dictName}</Option>
                )
            })
            this.setState({
                startDateType: startDateType,
                loading: false,
            })
        }
    }
    /**
     * 获取签单产品
     */
    getProductList = async() => {
        let res:any = await getProductList();
        if(res.status === 0){
            const productData = res.data;
            let productStr:any = [];
            for (let key in productData) {
                productStr.push(<OptGroup key={key} label={key}>
                    {
                        productData[key].map(item => <Option key={item['name']} title={item['id']}>{item['name']}</Option>)
                    }
                </OptGroup>)
            }
            this.setState({
                productList: productStr,
                loading: false,
            })
        }
    }

    signSubjectChange = (signSubjectList) => {
        this.setState({
            signSubjectList
        })
    }

    editSignSubject = () => {
        this.setState({
            signSubjectVisible: true,
            signSubjectNumber: this.state.signSubjectNumber + 1
        })
    }

    closeMoadl = () =>{
        this.setState({
            signSubjectVisible: false,
        });
        this.getSignSubjectList();
    }

    delTypeHandle = (e, item) => {
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/deleteProductType`, {
            id: item.id
        })
        .then((res: any) => {
            if(res.errcode == 0){
                this.getTypeDataList();
            }
        });
    }

    onChangeTypeAdd = (e) => {
        this.setState({ typeAddVal: e.target.value });
    }

    typeAddHandle = () => {
        const { typeAddVal } = this.state;
        this.setState({typeAddLoading: true})
        if(typeAddVal.trim()){
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/addBySort`, {
                dictKey: 'CPLX',
                dictName: typeAddVal
            })
            .then((res: any) => {
                this.setState({typeAddLoading: false});
                if(res.errcode == 0){
                    this.setState({ 
                        typeAdd: false,
                        typeAddVal: ''
                    });
                    this.getTypeDataList();
                }
            });
        }else{
            message.warning('请填写产品类型');
        }
    }

    handleConflictChange = (e, item) => {
        //console.log(`selected ${e}`, item);
        let tempVal:any = [];
        item.map((item) => {
            tempVal.push(item.props.title)
        })
        this.setState({
            conflictVal: tempVal.join(',')
        })
        if(!urlId){
            this.props.form.setFieldsValue({conflictVal: tempVal.join(',')})
        }
    }
    handleChangeableChange = (e, item) => {
        //console.log(`selected ${e}`, item);
        let tempVal:any = [];
        item.map((item) => {
            tempVal.push(item.props.title)
        })
        this.setState({
            changeableVal: tempVal.join(',')
        })
        if(!urlId){
            this.props.form.setFieldsValue({changeableVal: tempVal.join(',')})
        }
    }
    handleAddableChange = (e, item) => {
        //console.log(`selected ${e}`, item);
        let tempVal:any = [];
        item.map((item) => {
            tempVal.push(item.props.title)
        })
        this.setState({
            addableVal: tempVal.join(',')
        })
        if(!urlId){
            this.props.form.setFieldsValue({addableVal: tempVal.join(',')})
        }
    }

    changeableHandle = (e) => {
        let target = e.target.value;
        if(target == 1){
            this.setState({
                changeable: true,
                defaultChangeableProduct: undefined,
            })
        }else{
            this.setState({
                changeable: false
            })
        }
    }

    addableHandle = (e) => {
        let target = e.target.value;
        if(target == 1){
            this.setState({
                addable: true,
                defaultAddableProduct: undefined,
            })
        }else{
            this.setState({
                addable: false
            })
        }
    }

    editHandle = () => {
        this.setState({
            isEdit: true,
        })
        this.getDetail();
    }

    cancelSave = () => {
        this.setState({
            isEdit: false,
        })
        this.getDetail();
    }

    submit=(e) => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
            if(!err){
                const {
                    conflictVal,
                    changeableVal,
                    addableVal,
                } =this.state;
                values.id = urlId;
                values.addableProduct = Number(values.addable) === 1 ? addableVal : '';
                values.changeableProduct = Number(values.changeable) === 1 ? changeableVal : '';
                values.conflictProduct = conflictVal;
                values.signSubject = Array.isArray(values.signSubject) ? values.signSubject.join(',') : values.signSubject;
                this.setState({loading: true});
                let res:any = await saveProduct({
                    ...values,
                });
                if(Number(res.status) === 0){
                    message.success(res.msg || '操作成功');
                    this.setState({
                        isEdit: false,
                        loading: false,
                    })
                    //this.getDetail();
                    window.location.reload();
                }else{
                    this.setState({loading: false});
                }
            }
        });
    }

    render(){
        const {
            loading,
            isEdit,
            detailData,
            changeable,
            defaultChangeableProduct,
            addable,
            defaultAddableProduct,
        } = this.state;
        const { getFieldDecorator, getFieldsError, setFieldsValue } = this.props.form;

        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
                xs: { span: 24 },
            },
        }
        const formItemHiddenLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
                xs: { span: 0 },
            },
        }
        return <Spin
            spinning={loading}
        >
        <Form
            onSubmit={this.submit}
            className="sign-product-detail"
        >
            <PartTitle
                title='产品情况'
                buttons={urlId && detailData && detailData.button.updateProductButton ? [<Button type="primary" onClick={this.editHandle} disabled={isEdit}>编辑</Button>] : ''}
            />
            {isEdit ? <div className="reason-bg-wrap">
                <i className="org-icon"></i>
                <p className="tips">签单产品编辑后，之后新增（或修改）的合同将根据新的产品规则，已签的合同不随之改变；</p>
            </div> : ''}
            <TableUi 
                dataSource={[
                    {
                        label: '产品名称',
                        required: true,
                        value: !isEdit ? detailData && detailData.name : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            normalize: (value) => {
                                return value && value.trim();
                            },
                            rules: [{
                                validator:(rule, value, callback) =>{
                                    if(!value || value == ''){
                                        callback(`请填写产品名称`);
                                    }else if(value.length < 2 || value.length > 50){
                                        callback(`产品名称长度请控制在2-50个字`);
                                    }else{
                                        const {
                                            oldNameVal
                                        } = this.state;
                                        if(oldNameVal == value){
                                            callback();
                                        }else{
                                            this.setState({loading: true})
                                            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/ifExist`, {
                                                id: urlId,
                                                name: value
                                            })
                                            .then((res: any) => {
                                                if(res.data === 0){
                                                    this.setState({
                                                        oldNameVal: value,
                                                        loading: false
                                                    })
                                                    callback();
                                                }else{
                                                    this.setState({loading: false})
                                                    callback(res.msg);
                                                }
                                            }, function(error){
                                                this.setState({loading: false})
                                                callback(new Error(error))
                                            });
                                        }
                                    }
                                },
                            }],
                            validateTrigger: 'onBlur',
                            initialValue: detailData && detailData.name,
                        })(
                            <Input placeholder={`请填写产品名称`} />
                        )}
                    </FormItem>
                    },
                    {
                        label: '产品编码',
                        required: true,
                        value: !isEdit ? detailData && detailData.code : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('code', {
                            normalize: (value) => {
                                return value && value.trim();
                            },
                            rules: [{
                                validator:(rule, value, callback) =>{
                                    if(!value || value == ''){
                                        callback(`请填写产品编码`);
                                    }else if(value.length < 1 || value.length > 50){
                                        callback(`产品编码长度请控制在1-50个字且不可含有特殊符号`);
                                    }else{
                                        const {
                                            oldCodeVal
                                        } = this.state;
                                        if(oldCodeVal == value){
                                            callback();
                                        }else{
                                            this.setState({loading: true})
                                            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/ifExist`, {
                                                id: urlId,
                                                code: value
                                            })
                                            .then((res: any) => {
                                                if(res.data === 0){
                                                    this.setState({
                                                        oldCodeVal: value,
                                                        loading: false
                                                    })
                                                    callback();
                                                }else{
                                                    this.setState({loading: false})
                                                    callback(res.msg);
                                                }
                                            }, function(error){
                                                this.setState({loading: false})
                                                callback(new Error(error))
                                            });
                                        }
                                    }
                                },
                            }],
                            validateTrigger: 'onBlur',
                            initialValue: detailData && detailData.code,
                        })(
                            <Input placeholder={`请填写产品编码`} />
                        )}
                    </FormItem>
                    },
                    {
                        label: '签约主体',
                        required: true,
                        isAll: isEdit ? true : false,
                        value: !isEdit ? detailData && detailData.signSubjectName : <div><FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('signSubject', {
                            rules: [{
                                required: true,
                                message: '请选择签约主体'
                            }],
                            initialValue: detailData && detailData.signSubject && detailData.signSubject.split(',') || undefined,
                        })(
                            <CheckboxGroup options={this.state.signSubject} />
                        )}
                    </FormItem>
                    <Button style={{'color': '#337ab7', 'border': '1px solid #337ab7'}} size="small" onClick={this.editSignSubject}><Icon type="edit" />编辑签约主体</Button>
                    </div>
                    },
                    {
                        label: '产品类型',
                        required: true,
                        isAll: isEdit ? true : false,
                        value: !isEdit ? detailData && detailData.typeName : <div><FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true,
                                message: '请选择产品类型'
                            }],
                            initialValue: detailData && detailData.type.toString(),
                        })(
                            <RadioGroup>
                                {this.state.typeTags}
                            </RadioGroup>
                        )}
                    </FormItem>
                    {this.state.typeAdd ?
                    <div>
                        <Input style={{'width': '110px'}} value={this.state.typeAddVal} onChange={this.onChangeTypeAdd} />
                        <Button onClick={this.typeAddHandle} loading={this.state.typeAddLoading} style={{'margin-right': '10px'}} type="primary">确定</Button>
                        <Button onClick={()=> this.setState({typeAdd: false})}>取消</Button>
                    </div>
                    :<Button onClick={()=> this.setState({typeAdd: true})} type="dashed"><Icon type="plus" /></Button>}
                    </div>
                    },
                    {
                        label: '会员费',
                        required: true,
                        value: !isEdit ? detailData && detailData.memberFee + '元' : <div><FormItem
                        {...formItemLayout}
                        style={{'width': '240px', 'float': 'left', 'margin-right': '20px'}}
                    >
                        {getFieldDecorator('memberFee', {
                            rules: [{
                                validator:(rule, value, callback) =>{
                                    if(!/^[0-9]\d*(\.\d+)?$/.test(value)){
                                        callback(`请填写正确的会员费`);
                                    }else{
                                        callback();
                                    }
                                },
                            }],
                            initialValue: detailData && detailData.memberFee,
                        })(
                            <Input addonAfter={'元'} placeholder={`请填写会员费`} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        style={{'float': 'left'}}
                    >
                        {getFieldDecorator('applySpecialPrice', {
                            initialValue: detailData && detailData.applySpecialPrice,
                        })(
                            <Checkbox>可否申请特价</Checkbox>
                        )}
                    </FormItem></div>
                    },
                    {
                        label: '有效期',
                        required: true,
                        value: !isEdit ? detailData && detailData.validityPeriod + '月' : <div className="month-item"><FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('validityPeriod', {
                            rules: [{
                                validator:(rule, value, callback) =>{
                                    if(!value || value == ''){
                                        callback(`请填写有效期`);
                                    }else{
                                        callback();
                                    }
                                },
                            }],
                            initialValue: detailData && detailData.validityPeriod,
                        })(
                            <InputNumber style={{'width': '200px'}} min={1} max={240} precision={0} placeholder={`请填写有效期`} />
                        )}
                    </FormItem>
                    <span className="ant-input-group-addon">月</span>
                    </div>
                    },
                    {
                        label: '对应合同起始日期',
                        required: true,
                        value: !isEdit ? detailData && detailData.startDateTypeName : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('startDateType', {
                            rules: [{
                                required: true,
                                message: '请选择对应合同起始日期'
                            }],
                            initialValue: detailData && detailData.startDateType.toString(),
                        })(
                            <Select placeholder="请选择">
                                {this.state.startDateType}
                            </Select>
                        )}
                    </FormItem>
                    },
                    {
                        label: '冲突产品',
                        required: false,
                        value: !isEdit ? detailData && detailData.conflictProductName : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('conflictProduct', {
                            rules: [{
                                required: false,
                                message: '请选择冲突产品'
                            }],
                            initialValue: detailData && detailData.conflictProductName ? detailData.conflictProductName.split(';') : undefined
                        })(
                            <Select onChange={(e, item) => {this.handleConflictChange(e, item)}} mode="multiple" placeholder="请选择">
                                {this.state.productList}
                            </Select>
                        )}
                    </FormItem>
                    },
                    {
                        label: '是否可改签',
                        required: true,
                        value: !isEdit ? detailData && (detailData.changeable ? '是' : '否') : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('changeable', {
                            rules: [{
                                required: true,
                                message: '请选择是否可改签',
                                validator: (rules, value, callback) => {
                                    if(Number(value) === 0){
                                        setFieldsValue({changeableProduct: undefined, changeableVal: undefined});
                                        this.setState({changeableVal: ''});
                                    }
                                    callback();
                                }
                            }],
                            initialValue: detailData && detailData.changeable,
                        })(
                            <RadioGroup onChange={this.changeableHandle}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    },
                    {
                        label: changeable ? '可改签成的产品' : '',
                        required: changeable ? true : false,
                        value: !changeable ? '' : !isEdit ? detailData && detailData.changeableProductName : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('changeableProduct', {
                            rules: [{
                                required: true,
                                message: '请选择可改签成的产品'
                            }],
                            initialValue: defaultChangeableProduct
                        })(
                            <Select onChange={(e, item) => {this.handleChangeableChange(e, item)}} mode="multiple" placeholder="请选择">
                                {this.state.productList}
                            </Select>
                        )}
                    </FormItem>
                    },
                    {
                        label: '是否可加签',
                        required: true,
                        value: !isEdit ? detailData && (detailData.addable ? '是' : '否') : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('addable', {
                            rules: [{
                                required: true,
                                message: '请选择是否可加签',
                                validator: (rules, value, callback) => {
                                    if(Number(value) === 0){
                                        setFieldsValue({addableProduct: undefined, addableVal: undefined});
                                        this.setState({addableVal: ''});
                                    }
                                    callback();
                                }
                            }],
                            initialValue: detailData && detailData.addable,
                        })(
                            <RadioGroup onChange={this.addableHandle}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    },
                    {
                        label: addable ? '加签产品' : '',
                        required: addable ? true : false,
                        value: !addable ? '' : !isEdit ? detailData && detailData.addableProductName : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('addableProduct', {
                            rules: [{
                                required: true,
                                message: '请选择加签产品'
                            }],
                            initialValue: defaultAddableProduct
                        })(
                            <Select onChange={(e, item) => {this.handleAddableChange(e, item)}} mode="multiple" placeholder="请选择">
                                {this.state.productList}
                            </Select>
                        )}
                    </FormItem>
                    },
                    {
                        label: '是否可签关联合同',
                        required: true,
                        value: !isEdit ? detailData && (detailData.signableAssociatedContract ? '是' : '否') : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('signableAssociatedContract', {
                            rules: [{
                                required: true,
                                message: '请选择是否可签关联合同'
                            }],
                            initialValue: detailData && detailData.signableAssociatedContract,
                        })(
                            <RadioGroup>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    },
                    {
                        label: '是否可以被关联',
                        required: true,
                        value: !isEdit ? detailData && (detailData.associateStatus ? '是' : '否') : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('associateStatus', {
                            rules: [{
                                required: true,
                                message: '请选择是否可以被关联'
                            }],
                            initialValue: detailData && detailData.associateStatus,
                        })(
                            <RadioGroup>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    },
                    {
                        label: '是否可重复签约',
                        required: true,
                        isAll: true,
                        value: !isEdit ? detailData && (detailData.repeatStatus ? '是' : '否') : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('repeatStatus', {
                            rules: [{
                                required: true,
                                message: '请选择是否可重复签约'
                            }],
                            initialValue: detailData ? detailData.repeatStatus : 0,
                        })(
                            <RadioGroup>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    },
                    {
                        label: '收费标准',
                        required: false,
                        isAll: true,
                        value: !isEdit ? detailData && <div style={{'width': '100%', 'word-break': 'break-all'}}>{detailData.feeStandard}</div> : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('feeStandard', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: false,
                                validator:(rule, value, callback) =>{
                                    if(value && value.length > 500){
                                        callback(`收费标准不可超过500个字`);
                                    }else{
                                        callback();
                                    }
                                },
                            }],
                            initialValue: detailData && detailData.feeStandard,
                        })(
                            <Input maxLength={501} placeholder={`请填写收费标准`} />
                        )}
                    </FormItem>
                    },
                    {
                        label: '备注',
                        required: false,
                        isAll: true,
                        value: !isEdit ? detailData && <div style={{'width': '100%', 'word-break': 'break-all'}}>{detailData.remark}</div> : <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('remark', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                validator:(rule, value, callback) =>{
                                    if(value && value.length > 500){
                                        callback(`备注请控制在500个字之内`);
                                    }else{
                                        callback();
                                    }
                                },
                            }],
                            initialValue: detailData && detailData.remark,
                        })(
                            <TextArea maxLength={501} placeholder={`请填写备注`} />
                        )}
                    </FormItem>
                    },
                ]}
            />
            {!urlId ? <div><FormItem
                {...formItemHiddenLayout}
            >
                {getFieldDecorator('conflictVal', {})(
                    <Input />
                )}
            </FormItem>
            <FormItem
                {...formItemHiddenLayout}
            >
                {getFieldDecorator('changeableVal', {})(
                    <Input />
                )}
            </FormItem>
            <FormItem
                {...formItemHiddenLayout}
            >
                {getFieldDecorator('addableVal', {})(
                    <Input />
                )}
            </FormItem></div> : ''}
            {isEdit && urlId ?
            <div className='text-center' style={{marginTop: 20}}>
                <Button htmlType='submit' disabled={hasErrors(getFieldsError()) || loading} type='primary' style={{marginRight:20}}>保存</Button>
                <Button onClick={this.cancelSave}>取消</Button>
            </div>
            :
            ''
            }
        </Form>
        <Modal
            key={this.state.signSubjectNumber}
            visible={this.state.signSubjectVisible}
            width={680}
            footer={null}
            title={'编辑签约主体'}
            onCancel={this.closeMoadl}
        >
            <EditSignSubject />
        </Modal>
        </Spin>
    }
}

export default Form.create()(Signproduct);