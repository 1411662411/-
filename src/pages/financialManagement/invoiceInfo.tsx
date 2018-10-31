/**
 * Created by caozheng on 2017/1/4.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { Row, Col, Icon, Spin} from 'antd';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as moment from 'moment';
import {
    invoiceinfoSaga,
    invoiceinfoDataClear,
} from '../../action/financialManagement/invoiceInfoAction';
import './../../css/financialManagement/invoiceInfo';

interface InvoiceInfoProps {
    fetching: boolean;
    dataSource: any;
    dispatch: any;
}
class InvoiceInfo extends React.Component<InvoiceInfoProps, any> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const invoice_id = JSON.parse(sessionStorage.getItem('invoice')!).invoiceId;
        this.props.dispatch(invoiceinfoSaga({
            invoice_id,
        }));
    }
    handleBack = () => {
        this.props.dispatch(invoiceinfoDataClear({}));
        browserHistory.go(-1)
    };
    render() {
        const {
            fetching,
            dataSource
        } = this.props;
        let invoice:any = { };
        let order:any = { };
        if(dataSource.invoice && dataSource.order) {
            invoice = dataSource.invoice.records.data[0];
            order = dataSource.order.records.data[0];
        }
        return (
            <QueueAnim>
                <Spin spinning={fetching}>
                    <div key="InvoiceInfo">
                        <Row className="title-wrapper" type="flex" justify="start" align="middle">
                            <Col  className="col-label">
                                <h2 style={{color: '#108ee9', cursor:'pointer'}} onClick={e => this.handleBack()}>
                                    <Icon type="left-circle-o" style={{marginRight:4}} />查看发票详情
                                </h2>
                            </Col>
                        </Row>

                        <Row className="order-info-title" type="flex" justify="start" align="middle">
                            <span>发票信息</span>
                        </Row>
                        <div className="info-row-distance">
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">发票抬头：</label>
                                    <span>{ invoice.invoice_title || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">发票代码：</label>
                                    <span>{ invoice.invoice_code  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">发票号码：</label>
                                    <span>{ invoice.invoice_number  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">发票状态：</label>
                                    <span>{ invoice.invoice_status  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">开发票时间：</label>
                                    <span>{ invoice.open_invoice_time  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">操作人：</label>
                                    <span>{ invoice.open_invoice_user  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">金额：</label>
                                    <span>{ invoice.invoice_price  || '/' }</span>
                                </Col>
                            </Row>
                        </div>

                        <Row className="order-info-title" type="flex" justify="start" align="middle">
                            <span>发票寄送信息</span>
                        </Row>
                        <div className="info-row-distance">
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">发票信息：</label>
                                    <span>{ order.is_claim_invoice  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">发票快递方式：</label>
                                    <span>{ invoice.invoice_code  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">邮编：</label>
                                    <span>{ invoice.post_zip  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">寄送地址：</label>
                                    <span dangerouslySetInnerHTML={{__html: invoice.post_address || '/'}}></span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">手机：</label>
                                    <span>{ invoice.post_tel  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">收件人：</label>
                                    <span>{ invoice.post_contacts  || '/' }</span>
                                </Col>
                            </Row>
                        </div>

                        <Row className="order-info-title" type="flex" justify="start" align="middle">
                            <span>订单信息</span>
                        </Row>
                        <div className="info-row-distance">
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">订单号 ：</label>
                                    <span>{ order.order_code  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">企业名称：</label>
                                    <span>{ order.c_name  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">订单内容：</label>
                                    <span>{ order.order_name  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">订单类型：</label>
                                    <span>{ order.order_type_name  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">金额：</label>
                                    <span>¥ { order.order_money  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">汇款识别码：</label>
                                    <span>{ order.heading_code  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">订单状态：</label>
                                    <span>{order.order_staus_name  || '/'}</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">订单创建时间：</label>
                                    <span>{ moment(order.create_time , 'X').format('YYYY-MM-DD') || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">支付方式：</label>
                                    <span>{ order.pay_method  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">确认到款时间：</label>
                                    <span>{ order.confirm_time  || '/' }</span>
                                </Col>
                            </Row>
                            <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                <Col span={12}>
                                    <label className="col-label">确认到款操作人：</label>
                                    <span>{ order.comfirm_user  || '/' }</span>
                                </Col>
                                <Col span={12}>
                                    <label className="col-label">发票信息：</label>
                                    <span>{ order.is_claim_invoice  || '/' }</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </QueueAnim>
        )
    }
}

const mapStateToProps = (state: any) => {
    const data = state.get('invoiceInfo');
    return {
        fetching: data.get('fetching'),
        dataSource: data.get('dataSource').toJS(),
    }
};

export default connect(mapStateToProps)(InvoiceInfo)