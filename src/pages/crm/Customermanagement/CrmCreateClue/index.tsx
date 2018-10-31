import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { 
    Spin,
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    message,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import Table from '../../../../components/Table';
import PartTitle from '../../../../components/crm/Title';
import SelectGroup from '../../../../components/crm/SelectGroup'

import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from "../../../../util/fetch";
import SelectCity from '../../../../components/select-city';
import address from '../../../../components/select-city/address.json'; 
const API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getDataList`; //获取组织架构信息
const ADD_CLUE_API = `${DOMAIN_OXT}/apiv2_/crm//api/module/customerClue/saveClueAndContact`; //新增线索
const getDataList = () => {
    return fetchFn(API, {}).then(data => data);
}
const saveClueAndContact = (data) => {
    return fetchFn(ADD_CLUE_API, data).then(data => data);
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

const { Option, OptGroup } = Select;
const FormItem = Form.Item;

import { getTreeData } from '../../../../util/crmUtil';
const treeData = [{
    keys: 'Node1',
    id: '0-0',
    key: '0-0',
    sons: [{
      keys: 'Child Node1',
      id: '0-0-1',
      key: '0-0-1',
    }, {
      keys: 'Child Node2',
      id: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    keys: 'Node2',
    id: '0-1',
    key: '0-1',
  }];
console.log(getTreeData(treeData, 'keys', 'id', 'sons'))


interface SocialCpfModalProps extends FormComponentProps{
    visible: boolean;
    type: number;
    singletonSocialInfoId: any;
    singletonId: any;
    onCancel: ()=>void;
    onOk: ()=>void;
    collectionDate?: string | null | undefined;
}
class CreateClue extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            sources:[], //客户来源
            loading: false,

            cName:'',
            source:'',
            sourceChannel:'',
            clueStatus:'',
            provinceId:'',
            cityId:'',
            provinceName:'',
            cityName:'',
            address:'',
            clueRemark:'',
            name:'',
            gender:'',
            mobile:'',
            fixedTelephone:'',
            qq:'',
            mail:'',
            weixin:'',
            contactRemark:'',

        }
    }
    getDataList = async() => {
        let res:any = await getDataList();
        if(res.status === 0){
            this.setState({
                sources: res.data.souces,
                loading: false,
            })
        }
    }
    async componentWillMount(){
        this.setState({loading: true});
        await this.getDataList();
    }

    renderFormItem = (getFieldDecorator, required, label, name, initialValue, length=100) => {
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }
        return <FormItem
            {...formItemLayout}
            label={label}
        >
            {getFieldDecorator(name, {
                normalize:(value) => {
                    return value.trim();
                },
                rules: [{ 
                    validator:(rule, value, callback) =>{
                        if(required && (!value || value == '')){
                            callback(`请填写${label}`);
                        }else if(value.length > length){
                            callback(`${label}请控制在${length}个字之内`);
                        }else{
                            callback();
                        }
                    },
                    required: false,
                }],
                validateFirst: true,
                initialValue,
            })(
                <Input placeholder={`请填写${label}`} />
            )}
        </FormItem>
    }
    submit=(e) => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
           if(!err){
            const {
                provinceId,
                cityId,
                provinceName,
                cityName,
            } =this.state;
            this.setState({loading: true});
            // console.log({
            //     ...values,
            //     provinceId,
            //     cityId,
            //     provinceName,
            //     cityName,
            //     isCreate: 1,
            // });
            let res:any = await saveClueAndContact({
                ...values,
                provinceId,
                cityId,
                provinceName,
                cityName,
                isCreate: 1,
            });
            if(Number(res.status) === 0){
                message.success(res.msg || '操作成功');
                window.location.href = (`${DOMAIN_OXT}/crm/background/customermanagement/customerclue`);
            }else{
                this.setState({loading: false});
            }
           }
        });
    }
    onChange=(e, name) =>{
        const {setFieldsValue} = this.props.from;
        let value = e.target.value;
        setFieldsValue({[name]: value.trim()});
    }

    render(){
        const {
            loading,
            sources,
        } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }
        return <Spin
            spinning={loading}
        >
        <Form
            onSubmit={this.submit}
        >
            <PartTitle
                title='客户基本信息'
                // part={1}
            />
            <Table 
                dataSource={[
                    {
                        label: '客户名称',
                        value: this.renderFormItem(getFieldDecorator, false, '客户名称', 'cName', '', 50)
                    },
                    {
                        label: '线索状态',
                        required: true,
                        value: <FormItem
                        {...formItemLayout}
                        label='线索状态'
                    >
                        {getFieldDecorator('clueStatus', {
                            rules: [{ 
                                required: true,
                            }],
                            validateFirst: true,
                            initialValue: 0,
                        })(
                            <Select>
                                <Option value={0}>未跟进</Option>
                                <Option value={1}>暂无意向</Option>
                                <Option value={2}>信息无效</Option>
                                <Option value={3}>其它</Option>
                            </Select>
                        )}
                    </FormItem>
                    },
                    {
                        label: '客户来源',
                        value: <FormItem
                        {...formItemLayout}
                        label='客户来源'
                    >
                        {getFieldDecorator('source', {
                        })(
                            <SelectGroup 
                                dataSource={sources}
                                configure={{
                                    key: 'dictName',
                                    value: 'id',
                                    children: 'sons',
                                }}
                                placeholder='请选择客户来源'
                            />
                        )}
                    </FormItem>
                    },
                    {
                        label: '客户所在地',
                        isAll: true,
                        value: <Row>
                            <span style={{
                                float: 'left',
                                lineHeight: '39px',
                            }}>
                                <SelectCity 
                                    params={{
                                        placeholder: '请选择省市',
                                        deepMap: [{ name: '省' }, { name: '市'}],
                                        // deepMap: [{name: '省'},{name: '市'},{name: '区'}],
                                        popupStyle: {
                                            width: 350,
                                            zIndex: 99,
                                        }, /* 弹窗样式 */
                                        transform:true,
                                        // searchApi: apiConfig.queryCityData, /* 模糊搜索api */
                                        address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
                                        // addressApi:`${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/getcities`,
                                        // addressApi: apiConfig.getCityData, /* fetch api方式城市基本数据 */
                                        style: {
                                            width: 200,
                                        }, /* input 的样式 */
                                        onChange: (selectVal, selectName, code) => {  /* 选择到最后一层的回调 */
                                            // console.log(selectVal, selectName, code)
                                            this.setState({
                                                provinceId:selectVal[0],
                                                cityId:selectVal[1],
                                                provinceName:selectName[0],
                                                cityName:selectName[1],
                                            })
                                        },
                                        onSelect: (selectVal, selectName, code) => { /* 每层选择的回调，除了， 除了最后一层调用onChange */
                                            // console.log(selectVal, selectName, code)
                                            this.setState({
                                                provinceId:selectVal[0],
                                                cityId:'',
                                                provinceName:selectName[0],
                                                cityName:'',
                                            })
                                        },
                                    }}
                                />
                            </span>
                            <Col span={1}>  </Col>
                            <Col span={12}>
                                {this.renderFormItem(getFieldDecorator, false, '详细地址', 'address', '', 200)}
                            </Col>
                        </Row>
                    },
                    {
                        label: '备注',
                        isAll: true,
                        value: <FormItem
                            {...formItemLayout}
                            label='备注'
                        >
                            {getFieldDecorator('clueRemark', {
                                normalize:(value) => {
                                    return value.trim();
                                },
                                rules: [{ 
                                    validator:(rule, value, callback) =>{
                                        if(value.length > 500){
                                            callback(`备注请控制在500个字之内`);
                                        }else{
                                            callback();
                                        }
                                    },
                                }],
                                validateFirst: true,
                                initialValue: '',
                            })(
                                <Input.TextArea rows={3} placeholder='请填写备注'/>
                            )}
                        </FormItem>
                    },
                ]}
            />
            <PartTitle
                title='客户联系人信息'
                // part={2}
            />
            <Table 
                dataSource={[
                    {
                        label: '姓名',
                        value: this.renderFormItem(getFieldDecorator, false, '姓名', 'name', '', 20)
                    },
                    {
                        label: '性别',
                        value: <FormItem
                            {...formItemLayout}
                            label='性别'
                        >
                            {getFieldDecorator('gender', {
                                validateFirst: true,
                            })(
                                <Select
                                    placeholder='请填写性别'
                                >
                                    <Option value={1}>男</Option>
                                    <Option value={2}>女</Option>
                                    <Option value={0}>保密</Option>
                                </Select>
                            )}
                        </FormItem>
                    },
                    {
                        label: '手机号码',
                        value: this.renderFormItem(getFieldDecorator, false, '手机号码', 'mobile', '', 20)
                    },
                    {
                        label: '固定电话',
                        value: this.renderFormItem(getFieldDecorator, false, '固定电话', 'fixedTelephone', '', 30)
                    },
                    {
                        label: 'QQ',
                        value: this.renderFormItem(getFieldDecorator, false, 'QQ', 'qq', '', 50)
                    },
                    {
                        label: '邮箱',
                        value: this.renderFormItem(getFieldDecorator, false, '邮箱', 'mail', '', 50)
                    },
                    {
                        label: '微信',
                        value: this.renderFormItem(getFieldDecorator, false, '微信', 'weixin', '', 30)
                    },
                    {
                        label: '备注',
                        isAll: true,
                        value: <FormItem
                            {...formItemLayout}
                            label='备注'
                        >
                            {getFieldDecorator('contactRemark', {
                                // getValueFromEvent: (event) => {
                                //     console.log(event.target.value)
                                //     return event.target.value
                                // },
                                normalize:(value) => {
                                    return value.trim();
                                },
                                rules: [{ 
                                    validator:(rule, value, callback) =>{
                                        if(value.trim().length > 500){
                                            callback(`备注请控制在500个字之内`);
                                        }else{
                                            callback();
                                        }
                                    },
                                }],
                                validateFirst: true,
                                initialValue: '',
                            })(
                                <Input.TextArea onChange={(e)=>{console.log(e.target.value)}} rows={3} placeholder='请填写备注'/>
                            )}
                        </FormItem>
                    },
                ]}
            />
            <div className='text-center' style={{marginTop: 20}}>
                <Button htmlType='submit' disabled={hasErrors(getFieldsError()) || loading} type='primary' style={{marginRight:20}}>保存</Button>
                <Button onClick={() => {
                    this.setState({loading: true});
                    window.location.href = (`${DOMAIN_OXT}/crm/background/customermanagement/customerclue`);
                }}>取消</Button>
            </div>
        </Form>
        </Spin>
    }
}

export default Form.create()(CreateClue);;