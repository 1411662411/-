import React, { Component } from 'react';
import {
    Alert,
    Spin,
    Divider,
    message,
    Button,
    Input,
    Modal,
    Radio,
} from 'antd';
const RadioGroup = Radio.Group;
import moment from 'moment';
import EditCustomerOffer from '../../components/policyPackage/singleAccount/editCustomerOffer';
import {
    fetchFn,
} from '../../util/fetch';
import { DOMAIN_OXT } from '../../global/global';



class CustomerOffer extends Component<any,any> {
    constructor(props) {
        super(props);
        this.state ={
            id:'j7ge18e71524637433790',
            value: 1,
        }
    }
    EditCustomerOffer:any;
    handleSubmitCustomerOffer = ()=> {
        this.EditCustomerOffer.validateFieldsAndScroll((err, values) => {
            if (!err) {
                
                const jsonData = this.transformJsonResult(values)
                console.log(jsonData)
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

        const data:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/customeroffersubmit`, { id:this.state.id,customerOffer });
        if (data.status === 0) {
            
        }
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      }
    render(){
        return (
            <div>
                {/* type 1 编辑 2 只读(带输入框) 3 查看 */}
                <RadioGroup onChange={this.onChange} value={this.state.value} style={{paddingBottom:20}}>
                    <Radio value={1}>编辑</Radio>
                    <Radio value={2}>只读</Radio>
                    <Radio value={3}>查看</Radio>
                </RadioGroup>
                <EditCustomerOffer id={this.state.id} type={this.state.value} ref={node => this.EditCustomerOffer = node }></EditCustomerOffer>
                
                <Button type="primary" onClick={this.handleSubmitCustomerOffer}>父组件提交</Button>
            </div>
        )
    }
}
// newadmin/demo/customerOffer
export default CustomerOffer;


