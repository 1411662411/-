import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';
import * as QueueAnim from "rc-queue-anim/lib";
import {
    Button,
    Select,
    Pagination,
    Table,
    Form,
    Input,
    TreeSelect, 
    Spin,
    Modal,
} from 'antd'

import './style.less';

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import { getTreeData } from '../../../util/crmUtil';
import {
    paginationConfig,
} from '../../../util/pagination';
import {
    getSearchData
} from '../../../action/crm/MyTeamAction/';

import Tags from '../../../components/showcaseTags';
import FilterTableHeader from '../../../components/crm/common/FilterTableHeader';
import { Organizations } from '../../../components/common/organizationsUi';

import EditMyTeam from '../../../components/crm/MyTeam/EditMyTeam';

const ifExistPermissionApi = `${DOMAIN_OXT}/apiv2_/permission/v1/team/ifExistPermission`;   //是否有编辑团队权限
const getDataByDictKeyApi = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getDataByDictKey`;
const getOrganizationByOperatorApi = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getOrganizationByOperator`; //大区分公司下拉框接口
const getMyTeamOfSalesApi = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getMyTeamOfSales`; //团队成员列表接口

const ifExistPermission = () => fetchFn(ifExistPermissionApi, {code: 'TIANWU_my_team_edit'}).then(data => data);
const getDataByDictKey = () => fetchFn(getDataByDictKeyApi, {dictKey: '_POSITION'}).then(data => data);
const getOrganizationByOperator = () => fetchFn(getOrganizationByOperatorApi, {roleName: '团队超管'}).then(data => data);
const getMyTeam = (data) => fetchFn(getMyTeamOfSalesApi, {...data, isVerifyRole: 1}).then(data => data);

const Option = Select.Option;


class MyTeam extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            queryOrganizationsAndUsers: {} as any,
            selectedCriteria: new Map(), //已选条件
            selectedCriteriaClosable: true,  // 已选条件是否可以删除，当一个条件被删除时，其它条件不可删除
            salesIdVisible: false,
            salesId: '',
            positionIdVisible: false,
            positionId: '',
            canEdit: false,
            positions: [],
            salesName: '',
            organizations: [],
            teams: [],
            loading: true,
            dataSource: [],

            pageSize: 20,
            current: 1,
        }
    }

    obj = {
        isAll: 1
    };

    async componentWillMount() {

        let [
            queryOrganizationsAndUsers,
            existPermission,
            positions,
            organizations,
            // ownUserWithOrganization,
            teams,
        ] = await Promise.all([
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`, {}),
            ifExistPermission(),
            getDataByDictKey(),
            getOrganizationByOperator(),
            // fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/account/getUserWithOrganization`, {id: this.props.userInfo.userId}),
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/team/teamList`, {}),
        ]);
        this.setState({
            queryOrganizationsAndUsers,
            canEdit: Number(existPermission.data) === 1,
            positions: positions.data && positions.data,
            organizations: organizations.data && [
                // {label: '全部', value: '', children: []},
                ...getTreeData(organizations.data, 'name', 'id', 'children')],
            // ownUserWithOrganization,
            teams: teams.data,
        })
        this.onSearch(1, this.state.pageSize);
    }

    handleSearchChangeCache = (value, key) => {
        this.obj[key] = value;
    }

    onSearchChange = (name, value, title) => {
        let {selectedCriteria} = this.state;
        let valueString : string = '';
        // console.log(name, value, title)
        if(!value){
            return;
        }
        if(name === 'positionId'){
            let position = this.state.positions.filter(item => Number(item.code) === Number(value))[0];
            valueString = `${title}：${position.dictName}`;
        }else if(name === 'salesId'){
            valueString = `${title}：${this.state.salesName}`;
        }else if(name === 'organizationId'){
            if(!value.value){
                return;
            }
            valueString = `${title}：${value.label}`;
        }else if(name === 'teamId'){
            let team = this.state.teams.filter(item => Number(item.id) === Number(value))[0];
            valueString = `${title}：${team.name}`;
        }
        
        selectedCriteria.set(name,{
            name,
            value: valueString,
        })
        this.setState({
            loading: true,
            selectedCriteria,
        })
        this.onSearch(1, this.state.pageSize)
    }
    onSearch = async(current, pageSize) => {
        this.props.form.validateFields(async(err, values) => {
            if(!err){
                if(!this.state.loading){
                    this.setState({loading: true});
                }
                // console.log(values);
                for(let key in values){
                    if(values[key] === undefined){
                        values[key] = null;
                    }else if(key === 'organizationId'){
                        values[key] = values[key].value ? values[key].value : null;
                    }
                }
                let res:any = await getMyTeam({
                    start: (current-1) * pageSize,
                    length: pageSize,
                    ...values,
                })
                if(res.status === 0){
                    this.setState({
                        dataSource: res.data ? res.data.records : [],
                        loading: false,
                        current,
                        pageSize,
                        total: res.recordsTotal,
                        selectedCriteriaClosable: true,
                    })
                }
            }
        })
    }

    selectedCriteriaOnClose = async (item, index) => {  //已选条件删除时触发
        this.setState({ selectedCriteriaClosable: false, loading: true }); //设置tag不可删除
        let { selectedCriteria } = this.state;
        this.props.form.resetFields([item.name]);
        selectedCriteria.delete(item.name);
        this.setState({ selectedCriteria });
        this.onSearch(1, this.state.pageSize);
    }

    onModalCannel = async() => {
        let [
            teams,
        ] = await Promise.all([
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/team/teamList`, {}),
        ]);
        this.setState({teams: teams.data, editTeam: false})
        this.onSearch(1, this.state.pageSize);
    }

    render() {
        const {
            isFetching
        } = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = this.props.form;
        const {
            queryOrganizationsAndUsers,
            positions,
            organizations,
            teams,
            dataSource,
            loading,
            current,
            pageSize,
        } = this.state;
        const positionsOption = positions.map(item => <Option value={item.code}>{item.dictName}</Option>);
        const teamsOption = teams ? teams.map(item => <Option value={item.id}>{item.name}</Option>) : [];
        const columns: any[] = [
            {
                title: '序号',
                dataIndex: 'sort',
                key: 'sort',
                width: 50,
                render: (text, record, index) => {
                    return (current - 1) * pageSize + index + 1;
                },
            },
            {
                title: <FilterTableHeader
                    title = '姓名'
                    form = {this.props.form}
                    name = 'salesId'
                    initialValue = ''
                    onOk={this.onSearchChange}
                    valuePropName='initValue'
                    validateTrigger='onSelect'
                >
                    <Organizations
                        needAll={false}
                        initValue={this.state.salesId}
                        onSelect={(value, option, data) => {
                            if (data[value]) {
                                const { name, id, userName } = data[value];
                                this.setState({
                                    salesName: name
                                })
                            }
                        }}
                        note='employeeNumber'
                        dataSource={queryOrganizationsAndUsers.data && queryOrganizationsAndUsers.data[0]}>
                    </Organizations>
                </FilterTableHeader>,
                width: 140,
                dataIndex: 'nameAndEmployeeNumber',
                key: 'nameAndEmployeeNumber',
            },
            {
                title: <FilterTableHeader
                    title = '部门'
                    form = {this.props.form}
                    name = 'organizationId'
                    onOk={this.onSearchChange}
                >
                    <TreeSelect
                        style={{ width: 160 }}
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={organizations}
                        placeholder="请选择"
                        treeDefaultExpandAll
                        labelInValue={true}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    /> 
                </FilterTableHeader>,
                width: 250,
                dataIndex: 'regionAndBranchCompany',
                key: 'regionAndBranchCompany',
            },
            {
                title: <FilterTableHeader
                    title = '职位'
                    form = {this.props.form}
                    name = 'positionId'
                    initialValue = ''
                    onOk={this.onSearchChange}
                >
                    <Select
                        style={{
                            width: 140
                        }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                        <Option value=''>全部</Option>
                        {positionsOption}
                    </Select>
                </FilterTableHeader>,
                width: 95,
                dataIndex: 'positionString',
                key: 'positionString',
            },
            {
                title: '上级主管',
                width: 140,
                dataIndex: 'reportUserName',
                key: 'reportUserName',
            },
            {
                title: '性别',
                width: 65,
                dataIndex: 'genderString',
                key: 'genderString',
            },
            {
                title: '生日',
                width: 140,
                dataIndex: 'birthday',
                key: 'birthday',
            },
            {
                title: '年龄',
                width: 65,
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '手机号',
                width: 140,
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '邮箱',
                width: 180,
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '入职时间',
                width: 140,
                dataIndex: 'entryTimeString',
                key: 'entryTimeString',
            },
            {
                title: <FilterTableHeader
                    title = '所在团队'
                    form = {this.props.form}
                    name = 'teamId'
                    initialValue = ''
                    onOk={this.onSearchChange}
                >
                    <Select
                        style={{
                            width: 140
                        }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                        <Option value=''>全部</Option>
                        {teamsOption}
                    </Select>
                </FilterTableHeader>,
                width: 140,
                dataIndex: 'teamName',
                key: 'teamName',
                render:(text) => {
                    return text || '/';
                }
            },
            {
                title: '团队主管 ',
                width: 140,
                dataIndex: 'teamMaster',
                key: 'teamMaster',
            }
        ];
        const pagination = {
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: true,
            showQuickJumper: true,
            // size: "small",
            pageSizeOptions:['20','30','50','100'],
            onChange: this.onSearch,
            onShowSizeChange: this.onSearch,
        };
        return <div className='crm-my-team-cnt'><Spin spinning={loading}>
            {
                this.state.editTeam && <Modal width={770} title='编辑团队' footer={null} destroyOnClose={true} visible={this.state.editTeam} onCancel={() => {this.onModalCannel()}}>
                    <EditMyTeam/>
                </Modal>
            }
            {
                this.state.canEdit && <div style={{ 'text-align': 'right', 'margin-bottom': '20px' }}>
                    <Button onClick={() => {this.setState({editTeam: true})}} type='primary'>编辑团队信息</Button>
                </div>
            }

            {
                this.state.selectedCriteria.size > 0 && <Tags
                    title='已选条件'
                    dataSource={this.state.selectedCriteria.values()}
                    onClose={this.selectedCriteriaOnClose}
                    closable={this.state.selectedCriteriaClosable}
                    color='cyan'
                />
            }

            <div key="2" className="crm-my-team-wrap">
            {/* <Form> */}
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{
                        x:1685,
                        y: 420,
                    }}
                    pagination={{
                        ...pagination,
                        current,
                        total: this.state.total,
                        pageSize, 
                    }}
                    loading={isFetching}
                    rowKey='id'
                    bordered
                />
            {/* </Form> */}
            </div>
        </Spin></div>
    }
}

// const mapStateToProps = (state: Any.Store): TStateProps => {
//     const data = state.get('crmMyTeam');
//     return {
//         dataSource: data.get('dataSource').toJS(),
//         total: data.get('total'),
//         searchParams: data.get('searchParams').toJS(),
//         isFetching: data.get('isFetching'),
//     }
// }

export default Form.create()(MyTeam);