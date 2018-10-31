import React, { Component } from 'react';
import {
    connect,
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import {
    Card,
    Table,
} from 'antd';
import * as importExportRecordsAction from '../../action/businessComponents/payGetInfoRecordsAction';
import { PAGINATION_PARAMS } from '../../global/global';
import {
    statePaginationConfig,
} from '../../util/pagination';
import moment from 'moment';
import Immutable from 'immutable';
import { DOMAIN_OXT } from '../../global/global';
import {
    useMapSaga,
} from '../../action/socialManagement/cashoutTransferBymeAction';
interface TOwnProps {
    type: 1 | 2;
    title?: string;
    userId?:number;
    userInfo:any;
}
interface TStateProps {
    dataSource: Immutable.List<Immutable.Map<any, any>>
    fetching: boolean;
    total: number;
    dataList:any;
    dataMap:any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
    getPayInfoImportExportRecords: (params) => any
}
let data:any = null;
type ImportExportRecordsProps = TStateProps & TDispatchProps & TOwnProps;

interface ImportExportRecordsState {
    currentPage: number;
    pageSize: number;
}

/**
 * table列表
 * @param type {Number} 根据不同type返回不同的类型
 */

const columns = (dataMap) => {
  
        return [
            {
                title: '序号',
                key: 'index',
                render: (data,recorde,index) => {
                    return (
                        index + 1
                    )
                },
                width: 100,
            },
            {
                title: '操作时间',
                key: 'operateTime',
                dataIndex: 'operateTime',
                render: (data, recorde, index) => {
                    return (
                        moment(data * 1000).format('YYYY-MM-DD HH:mm:ss')
                    )
                },
                width: 300,
            },
            {
                title: '操作人',
                key: 'operatorId',
                dataIndex: 'operatorId',
                render: (data, recorde, index) => {
                    const user = dataMap.toJS().userMapData
                    if (!data || user.length < 1 || !user[data]) {
                        return '/';
                    }
                    return <span> {user[data].name}</span>;
                },
                width: 200,
            },
            {
                title: '导出方向',
                key: 'type',
                dataIndex: 'type',
                render: (data, recorde, index) => {
                    return (
                       data == 1 ? "导入" : "导出"
                    )
                },
                width: 200,
            },
            {
                title: '相关文件',
                key: 'contiguousFile',
                render: (data, recorde, index) => {
                    return (
                        <a target="_blank" href={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${data.filePath}&type=EXCEL`}>{data.fileName}</a>
                    )
                },
            },
        ]
  

}

class PayinfoimportExportRecords extends Component<ImportExportRecordsProps, ImportExportRecordsState>{
    
    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
        };
        this.search();
    }
    componentWillMount() {
        // 默认加载
        /**获取员工map 后台列表返回id 前端根据id 显示对应的信息 */
        this.props.dispatch(useMapSaga([]));
        /**获取组织架构 */
        
    }
    search = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            type,
            getPayInfoImportExportRecords,
        } = this.props;
        getPayInfoImportExportRecords({

            currentPage,
            pageSize,
        });
    }
    
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            
            type,
            dispatch,
            total,
        } = this.props;
       
        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
            importExportRecordsAction.getPayInfoImportExportRecords,
            dispatch,
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
            type,
            dataList,
            title,
            dataMap
        } = this.props;
        return (
            <Card title={title ? title : "导入导出历史记录"}>
                <Table
                    columns={columns(dataMap)}
                    dataSource={dataList.toJS()}
                    scroll={{ x: 1200, y: 500 }}
                    rowKey={(record: any) => record.id}
                    pagination={this.pagination()}
                />
            </Card>
        )
    }
}

const mapStateToProps = state => {
    const data = state.get('getPayInfo');
    const dataMap = state.get('cashoutTransferByme');
    return {
        dataList:data.get('setPayImportExportRecords'),
        dataMap,
        total:data.get('total'),
    }
}
const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators({
            getPayInfoImportExportRecords: importExportRecordsAction.getPayInfoImportExportRecords,
        }, dispatch)
    }
}
const mergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...parentProps,
});

 
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PayinfoimportExportRecords);