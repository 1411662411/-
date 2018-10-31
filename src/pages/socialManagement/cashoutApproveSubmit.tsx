import * as React from 'react';
import {
    connect,
} from 'react-redux';
import  CashoutApproveSubmitComponent from '../../businessComponents/socialManagement/cashoutApproveSubmit';




class CashoutApproveSubmit extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return <CashoutApproveSubmitComponent />
    }
}

export default CashoutApproveSubmit;
