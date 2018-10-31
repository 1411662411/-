/**
 * Created by caozheng on 2017/1/4.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { Button, Input, Table, Row, Col, Spin, Icon, Alert, Modal, message, Timeline, } from 'antd';
import { connect } from 'react-redux';
import { orderColumns } from '../../components/financialManagement/fundConfirmInfoTable';
import './../../css/financialManagement/fundConfirmInfo.less';
import { OrderInfoMessage } from '../../components/financialManagement/fundConfirmInfoOrder';
import { FundConfirmAlert } from '../../components/financialManagement/fundConfirmAlert';
import * as _ from 'lodash';
import { browserHistory } from 'react-router';
import {
    getOrderInfoSaga,
    getOrderTableSaga,
    confirmOrderSearch,
    hideModal,
    confirmOrderSaga,
    rejectOrder,
    rejectOrderSaga,
} from '../../action/financialManagement/fundConfirmInfoAction';

const TimelineItem:any = Timeline.Item;
const TextArea  = Input.TextArea;


interface TStateProps {
    orderData?: any;
    dataSource?: any;
    current?: number;
    pageSize?: number;
    total?: number;
    company: string;
    orderContent: string;
    orderMoney: number | string;
    visible: boolean;
    confirmType: string;
    isFetching: boolean;
}
interface TOwnProps {
    location?: any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type FundConfirmInfoProps = TStateProps & TOwnProps & TDispatchProps;

class OrderInfoTable extends Table<any>{ }

class FundConfirmInfo extends React.Component<FundConfirmInfoProps, any> {

    fundInfo: any;
    tableParam: any;
    rejectReson: any;
    constructor(props) {
        super(props);
        const { dispatch, location } = this.props;

        this.fundInfo = { ...location.query};

        if(!this.fundInfo.order_id) {
            this.fundInfo = JSON.parse(sessionStorage.getItem('fundConfirmInfo')!);
        }
        // /** 测试数据 **/
        // this.fundInfo = {
        //     order_code: '20161228145223694584',
        //     order_id: 1543,
        //     order_type: 1,
        //     c_id: 1101518,
        //     contract_id: 11786,
        // }
        if (!this.fundInfo || !this.fundInfo.order_id) {
            message.error('缺少必要的订单查询参数');
            return;
        }
        dispatch(getOrderInfoSaga({orderCode: this.fundInfo.order_code}));



        /** **/
        this.tableParam = {
            orderCode: this.fundInfo.order_code,
            start: 0,
            length: 20
        };
        this.getOrderTable(this.tableParam)
    }
    getOrderTable = (param) => {
        const { dispatch } = this.props;
        dispatch(getOrderTableSaga(_.assign(this.tableParam, param)))
    }
    confirmHandle = (type) => {
        if (type === 'confirm') {

            this.props.dispatch(confirmOrderSearch({
                order_id: this.fundInfo.order_id,
            }));
        }
        else if (type === 'reject') {
            this.props.dispatch(rejectOrder({
                confirmType: 'reject',
                visible: true,
            }));
        }
        else {
            throw new Error('unknow type')
        }

    };
    handleCancel = () => {
        this.props.dispatch(hideModal({
            visible: false,
        }));
    };

    handleOk = () => {
        const {
            dispatch,
            confirmType,
        } = this.props;
        const {
            order_code,
            order_id,
            order_type,
            c_id,
            contract_id,
        } = this.fundInfo;

        if (confirmType === 'confirm') {
            dispatch(confirmOrderSaga({
                order_id: order_id,
                c_id: c_id,
                orderCode: order_code,
                orderType: order_type,
                contractId: 　contract_id,
            }));
        }
        else {
            const value = this.rejectReson === null ? [] : this.rejectReson.textAreaRef.value.trim();
            
            if (value.length <= 0) {
                message.error('驳回原因必填');
                return;
            }
            else if (value.length >= 255) {
                message.error('驳回原因长度小于255个字符');
                return;
            }
            dispatch(rejectOrderSaga({
                orderCode: order_code,
                rejectReason: value,
                contractId: contract_id,
            }));
        }
    };

    getChangeState = (orderData, order_data) => {
        if (!orderData.data) return;
        const {
            isFinance,
        } = orderData.data;
        const order_staus = Number.parseInt(order_data.order_staus);
        if (isFinance == 1 && order_staus!==120) {
            if(!order_data.operaterTime) {
                return (
                    <div>
                        <Button type="primary" onClick={e => this.confirmHandle('confirm')} style={{ 'marginRight': 20 }}>确认到款</Button>
                        <Button onClick={e => this.confirmHandle('reject')}>驳回</Button>
                    </div>
                )
            }
        }

    };
    modalProps = () => {
        const {
            visible,
            isFetching,
        } = this.props;
        return {
            title: '提示',
            visible,
            onCancel: () => {
                this.handleCancel();
            },
            footer: (
                <span>
                    <Button  type="ghost" onClick={e => this.handleCancel()}>取消</Button>
                    <Button type="primary" loading={isFetching} onClick={e => this.handleOk()}>确定</Button>
                </span>
            )
        }
    }
    tableProps = () => {
        let {
            dataSource,
            current,
            total,
            pageSize,
        } = this.props;
        const pagination = {
            current: current,
            total: total,
            showSizeChanger: true,
            defaultPageSize: 20,
            showQuickJumper: true,
            pageSizeOptions: ['20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onShowSizeChange: (onPage, pageSize) => {
                this.getOrderTable({ length: pageSize })
            },
            onChange: (onPage) => {
                this.getOrderTable({ length: pageSize, start: (onPage - 1) * pageSize! })
            }
        };
        dataSource = dataSource.data ? dataSource.data.records : [];
        return {
            scroll: { x: 3150 },
            dataSource,
            columns: orderColumns,
            rowKey: (record) => record.transId,
        }
    }
    handleBack = () => {
        browserHistory.go(-1)
    };
    render() {
        const {
            orderData,
            company,
            orderContent,
            orderMoney,
            visible,
            confirmType,
            isFetching,
        } = this.props;
        const order_data = orderData.data && orderData.data.order ? orderData.data.order : {};
        order_data.operaterTime = orderData.data && orderData.data.operaterTime;
        order_data.operaterUser = orderData.data && orderData.data.operaterUser;
        const modalProps = this.modalProps();
        let confirmInfos = orderData.data && orderData.data.confirmInfos ? orderData.data.confirmInfos : [];
        return (
            <QueueAnim>
                <div key="FundConfirmInfo" className="wrapper-content">
                    <Row className="title-wrapper" type="flex" justify="start" align="middle">
                        <Col className="col-label">
                            <h2 style={{ color: '#108ee9', cursor:'pointer' }} onClick={this.handleBack}>
                                <Icon type="left-circle-o" style={{ marginRight: 4 }} />查看订单详情
                            </h2>
                        </Col>
                    </Row>
                    <Spin tip="Loading..." spinning={isFetching}>
                        {
                            (orderData.data && orderData.data.rejectReason && order_data.audit_status != '1') && (
                                <Alert message={`驳回原因：${orderData.data.rejectReason}`}
                                    type="warning"
                                    closable />
                            )
                        }
                        <OrderInfoMessage orderData={order_data} />
                        {/*table*/}
                        <OrderInfoTable {...this.tableProps() } />
                        {/*table end*/}
                        <Row className="title-wrapper order-info-title" type="flex" justify="start" align="top">
                            <Col>
                                <label className="col-label">认款备注 :  </label>
                            </Col>
                        </Row>
                        <Timeline style={{ maxHeight: 300, overflowY: 'auto', overflowX: 'hidden', wordBreak: 'break-all' }}>
                            {
                                confirmInfos.map((item, index) =>
                                    <TimelineItem key={index} >
                                        <Row>
                                            <Col>
                                                {item.claimTime}
                                            </Col>
                                            <Col>
                                                {item.confirmInfo}
                                            </Col>
                                        </Row>

                                    </TimelineItem>
                                )
                            }
                        </Timeline>
                        <Row type="flex" justify="start" align="middle" style={{ marginTop: '20px' }}>
                            <Col>
                                {

                                    this.getChangeState(orderData, order_data)
                                }
                            </Col>
                        </Row>
                    </Spin>
                    <Modal {...modalProps}>
                        {
                            confirmType == 'confirm' ? <FundConfirmAlert company={company} orderContent={orderContent} orderMoney={orderMoney} /> : (
                                <div>
                                    <Alert message='请填写驳回原因' type="error" />
                                    <TextArea style={{ height: 100 }} ref={node => this.rejectReson = node} />
                                </div>
                            )
                        }
                    </Modal>
                </div>
            </QueueAnim>
        )
    }
}

const mapStateToProps = (state: Any.Store):TStateProps => {
    let data = state.get("fundConfirmInfo");
    return {
        orderData: data.get('orderData'),
        dataSource: data.get('dataSource'),
        current: data.get('current'),
        pageSize: data.get('pageSize'),
        total: data.get('total'),
        company: data.get('company'),
        orderContent: data.get('orderContent'),
        orderMoney: data.get('orderMoney'),
        visible: data.get('visible'),
        confirmType: data.get('confirmType'),
        isFetching: data.get('isFetching'),
    }

}

export default connect(mapStateToProps)(FundConfirmInfo);