/**
 * Created by yangws on 2017/11/27.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Form,
    message,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Card,
} from 'antd';
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT } from '../../global/global';
import {
    cashoutManagementBillSaga,
} from '../../action/socialManagement/cashoutManagementBillAction';
import { formatDateTime,accAdd,formatMoney } from '../../util/util';
import {
    PAGINATION_PARAMS
} from '../../global/global';

interface CashoutManagementBillProps {
    dispatch?: any;
    dataSource: [any];
    recordsTotal: number;
    pageSize: number;
    fetching: boolean;
    current: number;
    total: number;
    searchParams: any;
}


class CashoutManagementBill extends React.Component<CashoutManagementBillProps, any> {
    constructor(props) {
        super(props);
    }
    state = {
        searchParams: {
            ...PAGINATION_PARAMS,
        }
    }
    columns: [any] = [
         {
            title: '序号',
            dataIndex: null,
            width:'10%',
            key: 'sequenceNumber',
            render: (data, record,index ) => {
                return index+1

            },
        },{
            title: '创建时间',
            dataIndex: 'start_time',
            width:'20%',
            key: 'start_time',
            render:(data)=>{
                return data || '/'
            }
        },{
            title: '付款月份',
            dataIndex: 'export_month',
            key: 'export_month',
            width:'20%',
            render:(data)=>{
                return data || '/'
            }
        },{
            title: '文件名称',
            dataIndex: null,
            width:'50%',
            key: 'contiguousFile',
            render: (data, record, ) => {
                return <a  target="_blank" href={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${data.osskey}&type=EXCEL`}>{data.export_month+'_SP 请款_付款账单（人月次维度明细表）_导出表.zip'}</a>
            }
        }
        
        

    ]
    componentWillMount() {
        // 默认加载
        this.handleSearch();
    }
    handleSearch = ()=> {
        this.props.dispatch(cashoutManagementBillSaga(this.state.searchParams))
    }
    pagination = () => {
        const {
            dispatch,
            total,
        } = this.props;
        const {searchParams} = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage)=>{

            this.setSearchParamState({'currentPage':currentPage})
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, cashoutManagementBillSaga, dispatch,setCurrentPage)
    }
    setSearchParamState = (param) => {
        const {searchParams} = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
        }
        this.setState({
            searchParams:newSearchParams
        })
    }
    render() {
        const { dataSource ,
            fetching
        } = this.props;
        return (
                <QueueAnim>
                    <Card title="批量导出付款账单（人月次维度）">
                        <Table columns={this.columns }
                            rowKey={(record: any) => record.id}
                            dataSource={dataSource}
                            loading={fetching}
                            pagination={this.pagination()}
                            />
                    </Card>
                    
                </QueueAnim>
        )
    }
    
}
function mapStateToProps(state?: any) {
    const data = state.get('cashoutManagementBillReducer');
    return {
        dataSource: data.get('dataSource').toJS(),
        searchParams: data.get('searchParams').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        
        
    }
}
export default connect(mapStateToProps)(CashoutManagementBill)