/**
 * Created by caozheng on 2017/1/4.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from './../../redux-realize';
import { Button, Input, Table, Row, Col, Radio, DatePicker, Modal, Alert, Spin, message } from 'antd';
import * as moment from 'moment';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    triggerInvoiceSaga,
    setOrderType,
    setInvoiceStatus,
    setInvoiceModal,
    invoicingSaga,
    invoicing,
    updateSearchParams,
    updateCacheSearchParams,
} from '../../action/financialManagement/invoiceAction';
const RangePicker = DatePicker.RangePicker;
import "../../css/components/infoComponent.less";
import {
    ROUTER_PATH,
} from '../../global/global'
import {
    paginationConfig,
} from '../../util/pagination';



class InvoiceTable extends Table<any> { }

interface TStateProps {
    cacheSearchParams?: any;
    searchParams?: any;
    dataSource?: any;
    fetching?: any;
    visible?: boolean;
    modalData?: any;
    userInfo: Any.UserInfo;
    total: number;
}

interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type InvoiceProps = TStateProps &  TDispatchProps;

class Invoice extends React.Component<InvoiceProps, any> {

    constructor(props) {
        super(props);
    }

    columns: any = [{
        title: '发票抬头',
        key: 'invoice_title',
        dataIndex: 'invoice_title',
        width: 300,
    }, {
        title: '发票类型',
        key: 'invoice_type_name',
        dataIndex: 'invoice_type_name',
        width: 300,
    }, {
        title: '发票号码',
        key: 'invoice_number',
        dataIndex: 'invoice_number',
        width: 300,
    }, {
        title: '订单号',
        key: 'order_id',
        dataIndex: 'order_id',
        width: 200,
    }, {
        title: '订单金额',
        key: 'invoice_price',
        dataIndex: 'invoice_price',
        width: 200,
    }, {
        title: '操作',
        key: 'action',
        render: (data) => {
            // if(data.invoice_status!=2 && data.pay_status==1) {
            return (
                <div>
                    {/*<Link className="cell-a-distance" to={`${ROUTER_PATH}/newadmin/financial/invoice/info`}>发票详情</Link>*/}
                    <a href="" className="cell-a-distance" onClick={e => this.gotoInfo(e, data.id)}>发票详情</a>
                    <a onClick={() => this.props.dispatch(invoicing(data))}>开发票</a>
                </div>)
            // }
            // return <Link to={`${ROUTER_PATH}/newadmin/financial/invoice/info`}>发票详情</Link>
            // return <a href="#" className="cell-a-distance" onClick={e => this.gotoInfo(e, data.id)}>发票详情</a>
        }
    }];

    componentDidMount() {
        const {
            dispatch,
            searchParams,
        } = this.props;
        dispatch(triggerInvoiceSaga(searchParams));
    };
    cName: any;
    invoiceNumber: any;
    modalInvoiceNumber: any;
    // 记录当前选择的时间
    // rangePicker = ['', ''];
    gotoInfo = (e, id) => {
        e.preventDefault();
        sessionStorage.setItem('invoice', JSON.stringify({invoiceId: id}));
        browserHistory.push(`${ROUTER_PATH}/newadmin/financial/invoice/info`);
    }
    pagination = () => {
        const {
            dispatch,
            searchParams,
            total,
        } = this.props;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        return paginationConfig({ ...searchParams, currentPage, total, pageSize }, triggerInvoiceSaga, dispatch)
    }

    /**
     * 参数改变之后的修改state的缓存CacheSearchParams
     */
    searchHandleChange = (data) => {
        this.props.dispatch(updateCacheSearchParams({
            ...data
        }));
    };
    buttonHandleSearch = () => {
        const { cacheSearchParams, dispatch } = this.props;
        dispatch(updateSearchParams(cacheSearchParams));
        dispatch(triggerInvoiceSaga(cacheSearchParams));
    };
    rangePicker = (startTime, endTime) => {
        /**
         * rangePicker的默认值
         */
        const format = 'YYYY-MM-DD';
        const rangePickerDefaultValue = startTime && endTime && [moment(startTime, format), moment(endTime, format)];
        return {
            format,
            onChange: (moment, timeString) => {
                this.searchHandleChange({
                    startTime: timeString[0],
                    endTime: timeString[1],
                });
            },
            style: {
                width: 338,
            }
        }
    }
    modalHandleOk = () => {
        const {
            dispatch,
            modalData,
            userInfo,
        } = this.props;
        const invoice_number = this.modalInvoiceNumber.input.value;
        if (invoice_number.trim() === '') {
            message.error('请填写发票号码');
            return;
        }
        const {
            id,
            c_id,
        } = modalData;
        dispatch(invoicingSaga({
            invoice_id: id,
            c_id,
            invoice_number,
            update_user: userInfo.userName,
            callBack: () => {
                this.buttonHandleSearch();
            }
        }));

    };
    modalHandleCancel = () => {
        this.props.dispatch(setInvoiceModal(false));
    };
    modalProps = () => {
        const {
            visible,
            fetching,
        } = this.props;
        return {
            visible,
            title: '提示',
            onCancel: () => this.modalHandleCancel(),
            footer: (
                <span>
                    <Button  type="ghost" onClick={e => this.modalHandleCancel()}>取消</Button>
                    <Button  type="primary" loading={fetching} onClick={e => this.modalHandleOk()}>确定</Button>
                </span>
            )
        }
    }
    render() {
        const {
            dataSource,
            fetching,
            visible,
            modalData,
            searchParams,
            cacheSearchParams,
        } = this.props;
        const {
            orderType,
            invoiceStatus,
            startTime,
            endTime,
            invoiceNumber,
            invoiceTitle,
        } = cacheSearchParams;



        /**
         * 分页配置
         */
        const pagination = this.pagination();

        /**
         * 渲染reactNode
         */
        return (
            <QueueAnim>
                <div key="Invoice" className="wrapper-content">
                    <div className="form-site">
                        <Row type="flex" justify="start" align="middle">
                            <Col className="col-label">
                                <label>发票类型：</label>
                            </Col>
                            <Col>
                                <Radio.Group value={invoiceStatus} onChange={ (e) => this.searchHandleChange({ invoiceStatus: e.target.value })}>
                                    <Radio.Button value="">全部</Radio.Button>
                                    <Radio.Button value="1">代开发票</Radio.Button>
                                    <Radio.Button value="2">已开发票</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label">
                                <label>订单类型：</label>
                            </Col>
                            <Col>
                                <Radio.Group value={orderType} onChange={ (e) => this.searchHandleChange({ orderType: e.target.value })}>
                                    <Radio.Button value="0">全部</Radio.Button>
                                    <Radio.Button value="1">会员费订单</Radio.Button>
                                    <Radio.Button value="2">社保费订单</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label">
                                <label>企业名称：</label>
                            </Col>
                            <Col>
                                <Input placeholder="企业名称"
                                    value={invoiceTitle}
                                    onChange={e => this.searchHandleChange({ invoiceTitle: e.target['value'] })}
                                    ref={node => this.cName = node}
                                    style={{ width: 234 }} />
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label">
                                <label>发票号：</label>
                            </Col>
                            <Col>
                                <Input placeholder="发票号"
                                    defaultValue=""
                                    value={invoiceNumber}
                                    onChange={e => this.searchHandleChange({ invoiceNumber: e.target['value'] })}
                                    ref={node => this.invoiceNumber = node}
                                    style={{ width: 234 }} />
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label">
                                <label>时间范围：</label>
                            </Col>
                            <Col>
                                <RangePicker {...this.rangePicker(startTime, endTime) } />
                            </Col>
                            <Button className="col-distance" type="primary" onClick={this.buttonHandleSearch}>搜索</Button>
                        </Row>
                    </div>

                    <InvoiceTable className="fixed-distance"
                        dataSource={dataSource}
                        pagination={pagination}
                        loading={fetching}
                        rowKey={record => record.order_id}
                        scroll={{ y: 500, x: 1450 }}
                        columns={this.columns} />


                    <Modal className="invoice-modal" title="提示" {...this.modalProps() }>
                        <Spin spinning={fetching}>
                            <Alert message="请输入发票号码"
                                type="warning"
                            />
                            <Row className="row-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label">
                                    <label>发票抬头：</label>
                                </Col>
                                <Col>{modalData && modalData.invoice_title}</Col>
                            </Row>
                            <Row className="row-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label">
                                    <label>订单内容：</label>
                                </Col>
                                <Col>{modalData && modalData.order_name}</Col>
                            </Row>
                            <Row className="row-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label">
                                    <label>金额：</label>
                                </Col>
                                <Col>¥ {modalData && (modalData.invoice_price || 0)}</Col>
                            </Row>
                            <Row className="row-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label">
                                    <label>发票号码：</label>
                                </Col>
                                <Col>
                                    <Input placeholder="发票号码"
                                        defaultValue=""
                                        style={{ width: 234 }} ref={node => this.modalInvoiceNumber = node} />
                                </Col>
                            </Row>
                        </Spin>
                    </Modal>
                </div>
            </QueueAnim>

        )
    }
}

const mapStateToProps = (state: Any.Store):TStateProps => {
    let data = state.get('invoiceReducer');
    return {
        fetching: data.get('fetching'),
        searchParams: data.get('searchParams').toJS(),
        cacheSearchParams: data.get('cacheSearchParams').toJS(),
        dataSource: data.get('dataSource').toJS(),
        visible: data.get('visible'),
        modalData: data.get('modalData'),
        total: data.get('total'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

// const mapDispatchToProps = (dispatch) => bindActionCreators(InvoiceAction, dispatch);


export default connect(mapStateToProps)(Invoice)
