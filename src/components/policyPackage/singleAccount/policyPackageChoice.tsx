import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Alert, Form, Icon, Input, Button,DatePicker,Select,Mention,message  } from 'antd';
import SelectCity from '../../select-city/index';
import {
    PAGINATION_PARAMS,
    DOMAIN_OXT,
    ROUTER_PATH,
} from '../../../global/global';
import moment from 'moment';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import './policyPackageChoice.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { toString, toContentState } = Mention;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface PolicyPackageChoiceProps extends  FormComponentProps {
    role?:number;
    edit:boolean;
    data:any[];
    selectCityChange?:(any)=>void;
    activeTimeChange?:(any)=>void;
    activeTime?: string;
    callback?:any;
    headState?:any;
    fetching?:boolean;
    rejectReason?:string;
}
interface policyPackageChoiceState {
    policyPackage?:{
        selectVal: number[]; 
        selectName: string[];
        
    };
    rejectReason?:string;
    activeTimeList?: any[];
    activeTime?: string;

    
}

class PolicyPackageChoice extends Component<PolicyPackageChoiceProps,policyPackageChoiceState> {
    constructor(props: PolicyPackageChoiceProps) {
        super(props);
        const {
            headState = {} as any
        } = props;
        const {
            policyPackage,
            activeTime,
            activeTimeList,
            rejectReason
        } = headState;
        this.state = {
            policyPackage,
            activeTime,
            rejectReason,
            activeTimeList:props.data||[]
            
        };
    }


    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields(()=>{});
    }
    componentWillUnmount() {
        this.setState({
            activeTime:'',
            rejectReason: ''
        })
    }
    componentWillReceiveProps(nextProps){
        const {
            headState
        } = nextProps;
        if(headState){
            const {
                policyPackage,
                activeTime,
                activeTimeList,
                rejectReason
            } = headState;
            this.setState({policyPackage,activeTime,rejectReason})
           
            console.log(1)
            // this.handleSetSelectCity(policyPackage)
        }
    }
    /**
     * 点击进入
     */
    handleSubmit = (e) => {
        e.preventDefault();
        
        const {
            callback
        } = this.props;
        // 验证form
        this.props.form.validateFields((err, values) => {

            const {
                policyPackage,
                activeTime
            } = values;
            // 防止首次加载没有form 验证 
            // if(!activeTime || !policyPackage || policyPackage.selectVal.length!=3){
            //     message.error('请先完善信息');
            // }
            if (!err) {
                // 父组件回调
                callback && callback(2);
            }
        });
    }

    getStateData  = () =>{
        return this.state;
    }
    handleSetSelectCity = (policyPackage) => {
        this.props.form.setFieldsValue(policyPackage)
    }
    /**
     * selectCityParams
     * @param param {Object} 参数
     */
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        const {
            selectCityChange
        } = this.props;
        // this.handleSetSelectCity({selectVal,selectName})
        // this.form.setFieldsValue({'policyPackage',{selectVal,selectName}})
        return {
            // deepMap: [{name: '省',value: selectVal.length?'省':''},{name: '市',value: '市'},{name: '区',value: '区'}],
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择政策包',
            addressApi:`${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/getcities`,
            transform:true,
            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange:(selectVal, selectName, code)=>{
                const params = {
                    selectVal, 
                    selectName,
                   
                }
                this.setState({policyPackage:params})
                selectCityChange && selectCityChange(params)

            }

            
        }
    }
    /**
     * 城市验证方法
     * @param rule 
     * @param value 
     * @param callback 
     */
    validatorSelectCity = (rule, value, callback) => {
        if(value === undefined) {
            return callback('请选择政策包');
            // return callback();
        }
        const {
            selectVal,
        } = value;
        if(selectVal && (selectVal.length === 3 || selectVal.length === 0)) {
            return callback();
        }
        callback('请选择政策包');
    }
    checkActiveTime = (rule, value, callback) => {
        if(value === undefined) {
            return callback('请选择生效时间');
            // return callback();
        }
        const activeTime = value.ContentState || value;
        if(activeTime === undefined) {
            return callback('请选择生效时间');
        }
        var year = activeTime.slice(0, 4),
            month = activeTime.slice(4, 6),
            day = activeTime.slice(6, 8);
        var date = year + '-' + month + '-' + day;
        if (activeTime.length != 8 || year == '' || month == '' || day == '' || new Date(date).toString() == 'Invalid Date') {
            callback('生效时间格式无效，格式为YYYYMMDD,例如20180115');
        }else{
            this.props.activeTimeChange && this.props.activeTimeChange(activeTime)
            return callback();
        }
        callback('请选择生效时间');
        
    }

    render() {
        const {setFieldsValue, getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        
        
        /**
         * selectCityParams
         * @param param {Object} 参数
         */
        const {
            edit,
            role,
            data,
            
            fetching,
            
        } = this.props;
        const {
            policyPackage,
            activeTimeList,
            activeTime,
            rejectReason,
        } = this.state;
        function onChange(contentState) {
            console.log(toString(contentState));
        }
  
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
          };
        const formItemLayout = {
            labelCol: {
              xs: { span: 12 },
              sm: { span: 2 },
            }
        };
        const FormHead = (
            <div>
            
            <Form layout="inline" onSubmit={this.handleSubmit}>
            
            <FormItem
                
                label="政策包">
                {
                    role ===1?getFieldDecorator('policyPackage', {
                    initialValue: policyPackage,
                    rules: [
                        {
                            validator: this.validatorSelectCity
                        }
                    ]
                })(
                    <SelectCity params={this.selectCityParams(policyPackage)} > </SelectCity>
                    )
                    :(<h3>
                            {
                                !policyPackage  ?
                                    '/' :
                                    `${policyPackage && policyPackage.selectName.join('-')}`
                            }
                        </h3>)
                    }
            </FormItem>
            
            <FormItem>
                { 
                    role===1 ? getFieldDecorator('activeTime', {
                    initialValue:activeTime,
                    rules: [
                        {
                            required: true,
                            validator: this.checkActiveTime
                        }
                    ],
                })(
                    
                    <Select 
                        showSearch
                        placeholder="生效时间(格式为YYYYMMDD,例如20180115)"
                        defaultValue={activeTime}
                        mode="combobox"
                        className="select-activtime"
                        style={{ width: 330 }} >
                        
                        {
                            data&&data.map(item=>{
                                if(item.vetted === 0){
                                    return (<Option value={item.name} data-id={item.id} disabled >{item.name}<span className="wait-audit">待审核</span> </Option>)
                                }else{
                                    return (<Option value={item.name} data-id={item.id}>{item.name}</Option>)
                                }
                            }
                                
                                
                            )
                        }
                        
                        
                    
                    </Select>
                    
                    )
                    :<h3><div className="ant-form-item-label"><label>生效时间</label></div>{activeTime|| '/'}</h3>
                }
            </FormItem>
            
            {
                role===1 && <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                        loading={fetching}
                    >
                        进入
                    </Button>
                </FormItem>
                
            }
           
               
           
            
        </Form>
        {
                ((role ===1||role ===3 || role ===4 )&&rejectReason ) && <Form className="reject-reason-form"><FormItem ><Alert message={`驳回原因：${rejectReason}`} type="error"></Alert></FormItem></Form>
            }  </div>)
        // 角色控制 1：录入， 2： 审核， 3： 编辑， 4：查看 5：客户录入 6：客户查看
        return (
                <div>
                <Alert message={FormHead} type="success"  className={'single-account-head-form'}>
                    </Alert>
                
                
            </div>)
        
            
        
    }
}

export default Form.create()(PolicyPackageChoice);

// export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PolicyPackageChoice));

