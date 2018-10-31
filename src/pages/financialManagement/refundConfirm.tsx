import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Map, List } from 'immutable';
import {
    Button,
    Form,
    Card,
    Table,
    Input,
    Select,
    Modal,
    Checkbox,
    message,
} from "antd";
import {
    PAGINATION_PARAMS,
} from "../../global/global";
import { statePaginationConfig } from "../../util/pagination";
import {
    listGet,
} from '../../action/financialManagement/refundConfirmAction';
import { fetchFn} from '../../util/fetch';
import { DOMAIN_OXT } from '../../global/global';
const confirm = Modal.confirm;


const FormItem = Form.Item;
const Option = Select.Option;

const actions = {
    listGet,
};

interface TStateProps {
    dataSource: List<Map<string, any>>;
    fetching: boolean;
    total: number;
    userInfo: Any.UserInfo;
}
type TDispatchProps = typeof actions;

type RefundProps = TStateProps & TDispatchProps;

interface RefundState {
    pageSize: number;
    currentPage: number;
    orderStatus: any;
}
class Refund extends Component<RefundProps, RefundState> {
    orderCode: Input | null;
    cName: Input | null;
    checkbox: any;
    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
            orderStatus: '130',
        };
        this.search();
    }
    search = () => {
        this.props.listGet(this.searchParams())
    }
    searchParams() {
        const {
            currentPage,
            pageSize,
        } = this.state;
        return {
            currentPage,
            pageSize,
            orderCode: this.orderCode && this.orderCode.input.value,
            cName: this.cName && this.cName.input.value,
            orderStatus: this.state.orderStatus,
        };
    }
    columns = () => [
        {
            title: '订单号',
            dataIndex: 'orderCode',
            key: 'orderCode',
            width: 250,
        },
        {
            title: '客户名称',
            dataIndex: 'cName',
            key: 'cName',
            width: 250,
        },
        {
            title: '订单类型',
            dataIndex: 'orderTypeName',
            key: 'orderTypeName',
            width: 200,
        },
        {
            title: '金额',
            dataIndex: 'orderMoney',
            key: 'orderMoney',
            width: 250,
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatusName',
            key: 'orderStatusName',
            width: 150,
        },
        {
            title: '操作',
            key: 'handle',
            render: (text) => {
                if(text.orderStatusName !== '待退费') {
                    return '/';
                }
                return <a href="#" onClick={e => this.refundConfirm(e, {contractId:text.contractId, cName: text.cName})}>确认已退费</a>
            },
            width: 150,
        },
    ]
    refundConfirm = (e: React.MouseEvent<HTMLAnchorElement>, params: {contractId:string, cName:string}) => {
        e.preventDefault();
        confirm({
            title: `公司名称：${params.cName}`,
            content: <Checkbox ref={node => this.checkbox = node}><span style={{color: '#f60'}}>我确认：款已打出，退费已完成</span></Checkbox>,
            onOk: () => {
                return new Promise(async (reslove, reject) => {
                    if(!this.checkbox || this.checkbox.rcCheckbox.state.checked === false) {
                        message.error('请确认已完成退费');
                        return reject();
                    }
                    const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/order/member-order/confirm/refund`, {
                        contractId: params.contractId,
                        userName: this.props.userInfo.userName,
                    }).then(data => data as any);
                    if (data.status === 0) {
                        reslove();
                        message.success('退费完成');
                        this.search();
                    }
                    else {
                        reject();
                    }
                })
            },
        });
    }
    pagination = () => {
        const {
            pageSize,
            currentPage,
        } = this.state;
        const {
            total
        } = this.props;

        return statePaginationConfig(
            {
                pageSize,
                currentPage,
                total,
            },
            (newParams) => this.props.listGet({ ...this.searchParams(), ...newParams, }),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize,
                })
            }
        )
    }
    render() {
        const {
            fetching,
            dataSource,
        } = this.props;
        return (
            [
                <Form layout="inline">
                    <FormItem label="订单号">
                        <Input placeholder="订单号" ref={node => this.orderCode = node} />
                    </FormItem>
                    <FormItem label="客户名称">
                        <Input placeholder="客户名称" ref={node => this.cName = node} />
                    </FormItem>
                    <FormItem label="订单状态">
                        <Select value={this.state.orderStatus} onSelect={(value) => this.setState({ orderStatus: value })} style={{ width: 100 }} >
                            <Option value="">全部</Option>
                            <Option value="130">待退费</Option>
                            <Option value="140">已退费</Option>
                        </Select>
                    </FormItem>
                    <FormItem style={{ marginLeft: 100 }}>
                        <Button type="primary" loading={fetching} onClick={this.search}>搜索</Button>
                    </FormItem>
                </Form>,
                <Table
                    style={{marginTop: 20}}
                    dataSource={dataSource.toJS()}
                    pagination={this.pagination()}
                    columns={this.columns()}
                    loading={fetching}
                    scroll={{x: 1250, y: window.innerHeight * 0.6}}
                />
            ]

        )
    }
}

const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('refund');
    return {
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => bindActionCreators(actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Refund);