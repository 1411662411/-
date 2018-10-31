/**
 * Created by yangws on 2017/7/5.
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
    Form,
    message,
    Modal,
    Alert,
    Spin,
    Card,
    Popconfirm,
} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT, PAGINATION_PARAMS } from '../../global/global';
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
import {
    payeeManagementSaga,
    payeesourceSaga,
    fetching,

} from '../../action/socialManagement/payeeManagementAction';

import {PayeeInfo} from '../../components/common/payeeInfoEntryUi'
import bankType from '../../components/selectBankType/bankType.json';
import './../../css/financialManagement/payeeManagement.less';
const bankTypeData = bankType.data
interface payeeManagementProps {
    dispatch?: any;
    payeeSource: any;
    dataSource: any;
    fetching: boolean;
    total: number;
}
interface columns {
    data?: [any];
}
const financeMap = {
    1: '分公司',
    2: '社保局',
    3: '公积金中心',
}

class PayeeManagement extends React.Component<payeeManagementProps, any> {
    sessionStorageSearchParams: any;
    constructor(props) {
        super(props);

        this.sessionStorageSearchParams = JSON.parse(sessionStorage.getItem('PAYEEMANAGEMENT_SESSIONSTORAGE')!);
        this.state = {
            businessType: 0,
            id: null,
            payeeModel: false,
            payeeInfoData: {},
            searchParams: {
                ...PAGINATION_PARAMS,
                branchName: '',
                cityName: '',
                ...this.sessionStorageSearchParams
            },
            dataSource: [],
            singeData: {
                id: '',
                businessType: '',
                userNameData: {
                    editable: true,
                    value: {
                        userName: '',
                        userId: '',
                    },
                },
                mailData: {
                    editable: true,
                    value: '',
                }

            }
        }
    }



    columns: any = (param) => {
        return [{
            title: '编码',
            dataIndex: 'code',
            width: 150,

        }, {
            title: '二次请款收款方类型',
            width: 150,
            dataIndex: 'financeType',
            render: (data) => financeMap[data],
        }, {
            title: '二次请款收款方名称',
            width: 200,
            dataIndex: 'branchName',

        }, {
            title: '开户行',
            width: 150,
            dataIndex: 'depositName',

        }, {
            title: '账号',
            width: 150,
            dataIndex: 'depositAccount',

        }, {
            title: '银行类型',
            width: 200,
            dataIndex: 'bankTypeName',

        }, {
            title: '地区',
            width: 200,
            dataIndex: 'cityName',

        }, {
            title: '备注',
            width: 200,
            dataIndex: 'remark',

        }, {
            title: '操作',
            width: 150,
            dataIndex: null,
            fixed: 'right',
            render: (data, record, index) => {
                // const tmpData = param.data[index];

                const { id, financeTypeData, key, enableStatus } = data;
                return (
                    <div className="editable-row-operations">
                        <a onClick={() => this.edit(data)} style={{ paddingRight: 10 }}>编辑</a>
                        <a onClick={() => this.setEnableStatus(id, enableStatus)}>{enableStatus === 0 ? '停用' : '启用'}</a>
                    </div>
                );
            }
        }]
    }
    // 函数在进入状态之前调用
    componentWillMount() {
        // 查看邮件设置
        this.handleSearchData();
        this.props.dispatch(payeesourceSaga({}));
    }
    // 已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource) {
            this.setState({ dataSource: nextProps.dataSource.toJS() });
        }
    }
    handleSearchData() {

        this.props.dispatch(payeeManagementSaga({ ...this.state.searchParams, type: 'query', financeAgain: 2 }));
    }
    // 更新搜索条件state
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
    pagination = () => {
        const {
            dispatch,
            total,
        } = this.props;
        const { searchParams } = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage, pageSize) => {

            this.setSearchParamState({ 'currentPage': currentPage, 'pageSize': pageSize })
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize, type: 'query', financeAgain: 2 }, payeeManagementSaga, dispatch, setCurrentPage)
    }


    handleChange(key, data, value) {
        const { dataSource, singeData } = this.state;
        const { id, businessType } = data;
        if (id) {
            this.handleEditData(id, false);
        }


    }

    setEnableStatus(id, enableStatus) {
        const status = enableStatus === 1 ? 0 : 1
        confirm({
            title: '确认是否' + (status === 0 ? '启用' : '停用') + '?',
            content: '',
            onOk: () => {
                this.props.dispatch(payeeManagementSaga({ type: 'edit', id, enableStatus: status, callback: () => { this.handleSearchData() } }))
            },
            onCancel() {
            },
        });
        // this.props.dispatch(payeeManagementSaga({ type: 'edit',id,enableStatus,callback:()=>{this.handleSearchData()}}))
    }
    // payeeModel
    handleModalCancel = () => {
        this.setState({ 'payeeModel': false });
    }
    PayeeInfo: any;
    handleModalOk = () => {
        // const { entryInfoCode } = this.state;
        // 
        let bankType;
        const result = this.PayeeInfo.validate();
        if (result !== false) {
            let params;
            const {
                id,
                code,
                payeeSource,
                financeType,
                payeeType,
                branchName,
                branchName2,
                edit,
                depositName,
                bankTypeName,
                depositAccount,
                remark,
                province,
                city,
            } = result;
            // 组装数据
            for (let i = 0; i < bankTypeData.length; i++) {
                if (bankTypeData[i].dictName == bankTypeName) {
                    bankType = bankTypeData[i].id;
                    break
                }

            }
            params = {
                // ...result,
                depositAccount,
                depositName,
                branchName,
                financeType,
                bankTypeName,
                bankType,
                remark,
                callback: () => {
                    this.handleModalCancel();
                    this.handleSearchData();
                }
            }
            params.cityName = `${province} ${city}`;

            // 分公司
            if (financeType === 1) {

                params.branchName = result.branchName2;
                params.officeId = result.officeId;
            }
            // 
            id ? this.props.dispatch(payeeManagementSaga({ type: 'edit', ...params, id })) :
                this.props.dispatch(payeeManagementSaga({ type: 'save', ...params }))
            // this.props.dispatch(payeeManagementSaga({ type: (id?'edit':'save'),...params,id}))
        }

    }

    entryInfoProps = () => {
        const {
            payeeSource
        } = this.props;
        const { payeeInfoData, } = this.state;

        return {

            ref: node => this.PayeeInfo = node,
            ...payeeInfoData,
            payeeSource: payeeSource.toJS(),

            edit: true,
        }

    }
    handleEditData(id, isEdit) {
        const { dataSource } = this.state;
        dataSource.map(function (item) {
            if (item.id === id) {
                Object.keys(item).forEach((key) => {
                    if (item[key] && typeof item[key].editable !== 'undefined') {
                        item[key].editable = isEdit;
                    }

                })
            }
        })
        this.setState({ dataSource });
    }
    edit(data) {
        this.setState({
            'payeeModel': true,
            payeeInfoData: data,
        });
        // this.handleEditData(id,true);

    }
    editDone(id, data, type) {
        const { dataSource, singeData } = this.state;



        dataSource.map(function (item) {
            if (item.id === id) {
                Object.keys(item).forEach((key) => {
                    if (item[key] && typeof item[key].editable !== 'undefined') {
                        item[key].status = type;
                        // item[key].editable = false;
                    }

                })
            }
        })
        this.setState({ dataSource }, () => {
            dataSource.map(function (item) {
                if (item.id === id) {
                    Object.keys(item).forEach((key) => {
                        if (item[key] && typeof item[key].editable !== 'undefined') {
                            delete item[key].status;
                        }
                    });
                }
            })

        });
        // 删除后，该员工将无法收到提醒邮件，你还要继续吗？
    }
    addRemoveEdit = (key) => {
        const { dataSource } = this.state;
        dataSource.map((item, i) => {
            if (item.key === key) {
                const data = [...dataSource];
                data.splice(i, 1);
                this.setState({ dataSource: data });
            }
        })

    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = () => {
        this.setState({ 'payeeModel': true, payeeInfoData: {} });
        // const { dataSource } = this.state;
        // const newData = {
        //     key:Date.now(),
        //     financeTypeData:{
        //         editable:true,
        //         value:'',
        //     },
        //     branchNameData:{
        //         editable:true,
        //         value:'',
        //     },
        //     cityData:{
        //         editable:true,
        //         value:'',
        //     },
        //     depositNameData:{
        //         editable:true,
        //         value:'',
        //     },
        //     depositAccountData:{
        //         editable:true,
        //         value:'',
        //     },
        //     remarkData:{
        //         editable:true,
        //         value:'',
        //     }
        // };

        // this.setState({
        //     dataSource: [...dataSource, newData],
        // });
    }
    render() {
        const {
            fetching,
        } = this.props;
        const {
            dataSource,
            searchParams,
        } = this.state;
        const {
            branchName,
            provinceId,
            cityId,
            districtId,
        } = searchParams;

        const columns = this.columns({ data: dataSource });

        return (
            <QueueAnim>
                <Spin tip="Loading..." spinning={fetching}>
                    <div className="search-group">
                        <Form layout="inline" className="search-form" >
                            <FormItem style={{ marginBottom: 8 }} label="二次请款收款方名称： ">
                                <Input
                                    style={{ width: 250 }}
                                    placeholder="请输入"
                                    value={branchName}
                                    onChange={(e: any) => { this.setSearchParamState({ branchName: e.target.value }) }}
                                />
                            </FormItem>
                            <FormItem style={{ marginBottom: 8 }} label="地区： ">
                                <Input onChange={(e: any) => { this.setSearchParamState({ cityName: e.target.value }) }} />
                            </FormItem>
                            <Button type="primary" onClick={e => this.handleSearchData()}>搜索</Button>
                        </Form>
                    </div>
                    <div key="1-1" style={{ marginTop: '20px' }}>
                        <Button type="primary" onClick={() => { this.handleAdd() }} style={{ marginBottom: 10 }}>添加</Button>
                        <Table columns={columns}
                            rowKey={(record: any) => record.id}
                            dataSource={dataSource}
                            scroll={{ x: 1550, y: 540 }}
                            pagination={this.pagination()}
                        />
                    </div>
                    <Modal
                        visible={this.state.payeeModel}
                        title="编辑收款方信息"
                        onCancel={this.handleModalCancel}
                        onOk={this.handleModalOk}
                        okText="保存"
                    >

                        <Spin spinning={fetching} >
                            <PayeeInfo {...this.entryInfoProps() } key={Date.now()} />
                        </Spin>
                    </Modal>
                </Spin>
            </QueueAnim>
        )
    }

}


function mapStateToProps(state?: any) {
    const data = state.get('payeeManagementReducer');
    return {
        dataSource: data.get('dataSource'),
        payeeSource: data.get('payeeSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),


    }
}
export default connect(mapStateToProps)(PayeeManagement)