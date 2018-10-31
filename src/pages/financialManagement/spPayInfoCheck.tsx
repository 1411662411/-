import * as React from 'react';
import PayInfoEntryCommon from '../../businessComponents/financialManagement/payInfoEntry';
export default class PayInfoEntryCheck extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render(){
        const params = JSON.parse(sessionStorage.getItem('spPayment')!);
        const orderCode = params && params.params ? params.params.orderCode : undefined;
        return (
            <div key="payInfoEntry">
                <PayInfoEntryCommon  edit={false} orderCode={orderCode}  />
            </div>
        )
    }
} 