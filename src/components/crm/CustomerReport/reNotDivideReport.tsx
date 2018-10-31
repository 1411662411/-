import React from 'react'
import { Button, Modal, Form, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form';

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import { Organizations } from '../../common/organizationsUi';

import './style.less'

const FormItem = Form.Item;

class RenotDivideReport extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            iconLoading: false,
            notDivideReportHandlerList: null,
            getSuccessElseWhereByCustomerId: null,
            showNotDivideReport: null,
            employeeName: '',
            employeeId: 0,
        }
    }
    
    componentWillMount(){
        if(this.props.visible && this.props.resItem){
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/getSuccessElseWhereByCustomerId`, {customerId: this.props.resItem.customerId})
            .then((res:any) => {
                if(!res || !res.data || !Array.isArray(res.data) || res.data.length == 0){
                    message.error('暂无数据');
                    return false;
                }
                let {
                    id,
                    province,
                    city,
                    district,
                    customerAddress,
                    customerId,
                } = res.data[0];
                this.setState({
                    getSuccessElseWhereByCustomerId: res.data[0],
                })
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/notDivideReportHandlerList`, {cityId: city})
                .then(data => {
                    this.setState({
                        notDivideReportHandlerList: data,
                    })
                });
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/showNotDivideReport`, {id: id})
                .then((data:any) => {
                    this.setState({
                        showNotDivideReport: data.data,
                    })
                });
            });
        }
    }

    handleOk = () => {
        let {
            employeeId
        } = this.state;
        if(!employeeId){
            message.error('请选择请选择审批人');
            return false;
        }
        this.setState({
            iconLoading: true
        })
        const {
            cname
        } = this.props.resItem;

        const {
            getSuccessElseWhereByCustomerId
        } = this.state;

        let sendData = {
            id: getSuccessElseWhereByCustomerId.id,
            customerId: getSuccessElseWhereByCustomerId.customerId,
            cName: cname,
            provinceId: getSuccessElseWhereByCustomerId.province,
            cityId: getSuccessElseWhereByCustomerId.city,
            districtId: getSuccessElseWhereByCustomerId.district,
            customerAddress: getSuccessElseWhereByCustomerId.customerAddress,
            reportUserName: this.state.employeeName,
            reportUserId: this.state.employeeId,
        }
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/startUpNotDivideReport`,
            sendData,
        )
        .then(data => {
            this.props.toggleReNotVisible()
            this.props.auditDidSuccessCallback()
        });
    }

    handleCancel = () => {
        this.props.toggleReNotVisible()
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

    render() {
        if(!this.state.notDivideReportHandlerList || !this.state.getSuccessElseWhereByCustomerId || !this.state.showNotDivideReport){
            return false;
        }

        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
        };
        const {
            visible
        } = this.props;

        const {
            notDivideReportHandlerList,
            showNotDivideReport
        } = this.state;

        return visible ? <Modal
        key={this.props.modalNumber}
        title="异地报备-不分成申请"
        width={680}
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
            <Button key="submit" type="primary" loading={this.state.iconLoading} onClick={this.handleOk}>
                提交
            </Button>,
          ]}
        >
        <Form>
            <div className="re-not-dialog-wrap">
                <FormItem
                    {...formItemLayout}
                    label="报备客户"
                >
                    {this.props.resItem.cname}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="报备给分公司"
                >
                    {showNotDivideReport.customerCity}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="本月可发起不分成报备的总数"
                >
                    {showNotDivideReport.notDivideNumber}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="本月已发起不分成报备的数量"
                >
                    {showNotDivideReport.applyNumber}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="本月已通过不分成报备的数量"
                >
                    {showNotDivideReport.agreeNumber}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    required={true}
                    label='报备给审批人'
                >
                    <Organizations
                        needAll={false}
                        initValue={''}
                        onSelect={(e,option,valueMap) => this.handleReportToUserChange(e,option,valueMap)}
                        dataSource={notDivideReportHandlerList.data.data ? notDivideReportHandlerList.data.data[0] : notDivideReportHandlerList.data[0]}>
                    </Organizations>
                </FormItem>
            </div>
        </Form>
    </Modal> : null
    }
}

export default RenotDivideReport