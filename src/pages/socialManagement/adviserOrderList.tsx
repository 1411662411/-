import * as React from 'react';
import OrderList from '../../businessComponents/socialManagement/orderList';
// /newadmin/social/salarymanagement/orderlist/
class  AdviserOrderList  extends React.Component<{}, any> {
    render() {
        
        return (
            <OrderList role={1} />
        )
    }
}

export default AdviserOrderList;