import * as React from 'react';
import { shouldComponentUpdate } from '../../../util/shouldComponentUpdate';
import {
    Table,
} from 'antd';
interface PaymentscheduleProps {
    dispatch?: any;
    total?:any;
    tableloading?: any;
    dataSource: {
        toJS: () => any[];
    };
    title?: any;
    params?: any;
    keyid?: any;
}
interface AdvanceTableProps extends PaymentscheduleProps {

}
import {
    columnsCustomer,
    columnsAdvance,
    columnsPersonMonthNum,
} from '../columns/paymentBillColumns';
import {formatMoney} from '../../../util/util';

/**
 * 付款清单（客户维度）
 */
export class PaymentscheduleTable extends React.Component<PaymentscheduleProps, any> {
    constructor(props) {
        super(props);
    }
    tableProps = () => {
        const dataSource = this.props.dataSource.toJS();
        const total = this.props.total.toJS();
        const key = this.props.keyid;
        let props: any = {
            rowKey:　record => record.id,
            columns: columnsCustomer(total),
            loading: this.props.tableloading,
            pagination: {
                defaultPageSize: 100,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                pageSizeOptions: [100, 200, 300, 400],
            },
            scroll: { y: 500, x: 3300 },
            ...this.props,
            dataSource,
        }
        return props;
    }
    render() {
        return (
            <Table {...this.tableProps() } />
        )
    }
}


/**
 * 付款清单（客户维度）
 */
export class AdvanceTable extends React.Component<AdvanceTableProps, any> {
    constructor(props) {
        super(props);
    }
    tableProps = () => {
        const dataSource = this.props.dataSource.toJS();
        const total = this.props.total.toJS();
        const key = this.props.keyid;
        let props: any = {
            rowKey:　record => record.id,
            columns: columnsAdvance(total),
            loading: this.props.tableloading,
            pagination: {
                defaultPageSize: 100,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                pageSizeOptions: [100, 200, 300, 400],
            },
            scroll: { y: 500, x: 3300 },
            ...this.props,
            dataSource,
        }
        return props;
    }
    render() {
        return (
            <Table {...this.tableProps() } />
        )
    }
}

/**
 * 付款账单
 */
export class PaymentbillsTable extends React.Component<PaymentscheduleProps, any> {
    constructor(props) {
        super(props);
    }
    tableProps = () => {
        const dataSource = this.props.dataSource.toJS();
        const key = this.props.keyid;
        const total = this.props.total.toJS();
        let props: any = {
            rowKey:　record => record.id,
            columns: columnsPersonMonthNum(total),
            loading: this.props.tableloading,
            pagination: {
                 defaultPageSize: 100,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                pageSizeOptions: [100, 200, 300, 400],
            },
            scroll: { y: 500, x: 10800 },
            ...this.props,
            dataSource,
        }
        return props;
    }
    render() {
        return (
            <Table {...this.tableProps() } />
        )
    }
}



// export const Paymentschedule = connect(
//     (state, o) => {
//         const data = state.get('paymentBillTable');
//         return {
//             dataSource: data.get('paymentscheduleDataSource').toJS(),
//         }
//     },
//     (dispatch) => {
//        return {
//         increase: (...args) => dispatch(getPaymentschedule(1)),
//     }
//     }
// )(PaymentscheduleTable);



