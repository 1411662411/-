import React from 'react';
import {Table  } from 'antd';
import { debug } from 'util';
import Text from '../../common/Text';
import  '../../../css/socialManagement/lanchConfirm.less';
class lanchConfirm extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            resPaymentSource:props.resPaymentSource,
            confirm:undefined,
        }
    }

    componentWillMount(){
       var newData = this.props.resPaymentSource;
       newData.map((item,index)=>{
            if(index == newData.length-1){   // 获取最后一条
                this.setState({
                    confirm:item
                });
            }
       })
    }
    render(){
        return (
            <table className='lanchConfirmtable'>
                <tbody>
                    <tr>
                        <td>支付方式：</td>
                        <td>{this.state.confirm.payTypeString}</td>
                    </tr>
                    <tr>
                        <td>合并后出款金额（实付金额）总计：</td>
                        <td style={{fontWeight:700}}><Text color='red'>{this.state.confirm.amount}</Text>元</td>
                    </tr>
                    <tr>
                        <td>收款方名称：</td>
                        <td>{this.state.confirm.receiverName}</td>
                    </tr>
                    <tr>
                        <td>最终付款时间（财务计划付款时间）：</td>
                        <td>{this.state.confirm.financePlanPayTimeString}</td>
                    </tr>
                </tbody>
            </table>
                
            
        )
    }
}

export default lanchConfirm













