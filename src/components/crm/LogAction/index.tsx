import React from 'react';
import {
    Table,
    Select,
    Button,
    Tooltip,
} from 'antd'

import query from '../../../util/query';
import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';
import PartTitle from '../Title';

const urlId = query('id');

import './style'

const { Option, OptGroup } = Select;

class LogAction extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            total: 0,
            pageSize: 20,
            logAction: [],
            dataSource: [],
            current: 1,
            isLoading: true,
            filterDropdownVisible: false,
            searchType: undefined,
        }
    }

    getData = async (current, pageSize) => {
        this.setState({ isLoading: true })
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerOperationLogs/list`, {
            associateId: urlId,
            useType: 7,
            type: this.state.searchType,
            start: (current - 1) * pageSize,
            length: pageSize,
        })
            .then((res: any) => {
                this.setState({
                    dataSource: res.data ? res.data.records : [],
                    total: res.data ? res.recordsTotal : 0,
                    current: current,
                    pageSize: pageSize,
                    isLoading: false,
                })
            });
    }

    /**
     * 获取操作日志动作
     */
    getLogAction = async() => {
        let res:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerOperationLogs/logAction`, {
            employType: 4
        }).then(data => data);
        if(res.status === 0){
            let logAction:any = [];
            res.data.map((item) =>{
                logAction.push(
                    <Option value={item.code}>{item.dictName}</Option>
                )
            })
            this.setState({
                logAction: logAction,
                isLoading: false,
            })
        }
    }

    getLogList = async() => {
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerOperationLogs/list`, {
            associateId: urlId,
            useType: 7,
            type: this.state.searchType,
            start: 0,
            length: 20
        })
            .then((res: any) => {
                this.setState({
                    dataSource: res.data ? res.data.records : [],
                    total: res.data ? res.recordsTotal : 0,
                    current: res.data ? res.data.pageNow : 1,
                    pageSize: res.data ? res.data.pageSize : 20,
                    isLoading: false,
                })
            });
    }

    async componentWillMount() {
        await this.getLogList();
        await this.getLogAction();
    }

    typeChangeHandle = (e) => {
        this.setState({
            searchType: e
        });
    }

    onSearch = () => {
        this.setState({
            isLoading: true,
            filterDropdownVisible: false,
        });
        this.getLogList();
    }

    onReset = () => {
        this.setState({
            searchType: undefined,
            isLoading: true,
            filterDropdownVisible: false,
        }, () => {this.getLogList()});
    }

    render() {
        const pagination = {
            showTotal: (total, range) => `${range[0]} - ${range[1]} , 共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            size: "small",
            pageSize: this.state.pageSize,
            total: this.state.total,
            current: this.state.current,
            pageSizeOptions: ['20', '40', '60', '80', '100'],
            onChange: this.getData,
            onShowSizeChange: this.getData,
        }

        const columns = [{
            title: '操作时间',
            dataIndex: 'submitTime',
            key: 'submitTime',
            width: '15%',
        }, {
            title: '操作人',
            dataIndex: 'operater',
            key: 'operater',
            width: '10%',
        }, {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            width: '25%',
        }, {
            title: '动作',
            dataIndex: 'typeName',
            key: 'typeName',
            width: '10%',
            filterDropdown: (
                <div id="custom-filter-dropdown-type" className="custom-filter-dropdown">
                    <Select
                        style={{width: 200}}
                        value={this.state.searchType}
                        onChange={this.typeChangeHandle}
                        getPopupContainer={() => document.getElementById('custom-filter-dropdown-type') as HTMLElement}
                        placeholder="请选择动作"
                    >
                        {this.state.logAction}
                    </Select>
                    <div className="ant-table-filter-dropdown-btns">
                        <Button type="primary" onClick={this.onSearch} style={{marginRight:20}}>搜索</Button>
                        <Button onClick={this.onReset}>重置</Button>
                    </div>
                </div>
            ),
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                });
            },
        }, {
            title: '备注说明',
            dataIndex: 'content',
            key: 'content',
            width: '40%',
            render: (text, record, index) => {
                const {
                    id,
                    content
                } = record;
                return <div id={`parentM${id}`} className="log-content">{content.replace(/<[^>]+>/g,"").length > 50 ? <Tooltip getPopupContainer={() => document.getElementById(`parentM${id}`) as HTMLElement} overlayClassName="log-message-tip" title={<span dangerouslySetInnerHTML={{ __html: content }}></span>}><span className="message-info" dangerouslySetInnerHTML={{ __html: content }}></span></Tooltip> : <span className="message-info" dangerouslySetInnerHTML={{ __html: content }}></span>}</div>
            },
        }];

        return (
            <div className="log-action">
                <PartTitle
                    title='操作日志'
                />
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered={true}
                    loading={this.state.isLoading}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default LogAction