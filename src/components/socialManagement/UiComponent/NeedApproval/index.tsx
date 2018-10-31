import React from 'react';
import {Form, Input, DatePicker, Button, Select, InputNumber, Table} from 'antd';
import {Organizations} from '../../../../components/common/organizationsUi';
import { FormComponentProps } from 'antd/lib/form';

import WhiteSpace from '../../../common/WhiteSpace'

const FormItem = Form.Item;

interface NeedApprovalProps{
    type: 1 | 2 | 3 ; //1CEO,  2财务  3业务
}
class NeedApproval extends React.Component<NeedApprovalProps,any>{
    constructor(props) {
        super(props);
        
    }

    renderCEO(){
        return <div>
            {/* <CEOSearch /> */}
            <WhiteSpace />
            <Table 
                columns={this.columns}
                dataSource={[{}]}
            />
        </div>
    }

    renderFinance(){
        return <div>
            {/* <FinanceSearch /> */}
            <WhiteSpace />
            <Table 
                columns={this.columns}
                dataSource={[{}]}
            />
        </div>
    }

    renderBusiness(){
        return <div>
            {/* <BusinessSearch /> */}
            <WhiteSpace />
            <Table 
                columns={this.columns}
                dataSource={[{}]}
            />
        </div>
    }
    render(){
        const {type} = this.props;
        return type === 1 ? this.renderCEO() : type === 2 ? this.renderFinance() : type === 3 ? this.renderBusiness() : null;
    }

    columns:any = [
        {
            title: '请款单号',
            dataIndex: '请款单号',
            width: 120,
            render:() => {
                return '/'
            }
        },
        {
            title: '请款平台',
            dataIndex: '请款平台',
            render:() => {
                return '/'
            }
        },
        {
            title: '创建时间',
            dataIndex: '创建时间',
            render:() => {
                return '/'
            }
        },
        {
            title: '收款方类型',
            dataIndex: '收款方类型',
            render:() => {
                return '/'
            }
        },
        {
            title: '收款方名称',
            dataIndex: '收款方名称',
            render:() => {
                return '/'
            }
        },
        {
            title: '请款单类型',
            dataIndex: '请款单类型',
            render:() => {
                return '/'
            }
        },
        {
            title: '请款总金额',
            dataIndex: '请款总金额',
            render:() => {
                return '/'
            }
        },
        {
            title: '已支付金额',
            dataIndex: '已支付金额',
            render:() => {
                return '/'
            }
        },
        {
            title: '未支付金额',
            dataIndex: '未支付金额',
            render:() => {
                return '/'
            }
        },
        {
            title: '社保缴费月（操作月）',
            dataIndex: '社保缴费月（操作月）',
            render:() => {
                return '/'
            }
        },
        {
            title: '审批经手人',
            dataIndex: '审批经手人',
            render:() => {
                return '/'
            }
        },
        {
            title: '审批状态',
            dataIndex: '审批状态',
            render:() => {
                return '/'
            }
        },
        {
            title: '支付状态',
            dataIndex: '支付状态',
            render:() => {
                return '/'
            }
        },
        {
            title: '业务方计划支付时间倒计时',
            dataIndex: '业务方计划支付时间倒计时',
            render:() => {
                return '/'
            }
        },
        {
            title: '业务方计划支付时间',
            dataIndex: '业务方计划支付时间',
            render:() => {
                return '/'
            }
        },
        {
            title: '请款提交人',
            dataIndex: '请款提交人',
            render:() => {
                return '/'
            }
        },
        {
            title: '导出状态',
            dataIndex: '导出状态',
            render:() => {
                return '/'
            }
        },
        {
            title: '业务方计划支付时间倒计时',
            dataIndex: '业务方计划支付时间倒计时',
            render:() => {
                return '/'
            }
        },
        {
            title: '社保业务请款性质',
            dataIndex: '社保业务请款性质',
            render:() => {
                return '/'
            }
        },
        {
            title: '代发代付金额',
            dataIndex: '代发代付金额',
            render:() => {
                return '/'
            }
        },
        {
            title: '人月次',
            dataIndex: '人月次',
            render:() => {
                return '/'
            }
        },
        {
            title: '服务费',
            dataIndex: '服务费',
            render:() => {
                return '/'
            }
        },
        {
            title: '人均服务费（服务费/人月次）',
            dataIndex: '人均服务费（服务费/人月次）',
            render:() => {
                return '/'
            }
        },
        {
            title: '垫付金额',
            dataIndex: '垫付金额',
            render:() => {
                return '/'
            }
        },
        {
            title: '财务计划支付时间倒计时',
            dataIndex: '财务计划支付时间倒计时',
            render:() => {
                return '/'
            }
        },
        {
            title: '财务计划支付时间',
            dataIndex: '财务计划支付时间',
            render:() => {
                return '/'
            }
        },
        {
            title: '付款时间',
            dataIndex: '付款时间',
            render:() => {
                return '/'
            }
        },
        {
            title: '操作',
            dataIndex: '操作',
            render:() => {
                return <a>审批</a>
            }
        },
    ]
}

export default NeedApproval;

interface FinanceProps extends FormComponentProps{
    dataSource: any;
    onSearch: (values) => void;
    onReset?: () => void;
}
class FinanceSearchForm extends React.Component<FinanceProps, any>{
    constructor(props:FinanceProps){
        super(props);
        this.state={
            key: 0,
        }
    }


    reset = () => {
        this.setState({
            key: this.state.key + 1,
        }, () => {
            this.props.form.resetFields();
            this.props.onReset && this.props.onReset();
        })
    }

    search = () => {
        const values = this.props.form.getFieldsValue();
        this.props.onSearch(values);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return <Form layout="inline" className="search-form">
        <FormItem style={{ marginBottom: 8 }} label="请款单号： ">
            {getFieldDecorator(`code`, {})(
                <Input style={{width: 100}} placeholder="" />
            )}
        </FormItem>
        <FormItem style={{ marginBottom: 8 }} label="业务方计划付款时间倒计时： ">
            {getFieldDecorator(`businessPlanPayDay`, {
                rules: [{
                    validator: (rule, value, callback) =>{
                        let reg = /^(-|\+)?\d+$/;
                        let newParam ={}
                        for(var key in value){
                            let param = value[key];
                            if (reg.test(param)||param=="") {
                                newParam[key] = param;
                            }
                        }
                        const val = (Object as any).values(newParam).join('');
                        // console.log(val);
                        this.props.form.setFieldsValue({'businessPlanPayDay': val})
                        callback();
                    }
                }],
                })(
                <Input
                    prefix="≤"
                    addonAfter="天"
                    placeholder=""
                    style={{ width: 180 }}
                />
            )}
            
        </FormItem>
        <FormItem style={{ marginBottom: 8 }} label="导出状态：">
            {getFieldDecorator(`exportStatus`)(
                <Select 
                    style={{ width: 100 }}
                >
                    <option value=''>全部</option>
                    <option value='1'>已导出</option>
                    <option value='0'>未导出</option>
                    
                </Select>
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="社保业务请款性质：">
            {getFieldDecorator(`socialRequestType`)(
                <Select
                    style={{ width: 100 }}
                    >
                    <option value=''>全部</option>
                    <option value='1'>实付请款</option>
                    <option value='2'>预付请款</option>
                    
                </Select>
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="收款方类型：" >
            {getFieldDecorator(`receiverType`)(
                <Select
                    style={{ width: 100 }}
                    >
                    <option value=''>全部</option>
                    <option value='1'>服务商</option>
                    <option value='2'>分公司</option>
                </Select>
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="收款方名称： ">
            {getFieldDecorator(`searchReceiverName`)(
                <Input 
                
                    style={{ width: 250 }}
                    placeholder=""
                />
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="请款总金额： ">
            {getFieldDecorator(`totalAmount`)(
                <InputNumber 
                    style={{ width: 180 }}
                    placeholder=""
                />
            )}  
            
        </FormItem>
        
        <FormItem key={`请款提交人-${this.state.key}`} style={{ marginBottom: 8 }} label="请款提交人：">
            {getFieldDecorator(`createUserId`)(
                <Organizations 
                    // initValue={cashoutSubmitter}
                    dataSource={this.props.dataSource}
                >
                </Organizations>
            )}  
        </FormItem>

        <FormItem key={`审批经手人-${this.state.key}`} style={{ marginBottom: 8 }} label="审批经手人：">
            {getFieldDecorator(`auditPerson`)(
                <Organizations 
                    // initValue={cashoutSubmitter}
                    dataSource={this.props.dataSource}
                >
                </Organizations>
            )} 
            
        </FormItem>
        
        <Button type="primary" style={{  marginTop: 3 }}  onClick={this.search}>搜索</Button>
        <Button style={{ marginLeft: 8,marginTop:3 }}  onClick={this.reset}>重置</Button>
    </Form>
    }
}

export const FinanceSearch = Form.create()(FinanceSearchForm);

class CEOSearchForm extends React.Component<FinanceProps, any>{
    constructor(props:FinanceProps) {
        super(props);
    }

    reset = () => {
        this.props.form.resetFields();
    }

    search = () => {
        const values = this.props.form.getFieldsValue();
        this.props.onSearch(values);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return <Form layout="inline" className="search-form">
        <FormItem style={{ marginBottom: 8 }} label="财务计划支付时间">
            {getFieldDecorator(`financialPlanPayTime`, {})(
                <DatePicker />
            )}
        </FormItem>
        <FormItem style={{ marginBottom: 8 }} label="业务方计划付款时间倒计时： ">
            {getFieldDecorator(`businessPlanPayDay`, {
                rules: [{
                    validator: (rule, value, callback) =>{
                        let reg = /^(-|\+)?\d+$/;
                        let newParam ={}
                        for(var key in value){
                            let param = value[key];
                            if (reg.test(param)||param=="") {
                                newParam[key] = param;
                            }
                        }
                        const val = (Object as any).values(newParam).join('');
                        // console.log(val);
                        this.props.form.setFieldsValue({'businessPlanPayDay': val})
                        callback();
                    }
                }],
                })(
                <Input
                    prefix="≤"
                    addonAfter="天"
                    placeholder=""
                    style={{ width: 180 }}
                />
            )}
            
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="收款方类型：" >
            {getFieldDecorator(`receiverType`)(
                <Select
                    style={{ width: 100 }}
                    >
                    <option value=''>全部</option>
                    <option value='1'>服务商</option>
                    <option value='2'>分公司</option>
                </Select>
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="收款方名称： ">
            {getFieldDecorator(`searchReceiverName`)(
                <Input 
                    style={{ width: 250 }}
                    placeholder=""
                />
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
            {getFieldDecorator(`auditPerson`)(
                <Organizations 
                    // initValue={cashoutSubmitter}
                    dataSource={this.props.dataSource}
                >
                </Organizations>
            )} 
            
        </FormItem>
        
        <Button type="primary" style={{  marginTop: 3 }}  onClick={this.search}>搜索</Button>
        {/* <Button style={{ marginLeft: 8,marginTop:3 }}  onClick={this.reset}>重置</Button> */}
    </Form>
    }
}

export const CEOSearch = Form.create()(CEOSearchForm);

class BusinessSearchForm extends React.Component<FinanceProps, any>{
    constructor(props:FinanceProps) {
        super(props);
        
    }

    search = () => {
        const values = this.props.form.getFieldsValue();
        this.props.onSearch(values);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return <Form layout="inline" className="search-form">
        <FormItem style={{ marginBottom: 8 }} label="请款提交人：">
            {getFieldDecorator(`createUserId`)(
                <Organizations 
                    // initValue={cashoutSubmitter}
                    dataSource={this.props.dataSource}
                >
                </Organizations>
            )}  
        </FormItem>

        <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
            {getFieldDecorator(`auditPerson`)(
                <Organizations 
                    // initValue={cashoutSubmitter}
                    dataSource={this.props.dataSource}
                >
                </Organizations>
            )} 
            
        </FormItem>
        
        <Button type="primary" style={{  marginTop: 3 }}  onClick={this.search}>搜索</Button>
    </Form>
    }
}

export const BusinessSearch = Form.create()(BusinessSearchForm);

