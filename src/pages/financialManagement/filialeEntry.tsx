import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Form,
    Input,
    Table,
    Row,
    Col,
    Icon,
    message,
    Modal,
} from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
import * as _ from 'lodash';
import { Organizations } from '../../components/common/organizationsUi';
import SelectCity from '../../components/select-city/index';
import address from '../../components/select-city/address.json';
import bankType from '../../components/selectBankType/bankType.json';
import {
    FILIALE_ENTRY_SAGA,
    EDIT_TABLE_DATA,
    SAVE_TABLE_DATA,
    CANCEL_EDIT_TABLE_DATA,
    START_STOP_TABLE_DATA,
    DELETE_TABLE_DATA,
    ADD_TABLE_DATA,
    inputChange,
} from '../../action/financialManagement/filialeEntryAction';
import { DOMAIN_OXT, PAGINATION_PARAMS } from '../../global/global';
import './../../css/financialManagement/filialeEntry.less';

const FormItem = Form.Item;


const bankTypeData = bankType.data

let tempDataSource;


interface FilialeEntryProps {
    dispatch: any;
    dataSource: any;
    total: number;
    pageSize: number;
    currentPage: number;
    branchName: string;
    handleEdit: () => void;
    handleEditChange: () => void;
    isEdit: boolean;
    addIsFetching: boolean;
    listIsFetching: boolean;
    searchListFetching: boolean;
    addFilialeSearchName: any;
    branchType: any;
    addDepositName: any;
    addDepositAccount: any;
    bankTypeName: any;
    bankType: any;
    provice: string;
    city: string;
}

const ValidationInputIsEmpty = (value, error) => {
    if (value === '') {
        message.error(error);
        return false;
    }
    return true;
}
const branchTypeMap = {
    1: '五险一金',
    2: '五险',
    3: '公积金'
}

class FilialeEntry extends React.Component<FilialeEntryProps, any> {
    sessionStorageSearchParams: any;
    filialeSearchName: any;
    addFilialeSearchName: any;
    addDepositName: any;
    addDepositAccount: any;
    bankTypeName: any;
    bankType: any;
    cityName: any;
    branchType: any;
    provinceId: any;
    cityId: any;
    districtId: any;
    columns: [any] = [
        {
            title: '分公司编码',
            dataIndex: 'code',
            key: 'code',
            width: 160,
        },
        {
            title: '分公司名称',
            dataIndex: 'branchName',
            key: 'branchName',
            width: 150,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                } = record;
                return (
                    !isEdit ?
                        <span>{text ? text : '/'}</span>
                        :
                        <Input defaultValue={text} onBlur={e => this.handleEditChange(e, { key: 'branchName', index, id })} />
                )
            },

        },
        {
            title: '账户社保对应类别',
            dataIndex: 'branchType',
            key: 'branchType',
            width: 150,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                } = record;
                return (
                    !isEdit ?
                        <span>{text ? branchTypeMap[text] : '/'}</span>
                        :
                        <Select style={{ width: 150 }} defaultValue={text} size="default" onSelect={e => this.handleEditChange(e, { key: 'branchType', index, id })} >
                            <Option value={1}>五险一金</Option>
                            <Option value={2}>五险</Option>
                            <Option value={3}>公积金</Option>
                        </Select>

                )
            },
        },
        {
            title: '开户行',
            dataIndex: 'depositName',
            key: 'depositName',
            width: 100,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                } = record;
                return (
                    !isEdit ?
                        <span>{text ? text : '/'}</span>
                        :
                        <Input defaultValue={text} onBlur={e => this.handleEditChange(e, { key: 'depositName', index, id })} />
                )
            },
        },
        {
            title: '账号',
            dataIndex: 'depositAccount',
            key: 'depositAccount',
            width: 150,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                } = record;
                return (
                    !isEdit ?
                        <span>{text ? text : '/'}</span>
                        :
                        <Input defaultValue={text} onBlur={e => this.handleEditChange(e, { key: 'depositAccount', index, id })} />
                )
            },
        }, {
            title: '银行类型',
            dataIndex: 'bankTypeName',
            key: 'bankTypeName',
            width: 150,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                } = record;

                const restProps: any = {
                    onPopupScroll: (e) => {
                        e.stopPropagation()
                    }
                }

                return (
                    !isEdit ?
                        <span>{text ? text : '/'}</span>
                        :
                        <Select defaultValue={text} style={{ width: 190 }} size="default" onChange={(e: any) => { this.handleEditChange(e, { key: 'bankTypeName', index, id }) }}
                            showSearch
                            placeholder="请选择银行"
                            optionFilterProp="children"
                            {...restProps}
                            getPopupContainer={node => document.getElementsByClassName('accountTable')[0]}
                            filterOption={(value, options) => {
                                let flag = 0;
                                let option = options.props.children;
                                if (String(option).indexOf(value) > -1) {
                                    flag += 1;
                                    return true;
                                } else if (options.props.children === '其他银行-OTH' && flag === 0) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }}
                        >
                            {bankTypeData.map((item) => {
                                return <Option key={item.id} value={item.dictName}>{item.dictName}</Option>
                            })}

                        </Select>
                )
            },
        },
        {
            title: '地区',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 150,
            render: (text, record, index) => {
                const {
                    dataSource
                } = this.props;
                const {
                    isEdit,
                    id,
                } = record;
                const [provice, city] = text ? text.split(' ') : '';
                return (
                    !isEdit ?
                        <span>{text ? text : '/'}</span>
                        :
                        <Form layout="inline">
                            <FormItem style={{width:70}}>
                                <Input placeholder="省份" defaultValue={provice} onChange={(e: any) => { this.handleEditChange(`${e.target.value} ${city}`, { key: 'cityName', index, id }) }} />
                            </FormItem>
                            <FormItem style={{width:70}}>
                                <Input placeholder="城市" defaultValue={city} onChange={(e: any) => { this.handleEditChange(`${provice} ${e.target.value}`, { key: 'cityName', index, id }) }} />
                            </FormItem>
                        </Form>
                )
            },
        },
        {
            title: '操作',
            key: 'handles',
            width: 100,
            render: (text, record, index) => {
                const {
                    isEdit,
                    id,
                    enableStatus,
                } = record;
                const {
                    dataSource
                } = this.props;
                return (
                    <span>
                        {
                            !isEdit ?
                                <span>
                                    <a href="#" onClick={e => this.handleEdit(e, { dataSource, index, id, isEdit: true })}>编辑</a>
                                    <span className="ant-divider" />
                                    {enableStatus ?
                                        <a href="#" onClick={e => this.handleStartStop(e, { index, id, enableStatus: 0, title: '是否确认启用' })}>启用</a>
                                        :
                                        <a href="#" onClick={e => this.handleStartStop(e, { index, id, enableStatus: 1, title: '是否确认停用' })}>停用</a>

                                    }
                                    {/* <span className="ant-divider" />
                                    <a href="#" onClick={e => this.handleDelete(e, {index, id, title: '是否确定删除该条数据？'})}>删除</a> */}
                                </span>
                                :
                                <span>
                                    <a href="#" onClick={e => this.handleEditSave(e, { index, id })}>保存</a>
                                    <span className="ant-divider" />
                                    <a href="#" onClick={e => this.handleEditCancel(e, { dataSource, index, id, isEdit: false })}>取消</a>
                                </span>
                        }
                    </span>
                )
            }
        }
    ];

    constructor(props) {
        super(props);
        this.sessionStorageSearchParams = JSON.parse(sessionStorage.getItem('PAYEEMANAGEMENT_SESSIONSTORAGE')!);
        const { dispatch } = this.props;
        dispatch({ type: FILIALE_ENTRY_SAGA, params: {} });
        this.state = {
            searchParams: {
                ...PAGINATION_PARAMS,
                branchName: '',
                ...this.sessionStorageSearchParams,
            },
            provinceId: '',
            cityId: '',
            districtId: '',
            cityName: '',
        }
    }
    handleInputChange = (params) => {
        this.props.dispatch(inputChange(params));//放在props里面
    }
    handleAdd = (e) => {
        let {
            addFilialeSearchName,
            addDepositName,
            addDepositAccount,
            bankTypeName,
            branchType,
            bankType,
            provice,
            city,
        } = this.props;

        const {
            dispatch,
            pageSize,
            addIsFetching
        } = this.props;


        const branchName = addFilialeSearchName;
        const depositName = addDepositName;
        const depositAccount = addDepositAccount;
        if (!ValidationInputIsEmpty(branchName, '请填写分公司名称')) {
            return;
        }
        if (!ValidationInputIsEmpty(addDepositName, '请输入开户行')) {
            return;
        }
        if (!ValidationInputIsEmpty(addDepositAccount, '请输入账号')) {
            return;
        }
        if (!ValidationInputIsEmpty(bankTypeName, '请选择银行类型')) {
            return;
        } else {
            for (let i = 0; i < bankTypeData.length; i++) {
                if (bankTypeData[i].dictName == bankTypeName) {
                    bankType = bankTypeData[i].id;
                    break
                }

            }
        }

        if (!ValidationInputIsEmpty(provice, '请填写省份')) {
            return;
        }

        if (!ValidationInputIsEmpty(city, '请填写城市')) {
            return;
        }


        dispatch({
            type: ADD_TABLE_DATA,
            params: {
                branchName,
                depositName,
                bankType,
                depositAccount,
                branchType,
                bankTypeName,
                cityName: `${provice} ${city}`,
                pageSize,
            }
        });

    }
    handleSearch = () => {
        const { dispatch, searchListFetching } = this.props;
        if (searchListFetching) return;
        const {
            filialeSearchName,
        } = this;
        dispatch({
            type: FILIALE_ENTRY_SAGA,
            params: {
                branchName: filialeSearchName.input.value,
                currentPage: this.props.currentPage,
                pageSize: this.props.pageSize,
            }
        });
    }
    handleEdit = (e, params) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: EDIT_TABLE_DATA,
            params,
        });
    }
    handleEditChange = (e, params) => {
        const {
            index,
            id,
            key,
        } = params;
        const value = e.target ? e.target.value : e;
        let data = tempDataSource[index];
        if (data && data.id === id && Object.prototype.hasOwnProperty.call(data, key)) {
            data[key] = value;
        }
    }
    handleEditSave = (e, params) => {
        e.preventDefault();
        const {
            index,
            id,
        } = params;
        const data = tempDataSource[index];

        if (!data || data.id !== id) {
            message.error('保存失败, 该条数据不存在', 3);
            return;
        }
        
        let {
            depositAccount,
            depositName,
            branchName,
            branchType,
            depositCity,
            depositBank,
            bankTypeName,
            cityName,
            provinceId,
            cityId,
            districtId,
            bankType,
        } = data
        let isCity = false


        if (!ValidationInputIsEmpty(branchName, '请填写分公司名称') || !ValidationInputIsEmpty(depositName, '请填写开户行') || !ValidationInputIsEmpty(depositAccount, '请填写账号' || !ValidationInputIsEmpty(branchType, '请填写账户社保对应类别'))) {
            return;
        }
        if (branchName.length > 100) {
            message.error('分公司名称长度不能超过100');
            return false;
        }
        if (bankTypeName === '') {
            message.error('请选择银行类型');
            return false;
        }
        if (cityName === '' || cityName === null) {
            message.error('请选择地区');
            return false;
        }
        if (typeof cityName === 'string') {
            let cityStr
            cityStr = cityName.split(' ')
            if (cityStr.length === 0) {
                message.error('请选择省份');
                return false;
            }
            if (cityStr.length === 1) {
                message.error('请选择城市');
                return false;
            }
            isCity = true
        } else {
            if (cityName.selectName.length === 0) {
                message.error('请选择省份');
                return false;
            }
            if (cityName.selectName.length === 1) {
                message.error('请选择城市');
                return false;
            }
        }

        const {
            dispatch,
        } = this.props;
        if (!isCity) {
            var {
                    selectVal,
                selectName,
            } = cityName;
        }


        dispatch({
            type: SAVE_TABLE_DATA,
            params: {
                dataSource: tempDataSource,
                depositAccount,
                bankTypeName,
                cityName: isCity ? cityName : selectName.toString().replace(/,/g, " "),
                provinceId: isCity ? provinceId : selectVal[0],
                cityId: isCity ? cityId : selectVal[1],
                districtId: isCity ? districtId : selectVal[2],
                depositCity,
                depositBank,
                depositName,
                branchName,
                branchType,
                bankType,
                id,
                index,
            },
        });

    }
    handleDelete = (e, params) => {
        e.preventDefault();
        const {
            title,
            id,
        } = params
        const {
            dispatch
        } = this.props
        confirm({
            title,
            onOk() {
                return new Promise((resolve, reject) => {
                    params = _.assign(params, {
                        resolve,
                        reject,
                        dataSource: tempDataSource,
                        id,
                        callback: () => {
                            dispatch({ type: FILIALE_ENTRY_SAGA, params: {} });
                        }
                    });
                    dispatch({
                        type: DELETE_TABLE_DATA,
                        params,
                    });
                });
            },
        });
    }
    handleStartStop = (e, params) => {
        e.preventDefault();
        const {
            id,
            index,
            enableStatus,
            title,
        } = params;
        const {
            dispatch
        } = this.props;
        let data = tempDataSource[index];
        if (!data || data.id !== id) {
            return;
        }
        data.enableStatus = enableStatus;
        const {
            branchName,
            depositName,
            depositAccount,
            depositCity,
            depositBank,
            branchType,
        } = data;
        confirm({
            title,
            onOk() {
                return new Promise((resolve, reject) => {
                    params = _.assign(params, {
                        resolve,
                        reject,
                        dataSource: tempDataSource,
                        branchName,
                        depositName,
                        depositAccount,
                        depositCity,
                        depositBank,
                        branchType,
                    });
                    dispatch({
                        type: START_STOP_TABLE_DATA,
                        params,
                    });
                });
            },
        });
    }
    handleEditCancel = (e, params) => {
        e.preventDefault();
        const {
            id,
            index,
            dataSource,
        } = params;
        const {
            dispatch,
        } = this.props;
        let oldData = dataSource[index] /* 编辑前的数据源 */;
        let newData = tempDataSource[index] /* 编辑后的数据源 */;

        /* 2条数据不匹配 */
        if (!oldData || !newData || oldData.id !== newData.id) {
            return;
        }

        oldData.isEdit = false;
        oldData = _.assign({}, newData, oldData);
        tempDataSource[index] = oldData;

        dispatch({
            type: CANCEL_EDIT_TABLE_DATA,
            params: {
                dataSource: tempDataSource,
            }
        });

    }
    setSearchParamState = (param) => {
        const { searchParams } = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
        }
        this.setState({
            searchParams: newSearchParams
        })
        return newSearchParams;
    }
    pagination = ({ total, currentPage }) => ({
        current: currentPage,
        total,
        showSizeChanger: true,
        defaultPageSize: 20,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        pageSizeOptions: ['20', '50', '100'],
        onShowSizeChange: (current, size) => {
            const {
                dispatch,
                branchName,
                branchType,
            } = this.props;
            dispatch({
                type: FILIALE_ENTRY_SAGA,
                params: {
                    currentPage: current,
                    pageSize: size,
                    branchName,

                }
            })
        },
        onChange: (current) => {
            const {
                dispatch,
                branchName,
                pageSize,
            } = this.props;
            dispatch({
                type: FILIALE_ENTRY_SAGA,
                params: {
                    currentPage: current,
                    pageSize: pageSize,
                    branchName: branchName,
                }
            })
        },
    })

    render() {
        const {
            currentPage,
            dataSource,
            total,
            addIsFetching,
            searchListFetching,
            listIsFetching,
            addFilialeSearchName,
            branchType,
            addDepositName,
            addDepositAccount,
            bankTypeName,
        } = this.props;
        tempDataSource = _.cloneDeep(dataSource);
        const pagination: any = this.pagination({ total, currentPage });
        return (
            <QueueAnim>
                <div key="1" style={{ marginBottom: '20px' }}>

                    <Form layout="inline">
                        <Row>
                            <FormItem label="分公司名称">
                                <Input value={addFilialeSearchName} onChange={(e) => { this.handleInputChange({ addFilialeSearchName: e.target.value }) }} size="default" />
                            </FormItem>
                            <FormItem label="账户社保对应类别">
                                <Select value={branchType} style={{ width: 150 }} size="default" onChange={(e: any) => { this.handleInputChange({ branchType: e }) }} >
                                    <Option value={1}>五险一金</Option>
                                    <Option value={2}>五险</Option>
                                    <Option value={3}>公积金</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="开户行">
                                <Input value={addDepositName} size="default" onChange={(e) => { this.handleInputChange({ addDepositName: e.target.value }) }} />
                            </FormItem>
                            <FormItem label="账号">
                                <Input value={addDepositAccount} size="default" onChange={(e) => { this.handleInputChange({ addDepositAccount: e.target.value }) }} />
                            </FormItem>

                            <FormItem label="银行类型">
                                <Select value={bankTypeName} style={{ width: 190 }} size="default" onChange={(e: any) => { this.handleInputChange({ bankTypeName: e }) }}
                                    showSearch
                                    placeholder="请选择银行类型"
                                    optionFilterProp="children"
                                    filterOption={(value, options) => {
                                        let flag = 0;
                                        let option = options.props.children;
                                        if (String(option).indexOf(value) > -1) {
                                            flag += 1;
                                            return true;
                                        } else if (options.props.children === '其他银行-OTH' && flag === 0) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }}
                                >
                                    {bankTypeData.map((item) => {
                                        return <Option key={item.id} value={item.dictName}>{item.dictName}</Option>
                                    })}

                                </Select>
                            </FormItem>
                        </Row>
                        <FormItem label="地区">
                            <Input placeholder="省份" onChange={(e) => { this.handleInputChange({ provice: e.target.value }) }} />
                        </FormItem>
                        <FormItem>
                            <Input placeholder="城市" onChange={(e) => { this.handleInputChange({ city: e.target.value }) }} />
                        </FormItem>
                        <Button type="primary" loading={addIsFetching} onClick={e => this.handleAdd(e)} style={{ marginTop: 4 }}>添加分公司</Button>
                    </Form>
                    <Form layout="inline" className="add-company-form" style={{ marginTop: "20px" }}>
                        <FormItem label="分公司名称">
                            <Input ref={node => this.filialeSearchName = node} onPressEnter={e => this.handleSearch()} size="default" />
                        </FormItem>
                        <Button type="primary" loading={searchListFetching} onClick={e => this.handleSearch()} style={{ marginTop: 4 }}>搜索</Button>
                    </Form>
                </div>
                <QueueAnim type='bottom' delay="300">
                    <div key="2">
                        <Table
                            className="accountTable"
                            columns={this.columns}
                            dataSource={dataSource}
                            pagination={pagination}
                            loading={listIsFetching}
                            scroll={{x: 1110, y: 500 }}
                            rowKey={record => record['id']}
                        />
                    </div>
                </QueueAnim>
            </QueueAnim>
        )
    }
}

function mapStateToProps(state) {
    const data = state.getIn(['filialeEntry']);
    return {
        dataSource: data.dataSource,
        total: data.total,
        pageSize: data.pageSize,
        currentPage: data.currentPage,
        listIsFetching: data.listIsFetching,
        branchName: data.branchName,
        addIsFetching: data.addIsFetching,
        searchListFetching: data.searchListFetching,
        addFilialeSearchName: data.addFilialeSearchName,
        branchType: data.branchType,
        addDepositName: data.addDepositName,
        addDepositAccount: data.addDepositAccount,
        provice: data.provice,
        city: data.city,
        bankTypeName: data.bankTypeName,
        bankType: data.bankType,

    }
}

export default connect(mapStateToProps)(FilialeEntry)