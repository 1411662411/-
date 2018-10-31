/**
 * Created by yangws on 2018/6/22.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
interface TOwnProps  {
    id?: number;
    dataSource: any;
    callback?: any;
}


interface blacklistEditFromProps extends TOwnProps, FormComponentProps {
    
}
class BlacklistEditFrom extends React.Component<blacklistEditFromProps, any> {
    constructor(props: blacklistEditFromProps) {
        super(props);
       
        this.state = {

            dataSource: props.id ? props.dataSource : {
                isSocial:"否"
            }
        }
    }
    componentWillUnmount() {
        this.setState({dataSource:{isSocial:"否"}})
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
    handleReset = () => {
        this.props.form.resetFields();
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
            id,
            name,
            certificateNumber,
            isSocial,
            cityName,
            socialPlatform,
            riskDescription,
            dealMethod,
            informationAchieve,
            dataSource,
        } = this.state.dataSource;
        return (<Form onSubmit={this.handleSubmit}>
            {id && getFieldDecorator('id', { initialValue: id})}
            <FormItem
                {...formItemLayout}
                label="姓名"
                >
                {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [{
                    max: 20, message: '姓名字数控制在20个字内',
                    }, {
                    required: true, message: '请填写姓名',
                    }],
                })(
                    <Input placeholder="请填写姓名"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="身份证号"
                >
                {getFieldDecorator('certificateNumber', {
                    initialValue: certificateNumber,
                    rules: [{
                    len: 18, message: '请输入正确的身份证号',
                    }, {
                    required: true, message: '请填写身份证号',
                    }],
                })(
                    <Input placeholder="请填写身份证号"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="是否已参保"
                >
                {getFieldDecorator('isSocial', {
                    initialValue: isSocial,
                    rules: [{
                    required: true, message: '请选择是否已参保',
                    }],
                })(
                    <RadioGroup onChange={(e)=>{this.handleIsSocialChange(e)}}>
                        <Radio value="是">是</Radio>
                        <Radio value="否">否</Radio>
                    </RadioGroup>
                )}
            </FormItem>
            {( !isSocial || isSocial ==="是") && <FormItem
                {...formItemLayout}
                label="参保城市"
                >
                {getFieldDecorator('cityName', {
                    initialValue: cityName,
                    rules: [{
                        max: 20, message: '字数控制在20个字',
                        },{
                        required: true, message: '请填写参保城市',
                    }],
                })(
                    <Input placeholder="若已参保，须填写参保城市"/>
                )}
            </FormItem>}
            {(!isSocial || isSocial ==="是") && <FormItem
                {...formItemLayout}
                label="参保平台"
                >
                {getFieldDecorator('socialPlatform', {
                    initialValue: socialPlatform,
                    rules: [{
                        max: 50, message: '字数控制在50个字',
                        },{
                        required: true, message: '请填写参保平台',

                    }],
                })(
                    <Input placeholder="若已参保，须填写参保平台"/>
                )}
            </FormItem>}
            <FormItem
                {...formItemLayout}
                label="风险说明"
                >
                {getFieldDecorator('riskDescription', {
                    initialValue: riskDescription,
                    rules: [{
                        max: 300, message: '风险说明字数控制在300个字内',
                        },{
                        required: true, message: '请填写风险说明',

                    }],
                })(
                    <TextArea placeholder="简单说明，300个字以内" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="处理方式"
                >
                {getFieldDecorator('dealMethod', {
                    initialValue: dealMethod,
                    rules: [{
                        max: 300, message: '处理方式字数控制在300个字内',
                        },{
                        required: true, message: '请填写处理方式',

                    }],
                })(
                    <TextArea placeholder="简单说明，300个字以内" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="信息获取"
                >
                {getFieldDecorator('informationAchieve', {
                    initialValue: informationAchieve,
                    rules: [{
                        max: 50, message: '信息获取字数控制在50个字内',
                        },{
                        required: true, message: '请填写信息获取',

                    }],
                })(
                    <Input placeholder="请填写信息获取"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="数据来源"
                >
                {getFieldDecorator('dataSource', {
                    initialValue: dataSource,
                    rules: [{
                        max: 50, message: '数据来源字数控制在50个字内',
                        },{
                        required: true, message: '请填写数据来源',

                    }],
                })(
                    <Input placeholder="请填写数据来源"/>
                )}
            </FormItem>
        </Form>)
    }
}
export default Form.create()(BlacklistEditFrom);