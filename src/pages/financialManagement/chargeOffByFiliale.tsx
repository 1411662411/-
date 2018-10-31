import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Table,
    Form,
    Input,
    Select,
    Button,
    Icon,
    Modal,
    Alert,
    message,
    InputNumber,
} from 'antd';
import * as actions from '../../action/financialManagement/chargeOffByFilialeAction';
import {
    PAGINATION_PARAMS,
    DOMAIN_OXT,
} from '../../global/global';
import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import RightMenu from '../../components/right-menu/index'
import {
    statePaginationConfig,
} from '../../util/pagination';
import {formatMoney} from '../../util/util';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const actionCreators = {
    listGet: actions.listGet,
    reject: actions.reject,
    retrieve: actions.retrieve,
    unretrieve: actions.unretrieve,
}




interface TStateProps {
    total: number;
    retrieveTotal: number;
    dataSource: List<Map<any, any>>;
    fetching: boolean;
}
type TDispatchProps = typeof actionCreators;
type ChargeOffByFilialeProps = TStateProps & TDispatchProps;

interface ChargeOffByFilialeState {
    showAll: boolean;
    pageSize: number;
    currentPage: number;
    rejectVisible: boolean;
}

class ChargeOffByFiliale extends React.Component<ChargeOffByFilialeProps, ChargeOffByFilialeState> {
    constructor(props) {
        super(props);
        this.state = {
            rejectVisible: false,
            showAll: false,
            ...PAGINATION_PARAMS,
        }
        this.search(true);
    }
    rejectReason: any;
    qOrderId: number | string;
    payeeName: Input | null;
    qOrderIdInput: Input | null;
    socialNotCostMoneyLest: Input | null;
    socialNotCostMoneyBiggest: Input | null;
    
    colmun: any[] = [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => ++ index,
            width: 100,
        },
        {
            title: '请款单号',
            key: 'qOrderId',
            dataIndex: 'qOrderId',
            width: 200,
        },
        {
            title: '核销状态',
            key: 'charge-off-status',
            render: (data) => {
                switch (Number(data.receiptVerifyStatus)) {
                    case 0:
                        return '未发起核销';
                    case 2:
                        return '待财务取回';
                    case 3:
                        return '财务已取回';
                    case 1:
                        return <span style={{color:'red'}}>被财务驳回</span>;
                    case 4:
                        return '无需取回';
                    default:
                        return '';
                }
            },
            width: 150,
        },
        {
            title: <span>打款时间<br />（财务）</span>,
            key: 'payTime',
            dataIndex: 'payTime',
            width: 200,
        },
        {
            title: <span>发起核销时间<br />（客服）</span>,
            key: 'verifyTime',
            dataIndex: 'verifyTime',
            width: 200,
        },
        {
            title: <span>确认取回时间<br />（财务）</span>,
            key: 'confirmTime',
            dataIndex: 'confirmTime',
            render: (data) => {
                return data || '/';
            },
            width: 200,
        },
        {
            title: '请款金额',
            key: 'cashout-momey',
            dataIndex: 'prepaymentMoney',
            render:(data)=> (
                formatMoney(data,2,'')
            ),
            width: 150,
        },
        {
            title: '社保局已扣款金额',
            key: 'charge-momey',
            dataIndex: 'socialCostMoney',
            width: 150,
            render:(data)=> (
                formatMoney(data,2,'')
            ),
        },
        {
            title: '社保局未确认金额',
            key: 'socialUnconfirmedMoney',
            dataIndex: 'socialUnconfirmedMoney',
            width: 150,
            render:(data)=> (
                formatMoney(data,2,'')
            ),
        },
        {
            title: <span>社保局未扣款金额 <br />（需取回总公司）</span>,
            key: 'uncharge-momey',
            dataIndex: 'socialNotCostMoney',
            render(data) {
                return <span style={{color: 'red'}}>{formatMoney(data,2,'')}</span>
            },
            width: 150,
        },
        {
            title: '对应分公司',
            key: 'filiale',
            dataIndex: 'payeeName',
            width: 200,
        },
        {
            title: '分公司开户行 | 账号',
            key: 'filiale-account',
            render: (data) => {
                if(!data.bankAccountName && data.bankAccount) {
                    return '/';
                }
                return <span>
                    {data.bankAccountName} 
                    <br />
                    {data.bankAccount}
                </span>
            },
            width: 350,
        },
        {
            title: '操作',
            key: 'handle',
            fixed: 'right',
            render: (data) => {
                switch (Number(data.receiptVerifyStatus)) {
                    case 2:
                        //待财务取回
                        return <div>
                            <a href="" style={{ marginRight: 5 }} onClick={e => this.retrieve(e, data)}>确认取回</a>
                            <a href="" onClick={(e) => this.rejectShowModal(e, data)}>驳回</a>
                        </div>
                    case 3:
                        //财务已取回
                        return <a href="" style={{ marginRight: 5 }} onClick={e => this.unretrieve(e, data)}>撤销取回</a>
                    case 1:
                        //被财务驳回
                        return '/';
                    case 4:
                        //无需取回
                        return <a href="" onClick={(e) => this.rejectShowModal(e, data) }>驳回</a>
                    default:
                        return '';
                }
            },
            width: 150,
        },
    ]
    unretrieve = (e:React.MouseEvent<HTMLAnchorElement>, data) => {
        e.preventDefault();
        this.props.unretrieve({
            handleParams: {
                qOrderId: data.qOrderId,
                verifyStatus: 2,
            },
            searchParams: this.searchParams(),
        })
    }
    retrieve = (e:React.MouseEvent<HTMLAnchorElement>, data) => {
        e.preventDefault();
        this.props.unretrieve({
            handleParams: {
                qOrderId: data.qOrderId,
                verifyStatus: 3,
            },
            searchParams: this.searchParams(),
        })
    }
    rejectShowModal = (e:React.MouseEvent<HTMLAnchorElement>, data) => {
        e.preventDefault(); 
        this.qOrderId = data.qOrderId; 
        this.setState({rejectVisible: true}) 
    }
    reject = (e) => {
       e.preventDefault();
        const rejectReason = this.rejectReason.textAreaRef.value;
        if(!rejectReason.trim()) {
            message.error('请填写驳回原因');
            return;
        }
        this.props.reject({
            handleParams: {
                qOrderId: this.qOrderId,
                verifyStatus: 1,
                rejectReason,
            },
            searchParams: this.searchParams(),
        }, () => {
            this.setState({
                rejectVisible: false
            })
        });

    }
    searchParams = () => {
        const {
            pageSize,
            currentPage,
            showAll,
        } = this.state;
        const payeeName = this.payeeName && this.payeeName.input.value ? this.payeeName.input.value : null;
        const qOrderId = this.qOrderIdInput && this.qOrderIdInput.input.value ? this.qOrderIdInput.input.value: null;
        const socialNotCostMoneyLest = this.socialNotCostMoneyLest && this.socialNotCostMoneyLest.input.value ? this.socialNotCostMoneyLest.input.value: null;
        const socialNotCostMoneyBiggest = this.socialNotCostMoneyBiggest && this.socialNotCostMoneyBiggest.input.value ? this.socialNotCostMoneyBiggest.input.value: null;
        /**
         * 搜索参数
         */
        return {
            ...PAGINATION_PARAMS,
            pageSize,
            currentPage,
            payeeName,
            qOrderId,
            socialNotCostMoneyLest,
            socialNotCostMoneyBiggest,
            verifyStatus: showAll ? 2 : null,
        };
    }
    search = (init = false, otherParams = {}) => {
        let params = {...this.searchParams(), ...otherParams};
        const {
            socialNotCostMoneyLest,
            socialNotCostMoneyBiggest,
        } = params;

        /**
         * 社保局未扣款金额范围判断
         */
        if(socialNotCostMoneyLest && socialNotCostMoneyBiggest && Number(socialNotCostMoneyLest) > Number(socialNotCostMoneyBiggest) ) {
            message.error('金额上限不得小于金额下限');
            return;
        }

        /**
         * 是否初始化到第一页
         */
        if (init) {
            params = {
                ...params,
                currentPage: 1,
            }
            this.setState({
                currentPage: 1,
            });
        }
        this.props.listGet(params);
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            total,
        } = this.props;
        return statePaginationConfig(
            {
                currentPage,
                pageSize,
                total,
            },
            (newParams) => this.props.listGet({ ...this.searchParams(), ...newParams, }),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    showAll = (verifyStatus) => {
        const showAll = !this.state.showAll;
        this.setState({
            showAll,
        });
        this.search(false, {
            verifyStatus: showAll ? 2 : null,
        })
    }
    render() {
        const {
            dataSource,
            fetching,
            retrieveTotal,
        } = this.props;
        return (
            <div className="chapterList">
                <Form>
                    <FormItem>
                        <Button type="primary" onClick={this.showAll} loading={fetching}>
                            {this.state.showAll ? `显示全部`: `仅显示待取回的数据（共 ${retrieveTotal} 条）`}
                        </Button>
                    </FormItem>
                </Form>
                <Form layout="inline">
                    <FormItem label="请款单号">
                        <Input ref={node => this.qOrderIdInput = node}/>
                    </FormItem>
                    <FormItem label="社保局未扣款金额">
                        <Input type="number" ref= {node => this.socialNotCostMoneyLest = node} />
                    </FormItem>
                    <FormItem>
                        -
                    </FormItem>
                    <FormItem>
                        <Input type="number" ref = {node => this.socialNotCostMoneyBiggest = node}/>
                    </FormItem>
                    <FormItem label="对应分公司">
                        <Input ref={node => this.payeeName = node} style={{width: 200}}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" loading={fetching} onClick={() => { this.search(true) }}>搜索</Button>
                    </FormItem>
                </Form>
                <Table
                    loading={fetching}
                    style={{ marginTop: 20 }}
                    columns={this.colmun}
                    pagination={this.pagination()}
                    scroll={{ y: 500, x: 2150 }}
                    rowKey={(record: any) => record.id}
                    dataSource={dataSource.toJS()}
                />
                <Modal 
                    title="提示"
                    visible={this.state.rejectVisible}
                    footer={
                        <div>
                            <Button onClick={() => this.setState({rejectVisible:false})}>取消</Button>
                            <Button type="primary" onClick={this.reject} loading={fetching}>确定</Button>
                        </div>
                    }
                    onCancel={() => this.setState({rejectVisible:false})}
                >
                    <div>
                        <Alert type="warning" message="请填写驳回原因" style={{marginBottom: 10}}>
                        </Alert>
                        <TextArea key={Date.now()} maxLength={500} style={{height: 150}} ref={node => this.rejectReason = node}>
                        </TextArea>
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('chargeOffByFilialeReducer');
    return {
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),
        retrieveTotal: data.get('retrieveTotal'),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChargeOffByFiliale);