import React, { Component } from 'react';
import QueueAnim from "rc-queue-anim/lib";
import moment, { Moment } from 'moment';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
    Select,
    Table,
    Row,
    Col,
    Pagination,
    Spin,
    message,
    Tooltip,
} from 'antd';
import { Link } from 'react-router';
import {
    DOMAIN_OXT,
    PAGINATION_PARAMS,
} from '../../global/global';
import * as actions from './../../action/businessComponents/chapter/chapterHandleRecordAction';
import { statePaginationConfig, mapCurrentPageToStart, } from '../../util/pagination';
import { Map, List } from 'immutable';
const Option = Select.Option;

const actionCreators = {
    listGet: actions.listGet,
}

interface TStateProps {
    dataSource: List<Map<string, any>>;
    fetching: boolean;
    total: number;
}

interface TOwnProps {
    csId: string | number;
}

interface ChapterHandleRecordState {
    currentPage: number;
    pageSize: number;
}

type TDispatchProps = typeof actionCreators;
type ChapterHandleRecordProps = TStateProps & TDispatchProps & TOwnProps;


const options = [
    { id: 1, name: '新增公司' },
    { id: 2, name: '编辑公司' },
    { id: 3, name: '转移录入人' },
    { id: 4, name: '编辑国税信息' },
    { id: 5, name: '编辑地税信息' },
    { id: 6, name: '启用/停用银行账户' },
    { id: 7, name: '添加银行账户信息' },
    { id: 8, name: '编辑银行账户信息' },
    { id: 9, name: '添加国税信息' },
    { id: 10, name: '添加地税信息' },
]

class ChapterHandleRecord extends React.Component<ChapterHandleRecordProps, ChapterHandleRecordState> {
    constructor(props: ChapterHandleRecordProps) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
            pageSize: 10
        }
        this.search();
    }
    time: any[] = [];
    order: number = 1;
    replytext: any;
    searchParams = () => {
        return {
            csId: this.props.csId,
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
        };
    }
    search = (params = {}) => {
        this.props.listGet(mapCurrentPageToStart({ ...this.searchParams(), ...params }));
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            total,
        } = this.props;
        return {
            ...statePaginationConfig(
                {
                    currentPage,
                    pageSize,
                    total,
                },
                (newParams) => this.search(newParams),
                null,
                (currentPage, pageSize) => {
                    this.setState({
                        currentPage,
                        pageSize
                    });
                }
            ),
            pageSizeOptions: ['10', '20', '50',],
        }
    }
    columns: [any] = [
        {
            title: "操作时间",
            key: 'createTime',
            dataIndex: 'createTime',
            width: 170,
            render: (data) => moment(data, 'X').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作人',
            key: 'createUser',
            dataIndex: 'createUser',
            width: 150,
            render: (data) => data || '/',
        }, {
            title: '部门',
            dataIndex: 'createOrganizationName',
            key: 'createOrganizationName',
            width: 150,
        }, {
            title: '动作',
            dataIndex: 'operationName',
            key: 'operationName',
            width: 150,
        }, {
            title: '内容',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            width: 800,
            render: (data) => {
                return <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 800 }}>
                    <Tooltip title={data} placement="top">{data}</Tooltip>
                </div>
            }
        }
    ]
    render() {
        const {
            fetching,
            dataSource,
        } = this.props;
        return (
            <QueueAnim>
                <div className="chapterHandleRecord">
                    <div className="form-site">
                        <Row type="flex" justify="start" align="middle">
                            <Col className="col-label"><label>动作：</label></Col>
                            <Col>
                                <Select style={{ width: 200 }} placeholder='请选择动作' onChange={(id) => this.search({ order: id })} allowClear>
                                    {options.map(({ id, name }) => <Option value={id}>{name}</Option>)}
                                </Select>

                            </Col>
                        </Row>
                    </div>
                    <QueueAnim type="bottom" delay="300">
                        <Table
                            style={{ marginTop: 20 }}
                            loading={fetching}
                            rowKey={(record: any) => record.id}
                            pagination={this.pagination()}
                            dataSource={dataSource.toJS()}
                            bordered={true}
                            columns={this.columns}
                            scroll={{ x: 1420 }}
                        >
                        </Table>
                    </QueueAnim>
                </div>
            </QueueAnim>
        )
    }
}




function mapStateToProps(state: Any.Store) {
    const data = state.get('chapterHandleRecordReducer');
    return {
        dataSource: data.get('dataSource'),
        total: data.get('total'),
        fetching: data.get('fetching'),
    }
}

export default connect(mapStateToProps, { listGet: actions.listGet })(ChapterHandleRecord)




