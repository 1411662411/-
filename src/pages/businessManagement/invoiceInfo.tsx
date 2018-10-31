import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import {
    Form,
    Input,
    Table,
    Card,
    Radio,
    Button,
    Divider,
    Badge,
    Modal,
    message,
} from 'antd';
import {
    PAGINATION_PARAMS,
    PHP_DOMAIN,
    DOMAIN_OXT,
} from '../../global/global';
import {
    fetching,
    getInvoiceInfo,
} from '../../action/businessManagement/invoiceInfoAction';
import {
    statePaginationConfig,
} from '../../util/pagination';
import {
    fetchFn,
} from '../../util/fetch';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;


const actionCreators = {
    getInvoiceInfo,
}

interface InvoiceInfoState {
    currentPage: number;
    pageSize: number;
    examineStatus: number | string;
    invoiceTitle: string;
    payStatus: number | string;
}
type TDispatchProps = typeof actionCreators;
interface TStateProps {
    total: number;
    dataSource: List<Map<string, any>>
    fetching: boolean;
    buttons: List<Map<'highlightNumber' | 'highlightText' | 'id' | 'name', 'string' | 'number'>>
}

type InvoiceInfoProps = TStateProps & TDispatchProps;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
    }
}




class InvoiceInfo extends Component<InvoiceInfoProps, InvoiceInfoState> {
    constructor(props: InvoiceInfoProps) {
        super(props);
        let sessionStorageParams = sessionStorage.getItem('businessmanagement/invoice');
        const params = sessionStorageParams ? JSON.parse(sessionStorageParams).params : {};
        this.state = {
            ...PAGINATION_PARAMS,
            examineStatus: 1,
            invoiceTitle: '',
            payStatus: undefined,
            ...params
        }
        this.search(true)
    }
    columns = [
        {
            title: '操作',
            width: 100,
            render: (text, record) => {
                const invoiceTitle = record.c_name || '';
                const status = record.examine_status;
                const {
                    c_name,
                    examine_status,
                    id,
                    is_recheck,
                } = record;
                let handles = [
                    <a href={`${PHP_DOMAIN}/orderbackend/invoice/invoiceaudit/auditdetail?id=${id}&cname=${c_name}`}>{examine_status === 1 ? '审核' : '查看'}</a>
                ]

                /**
                 * 对于“审核状态=审核通过”，
                 * 且“发票信息导出状态=未导出”的发票，
                 * 在“业务管理-发票信息”列表的“操作”中，增加“重审”操作
                 */
                if (examine_status === 2 && is_recheck === 1) {
                    handles = handles.concat([
                        <Divider type="vertical" />,
                        <a onClick={e => this.reAudit(e, id)}>重审</a>
                    ])
                }

                return handles;
            }
        },
        {
            title: '客户名称',
            width: 250,
            dataIndex: 'c_name',
        },
        {
            title: '开票单位',
            width: 150,
            dataIndex: 'invoicing_unit',
        },
        {
            title: '增值税发票类型',
            width: 150,
            dataIndex: 'invoice_type',
            render: (text) => {
                switch (text) {
                    case 1:
                        return '纸质_普通发票';

                    case 2:
                        return '纸质_专用发票';
                    case 3:
                        return '电子_普通发票';
                    default:
                        return '/';

                }
            },
        },
        {
            title: '发票信息提交人',
            width: 150,
            dataIndex: 'create_user',
        },
        {
            title: '到款状态',
            width: 150,
            dataIndex: 'pay_status',
            render: (text) => {
                switch (text) {
                    case 0:
                        return '未到款';

                    case 1:
                        return '已到款';
                    default:
                        return '/';

                }
            },
        },
        {
            title: '订单号',
            width: 150,
            dataIndex: 'order_code',
        },
        {
            title: '审核状态',
            width: 150,
            dataIndex: 'examine_status_name',
        }
    ]
    reAudit = (e: React.MouseEvent<HTMLAnchorElement>, invoiceId) => {
        e.preventDefault();
        Modal.confirm({
            content: '重审后，该发票的审核状态将变为“待审核”，同时在财务管理中撤回该发票的信息，是否确认进行重审？',
            onOk: () => {
                return new Promise(async (reslove, reject) => {
                    const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/order/invoice/update-invoice-examine-status`, {
                        invoiceId,
                    }).then(data => data as any);
                    console.log(data);
                    if (data.status === 0) {
                        reslove();
                        message.success('操作成功');
                        this.search();
                    }
                    else {
                        reject();
                    }
                })
            }
        })
    }
    searchParams = () => {
        const {
            currentPage,
            pageSize,
            invoiceTitle,
            examineStatus,
            payStatus,
        } = this.state;
        return {
            currentPage,
            pageSize,
            examineStatus: examineStatus,
            invoiceTitle: invoiceTitle,
            payStatus: payStatus,
        }
    }
    search = (init: boolean = false) => {
        this.props.getInvoiceInfo({
            ...this.searchParams(),
            init
        });
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            total,
        } = this.props;
        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
            (newParams) => this.props.getInvoiceInfo({ ...this.searchParams(), ...newParams, init: false }),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    render() {
        const {
            examineStatus,
            invoiceTitle,
            payStatus,
        } = this.state;
        const {
            dataSource,
            fetching,
            buttons,
        } = this.props;
        return (
            <Card>
                <Form style={{ width: 800 }}>
                    <FormItem label="审核状态" {...formItemLayout}>
                        <RadioGroup value={examineStatus} onChange={e => {
                            this.setState({ examineStatus: e.target.value })
                        }}>
                            {buttons.toJS().map(({ id, name, highlightNumber }) =>
                                <RadioButton value={id}>{name}{highlightNumber > 0 && id === 1 && <span style={{ color: '#f5222d' }}>({highlightNumber})</span>}</RadioButton>
                            )}
                        </RadioGroup>
                        <Button type="primary" style={{ marginLeft: 20 }} onClick={() => this.search()}>搜索</Button>
                    </FormItem>
                    <FormItem label="到款状态"  {...formItemLayout}>
                        <RadioGroup value={payStatus} onChange={e => {
                            this.setState({ payStatus: e.target.value })
                        }} >
                            <RadioButton value={undefined}>全部</RadioButton>
                            <RadioButton value={0}>未到款</RadioButton>
                            <RadioButton value={1}>已到款</RadioButton>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="客户名称" {...formItemLayout}>
                        <Input placeholder="请输入" value={invoiceTitle} style={{ width: 206 }} onChange={(e) => this.setState({ invoiceTitle: e.target.value })} />
                    </FormItem>
                </Form>
                <Table
                    loading={fetching}
                    dataSource={dataSource.toJS()}
                    columns={this.columns}
                    pagination={this.pagination()}
                    scroll={{ y: window.innerHeight * 0.6 }}
                />
            </Card>
        )
    }
}

const mapStateToProps = (state: Any.Store) => {
    const data = state.get("invoiceInfoForBusinessManagement");
    return {
        total: data.get('total'),
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        buttons: data.get('buttons'),
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(InvoiceInfo);