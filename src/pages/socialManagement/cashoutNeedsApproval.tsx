import * as React from 'react';
import CashoutNeedsApproval from '../../components/socialManagement/cashoutNeedsApproval';

class  SocialCashoutApprovalList  extends React.Component<{}, any> {
    render() {
        return (
            <CashoutNeedsApproval role={0} />
        )
    }
}
export default SocialCashoutApprovalList;