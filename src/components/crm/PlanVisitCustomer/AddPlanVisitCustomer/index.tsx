import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Spin, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';

const FormItem = Form.Item;

import {hasErrors} from '../../../../util/crmUtil'
import { DOMAIN_OXT } from '../../../../global/global';
import { fetchFn } from '../../../../util/fetch';

const GET_CUSTOMER_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/unsignedCustomerListOfOneself`; //新增待办事项获取客户接口
const USER_TODO_ADD_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/addNextFollowUp`; //新增待办事项
const USER_TODO_UPDATE_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/editNextFollowUp`; //编辑待办事项
const addNextFollowUp = (data) => fetchFn(USER_TODO_ADD_API, data).then(data => data)
const editNextFollowUp = (data) => fetchFn(USER_TODO_UPDATE_API, data).then(data => data)
const getCustomerList = () => fetchFn(GET_CUSTOMER_LIST_API, {}).then(data => data)

interface AddPlanVisitCustomerProps extends FormComponentProps{
    date: moment.Moment;
    onOk: Function;
    onCannel: Function;
    customerId?: number;
    nextFollowUpTime?: number | null;
    nextFollowUpContent?: string;
}

class AddPlanVisitCustomerFrom extends React.Component<AddPlanVisitCustomerProps,any>{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            customerList: [] as any,
            options: [] as any,
        }
        this.getCustomerList();
    }

    async getCustomerList(){
        this.setState({loading: true});
        let res = await getCustomerList();
        if(res.status === 0){
            if(res.data === null){
                this.setState({customerList: [], options:[], loading: false});
            }else{
                let options = res.data.map(item => <Select.Option value={`${item.id}-${item.nextFollowUpTime === null ? 0 : item.nextFollowUpTime}`}>{item.cName}</Select.Option>)
                this.setState({customerList: res.data, options, loading: false});
            }
        }
    }
    submit = () => {
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                this.setState({loading: true});
                let followUpTime = this.props.date.format('YYYY-MM-DD');
                let {customerId} = values;
                let arr = customerId.split('-');
                customerId = Number(arr[0]);
                let nextFollowUpTime = Number(arr[1]);
                let res:any;
                if(nextFollowUpTime > 0){
                    res = await editNextFollowUp({
                        ...values,
                        customerId,
                        followUpTime,
                        followUpResult: values.followUpResult ? values.followUpResult.trim() : '',  
                    })
                }else{
                    res = await addNextFollowUp({
                        ...values,
                        customerId,
                        followUpTime,
                        followUpResult: values.followUpResult ? values.followUpResult.trim() : '',  
                    })
                }
                if(res.status === 0){
                    this.setState({loading: false});
                    this.props.onOk()
                }
            }
        })
    }

    render(){
        const { loading, customerList, options } = this.state;
        const {customerId, nextFollowUpTime, nextFollowUpContent} =this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout={
            labelCol: {
                xs: {span:6},
            },
            wrapperCol: {
            xs: { span: 18 },
            },
        }
        let customerIdInitialValue:string|null = null;
        if(customerId){
            customerIdInitialValue = `${customerId}-${nextFollowUpTime === null ? 0 : nextFollowUpTime}`;
        }
        // const options = customerList.map(item => <Select.Option value={`${item.id}-${item.nextFollowUpTime === null ? 0 : item.nextFollowUpTime}`}>{item.cName}</Select.Option>)
        return <div><Spin spinning={loading}><Form>
            <FormItem
                {...formItemLayout}
                label='跟进客户'
            >
                {getFieldDecorator('customerId', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(!value || value == ''){
                                callback(`请选择跟进客户`);
                            }else{
                                callback();
                            }
                        },
                        required: true,
                    }],
                    validateFirst: true,
                    initialValue: customerIdInitialValue ? customerIdInitialValue : undefined,
                })(
                    <Select
                        disabled = {customerIdInitialValue !== null}
                        placeholder={'请选择跟进客户'}
                        showSearch
                        filterOption={(input, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >{options}</Select>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='跟进内容'
            >
                {getFieldDecorator('followUpResult', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(value && value.trim() && value.trim().length > 300){ 
                                callback('跟进内容请控制在300个字之内');
                            }else{
                                callback();
                            }
                        },
                    }],
                    validateFirst: true,
                    initialValue: nextFollowUpContent ? nextFollowUpContent : undefined,
                })(
                    <Input.TextArea 
                        rows={6}
                        placeholder={'请填写跟进内容'}
                    />
                )}
            </FormItem>

            <div className='text-center'>
                <Button disabled={!loading && hasErrors(getFieldsError())} onClick={this.submit} style={{margin:'0 5px'}} type='primary'>保存</Button>
                <Button onClick={()=>{this.props.onCannel()}} style={{margin:'0 5px'}}>取消</Button>
            </div>
        </Form></Spin></div>
    }
}

const AddPlanVisitCustomer = Form.create()(AddPlanVisitCustomerFrom);

const mapStateToProps = (state,ownProps) => ({
    // userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
})

export default connect(mapStateToProps)(AddPlanVisitCustomer);