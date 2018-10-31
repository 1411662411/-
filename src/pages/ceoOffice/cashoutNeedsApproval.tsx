import * as React from 'react';
import CashoutNeedsApproval from '../../components/socialManagement/cashoutNeedsApproval';

class CeoCashoutApprovalList  extends React.Component<{}, any> {

    
    
    render() {
        return (
            <CashoutNeedsApproval role={2} ref="getSwordButton" />
            
        )
    }
}
export default CeoCashoutApprovalList;