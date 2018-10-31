import * as React from 'react';
import * as moment from 'moment';
import { Button, Modal, Form, Input, Radio, DatePicker,Spin  } from 'antd';
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
const FormItem:any = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;



const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 7,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    }
}

interface BatchApprovalProps {
    modalProps?: any;
    datePickerProps?: any;
    form?: any;
    isBatchApprove?:boolean;
    modalHandleCancel?: any;
    modalHandleOk?: any;
    userInfo?: any;

}
interface BatchApprovalState {
    // isBatchApprove: boolean;
    approveOpinion: number;
    planPayTime: Date | null;
    planPayTimeChange: number;
    rejectReason: string;
    fetching:boolean;
}

/**
 * 批量审批Form
 */

class BatchApprovalForm extends React.Component<BatchApprovalProps & FormComponentProps, BatchApprovalState> {
    constructor(props:BatchApprovalProps & FormComponentProps) {
        super(props)
        this.state = {
            // isBatchApprove:false,   // 是否显示弹窗
            approveOpinion: 1,      // 审批意见， 1：通过，2：驳回 
            planPayTime: null,      // 计划支付时间
            planPayTimeChange: 1,   // 计划支付时间是否改变1不改变0改变 
            rejectReason: '',       // 驳回原因
            fetching:false,
        };
    }
    
    setfetching = (fetching:boolean) => {
        this.setState({fetching});
    }
    modalProps = () => {
        const {approveOpinion} = this.state;
        const {isBatchApprove,modalHandleCancel,modalHandleOk,userInfo} = this.props;
        const positionString = userInfo && userInfo.positionString;
        const buttonText = positionString == 'CSO'? '确认并提交给CEO审批' : '确认并提交给财务付款';
        return {
            visible:isBatchApprove,
            title: '批量审批',
            onCancel: () => modalHandleCancel({single:false,fetching:this.setfetching}),
            footer: (
                <div >
                    {
                        approveOpinion==1?<Button  loading={this.state.fetching} type="primary"  onClick={e => modalHandleOk({'single':false,fetching:this.setfetching})}>{buttonText}</Button>
                        :<Button  loading={this.state.fetching} type="primary"  onClick={e =>modalHandleOk({'single':false,fetching:this.setfetching})}>确定</Button>
                    }
                </div>
            )
        }
    }
    changeTextarea = (e) => {
        this.setSingleState({rejectReason: e.target.value})
    }

    setSingleState = (param) => {
        this.setState(param);
    }
    setPlanPayTimeState = (value) => {
        // 保留原计划支付时间
        if(value==1){
            // 设置一组输入控件的值（注意：不要在 componentWillReceiveProps 内使用，否则会导致死循环，更多）
            this.props.form.setFieldsValue({
                planPayTime: null,
            });
            // 重置一组输入控件的值（为 initialValue）与状态
            // this.props.form.resetFields(['planPayTime'])
        }
        this.setState({planPayTimeChange:value});
    }
  
    datePickerProps = () => {
        const {planPayTime,planPayTimeChange} = this.state;
        
        let props:any = {
            // value:(planPayTime&&planPayTimeChange==0)?moment(planPayTime):null,
            placeholder:"",
            format:'YYYY-MM-DD',
            disabledDate: (current)=>{
                return current && current.valueOf() < moment().subtract(1,'days');
            },
            onChange: (value)=>{
                this.setSingleState({planPayTime:value?value.format('YYYY-MM-DD'):null});
                
            },
            disabled:planPayTimeChange==1
        }
        
        if(planPayTime&&planPayTimeChange==0) {
            props.value = moment(planPayTime);
        }

        return props;
    }
    
    render() {
        const { modalProps,datePickerProps, form } = this.props;
        const { getFieldDecorator,resetFields } = this.props.form;
        const { approveOpinion, planPayTime, planPayTimeChange, rejectReason,fetching } = this.state;
        return (
            <Modal key="modal-1" className="batch-approve-modal" title="批量审批" {...this.modalProps()}>
                
                <Form className="form-1" key="form-1" >
                    <FormItem
                        {...formItemLayout}
                        label="审批意见："
                    >
                        {
                            getFieldDecorator('approveOpinion',{ initialValue: 1 }, {
                                rules: []
                            })(
                                <RadioGroup  onChange={ (e) => { this.setSingleState({ approveOpinion: e.target.value }) }}>
                                    <Radio value={1}>通过</Radio>
                                    <Radio value={2}>驳回</Radio>
                                </RadioGroup>
                                )
                        }
                    </FormItem>
                    {
                        approveOpinion == 1 ? <div><FormItem
                            {...formItemLayout}
                            label="计划支付时间："
                        >
                            {
                                getFieldDecorator('planPayTimeChange',{ initialValue: 1 }, {
                                    rules: [],
                                })(
                                    <RadioGroup onChange={(e) => { this.setPlanPayTimeState(e.target.value) }} value={planPayTimeChange}>
                                        <Radio value={1}>保留每笔选中请款单的原计划支付时间</Radio>
                                        <br />
                                        <Radio value={0}>统一设置每笔选中请款单的计划支付时间</Radio>
                                    </RadioGroup>
                                    )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="" wrapperCol={{ sm: { span: 16, offset: 8 } }} style={{ marginTop: '-30px',paddingLeft:'25px' }}>
                            {
                                getFieldDecorator('planPayTime', {
                                    rules: [{
                                        type: 'object',required: planPayTimeChange==0, message: '请选择计划支付时间',
                                        }
                                        
                                    ],
                                })(
                                    <DatePicker {...this.datePickerProps() } />
                                    )
                            }
                        </FormItem></div> : <FormItem
                            {...formItemLayout}
                            label="驳回原因："
                        >
                            {
                                getFieldDecorator('rejectReason',{
                                    rules: [
                                        { max: 500, message: '驳回原因需控制在 500 字以内'},
                                        { required: true, message: '请填写驳回原因'}
                                    ],
                                    
                                })(
                                    <TextArea value={rejectReason}  onChange={ this.changeTextarea }></TextArea>
                                    )
                            }
                        </FormItem>
                    }




                </Form>
                
            </Modal>
            
        )
    }
}
const BatchApprovalFormReactNode = Form.create<BatchApprovalProps>()(BatchApprovalForm) as any;
export class BatchApproval extends React.Component<BatchApprovalProps, BatchApprovalState> {
    constructor(props) {
        super(props);
    }
    batchApprovalFormReactNode;
    /**表单验证 */
    validate = () => {
        let result = {
            status:false,
            params:{},
           
        };
        // const { approveOpinion, planPayTime, planPayTimeChange, rejectReason } = this.state;
        this.batchApprovalFormReactNode.validateFields((err, fieldsValue) => {
            if (!err) {
                // console.log('Received values of form: ', fieldsValue);
                let planPayTime = fieldsValue['planPayTime'];
                const values = {
                    ...fieldsValue,
                    'planPayTime': planPayTime&&planPayTime.format('YYYY-MM-DD'),
                }
                result.status = true;
                result.params = values;
                
            }
        });
        
        return result;
        

    }

    render() {
        const { isBatchApprove,modalHandleCancel,modalHandleOk,userInfo } = this.props;
        return (
            <div   className="batchApproval">
                <BatchApprovalFormReactNode 
                    
                    
                    modalHandleCancel={modalHandleCancel}
                    modalHandleOk={modalHandleOk}
                    userInfo={userInfo}
                    isBatchApprove={isBatchApprove}

                    ref={node => this.batchApprovalFormReactNode = node}
                />
            </div>
        )
    }
}
//===========================================
interface SingleApprovalProps {
    singleVisible?:boolean;
    form?: any;
    singlePlanPayTime?:string;
    singleApproveOpinion?:number;
    approveRecord?:string;
    modalHandleCancel?: any;
    modalHandleOk?: any;
    userInfo?:any;
}
interface SingleApprovalState {
    singleApproveOpinion: number;
    singlePlanPayTime: string;
    rejectReason: string;
    fetching:boolean;
}
/**
 * 单个审批
 */
class SingleApprovalForm extends React.Component<SingleApprovalProps & FormComponentProps,SingleApprovalState> {
    constructor(props:SingleApprovalProps & FormComponentProps) {
        super(props);
        const { singlePlanPayTime,singleApproveOpinion } = this.props;
        this.state = {
            singleApproveOpinion: singleApproveOpinion!,      // 审批意见， 1：通过，2：驳回 
            singlePlanPayTime: singlePlanPayTime!,      // 计划支付时间
            rejectReason: '',       // 驳回原因
            fetching: false,
        };
        // this.setState({singleApproveOpinion,singlePlanPayTime})
    }
    
    setfetching = (fetching:boolean) => {
        this.setState({fetching});
    }
    modalProps = () => {
        
        const {singleVisible,modalHandleCancel,modalHandleOk,singleApproveOpinion,approveRecord,userInfo} = this.props;
        const positionString = userInfo && userInfo.positionString;
        const buttonText = positionString == 'CSO'? '确认并提交给CEO审批' : '确认并提交给财务付款';
        return {
            visible:singleVisible,
            title: singleApproveOpinion==1?'确认审批通过':'确认驳回',
            onCancel: () => modalHandleCancel({single:true,fetching:this.setfetching}),
            footer: (
                <div>
                    {
                        singleApproveOpinion==1?<Button  type="primary" loading={this.state.fetching} onClick={e => modalHandleOk({approveRecord,single:true,fetching:this.setfetching})}>{buttonText}</Button>
                        :<Button  type="primary" loading={this.state.fetching} onClick={e =>modalHandleOk({approveRecord,single:true,fetching:this.setfetching})}>确定</Button>
                    }
                </div>
            )
        }
    }
    changeTextarea = (e) => {
        this.setSingleState({rejectReason: e.target.value})
    }

    setSingleState = (param) => {
        this.setState(param);
    }
   
  
    datePickerProps = () => {
        const {singlePlanPayTime} = this.state;
        let props:any =  {
            
            placeholder:"",
            format:'YYYY-MM-DD',
            disabledDate: (current)=>{
                return current && current.valueOf() < moment().subtract(1,'days');
            },
            onChange: (value)=>{
                this.setSingleState({singlePlanPayTime:value?value.format('YYYY-MM-DD'):null});
                
            }
        }
        if(singlePlanPayTime) {
            props.value = moment(singlePlanPayTime,'YYYY-MM-DD')
        }
        return props;
    }
    handleSinglePass = (id) => {

    }
    handleSingleReject = (id) => {

    }
    singlePlanPayTimeCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请选择计划支付时间');
        }
        if (value.length > 10) {
            return callback('请选择计划支付时间格式错误');
        }
        callback();
    }
    render() {
        const { singleVisible,singleApproveOpinion,approveRecord } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { singlePlanPayTime,rejectReason,fetching } = this.state;
        
        
        return (
            <Modal key="modal-1" className="batch-approve-modal" title="审批" {...this.modalProps()}>
                
                <Form className="form-1" key="form-1" >
                    
                    {
                        singleApproveOpinion == 1 ? <div>
                        <FormItem {...formItemLayout} label="计划支付时间">
                            {
                                getFieldDecorator('singlePlanPayTime', {
                                    initialValue: singlePlanPayTime?moment(singlePlanPayTime):null,
                                    rules: [
                                        { required: true,message: '请选择计划支付时间' },
                                    ],
                                })(
                                    <DatePicker {...this.datePickerProps() } />
                                    )
                            }
                        </FormItem></div> : <FormItem
                            {...formItemLayout}
                            label="驳回原因："
                        >
                            {
                                getFieldDecorator('rejectReason',{
                                    rules: [
                                        { max: 500, message: '驳回原因需控制在 500 字以内'},
                                        { required: true, message: '请填写驳回原因'}
                                    ],
                                    
                                })(
                                    <TextArea  value={rejectReason}  onChange={ this.changeTextarea }></TextArea>
                                    )
                            }
                        </FormItem>
                    }




                </Form>
                
            </Modal>
        )
    }
}
const SingleApprovalFormReactNode = Form.create<SingleApprovalProps>()(SingleApprovalForm) as any;
export class SingleApproval extends React.Component<SingleApprovalProps, SingleApprovalState> {
    constructor(props) {
        super(props);
    }
    singleApprovalFormReactNode;
    /**表单验证 */
    validate = () => {
        let result = {
            status:false,
            params:{},
           
        };
        // const { approveOpinion, planPayTime, planPayTimeChange, rejectReason } = this.state;
        this.singleApprovalFormReactNode.validateFields((err, fieldsValue) => {
            if (!err) {
                // console.log('Received values of form: ', fieldsValue);
                let singlePlanPayTime = fieldsValue['singlePlanPayTime'];
                const values = {
                    ...fieldsValue,
                    'planPayTime': singlePlanPayTime&&singlePlanPayTime.format('YYYY-MM-DD'),
                }
                result.status = true;
                result.params = values;
                
            }
        });
        return result;
        

    }

    render() {
        const { approveRecord,singleApproveOpinion,singleVisible,modalHandleCancel,modalHandleOk,singlePlanPayTime,userInfo } = this.props;
        return (
            <div key= {`singleApproval-${approveRecord}`} className="batchApproval">
                <SingleApprovalFormReactNode 
                    
                    modalHandleCancel={modalHandleCancel}
                    modalHandleOk={modalHandleOk}
                    singleVisible={singleVisible}
                    singlePlanPayTime={singlePlanPayTime}
                    singleApproveOpinion={singleApproveOpinion}
                    approveRecord={approveRecord}
                    userInfo={userInfo}
                    ref={node => this.singleApprovalFormReactNode = node}
                />
            </div>
        )
    }
}