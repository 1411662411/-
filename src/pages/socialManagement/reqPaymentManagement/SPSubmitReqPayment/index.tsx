import React from 'react';
import { Card, Form } from 'antd';
import  CashoutApproveSubmitComponent from '../../../../businessComponents/socialManagement/SPSubmitReqPayment';
import {PaymentInfo} from '../../../../components/socialManagement/UiComponent';
class SPSubmitReqPayment extends React.Component<any,any>{
    constructor(props) {
        super(props);
        
    }
    
    public render() {
        // const {form} = this.props;
        return <CashoutApproveSubmitComponent />
    }
}

// export default Form.create()(SPSubmitReqPayment);
export default SPSubmitReqPayment;