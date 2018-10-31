import * as React from 'react';
import { 
    Spin,
    Button,
    message,
} from 'antd';
import query from '../../../../util/query';
import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from "../../../../util/fetch";

const urlId = query('id');

import ProductEdit from '../../../../components/crm/SignProduct/product';
import ServiceFee from '../../../../components/crm/SignProduct/serviceFee';
import CreateProduct from '../../../../components/crm/SignProduct/createProduct';
import MailAndMessage from '../../../../components/crm/SignProduct/mailAndMessage';
import LogAction from '../../../../components/crm/LogAction';

import './style'

const getDetail = () => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/getDetail`, {id: urlId}).then(data => data);
}

const saveProduct = (data) => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/add`, data).then(data => data);
}
class SignproductDetail extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resData: null,
        }
    }

    async componentWillMount(){
        if(urlId){
            this.setState({loading: true});
            await this.getDetail();
        }
    }

    /**
     * 获取页面数据
     */
    getDetail = async() => {
        let res:any = await getDetail();
        if(res.status === 0){
            // res.data.button = {
            //     createProduceIntroduceButton:0,
            //     createProductMessageMailSettingButton:0,
            //     enableProductMessageMailSettingButton:0,
            //     previewProductMessageMailSettingButton:0,
            //     updateProductButton:0,
            //     updateProductMessageMailSettingButton:0,
            //     updateProductServiceFeeButton:0,
            // }
            this.setState({
                loading: false,
                resData: res.data,
            })
        }
    }

    CreateProduct:any;
    handleSubmitProduct = ()=> {
        let productObj = {};
        this.CreateProduct.validateFieldsAndScroll(async(err, values) => {
            if (!err) {
                values.addableProduct = Number(values.addable) === 1 ? values.addableVal : '';
                values.changeableProduct = Number(values.changeable) === 1 ? values.changeableVal : '';
                values.conflictProduct = values.conflictVal ? values.conflictVal : '';
                values.applySpecialPrice = values.applySpecialPrice ? 1 : 0;
                values.signSubject = Array.isArray(values.signSubject) ? values.signSubject.join(',') : values.signSubject;

                this.setState({loading: true});
                let res:any = await saveProduct({
                    ...values,
                });
                if(Number(res.status) === 0){
                    message.success(res.msg || '操作成功');
                    this.setState({
                        loading: false,
                    })
                    window.location.href = `${DOMAIN_OXT}/crm/background/customermanagement/signproductmanagement`;
                }else{
                    this.setState({loading: false});
                }
            }
        })
    }

    handleCancel = () => {
        window.location.href = `${DOMAIN_OXT}/crm/background/customermanagement/signproductmanagement`;
    }

    render() {
        if(urlId && !this.state.resData){
            return false;
        }
        return (
            <Spin
                spinning={this.state.loading}
            >
            <div>
                {
                    urlId ?
                    <div>
                        <ProductEdit resData={this.state.resData} />
                        <ServiceFee permissionBtns={this.state.resData.button} />
                        <MailAndMessage permissionBtns={this.state.resData.button} />
                        <LogAction />
                    </div>
                    :
                    <CreateProduct ref={node => this.CreateProduct = node } />
                }
                
                {!urlId ?
                <div className='text-center' style={{marginTop: 20}}>
                    <Button type='primary' onClick={this.handleSubmitProduct} loading={this.state.btnLoading} style={{marginRight:20}}>保存</Button>
                    <Button onClick={this.handleCancel}>取消</Button>
                </div>
                :
                ''
                }
            </div>
            </Spin>
        )
    }
}
export default SignproductDetail;