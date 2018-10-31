import React from 'react'
import { Button, Modal, Form, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form';

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import { Organizations } from '../../common/organizationsUi';

import avaterImg from '../../../images/avater-03.png'
import './style.less'

const FormItem = Form.Item;
const { TextArea } = Input;

class CustomerShift extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            iconLoading: false,
            chageUsers: null,
            employeeName: '',
            employeeId: 0,
            radioVal: ''
        }
    }
    
    componentWillMount(){
        if(this.props.visible && this.props.resItem){
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`, {})
            .then(data => {
                this.setState({
                    chageUsers: data
                })
            });
        }
    }

    handleOk = () => {
        let {
            employeeId,
            textAreaVal
        } = this.state;
        if(!employeeId){
            message.error('请选择客户转移对象');
            return false;
        }
        if (!textAreaVal || textAreaVal == '') {
            message.error('请填写转移原因');
            return false;
        }
        this.setState({
            iconLoading: true
        })
        const {
            customerId,
            cname,
            salesId
        } = this.props.resItem;

        //后台接收格式为以下格式
        let _ajaxArr:any = [];
        let _ajaxObj = {
            salesId: salesId,
            cName: cname,
            id: customerId,
            cId: 0
        }
        _ajaxArr.push(_ajaxObj);
        let sendData = {
            intentionId: JSON.stringify(_ajaxArr),
            customerType: 3,
            receiveName: this.state.employeeName,
            receiveId: this.state.employeeId,
            customerStatus: 0,
            transferReason: textAreaVal
        }
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/crm/api/module/customerTransferExamine/add`,
            sendData,
        )
        .then(data => {
            this.props.toggleShiftVisible()
            this.props.auditWillSuccessCallback()
            this.setState({
                employeeName: '',
                employeeId: 0,
                textAreaVal: '',
            })
        });
    }

    handleCancel = () => {
        this.props.toggleShiftVisible()
    }

    handleReportToUserChange(value, option, valueMap) {
        if(valueMap[value]){
            let {name, id} = valueMap[value];
            this.setState({
                employeeName: name,
                employeeId: id
            })
        }
    }

    onChangeReason = (e) => {
        this.setState({
            textAreaVal: e.target.value
        })
    }

    render() {
        if(!this.state.chageUsers){
            return false;
        }

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        };
        const {
            visible
        } = this.props;

        const {
            chageUsers
        } = this.state

        return visible ? <Modal
        key={this.props.modalNumber}
        title="转移申请"
        width={680}
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
            <Button key="submit" type="primary" loading={this.state.iconLoading} onClick={this.handleOk}>
                确定
            </Button>,
            <Button type="primary" onClick={this.handleCancel}>
                取消
            </Button>,
          ]}
        >
        <Form>
            <div className="shift-dialog-wrap">
                <FormItem
                    {...formItemLayout}
                    label="客户名称"
                >
                    {this.props.resItem.cname}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    required={true}
                    label='转移给'
                >
                    <Organizations
                        needAll={false}
                        initValue={''}
                        onSelect={(e,option,valueMap) => this.handleReportToUserChange(e,option,valueMap)}
                        dataSource={chageUsers.data.data ? chageUsers.data.data[0] : chageUsers.data[0]}>
                    </Organizations>
                </FormItem>
                <FormItem {...formItemLayout} required={true} label="转移原因">
                    <TextArea onChange={this.onChangeReason} rows={4} placeholder="请填写转移原因" maxLength={255} />
                </FormItem>
                <div className="tips-wrap">
                    <em className="my-dialog-icon icon-bounce"></em>
                    <div className="tips-box">
                        <span>提示：</span>
                        <span>1.该申请将进入您当前汇报对象的审批列表中。</span>
                        <span>2.由您当前汇报对象审批完成后，系统才会完成转移手续。</span>
                        <span>3.若您当前汇报对象或转移对象在未完成转移审批前，发生人事变动，则需重新提交转移申请。</span>
                    </div>
                </div>
            </div>
        </Form>
    </Modal> : null
    }
}

export default CustomerShift