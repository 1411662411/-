import React from 'react';
import { connect } from 'react-redux';
import { Form, TimePicker, Input, Radio, Button, Spin, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';

const FormItem = Form.Item;

import {hasErrors} from '../../../../util/crmUtil'
import { DOMAIN_OXT } from '../../../../global/global';
import { fetchFn } from '../../../../util/fetch';

const USER_TODO_ADD_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/add`; //新增待办事项
const USER_TODO_UPDATE_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/update`; //编辑待办事项
const userTodoAdd = (data) => fetchFn(USER_TODO_ADD_API, data).then(data => data)
const userTodoUpdate = (data) => fetchFn(USER_TODO_UPDATE_API, data).then(data => data)

import './style.less'

interface AddTodoMattersProps extends FormComponentProps{
    date: moment.Moment;
    onOk: Function;
    onCannel: Function;
    isRemind?: 0 | 1 | undefined;
    remindTime?: number | null;
    todoTime?: number | null;
    id?: number | null;
    content?: string | null;
}

class AddTodoMattersForm extends React.Component<AddTodoMattersProps,any>{
    constructor(props){
        super(props)
        let isToday:boolean = props.date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
        this.state={
            isRemind: props.isRemind !== undefined ? props.isRemind === 1 ? true : false : true,
            loading: false,
            isToday,
        }

    }

    submit = () => {
        this.props.form.validateFields(async(err, values) => {
            this.setState({loading: true});
            if (!err) {
                // console.log(values, values.remindTime.unix(), values.remindTime.format('YYYY-MM-DD HH-mm-ss'));
                let res:any;
                let remindTime = values.isRemind === 1 ? `${this.props.date.format('YYYY-MM-DD')} ${values.remindTime.format('HH:mm:ss')}` : '';
                let todoTime = this.props.date.unix();
                if(this.props.id){
                    res = await userTodoUpdate({
                        ...values,
                        todoTime,
                        remindTime: values.isRemind === 1 ? moment(remindTime).unix() : '',
                        id: this.props.id,
                    })
                    if(res.status === 0){
                        this.props.onOk()
                    }
                }else{
                    // let str = values.isRemind === 1 ? `${this.props.date.format('YYYY-MM-DD')} ${values.remindTime.format('HH:mm:ss')}` : '';
                    // console.log(moment(str).format('YYYY-MM-DD HH:mm:ss'))
                    res = await userTodoAdd({
                        ...values,
                        todoTime,
                        remindTime: values.isRemind === 1 ? moment(remindTime).unix() : '',
                    })
                    if(res.status === 0){
                        this.props.onOk()
                    }
                }
                this.setState({loading: false});
            }else{
                this.setState({loading: false});
            }
        });
    }
    disabledHours = () => {
        let disabledHours:number[] = [];
        if(this.state.isToday){
            let hour = Number(this.props.date.format('H'));
            for(let i=0; i<=hour; i++){
                disabledHours.push(i)
            }
            return disabledHours
        }else{
            return disabledHours
        }
    }

    render(){
        const {loading} = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout={
            labelCol: {
                xs: {span:6},
            },
            wrapperCol: {
            xs: { span: 18 },
            },
        }
        return <div style={{padding: 10}} className='crm-todo-matters-add-container custom-scroll-bar'><Spin
            spinning={loading}
        ><Form>
            {/* <FormItem
                {...formItemLayout}
                label='待办时间'
            >
                {getFieldDecorator('todoTime', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(!value || value == ''){
                                callback(`请选择待办时间`);
                            }else{
                                callback();
                            }
                        },
                        required: true,
                    }],
                    validateFirst: true,
                    initialValue: this.props.todoTime ? moment(this.props.todoTime*1000) : undefined,
                })(
                    <TimePicker 
                        style={{width: 150}}
                        format={'HH:mm'}
                        minuteStep={15}
                        placeholder={'请选择待办时间'}
                    />
                )}
            </FormItem> */}
            <FormItem
                {...formItemLayout}
                label='待办内容'
            >
                {getFieldDecorator('content', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(!value || value == ''){
                                callback(`请填写待办内容`);
                            }else if(value.length > 200){
                                callback('待办内容请控制在200个字之内');
                            }else{
                                callback();
                            }
                        },
                        required: true,
                    }],
                    validateFirst: true,
                    initialValue: this.props.content ? this.props.content : undefined,
                })(
                    <Input.TextArea 
                        rows={4}
                        placeholder={'请填写待办内容'}
                    />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='是否提醒'
            >
                {getFieldDecorator('isRemind', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            this.setState({isRemind: value === 1}, ()=>{
                                callback();
                            })
                        },
                        required: true,
                    }],
                    validateFirst: true,
                    initialValue: this.props.isRemind !== undefined ? this.props.isRemind : 1,
                })(
                    <Radio.Group>
                        <Radio value={0}>不提醒</Radio>
                        <Radio value={1}>提醒</Radio>
                    </Radio.Group>
                )}
            </FormItem>
            {
                this.state.isRemind && <FormItem
                {...formItemLayout}
                label='提醒时间'
            >
                {getFieldDecorator('remindTime', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(!value || value == ''){
                                callback(`请选择提醒时间`);
                            }else{
                                callback();
                            }
                        },
                        required: true,
                    }],
                    validateFirst: true,
                    initialValue: this.props.remindTime ? moment(this.props.remindTime*1000) : undefined,
                })(
                    <TimePicker 
                        style={{width: '100%'}}
                        format={'HH:00'}
                        disabledHours={this.disabledHours}
                        minuteStep={15}
                        placeholder={'请选择提醒时间'}
                    />
                )}
            </FormItem>
            }
            

            <div className='text-center'>
                <Button disabled={!loading && hasErrors(getFieldsError())} onClick={this.submit} style={{margin:'0 5px'}} type='primary'>保存</Button>
                <Button onClick={()=>{this.props.onCannel()}} style={{margin:'0 5px'}}>取消</Button>
            </div>
        </Form></Spin></div>
    }
}

const AddTodoMatters = Form.create()(AddTodoMattersForm);

const mapStateToProps = (state,ownProps) => ({
    // userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
})

export default connect(mapStateToProps)(AddTodoMatters);