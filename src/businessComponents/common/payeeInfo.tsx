import React, { Component } from 'react';
import {
    connect,
} from 'react-redux';
import Immutable from 'immutable';
import {  PayeeInfo as PayeeInfoUi } from '../../components/common/cashoutApproveUi';
import {
    getSecondCashoutNameSource,
    getSecondCashoutInfo,
} from '../../action/businessComponents/payeeInfoAction';

// interface PayeeInfoBusiness {
//     validate: (data) => void;
//     secondCashoutInfoFetching: boolean;
// }


interface TStateProps {
    secondCashoutNameSource: any;
    secondCashoutInfo: any;
    secondCashoutInfoFetching: any;
}
interface TOwnProps {
    uiType: number;
    edit?: boolean; 
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type PayeeInfoProps = TStateProps & TOwnProps & TDispatchProps;

class PayeeInfo extends Component<PayeeInfoProps, any> {
    constructor(props) {
        super(props);
        const {
            uiType,
            edit,
            dispatch,
        } = this.props;
        
        if (uiType === 1 || edit === true) {
            
            dispatch(getSecondCashoutNameSource({}));
        }
    }
    payeeInfo: any;
    getSecondCashoutInfo = (params) => {
        this.props.dispatch(getSecondCashoutInfo(params));
    }
    validate = () => {
        
        if(this.props.secondCashoutInfoFetching) {
            return false;
        }
        return this.payeeInfo.validate();
    }
    render() {
        return (
            <PayeeInfoUi
                {...this.props}
                getSecondCashoutInfo={this.getSecondCashoutInfo}
                ref={node => this.payeeInfo = node}
            />
        )
    }
}
const mapStateToProps = (state) => {
    const data = state.get('payeeInfo');
    
    return {
        secondCashoutNameSource: data.get('secondCashoutNameSource'),
        secondCashoutInfo: data.get('secondCashoutInfo'),
        secondCashoutInfoFetching: data.get('secondCashoutInfoFetching')
    }
};


export default connect(
    mapStateToProps,
    (dispatch, props) => ({ dispatch }), 
    (stateProps, dispatchProps, parentProps) => {
        return {
            ...stateProps,
            ...parentProps,
            ...dispatchProps
        }
    }, { withRef: true })(PayeeInfo);