import * as React from 'react';
import CashoutOrderDetails from '../../businessComponents/common/cashoutOrderDetails';

class CashoutApproveDetails extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        const locationCode = this.props.location.query.code;
        const params = JSON.parse(sessionStorage.getItem('cashoutApproveDetail')!);
        const orderCode = params &&　params.params ? params.params.orderCode : undefined;
        return (
            <CashoutOrderDetails role={0} orderCode={locationCode||orderCode} />
        )
    }
}
export default CashoutApproveDetails;



