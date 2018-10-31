import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Form, Input,Radio, Button,message,Tabs,Modal,Tooltip,Icon } from 'antd';
import CustomerOffer from './customerOffer';
import CustomerPrepare from './customerPrepare';
import moment from 'moment';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import './setMaterials.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface SetMaterialsProps extends  FormComponentProps {
    id?:number;
    role?:number;
    edit:boolean;
    isAdmin:boolean;
    //** 社保类型 */
    socialInsurance?:number;
    //**公积金类型 */
    accumulationFund?:number;
    selectDictionaryData: any[];
    updateMaterialsType?:(data:any,key:string)=>void;
    removeMaterialsType?:(id:number,type:number,callback:()=>void)=>void;
    data?: {any};
    callback:any;

}
const socialInsuranceMap = {
    1:'已开户',
    2:'未开户需要开户'
}
const accumulationFundMap = {
    1:'已开户',
    2:'未开户需要开户',
    3:'未开户暂不开户'
}
const materialsMap = {
    'social2_fund2':1,
    'social2_fund1':2,
    'social2_fund3':3,
    'social1_fund3':4,
    'social1_fund2':5,
    'social1_fund1':6,
}
class SetMaterialsForm extends Component<SetMaterialsProps,any> {
    constructor(props: SetMaterialsProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            socialInsurance,
            accumulationFund,
            policyCategory,
            tabActiveKey
        } = data;
        this.state = {
            socialInsurance,
            accumulationFund,
            tabActiveKey,
            policyCategory:policyCategory || [],
            // tabActiveKey:policyCategory[0]?policyCategory[0].key:'',
            prepareFirstEdit:false,
         
        };
    }


    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields(()=>{});
    }
    componentWillUnmount() {
        
        this.setState({policyCategory:[],tabActiveKey:''})
    }
    componentWillReceiveProps(nextProps){
        const {
            data,
            role
        } = nextProps;
        if(data && data.policyCategory){
            
            const {
                socialInsurance,
                accumulationFund,
                policyCategory,
                tabActiveKey
            } = data;
            // if(role === 1 ){
            //     // this.setState({policyCategory})
            // }
            // if(!this.state.tabActiveKey){
            //     this.setState({tabActiveKey})
            // }
            this.setState({policyCategory,socialInsurance,accumulationFund,tabActiveKey})
            
        }
    }
    CustomerOffer:any;
    CustomerPrepare:any;
    setSearchParamState=(params)=>{
        this.setState(params);
    }
    /**
     * 点击生成新类别
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            
            callback
        } = this.props;
        // TODO
        // const data = this.CustomerOffer.handleGetData();
        // console.log(data)
        // 验证form
        this.props.form.validateFields((err, values) => {

            const {
                socialInsurance,
                accumulationFund
            } = values;
            // 防止首次加载没有form 验证 
            if(!socialInsurance || !accumulationFund ){
                message.error('请先选择类型信息');
                return false;
            }

            if (!err) {
                // 父组件回调
                const categoryKey = `social${socialInsurance}_fund${accumulationFund}`;
                
                this.generateCategory(categoryKey);

            }
        });
    }
    // 生成类别
    generateCategory = (key) => {
        const {
            policyCategory
        } = this.state;
        if(Object.prototype.toString.apply(policyCategory) === '[object Array]'){
            // const isIncludes = policyCategory.includes(key);
            // 找出数组中第一个key == key
            const includesData = policyCategory.find(function(value, index, arr) {
                return value.key == key;
            }) 
            if(includesData && includesData.key){
                message.error('该类别已存在无需重复生成');
            }else{
                // 深度拷贝
                const data = policyCategory[0]?JSON.parse(JSON.stringify(policyCategory[0])):{};
                const obj = {
                    key,
                    new:true,
                    // 复制第一条数据
                
                    offerData:(data.offerData?data.offerData:[]),
                    prepareData:(data.prepareData?data.prepareData:[])
                    
                    // data:(policyCategory[0] &&policyCategory[0].data?policyCategory[0].data : {})
                }
                policyCategory.push(obj);
                
                this.setState({policyCategory})
                // 有时需要设置延迟，才能选中tab
                setTimeout(() => {
                    this.handleTabsChange(key)
                }, 10);
                
                
                console.log("tabActiveKey============"+key)
                // this.props.form.setFieldsValue({"policyCategory":policyCategory})
                message.success('类别生成成功');
            }
        }else{
            message.error('生成类别格式不匹配');
            this.setState({policyCategory:[]})
        }
        
    }
    // 跟进key转换标题
    handleTransformTitle = (key,idEdit?) => {
        
        let markClass = 'policy-category-title'
        // 添加标识
        if(idEdit){
            markClass = 'policy-category-title-red'
        }
        const socialInsurance = Number.parseInt(key.substr(6,1));
        const accumulationFund = Number.parseInt(key.substr(12,1));
        if(socialInsurance && accumulationFund){
            return  (<div className={markClass}>社保{socialInsuranceMap[socialInsurance]}<br/>公积金{accumulationFundMap[accumulationFund]}</div>)
        }else {
            return '-/-';
        }
    }
    handleEditTabs = (targetKey, action) => {
        this[action](targetKey);
    }
    handleTabsChange = (activeKey) => {
        
        this.setState({ tabActiveKey: activeKey});
    }
    remove = (targetKey) => {
        const that = this;
        let {
            tabActiveKey,
            policyCategory
        } = that.state;
        
        // policyCategory.targetKey
        const targetData = policyCategory.find(function(obj, index, arr) {
            return obj.key == targetKey;
        })

        // 判断是否有数据 
        if(targetData &&  ((targetData.offerData && targetData.offerData.length>0) || (targetData.prepareData && targetData.prepareData.length>0 ))){
            const isNew = targetData.new?true:false;
            confirm({
                title: '该分类下已添加相关材料，确定是否删除?',
                content: '删除后不可恢复',
                okText:"确认",
                cancelText:"取消",
                onOk() {
                   
                    that.handleRemoveCategory(targetKey,isNew)
                    
                },
                onCancel() {
                    return false;
                },
            });
        }else{
            that.handleRemoveCategory(targetKey)
        }
        
        
    }
    handleRemoveCategory =(targetKey,isNew?)=> {
        const {
            id,
            removeMaterialsType,

        } = this.props;
        /**最初删除类型需要发请求 */
        // if(id && removeMaterialsType && !isNew) {
        //     const type = materialsMap[targetKey];
        //     removeMaterialsType(id,type,()=>{
        //         this.handleRemoveCategoryCallback(targetKey)
        //     })
        // }else{
        //     this.handleRemoveCategoryCallback(targetKey);
        // }
        this.handleRemoveCategoryCallback(targetKey);
    }
    handleRemoveCategoryCallback = (targetKey) =>{
        let {
            tabActiveKey,
            policyCategory
        } = this.state;
        const {
            form,
            updateMaterialsType
        } = this.props;
        let lastIndex;
        policyCategory.forEach((pane, i) => {
            if (pane.key === targetKey) {
            lastIndex = i ;
            }
        });
        policyCategory = policyCategory.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && tabActiveKey === targetKey) {
            lastIndex = lastIndex===0 ?1:lastIndex
            tabActiveKey = policyCategory.length>0?policyCategory[lastIndex-1].key:'';
        }
        this.setState({ policyCategory, tabActiveKey });
        form.setFieldsValue({"policyCategory":policyCategory});
        
        updateMaterialsType && updateMaterialsType(policyCategory,tabActiveKey);
    }
    // 传给子组件回调
    handleCallback = (data,callback?) =>{
        const {
            policyCategory
        } = this.state;
        const isInclude = policyCategory.findIndex(function(obj, index, arr) {
            return obj.key == data.key;
        })
        // 不存在
        if(isInclude === -1){
            console.error('数据不匹配')
        }else{
            // let policyCategoryData = policyCategory[isInclude].data ;
            // 客户需提供
            if(data.type === 1){
                policyCategory[isInclude].offerData = data.data;
            }
            // 客户需准备
            if(data.type === 2){
                policyCategory[isInclude].prepareData = data.data;
                
               
            }
            this.setState({policyCategory});
            // this.props.form.setFieldsValue({"policyCategory":policyCategory})
           
        }
        
        
    }
    render(){

        const formItemLayout = {
            labelCol: {
              xs: { span: 12 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 12 },
              sm: { span: 22 },
            },
        };
        const formTailLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22, offset: 2 },
          };
        const {
            edit,
            isAdmin,
            selectDictionaryData,
            role
        } = this.props;
        const {
            policyCategory,
            socialInsurance,
            accumulationFund,
            tabActiveKey,
            prepareFirstEdit
        } = this.state;
        
        
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        /**遍历对象 */
        const eachObj = (obj)=>{
            const Radios: Array<JSX.Element> = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    Radios.push(<Radio value={Number(key)}>{element}</Radio>)
                }
            }
            return Radios;
        }
        const isNewEdit = (status) => {
            if(status && (status === 'add' || status === 'replace') && (role ===2)){
                return true
            }
            return false
        }
        
        // 1：录入， 2： 审核， 3： 编辑， 4：查看 5：客户录入 6：客户查看
        return ( <div>
                    { (role ===1 || role ===3) &&
                        <Form onSubmit={this.handleSubmit}>
                                
                                <FormItem label="社 保" {...formItemLayout}>

                                    
                                    { 
                                    edit ?getFieldDecorator('socialInsurance', {
                                        initialValue: socialInsurance,
                                        rules: [{
                                            required: true,
                                            message: '请选择社保类型',
                                        }],
                                })(
                                    <RadioGroup  onChange={e => { this.setSearchParamState({ socialInsurance: e.target.value }) }} >
                                        
                                        {eachObj(socialInsuranceMap)}
                        
                                        
                                    </RadioGroup>
                                    
                                    )
                                    :<span>{socialInsurance|| '/'}</span>
                                }
                                </FormItem>
                                <FormItem label="公积金" {...formItemLayout}>
                                { 
                                    edit ?getFieldDecorator('accumulationFund', {
                                        initialValue: accumulationFund,
                                        rules: [{
                                            required: true,
                                            message: '请选择公积金类型',
                                        }],
                                })(
                                    <RadioGroup  onChange={e => { this.setSearchParamState({ accumulationFund: e.target.value }) }} defaultValue={accumulationFund} >
                                        {eachObj(accumulationFundMap)}
                                    </RadioGroup>
                                    
                                    // <DatePicker defaultValue={moment(activeTime, dateFormat)}  format={dateFormat} />
                                    )
                                    :<span>{accumulationFund|| '/'}</span>
                                }
                                    
                                </FormItem>
                                {
                                    edit && <FormItem {...formTailLayout}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={hasErrors(getFieldsError())}
                                        >
                                            生成新类别
                                        </Button>
                                        <Tooltip placement="top" title="默认复制第一条数据">
                                                <Icon type="question-circle-o" style={{marginLeft:10}}/>
                                        </Tooltip>
                                        
                                    </FormItem>
                                }
                                
                        </Form>
                    }
                    {
                    getFieldDecorator('policyCategory', {
                        initialValue: policyCategory})
                    }
                    {getFieldDecorator('tabActiveKey',{ initialValue: tabActiveKey })}
                <Tabs
                    className='policy-category-tabs'
                    onChange={this.handleTabsChange}
                    activeKey={tabActiveKey}
                    type="editable-card"
                    hideAdd={true}
                    onEdit={this.handleEditTabs}
                >
                {policyCategory.map((pane,index) => {
                   
                    return (<TabPane tab={this.handleTransformTitle(pane.key,isNewEdit(pane._op))} key={pane.key} closable={(role ===1 || role ===3)?pane.closable:false}>
                        <CustomerOffer 
                            type = {1}
                            role = {role}
                            edit={edit}
                            isAdmin={isAdmin}
                            identify={pane.key}
                            isNew = {isNewEdit(pane._op)}
                            data={pane.offerData || []}
                            selectDictionaryData = {selectDictionaryData}
                            callback = {this.handleCallback}
                            ref={node => this.CustomerOffer = node}
                        />
                        <CustomerOffer 
                            type = {2}
                            role = {role}
                            edit={edit}
                            isAdmin={isAdmin}
                            identify={pane.key}
                            isNew = {isNewEdit(pane._op)}
                            prepareData={pane.prepareData || []}
                            callback = {this.handleCallback}
                            ref={node => this.CustomerOffer = node}
                        />
                         {/* <CustomerPrepare 
                            role = {role}
                            edit={edit}
                            isAdmin={isAdmin}
                            identify={pane.key}
                            isNew = {isNewEdit(pane._op)}
                            data={pane.prepareData || []}
                            callback = {this.handleCallback}
                            // ref={node => this.CustomerPrepare = node}
                        /> */}

                        
                        
                    </TabPane>)
                })}
            </Tabs>
            </div>
        )
    }
}

export default Form.create()(SetMaterialsForm);