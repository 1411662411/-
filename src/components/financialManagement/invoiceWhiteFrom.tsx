/**
 * Created by yangws on 2018/6/22.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';
import {
    Button,
    Select,
    Input,
    Row,
    Col,
    Radio,
    Form,
    message,
    Modal,
    Spin,
    Icon,
    notification,
} from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;

import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import SelectClient from '../../components/common/selectClient'
interface TOwnProps  {
    id?: number;
    dataSource: any;
    callback?: any;
}


interface invoiceWhiteFromProps extends TOwnProps, FormComponentProps {
    
}
class InvoiceWhiteFrom extends React.Component<invoiceWhiteFromProps, any> {
    lastFetchId:number;
    // fetchCompanyName:(value:any)=>void;
    constructor(props: invoiceWhiteFromProps) {
        super(props);
        this.lastFetchId = 0;
        this.fetchCompanyName = debounce(this.fetchCompanyName, 800);
        this.state = {
            // adviserName:'',
            // filiale:"",
            dataSource: props.id ? props.dataSource : {
                isSocial:""
            },
            fetching: false,
            data: [],
            value: [],
        }
    }
    componentWillUnmount() {
        this.setState({dataSource:{isSocial:""}})
    }
    handleIsSocialChange = (e) => {
        const {
            dataSource
        } = this.state;
        this.setState({dataSource:{...dataSource,isSocial:e.target.value}})
    }
    handleSubmit = () => {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                
                // this.props.orderListSaga({
                //     ...this.setSearchParamState(values),
                    
                // });
            }
        });
        
        
    }
    fetchCompanyName = (value) => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        fetch('https://randomuser.me/api/?results=5')
          .then(response => response.json())
          .then((body) => {
            if (fetchId !== this.lastFetchId) { // for fetch callback order
              return;
            }
            const data = body.results.map(user => ({
              text: `${user.name.first} ${user.name.last}`,
              value: user.login.username,
            }));
            this.setState({ data, fetching: false });
          });
    }
    handleCompayNameChange = (value)=> {
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        this.setState({
            value,
            data: [],
            fetching: false,
        });
        setFieldsValue({name:value})
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleClientChange = (value) => {
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        const {
            dataSource
        } = this.state;
        setFieldsValue({
            cName:value.text,
            cId:value.value
        })
        this.setState({
            dataSource:{...dataSource,adviserName:value.adviserName}
            
           
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 18,
                offset: 6,
              },
            },
        };
        const {
            fetching,
            data,
            value,
            
            
        } = this.state;
        const {
            id,
            adviserName,
            filiale,
            cName,
            cId,
            businessApprover,
            financeApprover,
            remark
            
        } = this.state.dataSource;
        return (<Form onSubmit={this.handleSubmit}>
            {id && getFieldDecorator('id', { initialValue: id})}
            {getFieldDecorator('cId', { initialValue: cId})}
            <FormItem
                {...formItemLayout}
                label="客户名称"
                >
                {getFieldDecorator('cName', {
                    initialValue: cName,
                    rules: [{
                    max: 50, message: '长度控制在50个字内',
                    }, {
                    required: true, message: '请填写客户名称',
                    }],
                })(
                    <SelectClient placeholder="请输入客户名称" callback={this.handleClientChange} defaultValue={{key:cId,label:cName}}></SelectClient>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="业务审批人"
                >
                {getFieldDecorator('businessApprover', {
                    initialValue: businessApprover,
                    rules: [{
                        max: 20, message: '长度控制在20个字内',
                        },{
                    required: true, message: '请填写业务审批人',
                    }],
                })(
                    <Input placeholder="请填写业务审批人"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="财务审批人"
                >
                {getFieldDecorator('financeApprover', {
                    initialValue: financeApprover,
                    rules: [{
                        max: 20, message: '长度控制在20个字内',
                        },{
                        required: true, message: '请填写财务审批人',
                    }],
                })(
                    <Input placeholder="请填写财务审批人"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="前道客服"
                >
                <Input value={adviserName} disabled={true}/>
            </FormItem>
            {/* <FormItem
                {...formItemLayout}
                label="分公司"
                >
                <Input value={filiale} disabled={true}/>
            </FormItem> */}
            <FormItem
                {...formItemLayout}
                label="备注"
                >
                {getFieldDecorator('remark', {
                    initialValue: remark,
                    rules: [{
                        required: true, message: '请填写备注',
                    },{
                        max: 300, message: '备注字数控制在300个字内',
                    }],
                })(
                    <TextArea placeholder="请填写备注" autosize={{ minRows: 2, maxRows: 6 }} />
                   
                )}
            </FormItem>
        </Form>)
    }
}
export default Form.create()(InvoiceWhiteFrom);