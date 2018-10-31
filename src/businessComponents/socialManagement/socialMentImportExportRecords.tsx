

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
import * as socialExportRecordsAction from '../../action/socialManagement/socialMentImportRecordsAction';
import { PAGINATION_PARAMS } from '../../global/global';
import {
    statePaginationConfig,
} from '../../util/pagination';
import moment from 'moment';
import Immutable from 'immutable';
import { ROUTER_PATH } from '../../global/global';
import {
    useMapSaga,
} from '../../action/socialManagement/cashoutTransferBymeAction';
interface TOwnProps {
    type: 1 | 2;
    title?: string;
    userId?: number;
    userInfo: any;
}
interface TStateProps {
    dataSource: Immutable.List<Immutable.Map<any, any>>
    fetching: boolean;
    total: number;
    dataList: any;
    dataMap: any;
    userInfo:any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
    getSocalImportExportRecords: (params) => any
}
let data: any = null;
type ImportExportRecordsProps = TStateProps & TDispatchProps & TOwnProps;

interface ImportExportRecordsState {
    currentPage: number;
    pageSize: number;
}

/**
 * table列表
 * @param type {Number} 根据不同type返回不同的类型
 */

const columns = (userInfo) => {

    return [
        {
            title: '序号',
            key: 'index',
            render: (data, recorde, index) => {
                return (
                    index + 1
                )
            },
            width: 100,
        },
        {
            title: '操作时间',
            key: 'createTime',
            dataIndex: 'createTime',
            render: (data, recorde, index) => {
                return (
                    moment(data * 1000).format('YYYY-MM-DD HH:mm:ss')
                )
            },
            width: 300,
        },
        {
            title: '操作人',
            key: 'createUser',
            dataIndex: 'createUser',
            render: (data, recorde, index) => {
                // const user = userInfo.toJS().permission.userInfo
                // if (!data || user.length < 1) {
                //     return '/';
                // }
                return <span>{data}</span>;
            },
            width: 200,
        },
        {
            title: '导出方向',
            key: 'operation',
            dataIndex: 'operation',
           
            width: 200,
        },
        {
            title: '相关文件',
            key: 'contiguousFile',
            render: (data, recorde, index) => {
                return (
                    <a target="_blank" href={`${data.fileUrl}`}>{data.fileName}</a>
                )
            },
        },
    ]


}

class SocialMentImportExportRecords extends Component<ImportExportRecordsProps, ImportExportRecordsState>{

    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
        };
        
    }
    componentWillMount() {
        this.search();
        // 默认加载
        /**获取员工map 后台列表返回id 前端根据id 显示对应的信息 */
        // this.props.dispatch(useMapSaga([]));
        /**获取组织架构 */

    }
    search = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            type,
            getSocalImportExportRecords,
        } = this.props;
        getSocalImportExportRecords({

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
            socialExportRecordsAction.getSocalImportExportRecords,
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
            dataMap,
            userInfo,
        } = this.props;
        return (
            <Card title={title ? title : "导入导出历史记录"}>
                <Table
                    columns={columns(userInfo)}
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
    const data = state.get('getSocialPayInfo');
    const dataMap = state.get('cashoutTransferByme');
    const userInfo = state.get('routerPermission')
    return {
        dataList: data.get('setPayImportExportRecords'),
        dataMap,
        total: data.get('total'),
        userInfo
    }
}
const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators({
            getSocalImportExportRecords: socialExportRecordsAction.getSocalImportExportRecords,
        }, dispatch)
    }
}
const mergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...parentProps,
});


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SocialMentImportExportRecords);