
import * as React from 'react';
import { Alert, Row, Col } from 'antd';

export const FundConfirmAlert = ({company, orderContent, orderMoney}) => {
    return (
        <div>
            <Alert message='请再次核对付款信息' type="warning"/>
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{textAlign:'right'}}>企业名称：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>{company}</Col>
            </Row>
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{textAlign:'right'}}>订单内容：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>{orderContent}</Col>
            </Row>
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{textAlign:'right'}}>金额：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>¥ {orderMoney}</Col>
            </Row>
        </div>
    )
}