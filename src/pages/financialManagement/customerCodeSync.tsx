import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Form,
    Checkbox,
    Modal
} from 'antd';
import * as moment from 'moment';
import {
    paginationConfig,
} from '../../util/pagination';
// 引入 action
import { getSearchData, DATA_SEARCH, updateId, updateIds, sendDataConfirm } from '../../action/financialManagement/customerCodeSyncAction';
import './../../css/financialManagement/customerCodeSync';
import { Map } from 'immutable';
const Option = Select.Option;
const FormItem = Form.Item;

interface TStateProps {
    dataSource: any;
    searchParams: any;
    total: number;
    id: any;
    ids: any;
    isFetching?: any;
}
interface TOwnProps {
    index: any;
    edit?: boolean; /* 录入：true 查看: false */
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type CustomerCodeSyncProps = TStateProps & TOwnProps & TDispatchProps;


class CustomerCodeSync extends React.Component<CustomerCodeSyncProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            ModalText: '',
            visible: false,
            confirmLoading: false,
            selectedRowKeys: [],  // Check here to configure the default column
            visibleAll: false,
            ModalTextAll: ''
        }
    }

    columns: any = [
        {
            title: '操作',
            dataIndex: 'confirmButton',
            key: 'confirmButton',
            width: 100,
            render: (text, record, index) => {
                const {
                    id,
                    confirmStatus,
                    confirmButton,
                } = record;
                if (confirmButton == 1) {
                    return confirmStatus === 1 ? (<a href="#" onClick={(e) => this.showModal(e, id)}>确认</a>) : "/";
                } else {
                    return confirmStatus === 1 ? (<span>确认</span>) : "/";
                }
            },
        },
        {
            title: '同步状态',
            dataIndex: 'buttJointStatusName',
            key: 'buttJointStatusName',
            width: 100
        },
        {
            title: '类型',
            dataIndex: 'dataTypeName',
            key: 'dataTypeName',
            width: 150
        },
        {
            title: '客户编码',
            dataIndex: 'customerCode',
            key: 'customerCode',
            width: 200
        },
        {
            title: '客户名称',
            dataIndex: 'cName',
            key: 'cName',
            width: 200
        },
        {
            title: '原客户名称',
            dataIndex: 'oldCName',
            key: 'oldCName',
            width: 200
        },
        {
            title: '创建时间',
            dataIndex: 'createTimeString',
            key: 'createTimeString',
            width: 150
        }
    ];

    obj = {};
    componentWillMount() {
        this.props.dispatch(getSearchData(this.props.searchParams));
    }
    handleSearchChangeCache = (value, key) => {
        this.obj[key] = value;
    }
    handleSearch = () => {
        const { dispatch } = this.props;
        dispatch(getSearchData(this.obj));
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

    showModal = (e, id) => {
        e.preventDefault();
        const { dispatch } = this.props
        dispatch(updateId({
            id: id
        }))
        this.setState({
        ModalText: (<p>是否确认同步该客户？</p>),
            visible: true,
        });
    }

    showAllModal = () => {
        this.setState({
        ModalTextAll: (<p>是否确认同步该客户？<br/>（共 {this.state.selectedRowKeys.length} 个客户）</p>),
            visibleAll: true,
        });
    }

    handleOk = () => {
        const { dispatch, id } = this.props
        new Promise(resolve => {
            dispatch(sendDataConfirm({
                ids: id,
                resolve,
            }))
        }).then(res => {
            if(res == 'sucess'){
                const { searchParams, dispatch } = this.props
                dispatch(getSearchData(searchParams))
                this.setState({
                    visible: false,
                })
            }else{
                this.setState({
                    visible: false,
                })
            }
        })

        //dispatch(getSearchData(this.props.searchParams));
    }

    handleAllOk = () => {
        const { dispatch, ids } = this.props
        new Promise(resolve => {
            dispatch(sendDataConfirm({
                ids: ids,
                resolve,
            }))
        }).then(res => {
            if(res == 'sucess'){
                const { searchParams, dispatch } = this.props
                dispatch(getSearchData(searchParams))
                this.setState({
                    visibleAll: false,
                    selectedRowKeys: []
                })
            }else{
                this.setState({
                    visibleAll: false,
                })
            }
        })
    }


    handleCancel = () => {
        this.setState({
          visible: false,
        })
    }
    handleAllCancel = () => {
        this.setState({
            visibleAll: false,
        })
    }

    onSelectChange = (selectedRowKeys) => {
        const { dispatch } = this.props
        let ids = this.transformArrayToString(selectedRowKeys)
        dispatch(updateIds({
            ids
        }))
        this.setState({ selectedRowKeys });
    }
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
    
    render() {
        const {
            dataSource,
            isFetching
        } = this.props;
        const { 
            visible,
            ModalText,
            selectedRowKeys,
            visibleAll,
            ModalTextAll,
         } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
          getCheckboxProps: record => ({
            disabled: record.confirmButton !== 1 || record.confirmStatus === 2,    // Column configuration not to be checked
          }),
        };

        const hasSelected = selectedRowKeys.length > 0;
        /**
         * 分页配置
         */
        const pagination = this.pagination();

        return (
            <QueueAnim>
                <div key="1">
                    <Form layout="inline">
                        <FormItem label="状态">
                            <Select style={{ width: 150 }} onChange={(value) => this.handleSearchChangeCache(value, 'buttJointStatus')} defaultValue='' size='default'>
                                <Option value="">全部</Option>
                                <Option value="1">未确认</Option>
                                <Option value="2">已确认，未同步</Option>
                                <Option value="3">已确认，已同步</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="类型">
                            <Select style={{ width: 90 }} onChange={(value) => this.handleSearchChangeCache(value, 'dataType')} defaultValue='' size='default'>
                                <Option value="">全部</Option>
                                <Option value="1">新增</Option>
                                <Option value="2">更名</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="客户名称">
                            <Input style={{ width: 160 }} onChange={(e) => this.handleSearchChangeCache(e.target['value'], 'cName')} defaultValue='' size='default' />
                        </FormItem>
                        <Button type="primary" loading={isFetching} onClick={() => this.handleSearch()}>搜索</Button>
                        <Button className="btn-batch" type="primary" onClick={this.showAllModal} disabled={!hasSelected}>批量操作</Button>
                    </Form>
                </div>
                <QueueAnim>
                    <div key="2">
                        {<Table dataSource={dataSource} style={{ 'marginTop': 20 }} scroll={{ y: 500 }} columns={this.columns} pagination={pagination} loading={isFetching} rowSelection={rowSelection} rowKey='id'/>}
                    </div>
                </QueueAnim>
                <Modal title="提示"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {ModalText}
                </Modal>
                <Modal title="提示"
                       visible={visibleAll}
                       onOk={this.handleAllOk}
                       onCancel={this.handleAllCancel}
                >
                    {ModalTextAll}
                </Modal>
            </QueueAnim>
        )
    }
}

const mapStateToProps = (state: Any.Store): TStateProps =>  {
    const data = state.get('customerCodeSync');
    return {
        dataSource: data.get('dataSource').toJS(),
        total: data.get('total'),
        searchParams: data.get('searchParams').toJS(),
        id: data.get('id'),
        ids: data.get('ids'),
        isFetching: data.get('isFetching'),
    }
}

export default connect(mapStateToProps)(CustomerCodeSync);