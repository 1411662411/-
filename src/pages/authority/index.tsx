import React from 'react';
import QueueAnim from 'rc-queue-anim';
import {DOMAIN_OXT} from "../../global/global";
import { Button, Spin, message, Divider } from 'antd';
import * as _ from 'lodash';
import moment from 'moment';

import { fetchFn } from '../../util/fetch';

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

let pathName = window.location.pathname;
let accountInfoId = pathName.substring(pathName.lastIndexOf('\/') + 1, pathName.length);

class SoleAuthorityDetail extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            resData: null,
            customerOffer: null,
            customerPrepare: null,
            isEdit: true,
        }
    }

    EditCustomerOffer:any;

    componentWillMount(){
        if(accountInfoId){
            fetchFn(`${DOMAIN_OXT}/authority/api/policy/singleton/sendconsultation/getcustomeroffer`, {
                id: accountInfoId
            })
            .then((res: any) => {
                this.setState({
                    resData: res.data
                })
                if(res.data.status == 2){
                    this.setState({
                        isEdit: false
                    })
                }
                this.formatData(res.data);
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

    handleSubmitCustomerOffer = ()=> {
        this.EditCustomerOffer.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const jsonData = this.transformJsonResult(values)
                this.handleSubmit(jsonData)
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
    handleSubmit = async (customerOffer) => {
        this.setState({loading: true})
        const data:any = await fetchFn(`${DOMAIN_OXT}/authority/api/policy/singleton/sendconsultation/customeroffersubmit`, {
            id: accountInfoId,
            customerOffer
        });
        if (data.status === 0) {
            this.setState({
                loading: false,
                isEdit: false
            })
        }
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
            <div className="sole-authority-cnt" style={{'width': '1024px', 'margin': '0 auto'}}>

                <h1 style={{'font-size': '20px', 'font-weight': '700', 'color': 'rgb(34, 186, 160)', 'margin-top': '20px'}}>{resData.customerName}</h1>

                <Divider />

                <p className="second-info" style={{'font-size': '18px'}}>参保地：{resData.policyName} 社保账户：{socialInsuranceMap[materialsMapToString[resData.insuredType].socialInsurance]} 公积金账户：{accumulationFundMap[materialsMapToString[resData.insuredType].accumulationFund]}</p>

                {this.state.customerOffer && <EditCustomerOffer data={this.state.customerOffer} type={isEdit ? 1 : 3} ref={node => this.EditCustomerOffer = node }></EditCustomerOffer>}

                <div style={{'text-align': 'center', 'margin-top': '20px'}}>
                    <Button type="primary" onClick={this.handleSubmitCustomerOffer}>确认提交</Button>
                </div>
            </div>
        </Spin>
        </QueueAnim>
    }
}

export default SoleAuthorityDetail;