/**
 * Created by yangws on 2017/7/25.
 */
import * as React from 'react';
import InvoicesList from '../../components/financialManagement/invoicesList';

class  InvoicesSendList  extends React.Component<{}, any> {
    render() {
        return (
            <InvoicesList type={2} />
        )
    }
}
export default InvoicesSendList;

