import React, { Component } from 'react';
import Immutable from 'immutable';
import Invoice from '../../businessComponents/common/invoice';
import {
    connect,
} from 'react-redux';
import {
    Card,
    Button,
    Tabs,
    message,
} from 'antd';
const TabPane = Tabs.TabPane;




interface TStateProps {
    cName?: string;
    code?: string | number;
}
interface TOwnProps {
    location?: any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type InvoiceDetailProps = TStateProps &  TOwnProps & TDispatchProps;

class InvoiceDetail extends Component<InvoiceDetailProps, any> {
    params = {} as any;
    constructor(props) {
        super(props);
        this.state = {
            cName: '',
            code: ''
        }
        const  {
            codeId,
            contractId,
        } = this.props.location.query;
        if(codeId) {
            this.params = {
                codeId,
                contractId,
            }
        }
        else {
            let params = sessionStorage.getItem('invoiceDetail');
            if(params === null || !JSON.parse(params).codeId ) {
                message.error('缺少发票相关参数');
                return;
            }
            this.params = JSON.parse(params);
        }
        // this.params = {
        //    codeId: 2487,
        //   contractId： 12134
        // }
    };
    // changeState = (params) => {
    //     this.setState(params);
    // }
    render() {
        const {
            codeId,
            contractId,
        } = this.params;
        const {
            cName,
            code,
        } = this.props;
        return (
            (codeId || contractId) ? 
            <Tabs activeKey="1">
                <TabPane key="1" tab={<div><span style={{marginRight: 50}}>{`发票信息：${cName ? cName : '' }`}</span><span>{code && `发票号：${code}`}</span></div>} style={{padding: 20}}>
                    <Invoice type={3} codeId={codeId} contractId={contractId} ></Invoice>
                </TabPane>
            </Tabs>
            :
            null

        )
    }
};
const mapStateToProps = (state: Any.Store): TStateProps   => {
    const data = state.get('invoiceBusinessComponents');
    const invoiceBaseInfo = data.get('invoiceBaseInfo');
    return {
        cName: invoiceBaseInfo.getIn(['orderInfo', 'invoiceTitle']),
        code: invoiceBaseInfo.getIn(['orderInfo', 'invoiceNumber']),
    }
}

export default connect(mapStateToProps)(InvoiceDetail);



