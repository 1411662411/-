import * as React from 'react';
import { Row, Col } from 'antd';
import { formatDateTime } from '../../util/timeFormat';
import {formatMoney} from '../../util/util';
function getOpenTicket(state) {
    if(state==null)
        return "/";
    else if(state == 0)
        return "否";
    else if(state == 1||state == '索取')
        return "是";
    else
        return "否"

}
export const OrderInfoMessage = (props) =>{
    const orderData = props.orderData ? props.orderData : '' ;
    return (
        <div style={{marginBottom:20}}>
            <Row className="order-info-title" type="flex" justify="start" align="middle">
                <span>订单详情</span>
            </Row>
                <div >
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">订单号：</label>
                            <span>{orderData? orderData.order_code: "/"}</span>
                        </Col>
                        <Col span={12}>
                            <label className="col-label">企业名称：</label>
                            <span>{orderData? orderData.c_name: "/"}</span>
                        </Col>
                    </Row>
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">订单内容：</label>
                            <span>{orderData? orderData.order_name: "/"}</span>
                        </Col>
                        <Col span={12}>
                            <label className="col-label">订单类型：</label>
                            <span>{orderData? orderData.order_type_name: "/"}</span>
                        </Col>
                    </Row>
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">金额：</label>
                            <span>¥ {orderData? formatMoney(orderData.order_money, 2, ''): "/"}</span>
                        </Col>
                        <Col span={12}>
                            <label className="col-label">支付方式：</label>
                            <span>{orderData? orderData.pay_method_name: "/"}</span>
                        </Col>
                    </Row>
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">订单状态：</label>
                            <span>{orderData? orderData.order_staus_name: "/"}</span>
                        </Col>
                        <Col span={12}>
                            <label className="col-label">是否开发票：</label>
                            <span>{orderData && getOpenTicket(orderData.is_claim_invoice) }</span>
                        </Col>
                    </Row>
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">订单创建时间：</label>
                            <span>{orderData && orderData.create_time}</span>
                        </Col>
                        <Col span={12}>
                            <label className="col-label">确认到款时间：</label>
                            <span>{(orderData&&orderData.operaterTime)?orderData.operaterTime:"/"}</span>
                        </Col>
                    </Row>
                    <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                        <Col span={12}>
                            <label className="col-label">业务端到款认领操作人:</label>
                            <span>{(orderData&&orderData.operaterUser)? orderData.operaterUser: "/"}</span>
                        </Col>
                    </Row>
            </div>
        </div>
    )
};