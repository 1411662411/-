import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, message, Radio, Tag, Tooltip, Icon } from 'antd';

import moment from 'moment';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import './inputSelectChoice.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface InputSelectChoiceProps extends FormComponentProps {
    role?: string;
    maxLen?: number;
    data?:inputSelectChoiceState;
    callback?: any;
   
}
interface list {
    id: string;
    value: string;
}
interface inputSelectChoiceState {
    id?:number;
    title: string;
    type: 0 | 1 | 2; // 0无 1 输入框 2 选择框
    list: any[];
    isappend?: boolean;
    appendValue?: string;
    index?:number;
}

class InputSelectChoiceForm extends Component<InputSelectChoiceProps, inputSelectChoiceState> {
    constructor(props: InputSelectChoiceProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            id,
            title,
            type,
            isappend,
            list,
            index
        } =  data;
        this.state = {
            id,
            title,
            type:type||1,
            isappend,
            appendValue: '',
            list: list || [],
            index,
        };
    }


    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields(()=>{});
    }
    /**
     * 选项验证方法
     * @param rule 
     * @param value 
     * @param callback 
     */
    validatorOptions = (rule, value, callback) => {
        if(value === undefined) {
            return callback('请设置可选项');
            // return callback();
        }
        
        if(value){
            return callback();
        }
        
        callback('请设置可选项');
    }
    validatorType = (rule, value, callback) => {
        if(value === undefined) {
            return callback('请选择字段类型');
            // return callback();
        }
        
        if(value){
            return callback();
        }
        
        callback('请选择字段类型');
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
                callback && callback(2);
            }
        });
    }

    getStateData = () => {
        return this.state;
    }
    handleSetState = (obj) => {
        
        this.setState(obj);
        // if(obj.type && obj.type === 2){
        //     const { form } = this.props;
        //     form.setFieldsValue({
        //         keys: nextKeys,
        //     });
        // }
    }
    handleClose = (removedTag) => {
        const list = this.state.list.filter(tag => tag !== removedTag);
        console.log(list);
        this.setState({ list: list });
    }
    showInput = () => {
        this.setState({ isappend: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ appendValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const appendValue = state.appendValue;
        let list = state.list;
        if (appendValue && list.indexOf(appendValue) === -1) {
            list = [...list, appendValue];
        }
        console.log(list);
        this.setState({
            list,
            isappend: false,
            appendValue: '',
        });
        // 单独设置list value
        this.props.form.setFieldsValue({list});
        
    }
    input: any;
    saveInputRef = input => this.input = input

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;



        let {
            role,
            maxLen
        } = this.props;
        maxLen = maxLen || 50;
        const {

            title,
            type,
            list,
            isappend,
            appendValue,
            id,
            index
        } = this.state;


        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="input-select-choice">
                <FormItem label="字段名称" {...formItemLayout}>
                    {
                        getFieldDecorator('title', {
                            initialValue: title,
                            rules: [
                                { whitespace: true,message: '请填写字段名称'},
                                { required: true, message: '请填写字段名称' },
                                {
                                    max: maxLen,
                                    message:`请控制在${maxLen}个字之内`,
                                }],
                        })(
                            <Input onChange={e => { this.handleSetState({ title: e.target.value }) }} />
                            )

                    }
                </FormItem>
                <FormItem label="字段类型" {...formItemLayout}>
                    {
                        getFieldDecorator('type', {
                            initialValue: type,
                            
                            // rules: [{ required: true, message: '请选择字段类型' }],
                            rules: [
                                {
                                    validator: this.validatorType
                                }
                            ]
                        })(

                            <RadioGroup defaultValue={1} onChange={e => { this.handleSetState({ type: e.target.value }) }}>
                                <Radio value={1}>{role}需输入信息</Radio>
                                <Radio value={2}>{role}需选择信息</Radio>
                            </RadioGroup>
                            )

                    }
                </FormItem>
                {getFieldDecorator('id',{ initialValue: id })}
                {getFieldDecorator('index',{ initialValue: index })}
                {
                    type === 2 && <FormItem label="选项" {...formItemLayout}>
                        {
                            
                            getFieldDecorator('list', {
                                initialValue: list,
                                // rules: [{ required: true, message: '请设置可选项' }],
                                rules: [
                                    {
                                        validator: this.validatorOptions
                                    }
                                ]
                            })(
                                <div>
                                    {list.map((tag, index) => {
                                        const isLongTag = tag.length > 20;
                                        const tagElem = (
                                            <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                            </Tag>
                                        );
                                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                                    })}
                                    {isappend && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="default"
                                            style={{ width: 78 }}
                                            value={appendValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!isappend && (
                                    <span onClick={this.showInput}>
                                        <Tag style={{ background: '#fff', borderStyle: 'dashed' }}>
                                            <Icon type="plus" /> 添加
                                        </Tag>
                                    </span>
                                    )}
                                </div>
                                )

                        }
                    </FormItem>
                }




            </Form>
        );
    }
}

export default Form.create()(InputSelectChoiceForm);



