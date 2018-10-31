import React from 'react'
import { Button, Modal, Form, Radio, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form';

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

import avaterImg from '../../../images/avater-03.png'
import './style.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class NotDivideReport extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            isShowReject: false,
            resData: null,
            radioVal: '',
            textAreaVal: ''
        }
    }
    
    componentWillMount(){
        if(this.props.visible && this.props.resItem){
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/showNotDivideReport`, {id: this.props.resItem.reportId})
            .then(data => {
                this.setState({
                    resData: data
                })
            });
        }
    }

    handleOk = () => {
        let {
            radioVal,
            textAreaVal
        } = this.state;
        if(!radioVal){
            message.error('请选择审批结果');
            return false;
        }
        if(radioVal == '3'){
            if (!textAreaVal || textAreaVal == '') {
                message.error('请填写驳回原因');
                return false;
            }
        }
        let sendData = {
            id: this.props.resItem.reportId,
            reportType: 3,
            reportStatus: radioVal, //审批结果
        }
        radioVal == 3 ? sendData['rejectReason'] = textAreaVal : '';
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/reportAudit`,
            sendData,
        )
        .then(data => {
            this.props.toggleNotVisible()
            this.props.auditWillSuccessCallback()
            this.setState({
                isShowReject: false,
                radioVal: '',
                textAreaVal: '',
            })
        });
    }

    handleCancel = () => {
        this.props.toggleNotVisible()
    }

    handleRadioChange = (e) => {
        this.setState({
            radioVal: e.target.value
        })
        if(Number(e.target.value) === 3){
            this.setState({
                isShowReject: true
            })
        }else{
            this.setState({
                isShowReject: false
            })
        }
    }

    onChangeRejectReason = (e) => {
        this.setState({
            textAreaVal: e.target.value
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        };
        const {
            visible
        } = this.props;

        if(!this.state.resData){
            return false;
        }
        const {
            reportSalesName,
            cName,
            reportSalesCompany,
            customerCity,
            applyNumber,
            agreeNumber
        } = this.state.resData.data;

        return visible ? <Modal
        key={this.props.modalNumber}
        title="异地报备-不分成申请审批"
        width={680}
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              提交
            </Button>,
          ]}
    >
        <Form>
            <div className="report-dialog-wrap">
                <div className="init-bg-wrap">
                    <img src={avaterImg} className="org-icon" alt=""/>
                    <dl>
                        <dt>同学：</dt>
                        <dd>{reportSalesCompany}{reportSalesName}向你发起了异地报备-不分成申请；</dd>
                        <dd><strong>报备客户：</strong>{cName}；</dd>
                        <dd>注意：请于本月底前完成审批！如未审批且未超过限额，系统将自动默认该申请通过！</dd>
                        <dd className="text-success"><strong>提示：</strong>{reportSalesCompany}向{customerCity}已发起了<strong className="text-danger">{applyNumber}</strong>次不分成申请！已通过了<strong className="text-danger">{agreeNumber}</strong>次不分成申请！</dd>
                    </dl>
                </div>
                <FormItem
                    {...formItemLayout}
                    required={true}
                    label="审批结果："
                >
                    <RadioGroup onChange={this.handleRadioChange}>
                        <Radio value="2">通过</Radio>
                        <Radio value="3">驳回</Radio>
                    </RadioGroup>
                </FormItem>
                {this.state.isShowReject ? <FormItem {...formItemLayout} required={true} label="驳回原因：">
                    <TextArea onChange={this.onChangeRejectReason} rows={4} maxLength={500} />
                </FormItem> : ''}
            </div>
        </Form>
    </Modal> : null
    }
}

export default NotDivideReport