import * as React from 'react';
import * as QueueAnim from 'rc-queue-anim/lib/';
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH } from '../../global/global';
import {
    connect,
} from 'react-redux';
import * as Immutable from 'immutable'
import {
    Tabs,
    Table,
    Input,
    Card,
    Row,
    Form,
    Select,
    Button,
} from 'antd';
import CashoutTransferByme from '../../components/socialManagement/cashoutTransferByme';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
interface CashoutApproveListProps {
    dispatch: any;
    dataSource: Immutable.List<any>;
}
interface CashoutApproveListState {
    orderCode: number | string;
    approveStatus: string;
    payStatus: string;
}
class CashoutApproveList extends React.Component<CashoutApproveListProps, CashoutApproveListState> {
    constructor(props) {
        super(props);
        this.state = {
            orderCode: '',
            approveStatus: '',
            payStatus: '',
        };
    }
    onTabClick = (key) => {
        if (Number(key) === 1) {
            browserHistory.push(`${ROUTER_PATH}/newadmin/social/cashout/approve/submit`);
        }
        return false;
    }
    search = () => {

    }
    render() {
        const {
            orderCode,
            payStatus,
            approveStatus,
        } = this.state;
        return (
            <div key="cashoutApproveList">
                <Tabs onTabClick={(key) => { this.onTabClick(key) }} animated={false} activeKey="2">
                    <TabPane tab="提交请款审批" key="1" style={{ padding: '10px' }}>
                    </TabPane>
                    <TabPane tab="请款单列表" key="2">
                        <CashoutTransferByme role={3} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    };
}
export default connect(mapStateToProps)(CashoutApproveList);
