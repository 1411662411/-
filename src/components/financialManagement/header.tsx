/**
 * Created by caozheng on 2017/2/21.
 */
import * as React from 'react';
import { Row, Col, Icon } from 'antd';
import { formatDateTime } from '../../util/timeFormat';
import { browserHistory } from 'react-router';

// headerNo
const headerNames = {
    0: '请款单明细', // 社保款请款
    1: '请款单明细：', // 社保专员请款详情
    2: '审批请款单号：', // 业务方审批
    3: '审批请款单号：', // 财务方审批
    4: '打款信息录入_请款单号：', // 信息录入
    5: '打款信息录入_请款单号：', // 信息录入详情
};


export const Header = ({detailData, detailArgs}) => {
    const handleBack = () =>{
        browserHistory.go(-1)
    };
    const {
        businessType,
        insuranceFeesMonth,
        socialAddress,
        prepaymentsCode,
    } = detailData;
    const {
        headerNo,
        month,
        cityName,
    } = detailArgs
    
    return (
        <div className="cash-out">
            <Row className="title-wrapper" type="flex" justify="start" align="middle">
                <Col  className="col-label">
                    <h2 style={{color: '#108ee9',cursor:'pointer'}} onClick={handleBack}>
                        <Icon type="left-circle-o" style={{marginRight:4}} />{headerNo !== undefined && headerNames[headerNo]}{prepaymentsCode && prepaymentsCode}
                    </h2>
                </Col>
            </Row>
            <Row type="flex" justify="start" align="middle">
                <Col className="header-distance">业务类型：{
                    (()=>{
                        if (businessType==14) {
                            return "社保五险一金"
                        }else if(businessType==15) {
                            return "五险"
                        }else {
                            return "公积金"
                        }
                    })()
                }</Col>
                <Col className="header-distance">社保缴费月：{
                    headerNo != 0 ? 
                        insuranceFeesMonth && formatDateTime(insuranceFeesMonth, 'merge')
                        :
                        month
                    }
                </Col>
                <Col className="header-distance">参保地：{
                    headerNo != 0 ?
                        socialAddress && socialAddress
                        :
                        cityName
                }</Col>
            </Row>
        </div>

    )
};