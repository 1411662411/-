/**
 * Created by yangws on 2017/5/17.
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
} from 'antd';
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT } from '../../global/global';
import {
    cashoutImportRecordSaga,
} from '../../action/socialManagement/cashoutImportRecordAction';
import { formatDateTime,accAdd,formatMoney } from '../../util/util';
import {
    PAGINATION_PARAMS
} from '../../global/global';

interface CashoutImportRecordProps {
    dispatch?: any;
    dataSource: [any];
    recordsTotal: number;
    pageSize: number;
    fetching: boolean;
    current: number;
    total: number;
    searchParams: any;
}

const ImportTypeMap = {
    1: '付款清单（客户维度）',
    2: '垫款明细',
    3: '付款账单（人月次维度）',
}
class CashoutImportRecord extends React.Component<CashoutImportRecordProps, any> {
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
            key: 'sequenceNumber',
            render: (data, record,index ) => {
                return index+1

            },
        },{
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (data) => {
                return moment(data*1000).format('YYYY-MM-DD HH:mm:ss')
            }
        },{
            title: '导入类型',
            dataIndex: 'type',
            key: 'type',
            render: (data)=>{
                return ImportTypeMap[data]||'/';
            }
        },{
            title: '相关文件',
            dataIndex: null,
            key: 'contiguousFile',
            render: (data, record, ) => {
                return <a  target="_blank" href={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${data.filePath}&type=EXCEL`}>{data.fileName}</a>
            }
        }
        
        

    ]
    componentWillMount() {
        // 默认加载
        this.handleSearch();
    }
    handleSearch = ()=> {
        this.props.dispatch(cashoutImportRecordSaga(this.state.searchParams))
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
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, cashoutImportRecordSaga, dispatch,setCurrentPage)
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
                    <Table columns={this.columns }
                                rowKey={(record: any) => record.id}
                                dataSource={dataSource}
                                loading={fetching}
                                pagination={this.pagination()}
                                />
                </QueueAnim>
        )
    }
    
}
function mapStateToProps(state?: any) {
    const data = state.get('cashoutImportRecord');
    return {
        dataSource: data.get('dataSource').toJS(),
        searchParams: data.get('searchParams').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        
        
    }
}
// export default CashoutNeedsApproval
export default connect(mapStateToProps)(CashoutImportRecord)