import React from 'react'
import { connect } from 'react-redux';
import * as QueueAnim from "rc-queue-anim/lib";
import { Button, DatePicker, Input, Icon, Select, Pagination, Table, message, Popconfirm, Tooltip } from 'antd'

import './style.less'

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import {
    paginationConfig,
} from '../../../util/pagination';
import {
    getSearchData
} from '../../../action/crm/MessageAction/'

interface TStateProps {
    dataSource: any;
    searchParams: any;
    total: number;
    isFetching?: any;
}

let workNum = document.body.clientWidth < 1680 ? 40 : 100;
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type WorkbenchMessageProps = TStateProps & TDispatchProps;

class Message extends React.Component<WorkbenchMessageProps,any>{
    constructor(props){
        super(props)
        this.state={
            showAll:true, //当前页面是否显示所有消息
            selectedRowKeys: [],  // Check here to configure the default column
            countNoMsg: 0,
            selectedVal: '标记为',
            inputVal: '',
            isShowClose: false,
        }
    }

    columns: any = [
        {
            title: '',
            dataIndex: 'content',
            key: 'content',
            render: (text, record, index) => {
                const {
                    id,
                    status,
                    content
                } = record;
                if(status === 0){
                    return <div className="message-icon" id={`parentM${id}`}><i className="crmiconfont crmicon-weiduxiaoxi" style={{color: 'red'}}></i>{content.replace(/<[^>]+>/g,"").length > workNum ? <Tooltip getPopupContainer={() => document.getElementById(`parentM${id}`) as HTMLElement} overlayClassName="message-tip" title={<span dangerouslySetInnerHTML={{ __html: content }}></span>}><span className="message-info" dangerouslySetInnerHTML={{ __html: content }}></span></Tooltip> : <span className="message-info" dangerouslySetInnerHTML={{ __html: content }}></span>}</div>
                }else{
                    return <div className="message-icon" id={`parentM${id}`}><i className="crmiconfont crmicon-yiduxiaoxi"></i>{content.replace(/<[^>]+>/g,"").length > workNum ? <Tooltip getPopupContainer={() => document.getElementById(`parentM${id}`) as HTMLElement} overlayClassName="message-tip" title={<span dangerouslySetInnerHTML={{ __html: content }}></span>}><span className="message-info" dangerouslySetInnerHTML={{ __html: content }}></span></Tooltip> : <span className="message-info" dangerouslySetInnerHTML={{ __html: text }}></span>}</div>
                }
            },
        },
        {
            title: '',
            dataIndex: 'createTimeString',
            key: 'createTimeString',
            className: 'right-time'
        }
    ];

    transformArrayToString = (arr) => {
        let str = ''
        arr.map((item, index) => {
            if(index == 0){
                str = item
            }else {
                str = `${str},${item}`
            }
        })
        return str
    }

    getMessageCount(){
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/crm/api/module/message/count`,{'status': 0})
        .then(data => {
            this.setState({
                countNoMsg: data
            })
        });
    }

    obj = {};
    componentWillMount(){
        this.props.dispatch(getSearchData(this.props.searchParams));
        this.getMessageCount();
    }

    onWindowResize() {
        workNum = document.body.clientWidth < 1680 ? 40 : 100;
    }

    handleSearchChangeCache = (value, key) => {
        this.obj[key] = value;
    }

    handleSearch = (value) => {
        this.handleSearchChangeCache(value.trim(), 'searchContent')
        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
    }

    handleChange = (value) => {
        this.setState({
            inputVal: value.target.value
        })
        if (value.target.value.trim() != '') {
            this.setState({
                isShowClose: true
            })
        }else{
            this.setState({
                isShowClose: false
            })
        }
    }

    handleClickClose = (value) => {
        this.setState({
            inputVal: '',
            isShowClose: false
        })
        this.handleSearchChangeCache('', 'searchContent')
        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
    }

    handleTimeSearch = (time, timeString) => {
        this.obj['searchTime'] = timeString;

        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
    }

    allReadHandle = () => {
        const { dispatch } = this.props;
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/message/updateForRead`, {'updateType': 2})
        .then(data => {
            dispatch(getSearchData(this.obj));
            this.getMessageCount();
        });
    }
    
    readListHandle = (value) => {
        const { dispatch } = this.props;
        let { selectedRowKeys } = this.state;
        if(selectedRowKeys && selectedRowKeys.length){
            let ids = this.transformArrayToString(selectedRowKeys);
            let updateType = Number(value) === 0 ? 3 : 1;
            fetchFn(
                `${DOMAIN_OXT}/apiv2_/crm/api/module/message/updateForRead`,
                {
                    'updateType': updateType,
                    ids: ids
                }
            )
            .then(data => {
                this.setState({
                    selectedRowKeys: [],
                    selectedVal: '标记为'
                })
                dispatch(getSearchData(this.obj));
                this.getMessageCount();
            });
        }else{
            message.warning('请勾选消息');
        }
    }
    
    delListHandle = (value) => {
        const { dispatch } = this.props;
        let { selectedRowKeys } = this.state;
        if(selectedRowKeys && selectedRowKeys.length){
            let ids = this.transformArrayToString(selectedRowKeys);
            fetchFn(
                `${DOMAIN_OXT}/apiv2_/crm/api/module/message/delete`,
                {
                    'updateType': 5,
                    ids: ids
                }
            )
            .then(data => {
                this.setState({
                    selectedRowKeys: []
                })
                dispatch(getSearchData(this.obj));
                this.getMessageCount();
            });
        }else{
            message.warning('请勾选消息');
        }
    }

    showAllNoHandle = () => {
        this.setState({
            showAll: false
        })
        this.obj['status'] = 0;

        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
        this.getMessageCount();
    }

    showAllDidHandle = () => {
        this.setState({
            showAll: true
        })
        this.obj['status'] = '';

        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
        this.getMessageCount();
    }

    allRemoveHandle = () => {
        const { dispatch } = this.props;
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/message/delete`, {'updateType': 6})
        .then(data => {
            dispatch(getSearchData(this.obj));
            this.getMessageCount();
        });
    }

    onSelectChange = (selectedRowKeys) => {
        const { dispatch } = this.props
        this.setState({ selectedRowKeys });
    }

    pagination = () => {
        const {
            dispatch,
            searchParams,
            total,
        } = this.props;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        return paginationConfig({ ...searchParams, currentPage, total, pageSize }, getSearchData, dispatch)
    }

    render(){
        const {
            dataSource,
            isFetching
        } = this.props;

        const {
            showAll,
            selectedRowKeys,
            countNoMsg,
            selectedVal,
        } = this.state;

        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        //   getCheckboxProps: record => ({
        //     disabled: record.confirmButton !== 1 || record.confirmStatus === 2,    // Column configuration not to be checked
        //   }),
        };

        const button = showAll ? <Button type='primary' onClick={this.showAllNoHandle}>未读消息（共{countNoMsg ? countNoMsg.data : 0}条）</Button> : <Button type='primary' onClick={this.showAllDidHandle}>显示所有消息</Button>

        return <div className='crm-message-center'>
            <div> 
                {button}
                <span className='rt'>
                    <DatePicker
                        style={{'display':'inline-block', 'width': 140}}
                        onChange={this.handleTimeSearch}
                    />
                    <Input.Search
                        style={{'dispaly': 'inline-block', 'width': 200, 'margin-left': 20}}
                        suffix={ this.state.isShowClose ? <Icon type="close-circle" onClick={this.handleClickClose} /> : '' }
                        placeholder="请填写关键字"
                        value={this.state.inputVal}
                        onChange={value => this.handleChange(value)}
                        onSearch={value => this.handleSearch(value)}
                        enterButton
                    />
                </span>
            </div>

            <div key="2" className="crm-message-wrap">
                <div className='crm-message-center-buttons'>
                    <Select
                        style={{width:90}}
                        size='default'
                        placeholder='标记为'
                        disabled={!dataSource.length ? true : false}
                        value={selectedVal}
                        onSelect={(value) => {this.readListHandle(value)}}
                    >
                        <Select.Option value='0'>
                            未读
                        </Select.Option>
                        <Select.Option value='1'>
                            已读
                        </Select.Option>
                    </Select>
                    <Button size='default' disabled={!dataSource.length ? true : false} style={{marginLeft:10}} onClick={this.allReadHandle}>全部标记为已读</Button>
                    <Button size='default' disabled={!dataSource.length ? true : false} style={{marginLeft:10}} onClick={this.delListHandle}>删除</Button>
                    <Popconfirm
                        title={<span>是否确认清空？ <span style={{color: '#f60', display: 'block'}}>注意：清空后，不可恢复，请慎重操作</span></span>}
                        okText="确定"
                        onConfirm={this.allRemoveHandle}
                        cancelText="取消"
                    >
                        <Button size='default' disabled={!dataSource.length ? true : false} style={{marginLeft:10}}>清空</Button>
                    </Popconfirm>
                </div>
                {<Table
                    dataSource={dataSource}
                    style={{ 'marginTop': 20 }}
                    columns={this.columns}
                    pagination={this.pagination()}
                    loading={isFetching}
                    rowSelection={rowSelection}
                    rowKey='id'
                    rowClassName={(record: any, index) => `messageTable-tr-${record.status}`}
                    onRow={(record: any) => {
                        return {
                          onClick: () => {
                              let { status, id } = record;
                              if(status === 0){
                                const { dispatch } = this.props;
                                fetchFn(
                                    `${DOMAIN_OXT}/apiv2_/crm/api/module/message/updateForRead`,
                                    {
                                        'updateType': 1,
                                        ids: id
                                    }
                                )
                                .then(data => {
                                    dispatch(getSearchData(this.obj));
                                });
                              }
                          }, // 点击行
                        };
                    }}
                />}
            </div>
        </div>
    }
}

const mapStateToProps = (state: Any.Store): TStateProps =>  {
    const data = state.get('crmWorkbenchMessage');
    return {
        dataSource: data.get('dataSource').toJS(),
        total: data.get('total'),
        searchParams: data.get('searchParams').toJS(),
        isFetching: data.get('isFetching'),
    }
}

export default connect(mapStateToProps)(Message);