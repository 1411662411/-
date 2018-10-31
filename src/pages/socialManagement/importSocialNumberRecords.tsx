import React, { Component } from 'react';
import {
    Table,
} from 'antd';
import { PAGINATION_PARAMS } from '../../global/global';
import {
    statePaginationConfig,
    mapCurrentPageToStart,
} from '../../util/pagination';
import moment from 'moment';
import Immutable, { List, Map,} from 'immutable';
import {
    fetchFn,
} from '../../util/fetch';
import {
    DOMAIN_OXT
} from '../../global/global'

interface ImportSocialNumberRecordsState {
    fetching: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    dataSource: List<Map<string, any>>;
}

/**
 * table列表
 */
const columns = () => {
        return [
            {
                title: '序号',
                key: 'index',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    )
                },
            },
            {
                title: '操作时间',
                key: 'time',
                dataIndex: 'time',
            },
            {
                title: '导入类型',
                key: 'type',
                dataIndex: 'type',
            },
            {
                title: '相关文件',
                key: 'fileUrl',
                render: (text, record, index) => {
                    return (
                        <a href={record.fileUrl}>{record.fileName}</a>
                    )
                },
            },
        ]
}

class ImportSocialNumberRecords extends Component<{} ,ImportSocialNumberRecordsState> {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            ...PAGINATION_PARAMS,
            dataSource: Immutable.fromJS([]),
            total: 0,
        };
    }
    componentDidMount() {
        this.search();
    }
    search =  () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        this.setState({
            fetching: true,
        }, async () => {
            const respone = await fetchFn<{recordsTotal: number}>(`${DOMAIN_OXT}/apiv2_/social/record/history-socialnumber/list`, mapCurrentPageToStart({
                currentPage,
                pageSize,
            }));
            if(respone.status === 0) {
                let data = {
                    fetching: false,
                    dataSource: Immutable.fromJS(respone.data),
                    total: respone.recordsTotal,
                }
                this.setState(data);
            }
            
        });
        
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
            total,
        } = this.state;
        return statePaginationConfig({
                currentPage,
                pageSize,
                total,
            },
            null,
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                }, () => {
                    this.search()
                });
            },
        )
    }
    render() {
        const {
            dataSource,
            fetching,
        } = this.state;
      
        return (
            <Table 
                loading={fetching}
                columns={columns()}
                rowKey={(record: any) => record.id}
                dataSource={dataSource.toJS()}
                pagination={this.pagination()}
            />
        )
    }
}



export default ImportSocialNumberRecords;