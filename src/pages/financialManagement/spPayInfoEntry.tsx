import * as React from 'react';
import PayInfoEntryCommon from '../../businessComponents/financialManagement/payInfoEntry';
export default class PayInfoEntry extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render(){
        const locationCode = this.props.location.query.code;
        const params = JSON.parse(sessionStorage.getItem('spPayment')!);
        const orderCode = params && params.params ? params.params.orderCode : undefined;
        return (
            <div key="payInfoEntry">
                <PayInfoEntryCommon  edit={true} orderCode={locationCode||orderCode}/>
            </div>
        )
    }
} 