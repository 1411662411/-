import * as React from 'react';
import OrderList from '../../businessComponents/socialManagement/orderList';
// /newadmin/social/salarymanagement/orderlist/
class  SalaryOrderList  extends React.Component<{}, any> {
    render() {
        
        return (
            <OrderList role={2} />
        )
    }
}
export default SalaryOrderList;