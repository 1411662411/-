import React from 'react';
import { browserHistory } from 'react-router';
import { Modal, message, Spin, Form, Select, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form';

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

import CustomerReport from '../CustomerReport';

import './style.less'

const API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/judgeBusinessLicenseIsOutOfDateForSigned`; //判断营业执照是否过期
const getProductByElsewhereReportAPI = `${DOMAIN_OXT}/apiv2_/crm/api/module/product/getProductByElsewhereReport`; //判断是否异地报备什么鬼的 签约主体
const getSelectableProductAPI = `${DOMAIN_OXT}/apiv2_/crm/api/module/product/getSelectableProduct`; //判断是否异地报备什么鬼的

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const judgeBusinessLicenseIsOutOfDateForSigned = (data) => {
	return fetchFn(API, data).then(data => data);
}
const getProductByElsewhereReport = (data) => {
	return fetchFn(getProductByElsewhereReportAPI, data).then(data => data);
}
const getSelectableProduct = (data) => {
	return fetchFn(getSelectableProductAPI, {signType:1, ...data}).then(data => data);
}

interface CustomerSignProps extends FormComponentProps {
    id: number; //customerId
    close: Function;
    ok: Function;
    cityId: number;
    name: string;
}

class CustomerSign extends React.Component<CustomerSignProps, any>{
    constructor(props: CustomerSignProps){
        super(props)
        this.state={
            reportVisible: false,
            customerId: null as any,
            loading: true,
            signVisible: false,
            signModalLoading: false,
            reportData: [],
            productData: null as any,
        }
    }

    async getSelectableProduct(signSubject, isWillMount=false){
        let res:any = await getSelectableProduct({customerId: this.props.id, signSubject});
        this.setState({
            productData: res.data,
            signModalLoading: false,
        }, ()=> {
            !isWillMount && this.props.form.setFieldsValue({productId: null});
        })
    }

    async componentWillMount(){
        this.setState({loading:true})
        let res:any = await judgeBusinessLicenseIsOutOfDateForSigned({customerId: this.props.id})
        if(res.errcode !==0 ){
            // message.error(res.msg);
            this.props.close();
            return ;
        }
        let reportRes:any = await getProductByElsewhereReport({customerId: this.props.id, cityId:this.props.cityId})
        if(reportRes.errcode !== 0){
            this.setState({loading:false})
            Modal.warning({
                title: '报备提醒',
                content: '该客户有对应分公司，需先行报备',
                okText: '去报备',
                maskClosable: true,
                onOk: () => {
                    this.setState({reportVisible: true});
                },
                onCancel: () => {
                    this.props.close();
                }
            });
        }else{
            const { data } = reportRes;
            let signSubject = data[0].code;
            await this.getSelectableProduct(signSubject, true)
            this.setState({
                signVisible: true,
                reportData: data,
            })
        }
    }
    renderReportOption(){
        if(!this.state.productData){
            return [];
        }
        let arr:any[] = [];
        for(let key in this.state.productData){
            arr.push(<Select.OptGroup key={key} label={key}>
                {
                    this.state.productData[key].map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                }
            </Select.OptGroup> )
        }
        return arr;
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                let contractCompany = this.state.reportData.filter(item => item.code == values.signSubject)[0].dictName;
                let str = `?name=${this.props.name}&customerId=${this.props.id}&productId=${values.productId}&contractCompany=${contractCompany}&signSubject=${values.signSubject}`
                console.log(browserHistory)
                this.props.close();
                window.location.href = `${DOMAIN_OXT}/crm/background/contractmanagement/createContract${str}`;
            }
        })
    }

    render(){
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = this.props.form;
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
        let reportOption = this.renderReportOption();
        return <div className='crm-customerSign-modal'>
        <Spin
            spinning={this.state.loading}
        >
            {
                this.state.reportVisible && <CustomerReport 
                visible={this.state.reportVisible}
                toggleReportVisible={() =>{this.props.close()}}
                auditDidSuccessCallback={() => {this.props.close()}}
                modalNumber={21}
                resItem={{customerId: this.props.id}}
                isReject={false}
             />
            }
            {
                this.state.signVisible && <Modal
                    title='签约-选择签单产品'
                    visible={this.state.signVisible}
                    footer={null}
                    onCancel={(e) => {this.props.close()}}
                >
                <Spin
                    spinning={this.state.signModalLoading}
                >
                <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    {...formItemLayout}
                    label='合同签约主体'
                >
                    {getFieldDecorator('signSubject', {
                        rules: [{ 
                            required: true, 
                            message: '请选择合同签约主体',
                        }],
                    })(
                        <Select
                            style={{width: 200}}
                            placeholder='请选择合同签约主体'
                            onChange={(value) => {
                                this.setState({signModalLoading:true});
                                this.getSelectableProduct(value);
                                
                            }}
                        >
                        {
                            this.state.reportData.map(item => <Select.Option key={item.dictName} value={item.code}>{item.dictName}</Select.Option>)
                        }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label='签单产品'
                >
                    {getFieldDecorator('productId', {
                        rules: [{ 
                            required: true, 
                            message: '请选择签单产品',
                        }],
                    })(
                        <Select
                            style={{width: 200}}
                            placeholder='请选择签单产品'
                        >
                        {
                            reportOption
                        }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    colon={false}
                    label=' '
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                    >
                        确定
                    </Button>
                    <Button
                        style={{marginLeft:20}}
                        onClick={()=>{
                            this.props.close()
                        }}
                    >
                        取消
                    </Button>
                </Form.Item>
                </Form>
                </Spin>
                </Modal>
            }
        </Spin>
        </div>
    }
}

export default Form.create()(CustomerSign)