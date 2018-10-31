import * as React from 'react';
import CashoutNeedsApproval from '../../components/socialManagement/cashoutNeedsApproval';

import NeedApproval from '../../components/socialManagement/UiComponent/NeedApproval';

class FinancialCashoutApprovalList  extends React.Component<{}, any> {
    render() {
        return (
            // <NeedApproval type={1} />
            <CashoutNeedsApproval role={1} />
        )
    }
}
export default FinancialCashoutApprovalList;