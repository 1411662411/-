import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    message,
    Tooltip,
    Icon,
    Row, 
    Col,
    Collapse,
    Input,
    Form,
    Radio
 } from 'antd';
import CustomerOffer from './customerOffer';
import CustomerPrepare from './customerPrepare';
import moment from 'moment';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import './submitMaterials.less';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
interface SubmitMaterialsProps extends  FormComponentProps {
    role?:number;
    edit:boolean;
    isAdmin:boolean;
    submiting:boolean;
    data?: {any};
    callback:any;

}


class SubmitMaterialsForm extends Component<SubmitMaterialsProps,any> {
    constructor(props: SubmitMaterialsProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {
            remark
        } = data;
        
        this.state = {
            remark:data || '',
            approvalStatus:undefined,
            vetted:0,
        };
    }


    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields(()=>{});
    }
    componentWillReceiveProps(nextProps){
        const {
            data
        } = nextProps;
        
        this.setState({remark:data})
            
        
    }
    rejectReasonCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写驳回原因');
        }
        if (value.length > 200) {
            return callback('驳回原因需控制在200字以内');
        }
        callback();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        
        const {
            callback
        } = this.props;
        // 验证form
        this.props.form.validateFields((err, values) => {

            if (!err) {
                // 父组件回调
                callback && callback(3);
            }
        });
    }
    handleTemporaryStorage =()=> {
        const {
            callback
        } = this.props;
        this.props.form.setFieldsValue({vetted:3})
        // 验证form
        this.props.form.validateFields((err, values) => {

            if (!err) {
                // 父组件回调 
                callback && callback(3);
            }
        });
    }

    render(){
        const {
            role,
            submiting
        } = this.props;
       
        const {
            remark,
            approvalStatus,
            vetted
        } = this.state
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
          const formTailLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20, offset: 6 },
          };
        // 
        return ( <div>
                   
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} >
                            <Collapse bordered={false} defaultActiveKey={['1']} className="collapse-submit-mark">
                            
                                {getFieldDecorator('vetted',{ initialValue: vetted })}
                                {(role ===1 || role ==3 ) ?<Panel header="备注（仅开放给政策包审核人用）" key="1">
                                
                                    { getFieldDecorator('remark', {
                                        initialValue: remark,
                                        rules: [{
                                            max: 200,
                                            message:`请控制在200个字之内`,
                                        }],
                                    })(
                                        
                                        <TextArea  
                                            rows={4} 
                                            maxLength={200} 
                                            placeholder="" 
                                            defaultValue={remark} 
                                            onChange={e => this.setState({remark:e.target.value})} />
                                        
                                    )
                                
                                
                                }
                                
                                </Panel>:(remark&&<Panel header="备注（仅开放给政策包审核人用）" key="1">{remark}</Panel>)
                                }
                                </Collapse>
                        </FormItem>

                        {
                            role === 2 && <div className="ant-form-approval-warp">
                                <FormItem
                                    key="approvalStatus"
                                    {...formItemLayout}
                                    
                                >   <label  className="ant-form-item-required" >审批意见：</label>
                                    {
                                        getFieldDecorator('approvalStatus', {
                                            rules: [
                                                { required: true, message: '请选择审批意见', },
                                            ],
                                        })( 
                                            <RadioGroup onChange={(e: any) => this.setState({ approvalStatus: e.target.value })}>
                                                <Radio value={1}>通过</Radio>
                                                <Radio value={2}>驳回</Radio>
                                            </RadioGroup>
                                            )
                                    }
                                </FormItem>
                                {
                                    approvalStatus === 2 &&
                                    <FormItem
                                        key="rejectReason"
                                        {...formItemLayout}
                                        
                                    >   <label  className="ant-form-item-required" >驳回原因：</label>
                                        {
                                            getFieldDecorator('rejectReason', {
                                                rules: [
                                                    { required: true, validator: this.rejectReasonCheck },
                                                ],
                                            })(
                                                <TextArea 
                                                    rows={3} 
                                                    
                                                />
                                            )
                                        }
                                    </FormItem>
                                }
                            </div>
                        }

                        <FormItem {...formTailLayout} >
                            {(role===1 || role ===3  )&&<Button type="primary"
                                    htmlType="submit" loading={submiting}>提交审核</Button>}
                            {(role===2  )&&<Button type="primary" 
                                    htmlType="submit" loading={submiting}>审核</Button>}
                            {role ===1 && <div style={{display:'inline'}}><Button onClick={this.handleTemporaryStorage} style={{marginLeft:15}} loading={submiting}>保存</Button><Tooltip placement="top" title="信息未完善，可以先保存到未审核政策包">
                                    <Icon type="question-circle-o" style={{marginLeft:10}}/>
                            </Tooltip></div>}
                        </FormItem>
                        
                </Form>
               
            </div>
        )
    }
}


export default Form.create()(SubmitMaterialsForm);