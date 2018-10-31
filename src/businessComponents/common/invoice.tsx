import React, {
    Component,
} from 'react';
import {
    connect,
} from 'react-redux';
import {
    Spin,
    Form,
    Alert,
} from 'antd';
import InvoiceUi from '../../components/common/invoice';
import {
    DOMAIN_OXT,
} from '../../global/global';
import {
    getInvoiceBaseInfoSubmit,
    getInvoiceBaseInfoDetail,
} from '../../action/businessComponents/invoiceAction';
import Immutable from 'immutable';
import './invoice.less';
import {
    accSub,
    accAdd,
} from '../../util/math';
import  {formatMoney } from '../../util/moneyFormat';
const FormItem = Form.Item;
const uploadApi = `${DOMAIN_OXT}/api/order/invoice/imginput`;
const addExpressAddressApi = `${DOMAIN_OXT}/apiv2_/account/address/create`;
const editExpressAddressApi = `${DOMAIN_OXT}/apiv2_/account/address/update`;
const deleteExpressAddressApi = `${DOMAIN_OXT}/apiv2_/account/address/del`;


interface InvoicePropsNew {
    
}


interface TStateProps {
    invoiceBaseInfo: Immutable.Map<any, any>
    invoiceBaseInfoFetching: boolean;
    activeId: number;
}
interface TOwnProps {
    type: 1 | 2 | 3; /* 1提交， 2： 修正， 3： 查看 */
    codeId?: number | string; /* 发票对应的订单code */
    contractId?: number | string; /* 合同id */
    cId?: number; /* 企业id */
    orderType?: number;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type InvoiceProps = TStateProps & TOwnProps & TDispatchProps;

class Invoice extends Component<InvoiceProps , {}> {
    constructor(props) {
        super(props);
        const {
            dispatch,
            type,
            cId,
            codeId,
            contractId,
        } = this.props;
        if (type === undefined) {
            throw new Error('需要提供type, type: 1 | 2 | 3; /* 1提交， 2： 修正， 3： 查看 */ ');
        }

        if (type === 1) {
            dispatch(getInvoiceBaseInfoSubmit({ cId }));
        }
        if (type === 2 || type === 3) {
            dispatch(getInvoiceBaseInfoDetail({ id: codeId, contractId, type, cId,  }))
        }


    }
    Invoice: any;
    getResult = (e) => {
        return this.Invoice.getResult(e);
    }
    invoiceUiProps = () => {
        const {
            invoiceBaseInfo,
            type,
            orderType
        } = this.props;
        if (type === 1) {
            
            return {
                uploadApi,
                addExpressAddressApi,
                editExpressAddressApi,
                deleteExpressAddressApi,
                edit: true,
                orderType,
                expressInfo: invoiceBaseInfo.get('expressInfo'),
                baseInfo: invoiceBaseInfo.get('baseInfo'),
            }
        }
        if (type === 2) {
            return {
                uploadApi,
                addExpressAddressApi,
                editExpressAddressApi,
                deleteExpressAddressApi,
                edit: true,
                orderType,
                expressInfo: invoiceBaseInfo.get('expressInfo'),
                baseInfo: invoiceBaseInfo.get('baseInfo'),
                activeId: invoiceBaseInfo.get('activeId'),
            }
        }
        if (type === 3) {
            return {
                edit: false,
                orderType,
                baseInfo: invoiceBaseInfo.get('baseInfo'),
                expressInfo: invoiceBaseInfo.get('expressInfo'),
            }
        }

        throw new Error('需要提供type, type: 1 | 2 | 3; /* 1提交， 2： 修正， 3： 查看 */ ');
    }
    render() {
        const {
            invoiceBaseInfoFetching,
            type,
            invoiceBaseInfo,
        } = this.props;
     
        const orderInfo = invoiceBaseInfo.get('orderInfo') !== undefined ? invoiceBaseInfo.get('orderInfo').toJS() : {};
        const {
            order = {} as any,
            orderMoney = {} as any,
            differenceMoney = {} as any,
            payMoney = {} as any,
            invoicePrice,
            dimissionReason,
            examineStatus,
            productName,
        } = orderInfo;
        const {
            orderType,
            orderTypeName,
            shippingCost,
            payMethodFee,
        } = order;
        const orderMoneyTotal = order.orderMoney;
        console.log(order)
        return (
            <div>
                {this.props.invoiceBaseInfoFetching === true ?
                    <Spin spinning={true}>
                        <div style={{ height: 300 }}></div>
                    </Spin>
                    :
                    <div className="business-components-invoice-wrapper">
                        {
                            type === 2
                            &&
                            examineStatus === 3
                            &&
                            <Alert
                                message="审核结果：被驳回"
                                description={dimissionReason}
                                type="error"
                                closable
                                showIcon
                            />
                        }
                        <InvoiceUi ref={(node) => this.Invoice = node} {...this.invoiceUiProps() }/>
                        {
                            type === 3 &&
                            <div style={{ borderTop: '1px solid #e9e9e9', marginTop: 40, paddingTop: 20 }}>
                                {orderType !==6 && <Form layout="inline">
                                    <FormItem label="订单类型"
                                        style={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        {orderTypeName}
                                    </FormItem>
                                </Form>
                                }
                                {
                                    (orderType < 6 )?
                                        orderType === 1 ?
                                            <div>
                                                <div className="ant-table ant-table-large ant-table-bordered  my-table">
                                                    <div className="ant-table-body">
                                                        <table>
                                                            <thead className="ant-table-thead">
                                                                <tr>
                                                                    <th className="text-align-center"><span>会员类型</span></th>
                                                                    <th className="text-align-center"><span>订单发票总额</span></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="ant-table-tbody">
                                                                <tr>
                                                                    <td className="text-align-center">{productName}</td>
                                                                    <td className="text-align-center">{orderMoneyTotal}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="order-money-wrapper">
                                                    <div className="member-order-type fixed-grid">
                                                        <div className="fixed-grid-item">
                                                            <span className="left">本次会员费支付总计：</span>
                                                            <span className="right"> {formatMoney(orderMoneyTotal)}</span>
                                                        </div>
                                                        <div className="fixed-grid-item">
                                                            <span className="left">快递费：</span>
                                                            <span className="right">{formatMoney(shippingCost)}</span>
                                                        </div>
                                                        <div className="fixed-grid-item">
                                                            <span className="left">在线支付手续费：</span>
                                                            <span className="right">{formatMoney(payMethodFee)}</span>
                                                        </div>
                                                        <div className="fixed-grid-group">
                                                            <div className="fixed-grid-item">
                                                                <span className="left">订单发票总额：</span>
                                                                <span className="right"><strong className="invoice-price">{formatMoney(order.invoicePrice)}</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="social-order-type-wrapper">
                                                <div className="ant-table ant-table-large ant-table-bordered  my-table">
                                                    <div className="ant-table-body">
                                                        <table>
                                                            <thead className="ant-table-thead">
                                                                <tr>
                                                                    <th className="text-align-center"><span>分类</span></th>
                                                                    <th className="text-align-center"><span>社保<br />企业合计</span></th>
                                                                    <th className="text-align-center"><span>社保<br />个人合计</span></th>
                                                                    <th className="text-align-center"><span>公积金<br />企业合计</span></th>
                                                                    <th className="text-align-center"><span>公积金<br />个人合计</span></th>
                                                                    <th className="text-align-center"><span>残保金<br />企业合计</span></th>
                                                                    <th className="text-align-center"><span>其他</span></th>
                                                                    <th className="text-align-center"><span>社保款合计</span></th>
                                                                    <th className="text-align-center"><span>服务费合计<br />(月/人)</span></th>
                                                                    <th className="text-align-center"><span>总计</span></th>
                                                                </tr>

                                                            </thead>
                                                            <tbody className="ant-table-tbody">
                                                                <tr>
                                                                    <td className="text-align-center">本月社保预收款</td>
                                                                    <td className="text-align-center">{orderMoney.socialCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.socialPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.fundCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.fundPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.residualTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.otherTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.socialTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.serviceTotalMoney}</td>
                                                                    <td className="text-align-center">{orderMoney.totalMoney}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-align-center">本月多退少补明细</td>
                                                                    <td className="text-align-center">{differenceMoney.socialCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.socialPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.fundCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.fundPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.residualTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.otherTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.socialTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.serviceTotalMoney}</td>
                                                                    <td className="text-align-center">{differenceMoney.totalMoney}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-align-center">本月社保款发票明细</td>
                                                                    <td className="text-align-center">{payMoney.socialCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.socialPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.fundCompanyTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.fundPersonTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.residualTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.otherTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.socialTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.serviceTotalMoney}</td>
                                                                    <td className="text-align-center">{payMoney.totalMoney}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="order-money-wrapper">
                                                    { (orderType !==6 && orderType !==5 && order.offsetTotal!=0) && <div className="order-money-wrapper-left">
                                                        <div>
                                                            <strong>使用账户余额</strong>
                                                        </div>
                                                        <div className="ant-table ant-table-large ant-table-bordered  my-table">
                                                            <div className="ant-table-body">
                                                                <table>
                                                                    <thead className="ant-table-thead">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>社保款余额</th>
                                                                            <th>服务费余额</th>
                                                                            <th>总计</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="ant-table-tbody">
                                                                        <tr>
                                                                            <td><b>余额</b></td>

                                                                            <td>{order.accountBalanceMoney}</td>
                                                                            <td>{order.accountServiceBalanceMoney}</td>
                                                                            <td>{order.accountTotal}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><b>抵扣</b></td>

                                                                            <td>{order.balanceMoney}</td>
                                                                            <td>{order.serviceBalanceMoney}</td>
                                                                            <td>{order.offsetTotal}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><b>付款后结余</b></td>
                                                                            <td>{accAdd(order.accountBalanceMoney, order.balanceMoney)}</td>
                                                                            <td>{accAdd(order.accountServiceBalanceMoney, order.serviceBalanceMoney)}</td>
                                                                            <td>{accAdd(order.accountTotal, order.offsetTotal)}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                    <div className="member-order-type-warpper">
                                                        <div className="member-order-type fixed-grid">
                                                            <div className="fixed-grid-item">
                                                                <span className="left">订单总金额：</span>
                                                                <span className="right">{formatMoney(orderMoneyTotal)}</span>
                                                            </div>
                                                            <div className="fixed-grid-item">
                                                                <span className="left">多退少补合并金额：</span>
                                                                <span className="right">{formatMoney(order.differenceTotal)}</span>
                                                            </div>
                                                            <div className="fixed-grid-item">
                                                                <span className="left">社保款余额抵扣：</span>
                                                                <span className="right">{formatMoney(order.balanceMoney)}</span>
                                                            </div>
                                                            <div className="fixed-grid-item">
                                                                <span className="left">服务费余额抵扣：</span>
                                                                <span className="right">{formatMoney(order.serviceBalanceMoney)}</span>
                                                            </div>
                                                            <div className="fixed-grid-item">
                                                                <span className="left">在线支付手续费：</span>
                                                                <span className="right">{formatMoney(order.payMethodFee)}</span>
                                                            </div>
                                                            <div className="fixed-grid-item">
                                                                <span className="left">快递费：</span>
                                                                <span className="right">{formatMoney(shippingCost)}</span>
                                                            </div>
                                                            <div className="fixed-grid-group">
                                                                <div className="fixed-grid-item">
                                                                    <span className="left">订单发票总额：</span>
                                                                    <span className="right"><strong className="invoice-price">{formatMoney(order.invoicePrice)}</strong></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        :
                                        <div className="order-money-wrapper">
                                            <div className="member-order-type-warpper">
                                                <div className="member-order-type fixed-grid">
                                                    
                                                    <div className="fixed-grid-group">
                                                        <div className="fixed-grid-item">
                                                            <span className="left">订单发票总额：</span>
                                                            <span className="right"><strong className="invoice-price">{formatMoney(order.invoicePrice)}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                }

                            </div>
                        }

                    </div>

                }
            </div>
        )
    }
}

const mapStateToProps = (state: Any.Store, ownProps: TOwnProps): TStateProps => {
    const data = state.get('invoiceBusinessComponents');
    return {
        invoiceBaseInfo: data.get('invoiceBaseInfo'),
        invoiceBaseInfoFetching: data.get('invoiceBaseInfoFetching'),
        activeId: data.get('activeId'),
    };
}

export default connect(
    mapStateToProps,
    (dispatch) => ({ dispatch }),
    (stateProps, dispatchProps, parentProps) => ({
        ...stateProps,
        ...parentProps,
        ...dispatchProps
    }),
    { withRef: true }
)(Invoice);

