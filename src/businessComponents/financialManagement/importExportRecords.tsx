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
import * as importExportRecordsAction from '../../action/businessComponents/importExportRecordsAction';
import { PAGINATION_PARAMS } from '../../global/global';
import {
    statePaginationConfig,
} from '../../util/pagination';
import moment from 'moment';
import Immutable from 'immutable';


interface TOwnProps {
    type: 1 | 2 | 3;
    title?: string;
}
interface TStateProps {
    dataSource: Immutable.List<Immutable.Map<any, any>>
    fetching: boolean;
    total: number;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
    getImportExportRecords: (params) => any
}
type ImportExportRecordsProps = TStateProps & TDispatchProps & TOwnProps;

interface ImportExportRecordsState {
    currentPage: number;
    pageSize: number;
}

/**
 * table列表
 * @param type {Number} 根据不同type返回不同的类型
 */
const columns = (type: number) => {
    if (type === 1) {
        return [
            {
                title: '序号',
                key: 'index',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    )
                },
                width: 100,
            },
            {
                title: '操作时间',
                key: 'createTime',
                dataIndex: 'create_time',
                render: (text, record, index) => {
                    return (
                        <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                },
                width: 300,
            },
            {
                title: '操作人',
                key: 'operationName',
                dataIndex: 'operation_name',
                render: (text, record, index) => {
                    return (
                        <span>{text}</span>
                    )
                },
                width: 200,
            },
            {
                title: '导出方向',
                key: 'operation',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <span>{text}</span>
                    )
                },
                width: 200,
            },
            {
                title: '相关文件',
                key: 'fileUrl',
                render: (text, record, index) => {
                    return (
                        <a href={record.file_url}>{record.file_name}</a>
                    )
                },
            },
        ]
    }
    if (type === 2) {
        return [
            {
                title: '序号',
                key: 'index',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    )
                },
                width: 100,
            },
            {
                title: '操作时间',
                key: 'createTime',
                dataIndex: 'create_time',
                render: (text, record, index) => {
                    return (
                        <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                },
                width: 300,
            },
            {
                title: '操作人',
                key: 'operationName',
                dataIndex: 'operation_name',
                render: (text, record, index) => {
                    return (
                        <span>{text}</span>
                    )
                },
                width: 200,
            },
            {
                title: '导出方向',
                key: 'operation',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <span>{text}</span>
                    )
                },
                width: 200,
            },
            {
                title: '相关文件',
                key: 'fileUrl',
                render: (text, record, index) => {
                    return (
                        <a href={record.file_url}>{record.file_name}</a>
                    )
                },
            },
        ]
    }
    if (type === 3) {
        return [
            {
                title: '序号',
                key: 'index',
                width: 100,
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    )
                },
            },
            {
                title: '操作时间',
                width: 200,
                key: 'createTime',
                dataIndex: 'create_time',
                render: (text, record, index) => {
                    return (
                        <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                },
            },
            {
                title: '操作人',
                width: 200,
                key: 'operationName',
                dataIndex: 'operation_name',
                render: (text, record, index) => {
                    return (
                        <span>{text}</span>
                    )
                },
            },
            {
                title: '相关文件',
                
                key: 'fileUrl',
                render: (text, record, index) => {
                    return (
                        <a href={record.file_url}>{record.file_name}</a>
                    )
                },
            },
        ]
    }
}

class ImportExportRecords extends Component<ImportExportRecordsProps ,ImportExportRecordsState> {
    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
        };
        this.search();
    }
    search = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            type,
            getImportExportRecords,
        } = this.props;
        getImportExportRecords({
            type,
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
            type,
            total,
        },
            importExportRecordsAction.getImportExportRecords,
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
        console.log(this.props)
        const {
            title,
            dataSource,
            type,
        } = this.props;
      
        return (
            <Card title={title ? title : "导入导出历史记录"}>
                <Table 
                    columns={columns(type)}
                    rowKey={(record: any) => record.id}
                    dataSource={dataSource.toJS()}
                    pagination={this.pagination()}
                    scroll={{x: 1200, y: 500}}
                />
            </Card>
        )
    }
}

const mapStateToProps = state => {
    const data = state.get('importExportRecordsBusinessComponents');
    return {
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),
    }
}
const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators({
            getImportExportRecords: importExportRecordsAction.getImportExportRecords,
        }, dispatch)
    }
}
const mergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...parentProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ImportExportRecords);