import * as React from 'react';
import * as Immutable from 'immutable';
import { connect } from 'react-redux';
import CashoutApproveSubmit from '../../businessComponents/socialManagement/cashoutApproveSubmit';
import {
    getOrderInfo,
} from '../../action/socialManagement/cashoutApproveReSubmitAction';
import {
    message,
    Spin,
} from 'antd';
interface CashoutApproveReSubmitProps {
    dispatch: any;
    baseSource: any;
    baseSourceLoading: boolean;
    personInfo: any;
    personInfoLoading: boolean;
    location?: any;
}

class CashoutApproveReSubmit extends React.Component<CashoutApproveReSubmitProps, any> {
    constructor(props) {
        super(props);
    }
    orderCode;
    componentWillMount() {
        const {
            dispatch,
        } = this.props;
        const locationCode = this.props.location.query.code;
        const params = JSON.parse(sessionStorage.getItem('cashoutApproveReSubmit')!);
        if(!locationCode && (!params || !params.params || !params.params.orderCode)) {
            message.error("缺少请款单号查询参数");
            return;
        }
        this.orderCode = locationCode || params.params.orderCode;
        dispatch(getOrderInfo({ id: this.orderCode }))
    }
    render() {
        let {
            baseSource,
            baseSourceLoading,
        } = this.props;
        
        const orderCode = this.orderCode;
        if (!orderCode) {
            baseSourceLoading = true;
        }
        return (
            <span>
                {
                    baseSourceLoading === true ?
                        <Spin spinning={baseSourceLoading} tip="加载中" >
                            <div style={{ height: 400 }} ></div>
                        </Spin>
                        :
                        <CashoutApproveSubmit
                            defaultValue={{ params: baseSource }}
                            resubmit={true}
                            orderCode={orderCode}
                        />
                }
            </span>

        )
    }
}

const mapStateToProps = (state) => {
    const data = state.get('cashoutApproveReSubmit');
    return {
        baseSource: data.get('baseSource'),
        baseSourceLoading: data.get('baseSourceLoading'),
    }
}

export default connect(mapStateToProps)(CashoutApproveReSubmit);
