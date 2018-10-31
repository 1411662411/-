import React from 'react';
import moment from 'moment';
import { debug } from 'util';
import {Table,Spin,Input,InputNumber,Modal,DatePicker   } from 'antd';
import { dataSource } from '../../financialManagement/detailTableColumn';
import Text from '../../common/Text';
import {accAdd,} from '../../../util/math';
import  '../../../css/socialManagement/lanchConfirm.less';


class lanchList extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            estimatedAmount: 0, //客服预估
            amount: 0,   //实际付款金额
            resPaymentSource:props.resPaymentSource,  //打钩的列表数据
        }
    }
    componentWillMount(){
         //初始化预估金额与实际金额
        this.setState({loading:true});
        var obj = {};
        var newData= this.props.resPaymentSource;
        var estimateAmount = 0;
        var amount = 0;
        var receiverName ='';
        var insuredStatus = '';
        var insuredItem = '';
        var paymentRemark = '';
        var businessRemark = '';
        var payTypeString = '';
        var financePlanPayTimeString = '';
        newData.map((item,index) =>{
            if(item.sum){
                return
            }
            if(index != newData.length){
                receiverName = item.receiverName;
                insuredStatus = item.insuredStatus;
                insuredItem = item.insuredItem;
                paymentRemark= item.paymentRemark;
                businessRemark = item.businessRemark;
                payTypeString = item.payTypeString;
                financePlanPayTimeString = item.financePlanPayTimeString;
                estimateAmount = accAdd(estimateAmount,item.estimateAmount);  //初始预估总金额
                item.amount = item.estimateAmount; //给item加上一个实际金额变量字段
                amount = estimateAmount;
            }
        })

        const isnewData = newData.find((value, index, arr)=>{
            if(value.sum){
                return true
            }
        })
        if(!isnewData){
            //将 合并后单独一条数据 添加到数组中
            obj =
            {
                'sum':'合并后出款金额（实付金额）总计:',
                'receiverName':receiverName,
                'insuredStatus':insuredStatus,
                'insuredItem':insuredItem,
                'estimateAmount':estimateAmount,
                'amount':amount,
                'paymentRemark':paymentRemark,
                'businessRemark':businessRemark,
                'payTypeString':payTypeString,
                'financePlanPayTimeString':financePlanPayTimeString
            };
            newData.push(obj);
        }
       
        this.setState({
            resPaymentSource:newData,
            estimatedAmount:estimateAmount,
            amount:amount,
        })

        setTimeout(() => {
            this.setState({
                loading:false
            })
        }, 500);
    }
    

    handleChange = (value,id) => {
        var id = id;
        var value = value;  //input框的改变的值
        var newData = this.state.resPaymentSource;
        var amount = 0;
        newData.map((item,index) =>{
            if(item.id == id){
                item.amount = value;
            }
            if(index != newData.length-1){
                amount = accAdd(amount,item.amount);
            }
        })
        this.setState({
            resPaymentSource:newData,
            amount:amount,
        })
    }

    render(){
        const { resPaymentSource} = this.state;
        const columns:[any] = [   
            {
                title: '出款单号',
                key: '出款单号',
                width: 130,
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return <a href="javascript:;">{data.code}</a>;
                    }
                    return {
                        children: data.sum,
                        props: {
                            colSpan:2,
                        },
                    };
                },
            },
            {
                title: '收款方名称',
                key: '收款方名称',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return data.receiverName;
                    }
                    return {
                        props: {
                            colSpan:0,
                        },
                    };
                },
            },
            {
                title: '状态（参保类型）',
                key: '状态（参保类型）',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return data.insuredStatus;
                    }
                    return {
                        children: data.insuredStatus,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: '对应收款项',
                key: '对应收款项',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return data.insuredItem;
                    }
                    return {
                        children: data.insuredItem,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: '付款金额（客服预估）',
                key: '付款金额（客服预估）',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return data.estimateAmount;
                    }
                    return {
                        children: <Text color='#000'><span style={{fontWeight:700}}>{data.estimateAmount}</span></Text>,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: '付款金额（实际金额）',
                key: '付款金额（实际金额）',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                        return <InputNumber defaultValue={data.amount} onChange={(e)=>{this.handleChange(e,data.id)}} min={0.00} step={1} precision={2}/> ;
                    }
                    return {
                        children:  <Text color='red'><span style={{fontWeight:700}}>{this.state.amount}</span></Text>,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: '打款备注',
                key: '打款备注',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                        return  data.paymentRemark;
                    }
                    return {
                        children: data.paymentRemark,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: '业务备注',
                key: '业务备注',
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                        return  data.businessRemark;
                    }
                    return {
                        children: data.businessRemark,
                        props: {
                            colSpan:1,
                        },
                    };
                },
            },
            {
                title: ' 财务计划支付时间',
                key: ' 财务计划支付时间',
                width: 160,
                render: (data, row, index) => {
                    if (index < resPaymentSource.length -1) {
                      return data.financePlanPayTimeString;
                    }
                    return {
                        children:<DatePicker showTime  format="YYYY-MM-DD HH:mm"  defaultValue={moment(data.financePlanPayTimeString, 'YYYY-MM-DD HH:mm') }/>,
                        props: {
                            colSpan:1,
                        },
                    };
                },  
            }
        ]
        return (
            <Spin spinning={this.state.loading}>
                <Table  
                    bordered 
                    pagination={false}
                    className='ant-table-wrapper-text-center'  
                    columns={columns}
                    dataSource={this.state.resPaymentSource}
                />
             </Spin>
            
        )
            
            
        
    }
}

export default lanchList













