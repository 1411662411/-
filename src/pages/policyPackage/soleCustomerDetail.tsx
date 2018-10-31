import React from 'react';
import QueueAnim from 'rc-queue-anim';
import {DOMAIN_OXT} from "../../global/global";
import { Button, Spin, message } from 'antd';
import * as _ from 'lodash';

import { fetchFn } from '../../util/fetch';
import query from '../../util/query';
import { browserHistory } from 'react-router';
import moment from 'moment';

import '../../css/socialManagement/soleCustomerOpen'

import MaterialsTable from '../../components/socialManagement/soleConsulting/materialsTable';
import EditCustomerOffer from '../../components/policyPackage/singleAccount/editCustomerOffer';

const compare =(property)=>{
    return function(a,b){
        // 未设置index 排后面
        var value1 = a[property] ;
        var value2 = b[property] ;
        return value1 - value2;
    }
}

const socialInsuranceMap = {
    1:'已开户',
    2:'未开户需要开户'
}
const accumulationFundMap = {
    1:'已开户',
    2:'未开户需要开户',
    3:'未开户暂不开户'
}

const materialsMapToString = {
    '1':{
        socialInsurance: 2,
        accumulationFund: 2,
    },
    '2':{
        socialInsurance: 2,
        accumulationFund: 1,
    },
    '3':{
        socialInsurance: 2,
        accumulationFund: 3,
    },
    '4':{
        socialInsurance: 1,
        accumulationFund: 3,
    },
    '5':{
        socialInsurance: 1,
        accumulationFund: 2,
    },
    '6':{
        socialInsurance: 1,
        accumulationFund: 1,
    },
}

class SoleCustomerDetail extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            resData: null,
            customerOffer: null,
            customerPrepare: null,
            isEdit: false,
        }
    }

    EditCustomerOffer:any;

    componentWillMount(){
        if(query('accountInfoId') && query('accountInfoId') != 'null'){
            fetchFn(`${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/consultationpage`, {
                id: query('accountInfoId')
            })
            .then((res: any) => {
                this.setState({
                    resData: res.data
                })
                this.formatData(res.data);
                if(query('isEdit') == 'true'){
                    document.title = `征询函：${query('customerName')}`;
                    document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = `征询函：${query('customerName')}`;
                }
            });
        }
    }

    formatData = (data) => {
        let materialsData = data ? data : null;
        if(Object.prototype.toString.apply(materialsData) ==="[object Object]"){
            // 客户需提供
            const offerObj = data.customerOffer||'{}';
            // 客户需准备
            const prepareObj = data.customerPrepare||'{}';

            const offerArr = _.values(_.omit(offerObj,'_op')).sort(compare('index'));
            const prepareArr = _.values(_.omit(prepareObj,'_op')).sort(compare('index'));

            // let tempOfferArr:any = [];
            // offerArr.map((item, index) => {
            //     let temp = {
            //         'label': item.materialsName,
            //         'value': item.materialsType,
            //     }
            //     tempOfferArr.push(temp);
            // })

            this.setState({
                customerOffer: offerObj,
                customerPrepare: prepareArr,
            })
        }
    }

    enterHandle = () => {
        this.EditCustomerOffer.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const jsonData = this.transformJsonResult(values)
                this.setState({
                    customerOffer: jsonData,
                    isEdit: false,
                })
                fetchFn(
                    `${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/editconsultation`,
                    {
                        id: query('accountInfoId'),//id
                        socialInfoId: query('socialInfoId'),
                        customerOffer: JSON.stringify(this.state.customerOffer),
                    },
                )
                .then(data => {
                    if(data.errcode === 0 || data.status === 0){
                        window.location.href = `${DOMAIN_OXT}/newadmin/social/solemanagement`;
                    }else{
                        this.setState({
                            loading: false,
                        })
                    }
                });
            }
        })
    }

    cancelHandle = () => {
        window.location.href = `${DOMAIN_OXT}/newadmin/social/solemanagement`;
    }

    handleSubmitCustomerOffer = ()=> {
        this.EditCustomerOffer.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const jsonData = this.transformJsonResult(values)
                this.setState({
                    customerOffer: jsonData,
                    isEdit: false,
                })
            }
        })
    }
    transformJsonResult = (values) => {
        
        const customerOffer = values.customerOffer
        if(customerOffer){
            const tempData = customerOffer;
        
            for (const key in values) {
                if (values.hasOwnProperty(key)) {
                    // 遍历key
                    const item = tempData.find(function(value, index, arr) {
                        return value.materialsKey == key;
                    }) 

                    
                    if(item && tempData[item.index]){
                        const tempRecord = tempData[item.index]
                        // 子组件日期格式有问题 父组件重新格式化
                        if( tempData[item.index].materialsDescription == "时间"){
                            tempData[item.index].materialsValue = moment(values[key]).format('YYYY-MM-DD HH:mm:ss');
                        }else if( tempData[item.index].materialsDescription == "日期"){
                            tempData[item.index].materialsValue = moment(values[key]).format('YYYY-MM-DD')
                        }else {
                            tempData[item.index].materialsValue = values[key]
                        }
                        
                    }
                }
                
            }
            var customerOfferObj = new Object();
            tempData.map((offer,index)=> {
                if(offer.key){
                    customerOfferObj[offer.key] = {...offer,index};
                }
            })
            
            return  JSON.stringify(customerOfferObj)
        }
        
    }

    handelEdit = () => {
        this.setState({
            isEdit: !this.state.isEdit
        })
    }

    cancelEdit = () => {
        this.setState({
            isEdit: false
        })
    }

    render(){
        if(!this.state.resData){
            return false;
        }

        const {
            resData,
            loading,
            isEdit
        } = this.state;

        return <QueueAnim>
        <Spin spinning={loading}>
            {
                query('isEdit') == 'true' ?
                <div className="sole-customer-open-cnt">
                    <h2>单立户办理问询 <a onClick={this.handelEdit} href="javascript:;" style={{'font-size': '14px', 'color': '#0000FF', 'font-weight': 'normal'}}>{isEdit ? '' : '编辑'}</a></h2>

                    <p className="second-info">参保地：{resData.policyName} 社保账户：{socialInsuranceMap[materialsMapToString[resData.insuredType].socialInsurance]} 公积金账户：{accumulationFundMap[materialsMapToString[resData.insuredType].accumulationFund]}</p>

                    <h5 className="sub-title">1、填写电子申报相关信息</h5>

                    {this.state.customerOffer && <EditCustomerOffer data={this.state.customerOffer} type={isEdit ? 1 : 3} ref={node => this.EditCustomerOffer = node }></EditCustomerOffer>}

                    {/* {isEdit ? 
                    <div style={{'margin': '20px 0', 'text-align': 'center'}}><Button type="primary" onClick={this.handleSubmitCustomerOffer}>保存</Button>
                    <Button style={{'margin-left': '30px'}} onClick={this.cancelEdit}>取消</Button></div>
                    : ''} */}

                    <h5 className="sub-title">2、尽快准备好以下材料<span style={{'color': '#f60'}}>（请务必按照现场办理要求进行准备）：</span></h5>

                    <MaterialsTable isEmail={false} customerPrepare={this.state.customerPrepare} />

                    <Button type="primary" onClick={this.enterHandle}>确定并移交给后道客服</Button>
                    <Button style={{'margin-left': '30px'}} onClick={this.cancelHandle}>取消</Button>
                </div>
                :
                <div className='sole-customer-detail-cnt'>
                    <h4 style={{'font-size': '16px', 'font-weight': '700', 'padding': '10px 0'}}>电子信息</h4>
                    {this.state.customerOffer && <EditCustomerOffer data={this.state.customerOffer} type={3} ref={node => this.EditCustomerOffer = node }></EditCustomerOffer>}
                    <h4 style={{'font-size': '16px', 'font-weight': '700', 'padding': '10px 0'}}>材料</h4>
                    <MaterialsTable isEmail={false} customerPrepare={this.state.customerPrepare} />
                </div>
            }
        </Spin>
        </QueueAnim>
    }
}

export default SoleCustomerDetail;