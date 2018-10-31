import React from 'react'
import { Modal, Form, Radio, DatePicker, Select, Input, Button, message, List, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment'
import { FormComponentProps } from 'antd/lib/form';
import { DOMAIN_OXT } from '../../../../global/global';
import { fetchFn } from '../../../../util/fetch';

import './style.less'

const typeApi = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerParameterSet/followUpTypeList`; // 获取跟进类型
const addApi = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/add`; // 添加跟进记录
const limitFollowUptimeApi = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/limitFollowUptime`; // 添加跟进记录时间范围
const listApi = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/list`; // 获取跟进记录列表
const getContactsOfCustomer= `${DOMAIN_OXT}/apiv2_/crm/api/module/customerContacts/contacts` //获取客户联系人
const LENGTH = 20;

const getTypeApi = () => {
	return fetchFn(typeApi, {}).then(data => data);
}
const addFollowRecord = (data) => {
	return fetchFn(addApi, data).then(data => data);
}
const getContacts = (associatedId) => {
	return fetchFn(getContactsOfCustomer, {customerType: 3,associatedId}).then(data => data);
}
const getFollowRecordList = (associatedId, current) => {
	return fetchFn(listApi, {customerType: 3,associatedId, start: (current-1)*LENGTH, length:LENGTH}).then(data => data);
}
const limitFollowUptime = (customerId) => {
	return fetchFn(limitFollowUptimeApi, {customerId}).then(data => data);
}

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

interface UserFormProps extends FormComponentProps {
    visible: boolean;
    close: Function;     // 关闭回调
    ok: Function;        // 添加确认回调
    id: number | string; // 客户ID
    type: 'listOnly' | 'list' | 'add'; //list 跟进记录列表 add 添加跟进记录
  }

class AddFollowRecord extends React.Component<UserFormProps,any>{
    constructor(props:UserFormProps){
        super(props)
        this.state={
            loading: true,
            type:props.type,
            contacts: [] as any,
            startTime:'',
            endTime:'',
            dataSource:[] as any,
            current: 1,
            hasMore: true,
            types:[],
        }
    }
    async addFollow(){
        // let contacts:any, res:any, types:any;
        let [contacts ,res, types]:any[] = await Promise.all([getContacts(this.props.id), limitFollowUptime(this.props.id), getTypeApi()])
        this.setState({
            contacts: contacts.data || [],
            loading: false,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            types: types.data,
        })
    }
    async getFollowList(current,infiniteOnLoad=false){
        let res:any = await getFollowRecordList(this.props.id,current);
        if(res.status === 0){
            if(infiniteOnLoad){
                this.setState({
                    dataSource: [...this.state.dataSource,...res.data.records],
                    current,
                    loading: false,
                    hasMore: Math.ceil(res.recordsTotal / LENGTH) > current,
                })
            }else{
                this.setState({
                    dataSource: res.data.records,
                    current,
                    loading: false,
                    hasMore: Math.ceil(res.recordsTotal / LENGTH) > current,
                })
            }
        }else{
            this.setState({
                current:current-1,
                loading: false,
            })
        }
    }
    async componentWillMount(){
        this.setState({loading: true});
        if(this.props.type === 'add'){
            await this.addFollow();
        }else{
            await this.getFollowList(1);
        }
    }
    disabledDate = (current) => {
        const { startTime, endTime } = this.state;
        // return current && current > moment(endTime).endOf('day') current < moment(startTime).endOf('day') 
        return current && (current < moment(startTime) || current > moment(endTime).endOf('day'))
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
          if (!err) {
            this.setState({loading: true})
            values.followUpTime = moment(values.followUpTime).format('YYYY-MM-DD HH:00:00');
            values.contactName = this.state.contacts.filter(item => item.id == values.contactId)[0].name;
            values.customerId = this.props.id;
            values.customerType = 3;
            let res:any = await addFollowRecord(values);
            if(res.errcode === 0){
                
                if(this.props.type === 'add'){
                    message.success('添加成功',()=>{
                        this.setState({loading: false});
                    });
                    this.props.ok()
                }else{
                    message.success('添加成功');
                    this.setState({type: 'list'},() => {
                        this.getFollowList(1)
                    })
                }
            }
          }
        });
    }
    typeOnChange (type){
        this.setState({type})
    }
    renderOptions(){
        const { contacts } = this.state;
        let options:any = [];
        contacts.map(item => {
            options.push(<Select.Option value={item.id}>{item.name}</Select.Option>)
        })
        return options;
    }
    handleInfiniteOnLoad = (current)=>{
        let {dataSource} = this.state;
        this.setState({
            loading: true,
        });
        this.getFollowList(current, true)
    }
    render(){
        const options = this.renderOptions();
        const { type } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
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
        const {visible} = this.props;
        return visible ? <Modal
            className='crm-follow-record-modal'
            visible={visible}
            footer={null}
            title={type === 'add' ? '添加跟进记录' : '跟进记录'}
            onCancel={(e) => {this.props.close()}}
        >
        <Spin
            spinning={this.state.loading}
        >
        {
            type === 'add' ? <Form onSubmit={this.handleSubmit}>
            <FormItem
                {...formItemLayout}
                label='跟进类型'
            >
                {getFieldDecorator('followUpType', {
                    rules: [{ 
                        required: true, 
                        message: '请选择跟进类型',
                    }],
                })(
                    <Radio.Group 
                        size={'small'} 
                        style={{display:'inline-block'}}
                        defaultValue={''}
                    >
                    {
                        this.state.types.map(item => <Radio.Button value={item.id}>{item.name}</Radio.Button>)
                    }
                        {/* <Radio.Button value="1">拜访</Radio.Button>
                        <Radio.Button value="2">电话</Radio.Button>
                        <Radio.Button value="3">QQ</Radio.Button>
                        <Radio.Button value="4">微信</Radio.Button>
                        <Radio.Button value="5">会议</Radio.Button> */}
                    </Radio.Group>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='跟进时间'
            >
                {getFieldDecorator('followUpTime', {
                    rules: [{ 
                        required: true, 
                        message: '请选择跟进时间',
                    }],
                })(
                    <DatePicker 
                        showTime={{
                            format: 'HH:00:00'
                        }} 
                        format="YYYY-MM-DD HH:00:00" 
                        disabledDate = {this.disabledDate}
                    />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='跟进对象'
            >
                {getFieldDecorator('contactId', {
                    rules: [{ 
                        required: true, 
                        message: '请选择跟进对象',
                    }],
                })(
                    <Select style={{width:170}}>
                        {options}
                    </Select>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='跟进经过'
            >
                {getFieldDecorator('followUpResult', {
                    rules: [{ 
                        validator:(rule, value, callback) =>{
                            if(!value || value == ''){
                                callback('请填写跟进经过');
                            }else if(value.length > 300){
                                callback('跟进经过最多允许输入300个字');
                            }else{
                                callback();
                            }
                        },
                        required: true,
                    }],
                    validateFirst: true,
                })(
                    <TextArea rows={4} style={{width:220}}/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                colon={false}
                label=' '
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError()) || this.state.loading}
                >
                    确定
                </Button>
                <Button
                    style={{marginLeft:20}}
                    onClick={()=>{
                        if(this.props.type === 'add'){
                            this.props.close()
                        }else{
                            this.setState({type: 'list'})
                        }
                    }}
                >
                    取消
                </Button>
            </FormItem>
        </Form> 
        : <div 
            // className='crm-follow-record-modal'
            style={{position:'relative',paddingTop: 10}}
        >  {/*跟进记录列表*/}
            {
                this.props.type === 'list' && <a 
                    className='crm-follow-record-add'
                    onClick={()=>{this.setState({type: 'add', loading: true}, async() =>{
                        await this.addFollow()
                    })}}
                >添加</a>
            }
            <div
                className='crm-follow-record-list-container'
            >
            <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!this.state.loading && this.state.hasMore}
                useWindow={false}
            >
                <List
                    itemLayout="vertical"
                    dataSource={this.state.dataSource}
                    renderItem={item => {
                        return <List.Item key={item.id}>
                            <List.Item.Meta
                                title={<a className='crm-follow-time'> <b className='greenPoint'></b> {item.followUpDate}</a>}
                                description={<span><a className='crm-follow-time'>{item.operateName}</a>{item.followUpTypeName}跟进了<a className='crm-follow-time'>{item.contactName}</a></span>}
                            />
                            <div style={{ wordWrap:'break-word'}}>
                                {item.followUpResult} 
                            </div>
                        </List.Item>
                    }}
                >
                </List>
            </InfiniteScroll>
            {!this.state.hasMore && <div style={{color:'#999'}} className='text-center'>没有更多了</div>}
            </div>
        </div>
        }
        </Spin>
        </Modal> : null
    }
}
const AddFollowRecordForm = Form.create()(AddFollowRecord);

export default AddFollowRecordForm