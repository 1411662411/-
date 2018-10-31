import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, message, Radio, Tag, Tooltip, Icon } from 'antd';

import moment from 'moment';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import {
    fetchFn,
} from '../../util/fetch';
import { DOMAIN_OXT } from '../../global/global';
// import './selectDictionary.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface selectDictionaryProps extends FormComponentProps {
    dictKey: string;
    data?:any;
    dictionaryData?: any[];
    callback?: any;
   
}
interface list {
    id: string;
    value: string;
}

interface selectDictionaryState {
    id?:number;
    dictName?: string;
    dictKey?: string;
    
    type: 0 | 1 | 2 | 3; // 0无 1 输入框 2 选择框 3上传控件
    list: any[];
    isappend?: boolean;
    appendValue?: string;
    index?:number;
    dictionaryData:any[];
    description?: string;
    code?: string;
}


class SelectDictionaryForm extends Component<selectDictionaryProps, selectDictionaryState> {
    constructor(props: selectDictionaryProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            id,
            dictName,
            dictKey,
            isappend,
            index,
            type,
            list,
            description,
            code,
            dictionaryData
        } =  data;
        this.state = {
            id,
            dictName,
            dictKey,
            isappend,
            appendValue: '',
            index,
            type,
            description,
            code,
            list:list||[],
            dictionaryData
        };
    }


   
    componentWillMount() {
        // 优先读取穿过来的props
        const {
            dictionaryData
        } = this.props;
        if(dictionaryData){
            this.setState({
                dictionaryData:dictionaryData
            })
        }else {
            this.getDictionaryData(this.props.dictKey)
        }
        
    }
    getDictionaryData = async (key) => {

        const data:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getChildrenByDictKey`, { dictKey: key });
        if (data.status === 0) {
            
            this.setState({
                dictionaryData:data.data
            })
        }
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
        this.setState({ list: list });
        this.props.form.setFieldsValue({list});
    }
    showInput = () => {
        this.setState({ isappend: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ appendValue: e.target.value });
    }
    handleSelectChange = (value) => {
        const {
            dictionaryData
        } = this.state;
        const data =  dictionaryData.find(function(obj, index, arr) {
            return obj.dictKey == value;
        }) 
        if(data){
            const {
                dictKey,
                dictName,
                description,
                code
            } = data;
            let type: 0 | 1 | 2 | 3 = 1;

            switch (description) {
                case '选择':
                    type = 2;
                    break;
                case '图片':
                    type = 3;
                    break;
                case '附件':
                    type = 3;
                    break;
            
                default:
                    break;
            }
            this.setState({ dictKey,dictName,description,type,code });
        }
        
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



        
       
        const {
            dictName,
            dictKey,
            isappend,
            appendValue,
            id,
            index,
            type,
            list,
            dictionaryData,
            description,
            code
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
        const dictionaryOption = () => {
            const {
                dictionaryData
            } = this.state;
            const options: Array<JSX.Element> = [];
            dictionaryData.map(function (sub) {
                options.push(<Option value={sub.dictKey} data-id={sub.id} data-description={sub.description} data-code={sub.code}>{sub.dictName}</Option>)
            })
            return options;
        } 
        return (
            <Form onSubmit={this.handleSubmit} className="input-select-choice">
                <FormItem label="字段名称" {...formItemLayout}>
                    {
                        getFieldDecorator('dictKey', {
                            initialValue: dictKey,
                            rules: [
                                { whitespace: true,message: '请填写字段名称'},
                                { required: true, message: '请填写字段名称' },
                                ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 250 }}
                                placeholder="请选择字段名称"
                                optionFilterProp="children"
                                onChange={this.handleSelectChange}
                                allowClear = {true}
                                filterOption={(input, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                { dictionaryData && dictionaryData.length>0 && dictionaryOption() }
                            </Select>
                            )

                    }
                </FormItem>
                {
                    type && <FormItem label="字段类型" {...formItemLayout}>
                    <RadioGroup onChange={e => { this.handleSetState({ type: e.target.value }) }}>
                        { type ===1 && <Radio checked >客户需输入</Radio>}
                        { type ===2 && <Radio checked >客户需选择</Radio>}
                        { type ===3 && <Radio checked >客户需上传</Radio>}
                    </RadioGroup>
                </FormItem>
                }
                
                {getFieldDecorator('type',{ initialValue: type })}
                {getFieldDecorator('dictName',{ initialValue: dictName })}
                {getFieldDecorator('description',{ initialValue: description })}
                
                {getFieldDecorator('code',{ initialValue: code })}
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

export default Form.create()(SelectDictionaryForm);



